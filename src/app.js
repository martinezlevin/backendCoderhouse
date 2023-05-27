import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";
import compression from "express-compression";
import mailer from "./utils/mailer.js";

import { config } from "./config/config.js";
import { __dirname } from "./utils/utils.js";
import { initializePassport } from "./config/passport.config.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { addLogger } from "./middlewares/logger.middleware.js";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";

import productsApiController from "./controllers/productsApi.controller.js";
import messagesController from "./controllers/messages.controller.js";

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

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

app.use("*", (req, res) => {
  return req.user ? res.redirect("/products") : res.redirect("/login");
});

const httpServer = app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
const io = new Server(httpServer);
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("deleteProduct", async (productId, user) => {
    let response = await productsApiController.deleteProductSocket(productId, user);
    socket.emit("deleteProductRes", response);
    if (response.success) {
      socket.broadcast.emit("productListUpdated");
    }
  });

  socket.on("addProduct", async (product) => {
    let response = await productsApiController.addProductSocket(product);
    socket.emit("addProductRes", response);
    if (response.success) {
      socket.broadcast.emit("productListUpdated");
    }
  });

  socket.on("newMessage", async ({ user, message }) => {
    await messagesController.sendMessage({ user, message });
    io.emit("messagesListUpdated");
  });
});

app.use(errorMiddleware);