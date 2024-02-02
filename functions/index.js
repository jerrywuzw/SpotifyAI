const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors")({origin: true});

// ==============
// Initialization
// ==============
admin.initializeApp();
const db = admin.firestore();

// ===========================
// Spotify OAuth Configuration
// ===========================
const CLIENT_ID = functions.config().spotify.client_id;
const CLIENT_SECRET = functions.config().spotify.client_secret;
const REDIRECT_URI = functions.config().spotify.redirect_uri;
const SPOTIFY_TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const SPOTIFY_TOP_TRACKS_ENDPOINT = "https://api.spotify.com/v1/me/top/tracks";
const SPOTIFY_USER_PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";
const SPOTIFY_RECOMMENDATIONS_ENDPOINT = "https://api.spotify.com/v1/recommendations";

// ================
// Helper Functions
// ================
/**
 * Helper function to fetch Spotify username.
 * @param {String} accessToken
 * @return {Promise<*>}
 */
async function fetchSpotifyUserProfile(accessToken) {
  try {
    const userProfileResponse = await axios.get(SPOTIFY_USER_PROFILE_ENDPOINT, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    const userData = userProfileResponse.data;
    return {
      id: userData.id, // Spotify username
      email: userData.email, // Spotify email
    };
  } catch (error) {
    console.error("Error fetching Spotify user profile:", error);
    throw error;
  }
}

/**
 * Helper function to fetch Spotify tokens.
 * @param {String} authCode
 * @return {Promise<any>}
 */
async function fetchSpotifyTokens(authCode) {
  try {
    const tokenResponse = await axios.post(
        SPOTIFY_TOKEN_ENDPOINT,
        new URLSearchParams({
          grant_type: "authorization_code",
          code: authCode,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
    );

    return tokenResponse.data;
  } catch (error) {
    console.error("Error fetching Spotify tokens:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

/**
 * Helper function to store Spotify tokens in Firestore
 * @param {String} userId
 * @param {Object} tokens
 * @return {Promise<void>}
 */
async function storeSpotifyTokens(userId, tokens) {
  const userRef = db.collection("users").doc(userId);
  await userRef.set({
    spotifyAccessToken: tokens.access_token,
    spotifyRefreshToken: tokens.refresh_token,
    accessTokenExpiry: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + tokens.expires_in * 1000)),
  }, {merge: true});
}

/**
 * Helper function to create or retrieve a Firebase user
 * @param {String} userId
 * @param {String} email
 * @return {Promise<Object>}
 */
async function createOrRetrieveFirebaseUser(userId, email) {
  try {
    // Try to retrieve the existing user
    return await admin.auth().getUser(userId);
  } catch (error) {
    if (error.code === "auth/user-not-found") {
      // User does not exist, create a new user
      return await admin.auth().createUser({
        uid: userId,
        email: email,
      });
    } else {
      // Some other error occurred
      throw error;
    }
  }
}

/**
 * Helper to ensure the Spotify access token is valid
 * @param {String} userId
 * @return {Promise<String>}
 */
async function ensureValidSpotifyAccessToken(userId) {
  const userRef = db.collection("users").doc(userId);
  const userDoc = await userRef.get();
  const userData = userDoc.data();

  let accessToken = userData.spotifyAccessToken;
  const refreshToken = userData.spotifyRefreshToken;
  const accessTokenExpiry = userData.accessTokenExpiry.toDate();

  // Check if the current access token has expired
  if (accessTokenExpiry <= new Date()) {
    console.log(`Access token expired for user ${userId}, refreshing token...`);

    // Refresh the token
    const refreshedTokenData = await refreshSpotifyToken(refreshToken);
    accessToken = refreshedTokenData.access_token;
    console.log(`Access token refreshed for user ${userId}`);

    // Update the access token and its new expiry time in Firestore
    await userRef.set({
      spotifyAccessToken: accessToken,
      accessTokenExpiry: admin.firestore.Timestamp.fromDate(
          new Date(Date.now() + refreshedTokenData.expires_in * 1000)),
    }, {merge: true});
  }

  return accessToken;
}

/**
 * Helper function to fetch Spotify top tracks.
 * @param {String} refreshToken
 * @return {Promise<any>}
 */
async function refreshSpotifyToken(refreshToken) {
  const authHeader = "Basic " + Buffer.from(
      CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");

  try {
    const response = await axios.post(
        SPOTIFY_TOKEN_ENDPOINT, new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }).toString(), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": authHeader,
          },
        });

    return response.data; // The refreshed token data
  } catch (error) {
    console.error("Error refreshing Spotify token:", error);
    throw error;
  }
}

/**
 * Helper function to fetch Spotify top tracks.
 * @param {String} accessToken
 * @return {Promise<any>}
 */
async function fetchSpotifyTopTracks(accessToken) {
  try {
    const response = await axios.get(SPOTIFY_TOP_TRACKS_ENDPOINT, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    return response.data; // The user's top tracks
  } catch (error) {
    console.error("Error fetching Spotify top tracks:", error);
    throw error;
  }
}

/**
 * Helper function to fetch Spotify recommendations.
 * @param {String} accessToken
 * @param {Array<String>} trackIds
 * @return {Promise<any>}
 */
async function fetchSpotifyRecommendations(accessToken, trackIds) {
  try {
    const response = await axios.get(SPOTIFY_RECOMMENDATIONS_ENDPOINT, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      params: {
        seed_tracks: trackIds.join(","),
        limit: 20, // You can adjust the limit as needed
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Spotify recommendations:", error);
    throw error;
  }
}


// ==================
// Firebase Functions
// ==================
// Exchange a Spotify auth code for tokens
exports.exchangeSpotifyCode = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    if (request.method !== "POST") {
      return response.status(405).send("Method Not Allowed");
    }

    const authCode = request.body.code;
    if (authCode) {
      try {
        const tokens = await fetchSpotifyTokens(authCode);
        console.log("Successfully fetched tokens:", tokens);

        const userProfile = await fetchSpotifyUserProfile(tokens.access_token);
        console.log("Successfully fetched user profile:", userProfile);

        const userRecord = await createOrRetrieveFirebaseUser(
            userProfile.id, userProfile.email);
        console.log("Successfully processed Firebase user:", userRecord.uid);

        // Store Spotify tokens using the helper function
        await storeSpotifyTokens(userRecord.uid, tokens);
        console.log("Successfully stored tokens for user:", userRecord.uid);

        // Create a Firebase custom token
        const customToken = await admin.auth()
            .createCustomToken(userRecord.uid);
        console.log("Successfully created custom token:", customToken);

        response.status(200).send(customToken);
      } catch (error) {
        console.error("Error exchanging auth code for tokens:", error);
        response.status(500).send("Failed to exchange auth code for tokens");
      }
    } else {
      response.status(400).send("No auth code provided");
    }
  });
});

