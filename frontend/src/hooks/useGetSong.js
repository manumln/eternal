import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

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
  
  const { id } = useParams();

  useEffect(() => {
    if (!id) return; 

    const loadSong = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true, error: null })); 
      try {
        const song = await fetchData(id);
        setState({ song, isLoading: false, error: null });
      } catch (error) {
        toast.error(error.message);
        setState({ song: null, isLoading: false, error: error.message });
      }
    };

    loadSong();
  }, [id]);

  return {
    song: state.song,
    isLoading: state.isLoading,
    error: state.error,
  };
};

export default useGetSong;
