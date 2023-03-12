import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import path from "path";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import cartsDBRouter from "./routes/cartsDB.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";
import { __dirname } from "./helpers/utils.js";
import { messagesModel } from "./dao/models/messages.model.js";

const app = express();
const port = 8080;
const pm = new ProductManager(path.join(__dirname, "../files/products.json"));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname,"../views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/cartsDB", cartsDBRouter);

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

const connect = async () => {
  try {
    await mongoose.connect("mongodb+srv://admin01:Rafa1234@cluster0.pfcfkjg.mongodb.net/?retryWrites=true&w=majority&dbName=ecommerce");
    console.log("DB connection success");
  } catch (error) {
    console.log(`DB connection fail. Error: ${error}`);
  }
}

connect();

//httpServer.on("error", (error) => console.error(error));
io.on("error", (error) => console.error(error));