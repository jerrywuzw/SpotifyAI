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
 * @param {Object} medians
 * @return {Promise<any>}
 */
async function fetchSpotifyRecommendations(accessToken, trackIds, medians) {
  try {
    const response = await axios.get(SPOTIFY_RECOMMENDATIONS_ENDPOINT, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
      params: {
        seed_tracks: trackIds.join(","),
        limit: 20,
        target_tempo: medians.tempo,
        target_energy: medians.energy,
        // target_speechiness: medians.speechiness,
        // target_instrumentalness: medians.instrumentalness,
        // target_danceability: medians.danceability,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching Spotify recommendations:", error);
    throw error;
  }
}

/**
 * Helper function to find the median of a sorted array.
 * @param {Array<Number>} sortedArray
 * @return {*|number}
 */
function findMedian(sortedArray) {
  const midIndex = Math.floor(sortedArray.length / 2);

  if (sortedArray.length % 2 === 0) { // Even number of elements
    // Average of the two middle elements
    return (sortedArray[midIndex - 1] + sortedArray[midIndex]) / 2.0;
  } else { // Odd number of elements
    // The middle element
    return sortedArray[midIndex];
  }
}

/**
 * Helper function to compute the median of each attribute.
 * @param {Array<Object>} items
 * @return {{}}
 */
function computeMedians(items) {
  // Initialize arrays to hold values of each attribute
  const attributes = {
    tempo: [],
    energy: [],
    speechiness: [],
    instrumentalness: [],
    danceability: [],
  };

  // Populate the arrays with values from each track
  items.forEach((item) => {
    attributes.tempo.push(item.tempo);
    attributes.energy.push(item.energy);
    attributes.speechiness.push(item.speechiness);
    attributes.instrumentalness.push(item.instrumentalness);
    attributes.danceability.push(item.danceability);
  });

  // Compute and return the median for each attribute
  const medians = {};
  Object.keys(attributes).forEach((attr) => {
    // Sort the array of each attribute
    attributes[attr].sort((a, b) => a - b);
    // Compute the median
    medians[attr] = findMedian(attributes[attr]);
  });

  return medians;
}

/**
 * Helper function to get random elements from an array.
 * @param {unknown[]} arr
 * @param {number} count
 * @return {unknown[]}
 */
function getRandomElements(arr, count) {
  const randomElements = new Set();
  while (randomElements.size < count) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    randomElements.add(arr[randomIndex]);
  }
  return Array.from(randomElements);
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
const styleAttributes = {
  Chill: { target_energy: 0.3, target_valence: 0.3, target_tempo: 90 },
  Happy: { target_energy: 0.7, target_valence: 0.8, target_tempo: 120 },
  Energetic: { target_energy: 0.9, target_valence: 0.6, target_tempo: 150 },
  Workout: { target_energy: 0.8, target_valence: 0.5, target_tempo: 160 },
  Sad: { target_energy: 0.2, target_valence: 0.2, target_tempo: 70 }
};

exports.getRecommendations = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
        "unauthenticated", "The function must be called while authenticated.");
  }

  // Check for the style parameter, default to 'Chill' if not provided
  const style = data.style || 'Chill';

  // Validate if the provided style is one of the predefined ones
  if (!Object.keys(styleAttributes).includes(style)) {
    throw new functions.https.HttpsError(
        "invalid-argument", `The provided style '${style}' is not supported.`);
  }

  try {
    const userId = context.auth.uid;
    const accessToken = await ensureValidSpotifyAccessToken(userId);

    const topTracksData = await fetchSpotifyTopTracks(accessToken);
    const medians = computeMedians(topTracksData.items);

    const topTrackIds = topTracksData.items.map((item) => item.id);
    const randomTopTrackIds = getRandomElements(topTrackIds, 5);

    // Retrieve the attributes for the selected style
    const styleParams = styleAttributes[style];

    const recommendations = await fetchSpotifyRecommendations(
        accessToken, randomTopTrackIds, {...medians, ...styleParams});
    console.log(`Fetched ${recommendations.tracks.length} recommendations for style ${style}`);

    return recommendations;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    throw new functions.https.HttpsError(
        "internal", "Failed to fetch recommendations.");
  }
});

// This function retrieves details for a specific track by its Spotify ID.
exports.getTrackDetails = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const trackId = data.trackId;
  if (!trackId) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with one argument 'trackId'."
    );
  }

  try {
    const accessToken = await ensureValidSpotifyAccessToken(context.auth.uid);
    console.log(`Access token for user ${context.auth.uid} is valid`);

    const trackDetails = await fetchSpotifyTrackDetails(accessToken, trackId);
    console.log(`Successfully fetched details for track ${trackId}`);

    return { message: "Track details fetched successfully", trackDetails };
  } catch (error) {
    console.error("Error in getTrackDetails function:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error fetching track details from Spotify"
    );
  }
});

// You would also need to implement the fetchSpotifyTrackDetails helper function:
async function fetchSpotifyTrackDetails(accessToken, trackId) {
  const trackEndpoint = `https://api.spotify.com/v1/tracks/${trackId}`;
  try {
    const response = await axios.get(trackEndpoint, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    return response.data; // The track's details
  } catch (error) {
    console.error("Error fetching Spotify track details:", error);
    throw error;
  }
}



