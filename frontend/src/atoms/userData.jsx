import { atom } from "recoil";

export const userRoleState = atom({
  key: "userRole",
  default: "",
});

export const userIdState = atom({
  key: "userId",
  default: "",
});

export const isAuthenticatedState = atom({
  key: "isLoggedIn",
  default: !!localStorage.getItem("token"),
});

export const userFavouriteSongsState = atom({
  key: "usersFavouriteSongs",
  default: [],
});

export const likedReviewsState = atom({
  key: "likedReviews",
  default: [],
});

export const likedCommentsState = atom({
  key: "likedComments",
  default: [],
});

export const isUserLoadingState = atom({
  key: "isUserLoading",
  default: false,
});

export const userProfileImageState = atom({
  key: "userProfileImage",
  default: "",
});