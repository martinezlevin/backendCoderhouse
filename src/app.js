import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { __dirname } from "./helpers/utils.js";
import path from "path";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { initializePassport } from "./config/passport.js";

import productsDBRouter from "./routes/productsDB.router.js";
import cartsDBRouter from "./routes/cartsDB.router.js";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js";

import productManagerDB from "./dao/productManagerDB.js";
import { messagesModel } from "./dao/models/messages.model.js";

const app = express();
const port = 8080;
const pm = new productManagerDB;

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

app.use(session({
  secret:'miPalabraSecreta',
  resave: true,
  saveUninitialized: true,
  store:MongoStore.create({
    mongoUrl:'mongodb+srv://Martinez:12345@ejemplo.k2aia89.mongodb.net/test',
    ttl:60
  })
}));
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", viewsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/cartsDB", cartsDBRouter);
app.use("/api/productsDB", productsDBRouter);


const httpServer = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("New client connected");

  socket.on("deleteProduct", async (id) => {
    let response = await pm.deleteProductSocket(id);
    socket.emit("deleteProductRes", response);
    if (response.success) {
      socket.broadcast.emit("productListUpdated");
    }
  });
  
  socket.on("addProduct", async (product) => {
    let response = await pm.addProductSocket(product);
    socket.emit("addProductRes", response);
    if (response.success) {
      socket.broadcast.emit("productListUpdated");
    }
  });

  socket.on("newMessage", async ({ user, message }) => {
    await messagesModel.create({ user: user, message: message });
    io.emit("messagesListUpdated");
  })
});

const conectar = async () => {
  try {
    await mongoose.connect("mongodb+srv://Martinez:12345@ejemplo.k2aia89.mongodb.net/test");
    console.log("Conexión a DB establecida");
  } catch (error) {
    console.log(`Error al conectarse con el servidor de DB. Errores: ${error}`);
  }
}

conectar();

io.on("error", (error) => console.error(error));