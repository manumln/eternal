import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button, Spinner } from "@nextui-org/react";
import { toast } from "sonner";
import SongCard from "@/components/SongCard";

const FavouriteSongs = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/users/favourites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setSongs(response.data.songs);
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "An error occurred while fetching favourites.");
        })
        .finally(() => setIsLoading(false));
    } else {
      toast.error("You need to be logged in to view favourites.");
      setIsLoading(false);
    }
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <svg
          className="animate-spin h-10 w-10 text-gray-800"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
          <path
            d="M4 12a8 8 0 1 1 8 8"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          ></path>
        </svg>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center">
        <div className="bg-white dark:bg-gray-800 p-8 max-w-md mx-auto">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">No Favorites Found</h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Your favourites list is currently empty.</p>
          <Button
            onClick={() => window.location.href = "/"}
            className="px-6 py-2 bg-blue-600 font-medium text-white"
          >
            Back to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">My Favourite Songs</h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-12 w-12 animate-spin text-gray-500" />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {songs.map((song, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SongCard song={song} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </main>
  );
};

export default FavouriteSongs;
