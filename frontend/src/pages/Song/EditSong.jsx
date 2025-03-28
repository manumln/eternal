import {
  Button,
  Card,
  Input,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Formik, Field, Form } from "formik";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "sonner";

// Validación de formulario
const SongSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  artist: Yup.string().required("Artist is required"),
  genres: Yup.array()
    .of(Yup.string().required("Genre is required"))
    .min(1, "At least one genre is required"), // Al menos un género requerido  image: Yup.mixed().notRequired(),
  preview: Yup.mixed().notRequired(),
});

const EditSong = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState([]); // Estado para los géneros
  const [initialValues, setInitialValues] = useState({
    title: "",
    artist: "",
    genres: [],
    description: "",
    image: null,
    preview: null,
  });
  const [previewURL, setPreviewURL] = useState("");

  // Cargar géneros desde la base de datos
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/genres`
        );
        setGenres(response.data.genres);
      } catch (error) {
        toast.error("Failed to fetch genres.");
      }
    };
    fetchGenres();
  }, []);

  // Cargar datos de la canción a editar
  useEffect(() => {
    const fetchSong = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/songs/${id}`
        );
        const song = response.data.song;
        setInitialValues({
          title: song.title,
          artist: song.artist,
          genre: song.genre, // Obtener el género de la canción
          image: null,
          preview: null,
        });
        setPreviewURL(song.image_url);
      } catch (error) {
        toast.error("Failed to fetch song details.");
        navigate("/songs");
      }
    };
    fetchSong();
  }, [id, navigate]);

  const handleFileChange = (event, setFieldValue, fieldName) => {
    const file = event.target?.files?.[0];
    setFieldValue(fieldName, file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewURL(reader.result);
      reader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/genres`
        );

        setGenres(response.data.genres);
      } catch (error) {
        console.error("Error fetching genres:", error); // Log the error for debugging
        toast.error("Failed to fetch genres.");
      }
    };

    fetchGenres();
  }, []);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (Array.isArray(values[key])) {
          values[key].forEach((item) => formData.append(`${key}[]`, item));
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/songs/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      navigate(`/songs/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center p-4 sm:px-6">
      <Card className="w-full max-w-xl shadow-md">
        <Formik
          initialValues={initialValues}
          enableReinitialize
          validationSchema={SongSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <header className="border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold">Edit Song</h1>
              </header>
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium">
                    Title
                  </label>
                  <Field
                    name="title"
                    as={Input}
                    placeholder="Title of the Song"
                  />
                  {errors.title && touched.title && (
                    <div className="text-red-500 text-sm">{errors.title}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="artist" className="block text-sm font-medium">
                    Artist
                  </label>
                  <Field
                    name="artist"
                    as={Input}
                    placeholder="Artist of the Song"
                  />
                  {errors.artist && touched.artist && (
                    <div className="text-red-500 text-sm">{errors.artist}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="genres" className="block text-sm font-medium">
                    Genres
                  </label>
                  <Field name="genres">
                    {({ field, form }) => (
                      <Select
                        className="w-full"
                        label="Select Genres"
                        placeholder="Select one or more genres"
                        selectionMode="multiple"
                        selectedKeys={values.genres} // Pasar los géneros seleccionados al Select
                        onSelectionChange={
                          (keys) =>
                            form.setFieldValue(field.name, Array.from(keys)) // Actualizar el estado con las selecciones
                        }
                      >
                        {genres.map((genre) => (
                          <SelectItem key={genre._id}>{genre.name}</SelectItem>
                        ))}
                      </Select>
                    )}
                  </Field>
                  {errors.genres && touched.genres && (
                    <div className="text-red-500 text-sm">{errors.genres}</div>
                  )}
                </div>
                <div>
                  <label htmlFor="image" className="block text-sm font-medium">
                    Image
                  </label>
                  <Input
                    type="file"
                    onChange={(event) =>
                      handleFileChange(event, setFieldValue, "image")
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="preview"
                    className="block text-sm font-medium"
                  >
                    Preview
                  </label>
                  <Input
                    type="file"
                    onChange={(event) =>
                      handleFileChange(event, setFieldValue, "preview")
                    }
                  />
                </div>
              </div>
              {previewURL && (
                <div className="px-6 pb-4">
                  <h4 className="text-sm italic">Image Preview</h4>
                  <img
                    src={previewURL}
                    alt="Image Preview"
                    className="w-48 rounded-md"
                  />
                </div>
              )}
              <footer className="border-t border-gray-200 px-6 py-4 flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </footer>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default EditSong;
