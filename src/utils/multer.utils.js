import multer from "multer";
import { __dirname } from "../utils/utils.js";
import path from "path";

const imgStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const imgUploader = multer({ storage: imgStorage });