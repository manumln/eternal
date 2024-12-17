import { useEffect, useState } from 'react';
import useSongs from "@/hooks/useSongs";
import Slider from 'react-slick';  // Importamos el componente de Slider de react-slick
import 'slick-carousel/slick/slick.css';  // Estilos de Slick
import 'slick-carousel/slick/slick-theme.css';  // Estilos del tema de Slick
import SongCard from "./SongCard";

const SameArtist = ({ song }) => {
  const { songs } = useSongs(song?.artist);
  const [filteredSongs, setFilteredSongs] = useState([]);

  // Filtramos las canciones para que solo se muestren las del mismo autor que no sean la canción actual
  useEffect(() => {
    if (songs.length > 1) {
      const sameArtistSongs = songs.filter(curr => curr.artist === song.artist && curr._id !== song._id);
      setFilteredSongs(sameArtistSongs);
    }
  }, [songs, song.artist, song._id]);

  if (filteredSongs.length === 0) return null;

  // Configuración de Slick para el carrusel
  const settings = {
    infinite: true,  // Habilitar desplazamiento infinito
    speed: 500,  // Velocidad de transición
    slidesToShow: 3,  // Cuántas canciones mostrar a la vez
    slidesToScroll: 1,  // Cuántas canciones avanzar al hacer scroll
    responsive: [
      {
        breakpoint: 1024,  // Para pantallas de 1024px o más grandes
        settings: {
          slidesToShow: 4,  // Mostrar 4 elementos
        },
      },
      {
        breakpoint: 768,  // Para pantallas de 768px o más grandes
        settings: {
          slidesToShow: 3,  // Mostrar 3 elementos
        },
      },
      {
        breakpoint: 480,  // Para pantallas pequeñas
        settings: {
          slidesToShow: 1,  // Mostrar solo 1 elemento
        },
      },
    ],
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">
        More from {song?.artist}
      </h2>
      
      <Slider {...settings}>
        {filteredSongs.map(curr => (
          <div key={curr._id} className="px-2">
            <SongCard song={curr} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SameArtist;
