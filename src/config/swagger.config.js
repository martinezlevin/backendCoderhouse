import swaggerJSDoc from "swagger-jsdoc";
import { __dirname } from "../utils/utils.js";
import path from "path";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Proyecto de Ecommerce - Curso de Programación Backend - Institución: CODERHOUSE",
      version: "1.0.0",
      description: "Documentación completa de la aplicación",
    },
  },
  apis: [path.join(__dirname, "../docs/*.yaml")],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);
export default swaggerSpecs;