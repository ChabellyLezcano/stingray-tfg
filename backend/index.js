const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const http = require("http");

const { dbConnection } = require("./config/database");
const configureCloudinary = require("./config/cloudinary");
const { Boardgame } = require("./models/Boardgame");
const { Reservation } = require("./models/Reservation");
const { User } = require("./models/User");

//Enviroment variables
process.loadEnvFile();

// Crear la aplicación de express
const app = express();

// Crear el servidor HTTP utilizando Express
const server = http.createServer(app);

// DB connection
dbConnection();

//Cloudinary connection
configureCloudinary();

// Public directory
const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

// Middlewares
app.use(cors({ exposedHeaders: ["token"] }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/game", require("./routes/boardgame"));
app.use("/api/favorite", require("./routes/favorite"));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
/*
app.get("/api/reservations/average", async (req, res) => {
  try {
      // Primero agrupamos por userId y contamos las reservas
      const result = await Reservation.aggregate([
          {
              $group: {
                  _id: "$userId",
                  totalReservations: { $sum: 1 }
              }
          },
          {
              $group: {
                  _id: null,  // Agrupamos todos los resultados para calcular el promedio global
                  averageReservations: { $avg: "$totalReservations" }
              }
          }
      ]);

      // Como el resultado es un array con un solo elemento, accedemos a este para enviar la media
      if (result.length > 0) {
          res.send({ average: result[0].averageReservations });
      } else {
          res.send({ average: 0 }); // Envía 0 si no hay datos
      }
  } catch (error) {
      console.error('Error on aggregation:', error);
      res.status(500).send({ error: "Error retrieving reservation data" });
  }
});


app.get("/api/users/average-age", async (req, res) => {
  try {
      const result = await User.aggregate([
          {
              $project: {
                  _id: 0,  // Excluimos el _id de los resultados si no lo necesitas
                  age: {
                      $floor: {
                          $divide: [
                              { $subtract: [new Date(), "$birthDate"] },  // Asegúrate de usar 'birthDate' como en el esquema
                              (365 * 24 * 60 * 60 * 1000) // Número de milisegundos en un año
                          ]
                      }
                  }
              }
          },
          {
              $group: {
                  _id: null,
                  averageAge: { $avg: "$age" }
              }
          }
      ]);

      if (result.length > 0 && result[0].averageAge != null) {
          res.send({ averageAge: result[0].averageAge });
      } else {
          res.send({ averageAge: 0 }); // Envía 0 si no hay datos o si todos los birthDate son nulos
      }
  } catch (error) {
      console.error('Error on calculating average age:', error);
      res.status(500).send({ error: "Error retrieving user data" });
  }
});





async function updateGameStatus() {
  try {
    // Conectar a MongoDB si aún no está conectado
    await dbConnection();

    // Encontrar todos los juegos con el estado 'Occupied' y actualizarlos a 'Available'
    const result = await Boardgame.updateMany({ status: 'Occupied' }, { status: 'Available' });

    console.log(result); // Muestra el resultado de la operación
  } catch (error) {
    console.error("Error al actualizar el estado de los juegos:", error);
  }
}

updateGameStatus();


/*

async function updateReservaionStatus() {
  try {
    // Conectar a MongoDB si aún no está conectado
    await dbConnection();

    // Encontrar todos los juegos con el estado 'Occupied' y actualizarlos a 'Available'
    const result = await Reservation.updateMany({ status: 'Pending' }, { status: 'Cancelled' });

    console.log(result); // Muestra el resultado de la operación
  } catch (error) {
    console.error("Error al actualizar el estado de los juegos:", error);
  }
}

updateReservaionStatus();

*/
