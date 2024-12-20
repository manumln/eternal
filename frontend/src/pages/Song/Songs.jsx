import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Spinner, Button, Input } from "@nextui-org/react";
import { useRecoilValue } from "recoil";
import { userRoleState } from "@/atoms/userData";
import SongCard from "@/components/SongCard";
import { FiPlusCircle } from "react-icons/fi";

const Songs = () => {
  const role = useRecoilValue(userRoleState);
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Valor de búsqueda
  const itemsPerPage = 8;

  // Función para obtener canciones con búsqueda
  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/songs`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          q: searchQuery, // Pasamos el valor de búsqueda
        },
      });
      setSongs(response.data.songs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Llamar a la función de búsqueda cada vez que cambie el `currentPage` o `searchQuery`
  useEffect(() => {
    fetchSongs();
  }, [currentPage, searchQuery]);

  // Manejo del cambio de búsqueda
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reiniciar la página cuando se hace una nueva búsqueda
  };

  // Estructura de las columnas de las canciones
  const songColumns = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span title={row.getValue("title")} className="w-40 truncate block">
          {row.getValue("title")}
        </span>
      ),
    },
    {
      accessorKey: "artist",
      header: "Artist",
      cell: ({ row }) => (
        <span className="truncate">{row.getValue("artist")}</span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          onClick={() => navigate(`/songs/${row.original._id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <main className="flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="flex items-center justify-between px-2 py-4 w-full max-w-7xl">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Browse Songs
        </h1>
        {role === "admin" && (
          <Button
            onClick={() => navigate("add")}
            auto
            variant="bordered"
            shadow
            className="gap-2 bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md hover:opacity-90 transition-all"
          >
            <FiPlusCircle size={20} />
            Add Song
          </Button>
        )}
      </div>

      {/* Search Section */}
      <div className="flex justify-between items-center mb-6 w-full max-w-7xl">
        <Input
          type="text"
          placeholder="Search songs..."
          value={searchQuery} // Vinculamos el valor con el estado
          onChange={handleSearchChange} // Actualizamos el estado con el texto de búsqueda
          fullWidth
          shadow
          size="lg"
          className="w-full max-w-md"
        />
      </div>

      {/* Song Cards Section */}
      {isLoading ? (
        <div className="flex justify-center  items-center h-64">
          <Spinner className="h-12 w-12 animate-spin text-gray-500" />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 max-w-7xl sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {songs.map((song) => (
            <motion.div
              key={song._id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SongCard song={song} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination Section */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
};

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-between items-center mt-8 w-full max-w-7xl">
    <Button
      variant="bordered"
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      shadow
      className="bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md hover:opacity-90 transition-all"
    >
      Previous
    </Button>
    <span className="text-gray-600 dark:text-gray-300">
      Page {currentPage} of {totalPages}
    </span>
    <Button
      variant="bordered"
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      shadow
      className="bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md hover:opacity-90 transition-all"
    >
      Next
    </Button>
  </div>
);

export default Songs;
