const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { config } = require("dotenv");


if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  throw new Error("Missing Cloudinary configuration");
}

// Cargar las variables de entorno
config();

// Configuración de Cloudinary
const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
};

// Función para generar un ID único para las imágenes
const generateUniqueId = () => {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1e9);
  return `${timestamp}-${randomSuffix}`;
};

// Configuración de almacenamiento en Cloudinary usando multer
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "eternal",  // Directorio donde se almacenarán las imágenes
    allowedFormats: ["png", "jpg", "jpeg"],  // Formatos permitidos
    public_id: (req, file) => generateUniqueId(),  // Asignación de un ID único
  },
});

// Configurar Cloudinary al iniciar
cloudinaryConfig();

module.exports = cloudinaryStorage;
