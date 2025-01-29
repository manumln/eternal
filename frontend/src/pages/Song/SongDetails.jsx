import { Button, Image, Card, Spinner, Avatar } from "@nextui-org/react";
import axios from "axios";
import { Suspense, lazy, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import dateFormat from "dateformat";
import useGetSong from "@/hooks/useGetSong";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useRecoilValue, useRecoilState } from "recoil";
import { isAuthenticatedState, userRoleState, userFavouriteSongsState } from "@/atoms/userData";
import SameArtist from "@/components/SameArtist";
import { toast } from "sonner";
import "react-confirm-alert/src/react-confirm-alert.css";
import { AiFillHeart, AiFillStar } from "react-icons/ai";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../../components/ui/alert-dialog";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import ColorThief from "colorthief";

// Lazy-loaded components
const ReviewList = lazy(() => import("@/components/ReviewList"));
const ReviewForm = lazy(() => import("@/components/ReviewForm"));

const SongDetails = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [myReview, setMyReview] = useState(null);
  const [isHeartLoading, setIsHeartLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [counter, setCounter] = useState(0);
  const [titleColor, setTitleColor] = useState("#000");

  const { song, isDetailLoading } = useGetSong();
  const isLoggedIn = useRecoilValue(isAuthenticatedState);
  const role = useRecoilValue(userRoleState);
  const [userFavouriteSongs, setUserFavouriteSongs] = useRecoilState(userFavouriteSongsState);
  const navigate = useNavigate();

  useEffect(() => {
    const extractColor = async () => {
      if (song?.image_url) {
        const img = new window.Image();
        img.crossOrigin = "anonymous"; // Allow cross-origin loading
        img.src = song.image_url;

        img.onload = () => {
          const colorThief = new ColorThief();
          const color = colorThief.getColor(img);
          setTitleColor(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
        };

        img.onerror = (err) => {
          console.error("Error loading image for color extraction:", err);
        };
      }
    };

    extractColor();
  }, [song]);

  useEffect(() => {
    if (song && isLoggedIn) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/songs/${song._id}/reviews/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then(({ data }) => {
          setMyReview(data);
          setIsEditing(false);
        })
        .catch(console.error);
    }
  }, [song, isLoggedIn, counter]);

  useEffect(() => {
    if (song) setIsLiked(userFavouriteSongs.includes(song._id));
  }, [song, userFavouriteSongs]);

  const toggleFavorite = useCallback(async () => {
    if (!isLoggedIn) return toast.error("You need to be logged in");

    setIsHeartLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/users/favourites`,
        { songId: song._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setUserFavouriteSongs((prev) =>
        isLiked ? prev.filter((id) => id !== song._id) : [...prev, song._id]
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsHeartLoading(false);
    }
  }, [isLoggedIn, song, isLiked, setUserFavouriteSongs]);

  const handleDeleteSong = async () => {
    setIsDeleteLoading(true);
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/songs/${song._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/songs");
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const image = song?.image_url;

  if (isDetailLoading) return <Spinner className="mx-auto h-10 w-10 animate-spin" />;
  if (!song) return null;

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 gap-6">
      <Card className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl mx-auto p-6">
        <div className="flex flex-col items-center sm:sticky sm:top-[81px] pb-2">
          <Image
            loading="lazy"
            src={image}
            alt="Song cover"
            className="rounded-lg object-cover w-full h-auto max-w-lg"
            crossOrigin="anonymous"
          />
        </div>

        <div className="w-full">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold leading-tight">
            {song.title}
          </h1>
          <div className="flex items-center gap-2 text-lg">
            <h3>by</h3>
            <h2 className="font-semibold">{song.artist}</h2>
          </div>

          {isLoggedIn && myReview && (
            <Card className="w-full p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-4">
                <Avatar
                  className="h-10 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
                  src={myReview.userId.profileImage || "/path/to/default-avatar.png"}
                  alt="user"
                />
                <div className="flex flex-col">
                  <h4 className="text-xl font-semibold">{myReview.userId.firstName} {myReview.userId.lastName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    {[...Array(5)].map((_, index) => (
                      <AiFillStar key={index} size={16} color={myReview.rating >= index + 1 ? "gold" : "gray"} />
                    ))}
                    <span className="text-sm">{dateFormat(myReview.createdAt)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing((prev) => !prev)}
                  className="ml-auto hover:text-gray-900"
                >
                  <FiEdit2 size={20} />
                </Button>
              </div>
              <blockquote className="mt-3 text-sm sm:text-base">{myReview.content}</blockquote>
            </Card>
          )}

          {(isEditing || !myReview) && (
            <ReviewForm
              song={song}
              isEditing={isEditing}
              reviewId={myReview?._id}
              handleUserReply={() => setCounter((prev) => prev + 1)}
            />
          )}

          <div className="flex gap-4 items-center mt-4">
            <Button
              variant="outline"
              title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
              className={`flex items-center gap-2 p-3 transition-all ${isLiked ? "bg-gradient-to-r from-red-500 to-orange-400 text-white" : ""}`}
              onClick={toggleFavorite}
            >
              {isHeartLoading ? (
                <Spinner color="white" strokeWidth={2.5} opacity={0.5} className="w-8 h-8 animate-spin" />
              ) : (
                <AiFillHeart size={20} color={isLiked ? "white" : "red"} />
              )}
              <span>{isLiked ? "Added to Favourites" : "Add to Favourites"}</span>
            </Button>

            {role === "admin" && (
              <div className="flex gap-4 ml-auto">
                <Button variant="outline" onClick={() => navigate(`edit`)}>
                  <FiEdit2 className="mr-2 h-4 w-4" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-2 border-red-300 hover:bg-gradient-to-r from-red-500 to-orange-400 text-white"
                    >
                      <FiTrash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-11/12">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the song.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button variant="destructive" onClick={handleDeleteSong}>
                        {isDeleteLoading ? (
                          <>
                            <Spinner className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                          </>
                        ) : (
                          <>Delete</>
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </Card>

      {song?.preview?.trim() && (
        <div className="mt-6 w-full max-w-6xl mx-auto p-6 bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Preview</h3>
          <AudioPlayer src={song.preview} autoPlay={false} controls />
        </div>
      )}

      <Suspense fallback={<Spinner className="mx-auto h-10 w-10 animate-spin" />}>
        <SameArtist song={song} />
        <ReviewList
          song={song}
          userReplyCounter={counter}
          setUserReplyCounter={setCounter}
        />
      </Suspense>
    </div>
  );
};

export default SongDetails;
