import { useEffect } from "react";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  isAuthenticatedState,
  isUserLoadingState,
  likedCommentsState,
  likedReviewsState,
  userIdState,
  userRoleState,
  userFavouriteSongsState,
  userProfileImageState,
} from "@/atoms/userData";
import { toast } from "sonner";

const useUserData = () => {
  const setUserRole = useSetRecoilState(userRoleState);
  const setUserId = useSetRecoilState(userIdState);
  const setUsersFavouriteSongs = useSetRecoilState(userFavouriteSongsState);
  const setLikedReviews = useSetRecoilState(likedReviewsState);
  const setLikedComments = useSetRecoilState(likedCommentsState);
  const setIsUserLoading = useSetRecoilState(isUserLoadingState);
  const setUserProfileImage = useSetRecoilState(userProfileImageState);

  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isAuthenticatedState);

  const handleUserData = (user) => {
    const { _id, role, profileImage = "", favoriteSongs = [], likedReviews = [], likedComments = [] } = user;
    setUserRole(role);
    setUserId(_id);
    setUserProfileImage(profileImage);
    setUsersFavouriteSongs(favoriteSongs);
    setLikedReviews(likedReviews);
    setLikedComments(likedComments);
    localStorage.setItem("userId", _id);
    setIsLoggedIn(true);
  };

  const fetchUser = async () => {
    try {
      setIsUserLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      console.log("User data fetched:", data.user);
      handleUserData(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data. Please check your connection.");
      setIsLoggedIn(false);
    } finally {
      setIsUserLoading(false);
    }
  };

  const clearUserData = () => {
    setUserRole("");
    setUserId("");
    setUserProfileImage("");
    setUsersFavouriteSongs([]);
    setLikedReviews([]);
    setLikedComments([]);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
    } else {
      clearUserData();
    }
  }, [isLoggedIn, setIsUserLoading, setIsLoggedIn]);

};

export default useUserData;
