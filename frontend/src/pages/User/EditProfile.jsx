import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { Button, Card, Input, Spinner } from "@nextui-org/react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

const EditProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  });
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}`)
      .then((response) => {
        const { firstName, lastName, email, profileImage } = response.data.user;
        setInitialValues({ firstName, lastName, email, profileImage });
        setPreviewImage(profileImage);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Error loading user data");
        navigate("/not-found");
      })
      .finally(() => setIsLoading(false));
  }, [userId, navigate]);

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      setFieldValue("profileImage", file); // Actualiza el campo en Formik
      setPreviewImage(URL.createObjectURL(file)); // Vista previa de la imagen
    }
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/${userId}/edit`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(response.data.message || "Profile updated successfully");
      navigate(`/users/${userId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto mt-12 p-8">
      <h1 className="text-3xl font-bold text-center mb-5">Edit Profile</h1>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <Form>
            <div className="flex justify-center mb-4">
              <div
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 dark:border-zinc-700"
              >
                <img
                  src={previewImage || "/default-avatar.png"}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium"
                >
                  First Name
                </label>
                <Field name="firstName" as={Input} placeholder="First Name" />
                {errors.firstName && touched.firstName && (
                  <div className="text-red-500 text-sm">{errors.firstName}</div>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <Field name="lastName" as={Input} placeholder="Last Name" />
                {errors.lastName && touched.lastName && (
                  <div className="text-red-500 text-sm">{errors.lastName}</div>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block hidden text-sm font-medium">
                  Email
                </label>
                <Field name="email" as={Input} className="hidden" placeholder="Email" />
                {errors.email && touched.email && (
                  <div className="text-red-500 hidden text-sm">{errors.email}</div>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="profileImage" className="block text-sm font-medium">
                  Profile Image
                </label>
                <Input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                />
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
  );
};

export default EditProfile;
