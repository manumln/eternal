const multer = require("multer");
const path = require("path");

// Ruta de destino donde se guardarán los archivos
const THUMBNAIL_DIR = "./public/thumbnail";

const generateUniquePrefix = () => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1e9);
  return `${timestamp}-${randomSuffix}`;
};

const diskStorage = multer.diskStorage({
  // Define el destino donde se almacenarán los archivos
  destination: (req, file, cb) => {
    cb(null, THUMBNAIL_DIR);
  },

  // Establece un nombre único para cada archivo subido
  filename: (req, file, cb) => {
    const uniquePrefix = generateUniquePrefix();
    const fileExtension = path.extname(file.originalname)
    const fileName = `${uniquePrefix}-${file.originalname.replace(fileExtension, "")}${fileExtension}`;
    cb(null, fileName);
  },
});

module.exports = diskStorage;
