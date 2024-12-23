import { Link, useNavigate } from "react-router-dom";
import { Card } from "@nextui-org/react";
import axios from "axios";
import { useState } from "react";

const SongCard = ({ song }) => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const handleCardClick = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const token = localStorage.getItem('token'); // O donde guardes el token
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      const response = await axios.post(`${backendUrl}/songs/${song.id}/save`, song, config); // Usamos song.id
      console.log("Song saved successfully:", response.data);
      navigate(`/songs/${song.id}`); // Usamos song.id
    } catch (error) {
      console.error("Error saving song:", error.message);
      alert("Failed to save song. Please try again.");
    }
  };
  const imageUrl = song.image_url.replace("/upload", "/upload/h_400");

  return (
    <Link
    onClick={handleCardClick}
      className="group w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-3 py-6 transition-all transform hover:scale-105 hover:shadow-lg"
  >
      <Card className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all">
        <div className="relative w-full h-72 sm:h-96 lg:h-96">
          <img
            src={imageUrl}
            alt={song.title}
            className="w-full h-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30 group-hover:opacity-40 rounded-xl"></div>
      </Card>
      <div className="mt-4">
        <h3 className="font-bold text-xl sm:text-2xl text-gray-800 dark:text-white truncate">{song.title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{song.artist}</p>
      </div>
    </Link>
  );
};

export default SongCard;
