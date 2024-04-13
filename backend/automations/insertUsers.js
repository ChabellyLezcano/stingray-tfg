const axios = require("axios");
// Corrige la importación de faker aquí
const { faker } = require("@faker-js/faker");

const baseURL = "http://localhost:4000/api/auth"; // Ajusta esto a la URL base de tu API

// Función para generar datos de usuario ficticios
const generateUserData = () => {
  // Generar una fecha aleatoria entre 2001 y 2006
  const startDate = new Date("2001-01-01");
  const endDate = new Date("2006-04-12");

  // Generar una fecha aleatoria dentro del rango utilizando la nueva sintaxis
  const date = faker.date.between({ from: startDate, to: endDate });

  // Formatear la fecha a dd/mm/yyyy
  const birthDate =
    date.getDate().toString().padStart(2, "0") +
    "/" +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    date.getFullYear().toString();

  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: "Password123", // Por simplicidad, todos los usuarios tendrán la misma contraseña
    validatePassword: "Password123",
    role: "User", // Este valor es estático, pero podrías hacerlo dinámico si lo deseas
    sex: faker.helpers.arrayElement(["M", "F", "Otro"]),
    birthDate: birthDate,
    // Genera fechas de nacimiento aleatorias
  };
};

// Función para simular el registro de un usuario
const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${baseURL}/register`, userData);
    console.log("Usuario registrado exitosamente:", response.data.username);
    return response.data.token; // Devuelve el token para usarlo en la confirmación de la cuenta
  } catch (error) {
    console.error("Error registrando al usuario:", error.response.data);
  }
};

// Función para simular la confirmación de cuenta de un usuario
const confirmAccount = async (token) => {
  try {
    const response = await axios.get(`${baseURL}/confirm-account/${token}`);
    console.log("Cuenta confirmada exitosamente");
  } catch (error) {
    console.error("Error confirmando la cuenta:", error.response.data);
  }
};

// Función principal para orquestar el registro y confirmación de múltiples usuarios
const main = async () => {
  for (let i = 0; i < 5000; i++) {
    const userData = generateUserData();
    const token = await registerUser(userData);
    if (token) {
      await confirmAccount(token);
    }
  }
};

main();
