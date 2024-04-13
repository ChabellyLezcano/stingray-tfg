const { User } = require("../models/User");
const axios = require("axios");
const baseURL = "http://localhost:4000/api"; // Asegúrate de que la URL es correcta
const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTJjY2M2OTU2YzFlZGJjZTMzY2I1ZCIsImlhdCI6MTcxMzAxNTQ0MSwiZXhwIjoxNzEzNDU0NjQxfQ.WUXzYytpKIK34RgMxMRbA37BsgJ5yYRSFoM_mO73ejM"; // Asegúrate de tener un token válido
const mongoose = require("mongoose");
const { Favorite } = require("../models/Favorite");
const gameURL = "http://localhost:4000/api/game";

const dbConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://masterstingrayboardgames:1UGmltKGgZ95P4rZ@stingray.ptsw59l.mongodb.net/",
    );
    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error initializing DB");
  }
};

dbConnection();

const loginAllUsersAndReturnTokens = async () => {
  const users = await User.find();
  const userTokens = [];

  for (const user of users) {
    try {
      const response = await axios.post(`${baseURL}/auth`, {
        emailOrUsername: user.email,
        password: "Password123",
      });
      console.log(`Token for ${user.email}: ${response.data.token}`);
      userTokens.push({ userId: user._id, token: response.data.token });
    } catch (error) {
      console.error(
        "Error logging in user:",
        error.response ? error.response.data : error.message,
      );
    }
  }

  return userTokens;
};

const getBoardGameIds = async () => {
  try {
    const response = await axios.get(gameURL, {
      headers: { token: `${jwtToken}` },
    });
    if (response.data.boardgames && Array.isArray(response.data.boardgames)) {
      const ids = response.data.boardgames.map((game) => game._id);
      console.log("Board game IDs:", ids);
      return ids;
    } else {
      console.error(
        "No expected array of board games found in the response:",
        response.data,
      );
      return [];
    }
  } catch (error) {
    console.error(
      "Error getting the board game IDs:",
      error.response ? error.response.data : error,
    );
    return [];
  }
};

const assignRandomGamesAsFavorites = async () => {
  try {
    const userTokens = await loginAllUsersAndReturnTokens();
    const gameIds = await getBoardGameIds();

    console.log(userTokens);

    for (const { userId, token } of userTokens) {
      console.log("Token:", token); // Mostrar el token antes de enviarlo como autenticación

      const numberOfFavorites = Math.floor(Math.random() * 16) + 5; // Número aleatorio entre 5 y 20
      const selectedGameIds = gameIds
        .sort(() => 0.5 - Math.random())
        .slice(0, numberOfFavorites);

      try {
        for (const gameId of selectedGameIds) {
          const url = `${baseURL}/favorite/${gameId}`; // Construye la URL con el ID del juego

          const response = await axios.post(
            url,
            {
              userId,
            },
            {
              headers: { token: token },
            },
          );

          console.log(
            `Favorite added for user ${userId} and game ${gameId}:`,
            response.data,
          );
        }
      } catch (error) {
        console.error(
          `Error adding favorites for user ${userId}:`,
          error.response ? error.response.data : error.message,
        );
        console.error(
          "Status:",
          error.response ? error.response.status : "Unknown",
        );
      }
    }
  } catch (error) {
    console.error("Error assigning random games as favorites:", error);
  }
};

assignRandomGamesAsFavorites();
