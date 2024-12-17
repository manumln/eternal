import React, { useState, useEffect } from "react";
import { Input, Button, Link, Card, Spinner } from "@nextui-org/react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { isAuthenticatedState } from "@/atoms/userData";
import { loginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";

export default function LoginForm() {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isAuthenticatedState);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/login`,
        values
      );
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      navigate("/songs");
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "relative";
  const errorClasses = "text-red-600 absolute -bottom-5 left-1";
  const buttonClasses = "bg-gradient-to-r from-blue-500 to-green-500 hover:opacity-90 transition-opacity shadow-lg";

  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-6 bg-gradient-to-br from-blue-600 to-green-500">
      <Card className="w-full max-w-md p-10">
        <div className="flex flex-col items-center space-y-6">
          <img src={logo} alt="Logo" className="w-50 h-auto mb-6" />

          <h1 className="text-2xl font-bold">Welcome Back!</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <div className={inputClasses}>
              <Input
                id="email"
                labelPlaceholder="Email"
                placeholder="name@example.com"
                type="email"
                {...register("email")}
                disabled={isLoading}
                fullWidth
                clearable
                className="text-black"
              />
              {errors.email && (
                <small className={errorClasses}>
                  {errors.email.message}
                </small>
              )}
            </div>

            <div className={inputClasses}>
              <Input
                id="password"
                labelPlaceholder="Password"
                placeholder="Enter your password"
                type="password"
                {...register("password")}
                disabled={isLoading}
                fullWidth
                clearable
              />
              {errors.password && (
                <small className={errorClasses}>
                  {errors.password.message}
                </small>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              className={buttonClasses}
              size="lg"
            >
              {isLoading ? <Spinner className="animate-spin" /> : "Sign In"}
            </Button>

            <div className="flex justify-between items-center pt-6 text-sm">
              <Link href="/signup" underline className="underline hover:text-blue-600">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </section>
  );
}
