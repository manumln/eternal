const axios = require("axios");

let accessToken = null;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const getSpotifyAccessToken = async () => {
  if (accessToken) return accessToken;

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    }
  );

  accessToken = response.data.access_token;

  // Set a timeout to clear the token when it expires
  setTimeout(() => {
    accessToken = null;
  }, response.data.expires_in * 1000);

  return accessToken;
};

const searchSongsOnSpotify = async (query, limit = 10, offset = 0) => {
  const token = await getSpotifyAccessToken();

  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: query,
      type: "track",
      limit,
      offset,
    },
  });

  return response.data.tracks;
};

module.exports = { searchSongsOnSpotify };