// Get the user's top tracks from Spotify
exports.getTopTracks = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated", "The function must be called while authenticated.");
  }

  console.log(`getTopTracks function invoked by user: ${context.auth.uid}`);

  try {
    const accessToken = await ensureValidSpotifyAccessToken(context.auth.uid);
    console.log(`Access token for user ${context.auth.uid} is valid`);

    const topTracks = await fetchSpotifyTopTracks(accessToken);
    console.log(`Successfully fetched ${topTracks.items.length} top tracks`);

    return {message: "Top tracks fetched successfully", topTracks};
  } catch (error) {
    console.error("Error in getTopTracks function:", error);
    throw new functions.https.HttpsError(
        "internal", "Error fetching top tracks.");
  }
});

// Get recommendations
exports.getRecommendations = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated", "The function must be called while authenticated.");
  }

  // Get the authenticated user's UID
  const userId = context.auth.uid;

  try {
    // Ensure the user's Spotify access token is valid
    const accessToken = await ensureValidSpotifyAccessToken(userId);
    // Fetch the user's top tracks from Spotify
    const topTracksData = await fetchSpotifyTopTracks(accessToken);
    // Extract the track IDs from the top tracks data
    const topTrackIds = topTracksData.items.map((item) => item.id);
    // Fetch recommendations using the track IDs
    const recommendations = await fetchSpotifyRecommendations(
        accessToken, topTrackIds.slice(0, 5));

    console.log(`Fetched ${recommendations.tracks.length} recommendations`);

    // For now, return the top tracks data directly
    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw new functions.https.HttpsError(
        "internal", "Failed to fetch recommendations.");
  }
});
