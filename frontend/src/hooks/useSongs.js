import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

// Función separada para obtener canciones desde la API
const fetchSongs = async (searchQuery) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/songs`, {
      params: { q: searchQuery },
    });
    return response.data.songs; // Devolver la lista de canciones
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Error fetching songs.");
  }
};

const useSongs = () => {
  const [state, setState] = useState({
    songs: [],
    isLoading: false,
    error: null,
  });

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q") || ""; // Obtener 'q' de la URL
    setState((prevState) => ({ ...prevState, isLoading: true, error: null })); // Establecer el estado de carga

    // Llamada a la API
    const loadSongs = async () => {
      try {
        const songs = await fetchSongs(searchQuery);
        setState({ songs, isLoading: false, error: null }); // Actualizar el estado con las canciones
      } catch (error) {
        toast.error(error.message); // Mostrar error en caso de fallo
        setState({ songs: [], isLoading: false, error: error.message }); // Actualizar estado con el error
      }
    };

    loadSongs();
  }, [location.search]); // Dependemos de los cambios en 'location.search'

  return { songs: state.songs, isLoading: state.isLoading, error: state.error };
};

export default useSongs;
