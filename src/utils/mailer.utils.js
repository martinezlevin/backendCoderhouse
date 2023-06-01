import nodemailer from "nodemailer";
import { config } from "../config/config.js";

class Mailer {
  constructor() {
    this.client = nodemailer.createTransport({
      service: config.mailingService,
      port: config.mailingPort,
      auth: {
        user: config.mailingUser,
        pass: config.mailingPassword,
      },
    });
  }

  async sendPassResetLink(email, token) {
    return await this.client.sendMail({
      from: `${config.mailingName} <${config.mailingUser}>`,
      to: email,
      subject: "Restablecer contraseña",
      html: `<p>Toca <a href="http://localhost:8080/passwordreset/${email}/${token}">aquí</a> para reestablecer tu contraseña.</p>`,
    });
  }

  async send(to, subject, html, attachments = []) {
    return await this.client.sendMail({
      from: `${config.mailingName} <${config.mailingUser}>`,
      to,
      subject,
      html,
      attachments,
    });
  }
}

const mailer = new Mailer();
export default mailer;