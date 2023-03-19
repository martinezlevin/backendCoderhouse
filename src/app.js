import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";
import productsFSRouter from "./routes/products.router.js";
// import cartsFSRouter from "./routes/carts.router.js";
import cartsDBRouter from "./routes/cartsDB.router.js";
import productsDBRouter from "./routes/productsDB.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManagerFS from "./dao/productManagerFS.js";
import { __dirname } from "./helpers/utils.js";
import { messagesModel } from "./dao/models/messages.model.js";

const app = express();
const port = 8080;
const product = new ProductManagerFS(path.join(__dirname, "../files/products.json"));

app.engine("handlebars", engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  }
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname,"../views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use("/", viewsRouter);
app.use("/api/productsFS", productsFSRouter);
// app.use("/api/cartsFS", cartsFSRouter);
app.use("/api/cartsDB", cartsDBRouter);
app.use("/api/productsDB", productsDBRouter);

const httpServer = app.listen(port, () => {
  console.log(`Aplicación escuchando en el puerto ${port}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");

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

const connect = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/guillemtz");
    console.log("Conexión a DB establecida");
  } catch (error) {
    console.log(`Error al conectarse con el servidor de DB. Errores: ${error}`);
  }
}

connect();

io.on("error", (error) => console.error(error));