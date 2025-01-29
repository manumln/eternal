import { motion } from "framer-motion";

// Función para hacer un shuffle del array (reordenarlo aleatoriamente)
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Intercambiar elementos
  }
  return array;
};

const AlbumStack = () => {
  // Usamos import.meta.glob para importar las imágenes de la carpeta src/images/cover
  const images = import.meta.glob('../images/cover/*.{png,jpg,jpeg}', { eager: true });
  
  // Extraemos las rutas de las imágenes
  const albumImages = Object.values(images).map(module => module.default);

  // Mezclamos las imágenes aleatoriamente
  const shuffledImages = shuffleArray(albumImages);

  return (
    <div className="relative w-full max-w-md h-72">
      {shuffledImages.map((img, index) => (
        <motion.img
          key={index}
          src={img}
          alt={`Album ${index + 1}`}
          className="absolute object-cover rounded-xl shadow-lg"
          style={{
            left: `${index * 100}px`, // Aumentamos el valor para reducir el solapamiento
            top: "0", // Asegura que las imágenes estén alineadas correctamente
            width: "220px", // Tamaño de las imágenes
            height: "220px", // Tamaño de las imágenes
            zIndex: shuffledImages.length - index // Asegura que las imágenes se superpongan correctamente
          }}
          whileHover={{
            scale: 1.1, // Escala la imagen al 110% de su tamaño original
            zIndex: shuffledImages.length + 1, // Asegura que la imagen se mueva al frente
            transition: { duration: 0.3, ease: "easeInOut" }, // Transición suave
          }}
        />
      ))}
    </div>
  );
};

export default AlbumStack;