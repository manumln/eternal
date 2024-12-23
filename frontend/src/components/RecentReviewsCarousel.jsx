import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, Avatar } from "@nextui-org/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Importa los componentes de ShadCN

const RecentReviewsCarousel = () => {
  const [reviews, setReviews] = useState([]);

  // Cargar las reseñas desde el servidor
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/songs/recent`)
      .then((response) => {
        console.log("API Response:", response.data); // Log para depurar
        setReviews(response.data.reviews);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        toast.error(
          err.response?.data?.message || "Error fetching recent reviews"
        );
      });
  }, []);

  return (
    <div className="w-full my-10">
      {/* Título de la sección */}
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
        Recent on{" "}
        <span className="font-nimbus text-5xl text-gradient">eternal</span>
      </h2>

      {/* Carrusel de reseñas con ShadCN */}
      <Carousel className="w-full">
        <CarouselContent>
          {reviews
            .filter((review) => review.songId && review.userId) // Filtrar reseñas inválidas
            .map((review) => {
              const user = review.userId || {};
              const song = review.songId || {};

              return (
                <CarouselItem
                  key={review._id}
                  className="px-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-4">
                    {/* Tarjeta cuadrada moderna */}
                    <Card
                      hoverable
                      className="flex flex-col justify-between h-full border border-gray-200 shadow-lg rounded-lg"
                    >
                      {/* Imagen de la canción */}
                      <div
                        className="w-81 h-80 bg-cover bg-center rounded-t-lg"
                        style={{
                          backgroundImage: `url(${
                            song.image_url || "defaultImage.jpg"
                          })`,
                        }}
                      ></div>

                      {/* Contenedor de información de la canción */}
                      <div className="mt-4 px-3">
                        <h4 className="text-lg font-semibold text-gray-800">
                          {song.title || "Untitled"}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {song.artist || "Unknown"}
                        </p>
                        <p className="mt-2 text-sm text-gray-700">
                          {review.content || "No content available"}
                        </p>
                      </div>

                      {/* Información del usuario que dejó la reseña */}
                      <div className="flex items-center p-4 gap-4 mt-4 bg-gray-50 rounded-b-lg">
                        <Avatar
                          src={
                            user.profileImage ||
                            `https://api.multiavatar.com/${
                              user._id || "default"
                            }.svg`
                          }
                          alt={`${user.firstName} ${user.lastName}`}
                          size="lg"
                          className="shadow-md"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
        </CarouselContent>

        {/* Botones de navegación */}
        <div className="absolute inset-0 flex justify-between items-center px-4 z-10">
          <CarouselPrevious className="bg-gray-800 text-white rounded-full p-2 shadow-md hover:bg-gray-700 transition-all" />
          <CarouselNext className="bg-gray-800 text-white rounded-full p-2 shadow-md hover:bg-gray-700 transition-all" />
        </div>
      </Carousel>
    </div>
  );
};

export default RecentReviewsCarousel;
