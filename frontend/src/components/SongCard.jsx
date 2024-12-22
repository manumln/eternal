import { Link } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Card } from "@nextui-org/card";

const SongImage = lazy(() => import("./SongImage"));

const SongCard = ({ song }) => {
  const imageUrl = song.image_url.replace("/upload", "/upload/h_400");

  return (
    <Link
      to={`/songs/${song._id}`}
      className="group w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 px-3 py-6 transition-all transform hover:scale-105 hover:shadow-lg"
    >
      <Card className="relative overflow-hidden">
        <Suspense fallback={<div className="w-full h-full bg-gray-200 rounded-xl" />}>
          <SongImage src={imageUrl} alt={song.title} />
        </Suspense>
      </Card>

      {/* Contenedor del título y autor debajo de la imagen */}
      <div className="mt-4">
        <h3 className="font-bold text-2xl truncate">{song.title}</h3>
        <p className="mt-1 text-sm ">{song.artist}</p>
      </div>
    </Link>
  );
};

export default SongCard;
