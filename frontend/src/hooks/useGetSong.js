import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

// Función separada para la llamada a la API
const fetchData = async (id) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/songs/${id}`);
    return response.data.song; 
  } catch (err) {
    throw new Error(err?.response?.data?.message || "Error desconocido al obtener los datos.");
  }
};

const useGetSong = () => {
  const [state, setState] = useState({
    song: null,
    isLoading: true,
    error: null,
  });

  const { id } = useParams();  // Recupera el 'id' de la URL

  useEffect(() => {
    if (!id) {
      console.error('No song ID available!');
      return;
    }

    const loadSong = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null }));
      try {
        console.log(`Fetching song with ID: ${id}`); // Log el id para verificar que está correcto
        const song = await fetchData(id);
        setState({ song, isLoading: false, error: null });
      } catch (error) {
        // Mostrar el error en el toast y actualizar el estado
        toast.error(error.message);
        setState({ song: null, isLoading: false, error: error.message });
      }
    };

    loadSong();
  }, [id]); // El hook se ejecutará cada vez que el 'id' cambie

  return {
    song: state.song,
    isLoading: state.isLoading,
    error: state.error,
  };
};

export default useGetSong;
