const { User } = require("../models/User");
const axios = require("axios");
const mongoose = require("mongoose");

// Function to initialize database connection
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

// Function to get all usernames from the database
const getAllUsernames = async () => {
  try {
    const users = await User.find({}, "username"); // Seleccionando solo el campo 'username'
    const usernames = users.map((user) => user.username);

    // Escoger aleatoriamente 60 nombres de usuario si hay al menos 60, de lo contrario devuelve todos
    const randomUsernames =
      usernames.length > 130
        ? usernames.sort(() => 0.5 - Math.random()).slice(0, 130)
        : usernames;

    console.log(randomUsernames);
    return randomUsernames;
  } catch (error) {
    console.error("Error getting the usernames:", error);
    return [];
  }
};

// Constants for API URLs
const baseURL = "http://localhost:4000/api"; // Base URL of your authentication API
const gameURL = "http://localhost:4000/api/game"; // Base URL of your game API
const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDgwYmMwZTY4YTQ0NTU3ZWFkYzBjMCIsImlhdCI6MTcxMjc5MjA4MSwiZXhwIjoxNzEzMjMxMjgxfQ.YjXqTcA2k7AW1iAbA9buNHIUEANqsd681kXAytjRnV4"; // Example JWT token

// Function to log in users using Axios
const loginUserWithAxios = async (emailOrUsername) => {
  try {
    const response = await axios.post(`${baseURL}/auth`, {
      emailOrUsername: emailOrUsername,
      password: "Password123", // Assuming a generic password
    });
    console.log("Success " + response.data.token);

    return response.data.token;
  } catch (error) {
    console.error("Error during login:", error.response.data);
    return null;
  }
};

// Function to log in all users and return tokens
const loginAllUsersAndReturnTokens = async () => {
  const usernames = await getAllUsernames();
  const tokens = [];
  for (const username of usernames) {
    const token = await loginUserWithAxios(username);
    if (token) {
      console.log(`Token for ${username}: ${token}`);
      tokens.push(token);
    }
  }
  return tokens;
};

// Function to get board game IDs from the API
const getBoardGameIds = async () => {
  try {
    const response = await axios.get(gameURL, { headers: { token: jwtToken } });
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

// Function to select random elements from an array
function selectRandom(arr, num) {
  const results = [];
  while (results.length < num) {
    const random = Math.floor(Math.random() * arr.length);
    if (!results.includes(arr[random])) {
      results.push(arr[random]);
    }
  }
  return results;
}

// Function to make reservations
async function makeReservations(gameIds, tokens) {
  const reservationIds = [];
  for (let i = 0; i < gameIds.length; i++) {
    const gameId = gameIds[i];
    const token = tokens[i];
    try {
      const response = await axios.post(
        `${baseURL}/reservation/${gameId}`,
        {},
        { headers: { token: `${token}` } },
      );
      console.log(`Reservation ${i + 1}:`, response.data);
      if (
        response.data &&
        response.data.reservation &&
        response.data.reservation._id
      ) {
        reservationIds.push(response.data.reservation._id);
      }
      await new Promise((resolve) => setTimeout(resolve, 100)); // Throttling requests
    } catch (error) {
      console.error(
        `Error in reservation ${i + 1}:`,
        error.response ? error.response.data : error.message,
      );
    }
  }
  return reservationIds;
}

// Function to generate random dates for pickup and return
function generateDates() {
  const start = new Date();
  const end = new Date("2024-09-12");
  const pickup = new Date(
    start.getTime() +
      Math.random() * (end.getTime() - start.getTime() - 86400000),
  );
  const minReturn = new Date(pickup.getTime() + 86400000);
  const returnDate = new Date(
    minReturn.getTime() + Math.random() * (end.getTime() - minReturn.getTime()),
  );
  return { pickup, returnDate };
}

// Function to process reservations
async function processReservations(reservationIds, jwtToken) {
  for (let id of reservationIds) {
    const { pickup, returnDate } = generateDates();
    try {
      await axios.patch(
        `${baseURL}/reservation/${id}/accept`,
        { expirationDate: returnDate.toJSON() },
        { headers: { token: `${jwtToken}` } },
      );
      await axios.patch(
        `${baseURL}/reservation/${id}/pickup`,
        { newExpirationDate: returnDate.toJSON() },
        { headers: { token: `${jwtToken}` } },
      );
      await axios.patch(
        `${baseURL}/reservation/${id}/completed`,
        { returnDate: pickup.toJSON() },
        { headers: { token: `${jwtToken}` } },
      );
      console.log(`Reservation ${id} processed correctly.`);
    } catch (error) {
      console.error(
        `Error processing the reservation ${id}:`,
        error.response ? error.response.data : error.message,
      );
    }
  }
}

// Your main asynchronous function
const mainAsyncFunction = async () => {
  try {
    await dbConnection();
    console.log("Database successfully initialized.");
    const gameIds = await getBoardGameIds();
    const tokens = await loginAllUsersAndReturnTokens();
    const selectedGameIds = selectRandom(gameIds, 120);
    const selectedTokens = selectRandom(tokens, 120);
    console.log("Random selection completed.");
    const reservationIds = await makeReservations(
      selectedGameIds,
      selectedTokens,
    );
    //console.log("Reservations made successfully. Reservation IDs:", reservationIds);
    await processReservations(reservationIds, jwtToken);
    console.log("All reservations have been processed.");
  } catch (error) {
    console.error("Error in the main flow:", error);
  }
};

// Function to execute the main function 20 times sequentially
const executeMainAsyncFunctionSequentially = async () => {
  for (let i = 0; i < 100; i++) {
    await mainAsyncFunction(); // Await ensures that each call completes before the next begins
    console.log(`Iteration ${i + 1} completed.`);
  }
};

// Call the function to start the process
executeMainAsyncFunctionSequentially();
