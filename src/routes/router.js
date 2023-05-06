import { Router } from "express";
import { passportCall } from "../helpers/utils.js";

export default class Router {
  constructor() {
    this.router = Router();
    this.init();
  }

  init() {}

  getRouter() {
    return this.router;
  }

  get(path, policies, ...callbacks) {
    this.router.get(path, passportCall("jwt"), this.responses, this.handlePolicies(policies), this.applyCallbacks(callbacks));
  }

  post(path, policies, ...callbacks) {
    this.router.get(path, passportCall("jwt"), this.responses, this.handlePolicies(policies), this.applyCallbacks(callbacks));
  }

  put(path, policies, ...callbacks) {
    this.router.get(path, passportCall("jwt"), this.responses, this.handlePolicies(policies), this.applyCallbacks(callbacks));
  }

  delete(path, policies, ...callbacks) {
    this.router.get(path, passportCall("jwt"), this.responses, this.handlePolicies(policies), this.applyCallbacks(callbacks));
  }

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params);
      } catch (error) {
        console.log(error);
        params[1].status(500).send(error);
      }
    });
  }

  responses(req, res, next) {
    res.success = (respuesta) => res.status(200).send({ status: "OK", respuesta });
    res.success2 = (respuesta, datos) => res.status(200).send({ status: "OK", respuesta, datos });
    res.errorCliente = (error) => res.status(400).send({ status: "error cliente", error });
    res.errorAutenticacion = (error) => res.status(401).send({ status: "error Autenticacion", error });
    res.errorAutorizacion = (error) => res.status(403).send({ status: "error Autorizacion", error });

    next();
  }

  handlePolicies(arrayPermisos) {
    return (req, res, next) => {
      if (arrayPermisos.includes("PUBLIC")) return next();

      let autHeader = req.headers.authorization;
      if (!autHeader) return res.errorAutenticacion("No esta autenticado");
      let token = autHeader.split(" ")[1];
      let contenidoToken = jwt.verify(token, "miPalabraSecreta", (err, decoder) => {
        if (err) return false;
        return decoder;
      });
      if (!contenidoToken) return res.errorAutenticacion("No esta autenticado");

      let usuario = contenidoToken.usuario;

      if (!arrayPermisos.includes(usuario.rol.toUpperCase()))
        return res.errorAutorizacion("No tiene privilegios suficientes para acceder al recurso");
      req.user = usuario;
      console.log(usuario);
      next();
    };
  }
}