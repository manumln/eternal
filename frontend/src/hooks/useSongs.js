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
    // En lugar de lanzar un error, retornamos una lista vacía o un mensaje controlado
    console.error("Error fetching songs:", error);
    return [];  // Retornamos un array vacío si hay error en la solicitud
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
      const songs = await fetchSongs(searchQuery); // Aquí se obtiene la lista de canciones

      if (songs.length === 0) {
      }

      setState({ songs, isLoading: false, error: null }); // Actualizar el estado con las canciones o vaciar si hubo un error
    };

    loadSongs();
  }, [location.search]); // Dependemos de los cambios en 'location.search'

  return { songs: state.songs, isLoading: state.isLoading, error: state.error };
};

export default useSongs;
