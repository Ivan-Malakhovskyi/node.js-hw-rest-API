import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/index.js";

const tempDir = path.resolve("temp"); //*На поч.адреси підставляє абсолютний шлях до проекту

const storage = multer.diskStorage({
  //*Шлях до тимчасової папки
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e9)} `;
    const uniqueFileName = `${uniqueSuffix}_${file.originalname}`;
    cb(null, uniqueFileName);
  },
});

const limits = {
  fileSize: 5 * 1024 * 1024,
};

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.split(".").pop();

  if (ext === "exe") {
    return cb(HttpError(400, "Invalid file extension"));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
