import nodemailer from "nodemailer";
import { config } from "./config.js";

const transporter = nodemailer.createTransport({
  host: config.mailingHost,
  port: config.mailingPort,
  auth: {
    user: config.mailingUser,
    pass: config.mailingPassword,
  },
});