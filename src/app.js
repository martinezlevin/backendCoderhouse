import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";
import compression from "express-compression";
import swaggerUiExpress from "swagger-ui-express";
import swaggerSpecs from "./config/swagger.config.js";

import { config } from "./config/config.js";
import { __dirname } from "./utils/utils.js";
import { initializePassport } from "./config/passport.config.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { addLogger } from "./middlewares/logger.middleware.js";
import { logger } from "./utils/logger.utils.js";
import {
  setResContentTypeToApplicationJson,
  setResContentTypeToTextHtml,
} from "./middlewares/setRes.middleware.js";
import { setReqIsView } from "./middlewares/setReq.middleware.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import ordersRouter from "./routes/orders.router.js";

const app = express();

app.engine(
  "handlebars",
  engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.use(compression());

app.use(addLogger);

app.use(
  "/apidocs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(swaggerSpecs)
);

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", setReqIsView, setResContentTypeToTextHtml, viewsRouter);
app.use("/api/sessions", setResContentTypeToApplicationJson, sessionsRouter);
app.use("/api/products", setResContentTypeToApplicationJson, productsRouter);
app.use("/api/carts", setResContentTypeToApplicationJson, cartsRouter);
app.use("/api/orders", setResContentTypeToApplicationJson, ordersRouter);
app.use("*", (req, res) => {
  return req.user ? res.redirect("/products") : res.redirect("/login");
});

const httpServer = app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
const io = new Server(httpServer);
io.on("connection", (socket) => {
  logger.info("New client connected");

  socket.on("productsCollectionUpdated", () => {
    io.emit("productsCollectionUpdated");
  });
  socket.on("newOrder", () => {
    socket.broadcast("newOrder");
  });
});

app.use(errorHandler);