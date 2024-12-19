import { Button, Card, Input, Spinner } from "@nextui-org/react";
import { Formik, Field, Form } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as Yup from "yup";
import { toast } from "sonner";

const SongSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  artist: Yup.string().required("Artist is required"),
  image: Yup.mixed().notRequired(),
  preview: Yup.mixed().notRequired(),
});

const AddSong = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState("");
  const [genres, setGenres] = useState([]);
  const [newGenre, setNewGenre] = useState("");

  const initialValues = {
    title: "",
    artist: "",
    description: "",
    image: null,
    preview: null,
  };

  const handleFileChange = (event, setFieldValue, fieldName) => {
    const file = event.target?.files?.[0];
    setFieldValue(fieldName, file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewURL(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (values[key]) {
          formData.append(key, values[key]);
        }
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/songs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message);
      navigate("/songs/");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/genres`
      );
      setGenres(response.data.genres);
    };
    fetchGenres();
  }, []);

  const handleAddGenre = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/genres`,
        { name: newGenre },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setGenres([...genres, response.data.genre]);
      setNewGenre("");
      toast.success("Genre added successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="flex justify-center p-4 sm:px-6">
      <Card className="w-full max-w-xl shadow-md">
        <Formik
          initialValues={initialValues}
          validationSchema={SongSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form>
              <header className="border-b border-gray-200 px-6 py-4">
                <h1 className="text-lg font-semibold">Add Song</h1>
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
                  <Field
                    name="preview"
                    as={Input}
                    placeholder="Preview of the Song"
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

              <div>
                <label htmlFor="genre" className="block text-sm font-medium">
                  Genre
                </label>
                <Field
                  as="select"
                  name="genre"
                  className="border rounded w-full p-2"
                  placeholder="Select a Genre"
                >
                  <option value="">Select a genre</option>
                  {genres.map((genre) => (
                    <option key={genre._id} value={genre._id}>
                      {genre.name}
                    </option>
                  ))}
                </Field>
                <div className="mt-2">
                  <Input
                    type="text"
                    placeholder="Add new genre"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                  />
                  <Button onClick={handleAddGenre}>Add Genre</Button>
                </div>
              </div>
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

export default AddSong;
