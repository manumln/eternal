import React, { useState, useEffect } from "react";
import { Input, Button, Card, Spinner } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router-dom";
import { userSchema } from "@/schema";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { FiLock, FiMail, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import { Icon } from "@mui/material";

// Extend schema to include password confirmation

const extendedSchema = userSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Toggle for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(extendedSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/signup`,
        values
      );
      toast.success("Your account was created successfully! Redirecting...");
      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPasswordField = (
    id,
    label,
    placeholder,
    isPasswordVisible,
  ) => (
    <div className="relative">
      <Input
        id={id}
        label="Password"
        name="password"
        placeholder="Enter your password"
        type={isVisible ? "text" : "password"}
        {...register(id)}
        disabled={isLoading}
        fullWidth
        clearable
        isRequired
        bordered
        endContent={
          <button type="button" onClick={toggleVisibility}>
            {isVisible ? (
              <FiEyeOff
                className="pointer-events-none text-lg text-default-400"
              />
            ) : (
              <FiEye
                className="pointer-events-none text-lg text-default-400"
              />
            )}
          </button>
        }
      />
      {errors[id] && (
        <small className="text-red-600 absolute -bottom-5 left-1">
          {errors[id].message}
        </small>
      )}
    </div>
  );

  const buttonClasses =
    "bg-gradient-to-r from-blue-500 to-green-500 text-white hover:opacity-90 transition-opacity shadow-lg";

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-500 to-green-500">
      <Card className="w-full max-w-md p-10">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-2xl font-bold">Sign Up</h1>
          <p className="text-sm text-center">Create your account</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <Input
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  placeholder="Enter your first name"
                  {...register("firstName")}
                  disabled={isLoading}
                  fullWidth
                  clearable
                  isRequired
                  bordered
                  contentLeft={<FiUser className="text-gray-400" />}
                />
                {errors.firstName && (
                  <small className="text-red-600 absolute -bottom-5 left-1">
                    {errors.firstName.message}
                  </small>
                )}
              </div>
              <div className="relative">
                <Input
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter your last name"
                  {...register("lastName")}
                  disabled={isLoading}
                  fullWidth
                  clearable
                  bordered
                  isRequired
                  contentLeft={<FiUser className="text-gray-400" />}
                />
                {errors.lastName && (
                  <small className="text-red-600 absolute -bottom-5 left-1">
                    {errors.lastName.message}
                  </small>
                )}
              </div>
            </div>

            <div className="relative">
              <Input
                id="email"
                isRequired
                label="Email"
                name="email"
                placeholder="Enter your email"
                {...register("email")}
                disabled={isLoading}
                fullWidth
                clearable
                bordered
                contentLeft={<FiMail className="text-gray-400" />}
              />
              {errors.email && (
                <small className="text-red-600 absolute -bottom-5 left-1">
                  {errors.email.message}
                </small>
              )}
            </div>

            {renderPasswordField(
              "password",
              "Password",
              "Create a secure password",
              showPassword,
              () => setShowPassword((prev) => !prev)
            )}

            {renderPasswordField(
              "confirmPassword",
              "Confirm Password",
              "Repeat your password",
              showConfirmPassword,
              () => setShowConfirmPassword((prev) => !prev)
            )}

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              className={buttonClasses}
              size="lg"
            >
              {isLoading ? (
                <Spinner className="animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="underline hover:text-blue-600">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </section>
  );
};

export default SignupForm;
