import dotenv from "dotenv";

const environments = ["development", "staging", "production"]

const currentEnvironment = environments[0]

dotenv.config({
  override: true,
  path: `./src/.env.${currentEnvironment}`,
});

export const config = {
  port: process.env.PORT,
  persistence: process.env.PERSISTENCE,
  mongoUrl: process.env.MONGO_URL,
  secretKey: process.env.SECRET_KEY,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubCallbackUrl: process.env.GITHUB_CALLBACK_URL,
  adminMail: process.env.ADMIN_MAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
};