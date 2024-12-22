import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Card, Avatar } from "@nextui-org/react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"; // Importa los componentes de ShadCN

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
        Recent on <h2 className="font-nimbus text-5xl">eternal</h2>
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
                <CarouselItem key={review._id} className="pl-1 md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    {/* Tarjeta cuadrada moderna */}
                    <Card hoverable className="flex flex-col justify-between h-full">
                      {/* Imagen de la canción */}
                      <div
                        className="w-full h-full aspect-w-2 aspect-h-2 bg-cover bg-center rounded-lg"
                        style={{ backgroundImage: `url(${song.image_url || 'defaultImage.jpg'})` }}
                      ></div>

                      {/* Contenedor de información de la canción */}
                      <div className="mt-4">
                        <h4 className="text-lg font-semibold">{song.title || "Untitled"}</h4>
                        <p className="text-sm text-gray-500">{song.artist || "Unknown"}</p>
                        <p className="mt-2 text-sm text-gray-600">{review.content || "No content available"}</p>
                      </div>

                      {/* Información del usuario que dejó la reseña */}
                      <div className="flex items-center p-4 gap-4 mt-4">
                        <Avatar
                          src={user.profileImage || `https://api.multiavatar.com/${user._id || "default"}.svg`}
                          alt={`${user.firstName} ${user.lastName}`}
                          size="lg"
                        />
                        <div>
                          <p className="text-sm font-medium">
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default RecentReviewsCarousel;
