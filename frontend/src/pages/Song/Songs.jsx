import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Spinner, Button } from "@nextui-org/react";
import { useRecoilValue } from "recoil";
import { userRoleState } from "@/atoms/userData";
import SongCard from "@/components/SongCard";
import { FiPlusCircle } from "react-icons/fi";

const Songs = () => {
  const role = useRecoilValue(userRoleState);
  const navigate = useNavigate();
  const location = useLocation();
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  // Leer el parámetro de búsqueda de la URL
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/songs`,
        {
          params: { page: currentPage, limit: itemsPerPage, q: searchQuery },
        }
      );
      setSongs(response.data.songs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [currentPage, searchQuery]); // Se ejecuta cuando cambia la búsqueda

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 py-8 md:px-12">
      <div className="w-full max-w-7xl flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {searchQuery ? `Results for "${searchQuery}"` : "Browse Songs"}
        </h1>
        {role === "admin" && (
          <Button
            onClick={() => navigate("add")}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            <FiPlusCircle size={20} /> Add Song
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-12 w-12 text-gray-500" />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {songs.length > 0 ? (
            songs.map((song) => (
              <motion.div key={song.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-4">
                <SongCard song={song} />
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">No songs found.</p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Songs;
