const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
admin.initializeApp();


// Spotify OAuth configuration
const CLIENT_ID = functions.config().spotify.client_id;
const CLIENT_SECRET = functions.config().spotify.client_secret;
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SPOTIFY_TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";


// Refresh the user's Spotify access token
async function refreshSpotifyToken(uid) {
  // Fetch the refresh token from Firestore
  const tokenDoc = await admin.firestore()
      .collection("spotifyTokens")
      .doc(uid)
      .get();

  if (!tokenDoc.exists) {
    throw new functions.https.HttpsError(
        "not-found",
        "Refresh token not found.",
    );
  }

  const {refreshToken} = tokenDoc.data();
  const basicAuthHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  // Request a new access token using the refresh token
  const response = await axios.post(
      SPOTIFY_TOKEN_ENDPOINT,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }), {
        headers: {
          "Authorization": `Basic ${basicAuthHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

  const {access_token: newAccessToken} = response.data;

  // Update the access token in Firestore
  await admin.firestore()
      .collection("spotifyTokens")
      .doc(uid)
      .update({accessToken: newAccessToken});

  return newAccessToken;
}


// Create a user record in Firestore when a new user account is created
exports.createUserRecord = functions.auth.user().onCreate(async (user) => {
  const {uid, email, displayName} = user;
  const newUserRecord = {
    uid,
    email: email || "",
    displayName: displayName || "",
  };

  await admin.firestore().collection("users").doc(uid).set(newUserRecord);

  return null;
});

// Exchange a Spotify authorization code for an access token and refresh token
exports.exchangeSpotifyCode = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
    );
  }

  const {code} = data;
  const basicAuthHeader = Buffer.from(
      `${CLIENT_ID}:${CLIENT_SECRET}`,
  ).toString("base64");

  try {
    const response = await axios.post(
        SPOTIFY_TOKEN_ENDPOINT,
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "YOUR_SPOTIFY_REDIRECT_URI",
        }), {
          headers: {
            "Authorization": `Basic ${basicAuthHeader}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

    const {accessToken, refreshToken} = response.data;

    // Store the tokens in Firestore against the user's UID
    await admin.firestore()
        .collection("spotifyTokens")
        .doc(context.auth.uid)
        .set({
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

    return {status: "success"};
  } catch (error) {
    console.error("Error exchanging Spotify code:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Error exchanging Spotify code",
    );
  }
});

// Get the user's top tracks from Spotify
exports.getTopTracks = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated",
        "The function must be called while authenticated.",
    );
  }

  try {
    const uid = context.auth.uid;
    let {accessToken} = (await admin.firestore()
        .collection("spotifyTokens")
        .doc(uid)
        .get()).data();

    // Attempt to fetch top tracks with current access token
    try {
      const response = await axios.get(SPOTIFY_TOP_TRACKS_ENDPOINT, {
        headers: {"Authorization": `Bearer ${accessToken}`},
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token might be expired, try refreshing it
        accessToken = await refreshSpotifyToken(uid);

        // Retry the request with the new access token
        const response = await axios.get(SPOTIFY_TOP_TRACKS_ENDPOINT, {
          headers: {"Authorization": `Bearer ${accessToken}`},
        });
        return response.data;
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw new functions.https.HttpsError(
        "internal",
        "Error fetching top tracks",
    );
  }
});

