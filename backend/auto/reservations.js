const mongoose = require("mongoose");
const axios = require("axios");
const { User } = require("../models/User");
const { Reservation } = require("../models/Reservation");
const { Review } = require("../models/Review");

const baseURL = "http://localhost:4000/api";

const specificGameIds = [
  "660969393dee5d3207b713b2",
  "6646678101e09921601236a9",
  "664fdf7ab2b27d3a56fcb0c7",
  "664fe037b2b27d3a56fcb0d0",
  "664fe0beb2b27d3a56fcb0d9",
  "664fe210b2b27d3a56fcb0e6",
  "664fe2f0b2b27d3a56fcb0f4",
  "664fe382b2b27d3a56fcb0fd",
  "66926c586ea2925da2987c2b",
  "66926d496ea2925da2987c33",
  "66926db46ea2925da2987c3b",
  "66926e5e6ea2925da2987c4c",
  "66926f7a6ea2925da2987c54",
];
const highRatingTitles = [
  "Diversión sin límites",
  "Un clásico moderno",
  "Increíble experiencia",
  "Horas de entretenimiento",
  "Fácil de aprender, difícil de dominar",
  "Adictivo y emocionante",
  "Perfecto para todos",
  "Imprescindible en cualquier colección",
  "Calidad excepcional",
  "Diseño brillante",
  "Gran valor de rejugabilidad",
  "Diversión para toda la familia",
  "Magnífico y desafiante",
  "Una obra maestra",
  "Una joya lúdica",
  "Sorprendentemente bueno",
  "Mecánicas inteligentes",
  "Absolutamente fascinante",
  "Diversión garantizada",
  "Una experiencia épica",
  "Jugabilidad fluida",
  "Entretenimiento asegurado",
  "Estrategia a otro nivel",
  "Impresionante calidad",
  "Totalmente adictivo",
  "Innovador y creativo",
  "Perfecto para grupos",
  "Desafíos constantes",
  "Mucha profundidad",
  "Ideal para noches de juego",
  "Diversión continua",
  "Excepcional en todos los aspectos",
  "Aventura épica",
  "Un juego redondo",
  "Diversión competitiva",
  "Para todas las edades",
  "Innovador y envolvente",
  "Juego imprescindible",
  "Gran dinámica",
  "Estrategia pura y dura",
];

const highRatingDescriptions = [
  "Este juego es simplemente espectacular. Desde las primeras jugadas, nos quedamos completamente enganchados. La profundidad estratégica y las decisiones tácticas hacen que cada partida sea única y emocionante.",
  "Un juego que ha superado nuestras expectativas. Su diseño brillante y mecánicas innovadoras aseguran horas de diversión. Perfecto para cualquier tipo de jugador.",
  "Nos encanta este juego. Es fácil de aprender, pero ofrece una gran cantidad de desafíos y estrategias. Es una adición imprescindible para cualquier noche de juegos.",
  "Un clásico moderno que no puede faltar en ninguna colección. La calidad de los componentes y la jugabilidad son excepcionales. Totalmente recomendado.",
  "La calidad de los materiales es insuperable, y la jugabilidad es simplemente fantástica. Es uno de esos juegos que quieres jugar una y otra vez.",
  "Este juego es increíblemente adictivo. Sus mecánicas inteligentes y su diseño atractivo lo hacen perfecto para cualquier reunión. No podemos recomendarlo lo suficiente.",
  "Un juego que ofrece una experiencia completa y satisfactoria. Desde las reglas hasta los componentes, todo está perfectamente diseñado para garantizar la diversión.",
  "Nos sorprendió gratamente la profundidad estratégica de este juego. Cada partida es un nuevo desafío, y siempre hay algo nuevo que descubrir.",
  "La diversión que proporciona este juego es incomparable. Su mecánica ingeniosa y las variadas formas de ganar mantienen a todos al borde de sus asientos.",
  "Un espectáculo visual y táctico. Este juego no solo es bonito, sino que ofrece una profundidad estratégica que satisface incluso al jugador más exigente.",
  "Este juego logra lo que pocos pueden: ser accesible para novatos y desafiante para veteranos. Una verdadera joya en el mundo de los juegos de mesa.",
  "Su ritmo rápido y las decisiones impactantes lo hacen un juego emocionante en cada ronda. Es imposible jugar solo una partida.",
  "Este juego es la definición de un 'clásico moderno'. Combina lo mejor de los juegos tradicionales con mecánicas frescas y emocionantes.",
  "Me encanta cómo este juego promueve el pensamiento crítico y la planificación estratégica sin ser abrumador. Es educativo y divertido a la vez.",
  "Cada componente de este juego ha sido cuidadosamente diseñado para enriquecer la experiencia de juego. Desde las cartas hasta el tablero, todo es de primera calidad.",
  "Este juego trae una experiencia épica cada vez que se juega. Con su rica narrativa y múltiples posibilidades de estrategia, nunca te aburrirás.",
  "Para aquellos que aman los retos, este juego ofrece complejidad sin ser complicado. Es un equilibrio perfecto entre desafío y diversión.",
  "Las posibilidades de juego son casi infinitas. Con tantas estrategias para explorar, este juego se ha convertido rápidamente en el favorito de la casa.",
  "Este juego transforma cualquier noche ordinaria en una emocionante batalla de ingenios y estrategia. Es el centro de nuestras reuniones familiares.",
  "Fantástico para fomentar la cooperación y el trabajo en equipo, este juego hace un excelente trabajo al mantener a todos los jugadores involucrados y activos.",
];

const midRatingTitles = [
  "Prometedor pero imperfecto",
  "Potencial sin explotar",
  "Interesante pero confuso",
  "Podría ser mejor",
  "Algo repetitivo",
  "Calidad mixta",
  "Entretenido pero mejorable",
  "Bonito pero limitado",
  "Demasiado azar",
  "Necesita más ajustes",
  "Un poco desequilibrado",
  "No para todos",
  "Cumple pero no destaca",
  "Podría ser más emocionante",
  "Reglas confusas",
  "Demasiado largo",
  "Un poco tedioso",
  "Falta de dinamismo",
  "Promete más de lo que ofrece",
  "Mejorable con expansión",
];

const midRatingDescriptions = [
  "Este juego tiene una buena base, pero la ejecución deja mucho que desear. Las mecánicas pueden ser confusas y los componentes no son de la mejor calidad.",
  "Me pareció interesante al principio, pero se vuelve repetitivo rápidamente. Podría beneficiarse de más variedad en las opciones estratégicas.",
  "Aunque tiene potencial, este juego no logra mantener el interés por mucho tiempo. Las reglas son un poco confusas y la jugabilidad es algo monótona.",
  "Es entretenido, pero no lo suficiente como para ser un favorito. La calidad de los componentes podría mejorar y las reglas necesitan ser más claras.",
  "La idea es buena, pero el juego se siente incompleto. Las mecánicas necesitan más desarrollo y los componentes no están a la altura del precio.",
  "Es un juego decente, pero no sobresale en ningún aspecto en particular. Puede ser divertido en algunas ocasiones, pero no es muy rejugable.",
  "Este juego tiene un diseño bonito, pero la jugabilidad no está a la altura. Se siente más como una decoración que como un verdadero desafío.",
  "El juego depende demasiado del azar, lo que puede ser frustrante. Necesita un mejor equilibrio entre estrategia y suerte.",
  "La experiencia de juego es un poco desigual. Algunas partidas pueden ser emocionantes, pero otras se sienten largas y tediosas.",
  "Tiene buenas ideas, pero necesita más ajustes para ser realmente divertido. La configuración es tediosa y las partidas pueden ser demasiado largas.",
  "Es un juego que cumple su propósito, pero no destaca en nada. Las reglas son confusas y la experiencia de juego puede ser frustrante.",
  "La temática es interesante, pero no está bien integrada en la jugabilidad. Se siente como una oportunidad perdida.",
  "Las partidas son demasiado largas y pueden volverse tediosas. Necesita más dinamismo para mantener el interés de los jugadores.",
  "La falta de claridad en las reglas y la configuración tediosa hacen que este juego no sea muy accesible. Podría beneficiarse de una revisión.",
  "Es entretenido al principio, pero pierde su encanto rápidamente. Las mecánicas no son lo suficientemente sólidas como para mantener el interés.",
  "El juego tiene potencial, pero necesita más desarrollo. La configuración inicial es tediosa y las partidas pueden ser largas y aburridas.",
  "Aunque tiene algunos aspectos positivos, este juego necesita más ajustes para ser realmente divertido. La falta de dinamismo es un problema.",
  "Promete mucho al principio, pero no logra cumplir con las expectativas. Las mecánicas necesitan más desarrollo y los componentes podrían mejorar.",
  "Este juego tiene buenas ideas, pero la ejecución no es la mejor. Se siente incompleto y las mecánicas necesitan más desarrollo.",
  "Es un juego que podría ser realmente bueno con algunas mejoras. Las expansiones podrían ayudar a solucionar algunos de los problemas actuales.",
];
const lowRatingTitles = [
  "Gran decepción",
  "Evítalo",
  "Aburrido y lento",
  "Materiales pobres",
  "No lo repetiría",
  "Mal diseñado",
  "Demasiado complicado",
  "Nada divertido",
  "Malas decisiones",
  "Insatisfactorio",
  "No lo recomiendo",
  "Tiempo perdido",
  "Sobrevalorado",
  "Mal funcionamiento",
  "Demasiado básico",
  "Poco atractivo",
  "Injustamente caro",
  "Falto de innovación",
  "Desbalanceado",
  "Poca rejugabilidad",
  "Pésima experiencia",
  "Una desilusión",
  "Sin sentido",
];

const lowRatingDescriptions = [
  "Este juego fue una gran decepción. Las mecánicas no son divertidas y los componentes son de baja calidad. No lo recomendaría.",
  "Un juego que no vale la pena. Es aburrido y las reglas son demasiado complicadas para lo que ofrece. No lo recomiendo.",
  "Este juego es lento y frustrante. No hay dinamismo y la diversión es casi inexistente. No vale la pena.",
  "Los materiales de este juego son de muy baja calidad. No justifica el precio y no es agradable de jugar.",
  "Jugamos una vez y nadie quiso volver a jugarlo. Es predecible, monótono y no ofrece ningún desafío interesante.",
  "La calidad de este juego es muy baja. Las mecánicas no están bien pensadas y la experiencia de juego es mala.",
  "Este juego es demasiado complicado para lo poco que ofrece. No vale la pena el esfuerzo.",
  "Desperdicié mi tiempo con este juego. La jugabilidad es insatisfactoria y no ofrece nada interesante.",
  "Este juego está sobrevalorado. No entiendo por qué tiene tan buenas críticas, es mediocre en el mejor de los casos.",
  "Los componentes no funcionan bien, y las reglas están mal explicadas. Fue una experiencia muy frustrante.",
  "Un juego demasiado básico. No ofrece ningún tipo de desafío o diversión. No vale la pena.",
  "El diseño es poco atractivo y la jugabilidad no mejora las cosas. No recomendaría este juego.",
  "Este juego es injustamente caro para la calidad que ofrece. Los materiales son pobres y la jugabilidad mediocre.",
  "Falto de innovación. Este juego no aporta nada nuevo y se siente como una versión barata de otros juegos.",
  "Está completamente desbalanceado, lo que arruina la experiencia de juego. No es divertido para nada.",
  "Tiene muy poca rejugabilidad. Después de una partida, nadie quiere volver a jugarlo.",
  "Una pésima experiencia de juego. No es entretenido y las mecánicas son aburridas.",
  "Desilusionante de principio a fin. Las expectativas eran altas, pero el juego no las cumplió en absoluto.",
  "El juego no tiene sentido. Las reglas no están bien estructuradas y la jugabilidad es confusa.",
  "Un desastre total. Nada funciona como debería y jugarlo es una pérdida de tiempo.",
  "La falta de calidad en los componentes y la mala ejecución de las reglas hacen que este juego sea una mala elección.",
  "Este juego no es divertido ni interesante. Las mecánicas son torpes y poco entretenidas.",
  "Una experiencia completamente insatisfactoria. No lo recomendaría a nadie.",
];

const dbConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://masterstingrayboardgames:1UGmltKGgZ95P4rZ@stingray.ptsw59l.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );
    console.log("DB Online");
  } catch (error) {
    console.error("Error initializing DB", error);
    throw new Error("Error initializing DB");
  }
};

const loginAllUsersAndReturnTokens = async () => {
  const users = await User.find().limit(40);
  const userTokens = [];

  await Promise.all(
    users.map(async (user) => {
      try {
        const response = await axios.post(`${baseURL}/auth`, {
          emailOrUsername: user.email,
          password: "Password123",
        });
        console.log(`Success logging in ${user.email}: ${response.data.token}`);
        userTokens.push({ userId: user._id, token: response.data.token });
      } catch (error) {
        console.error(`Error logging in ${user.email}`, error);
      }
    }),
  );

  return userTokens;
};

const generateRating = () =>
  Math.random() < 0.95 ? 5 : Math.floor(Math.random() * 4) + 1;

const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const createReviewsForUserReservations = async (userTokens) => {
  for (const { userId, token } of userTokens) {
    const reservations = await Reservation.find({
      userId,
      status: "completed",
      boardGameId: { $in: specificGameIds },
    }).populate("boardGameId");

    for (const reservation of reservations) {
      const existingReview = await Review.findOne({
        userId,
        gameId: reservation.boardGameId._id,
      });
      if (!existingReview) {
        const rating = generateRating();
        let title, description;

        if (rating >= 4) {
          title = getRandomElement(highRatingTitles);
          description = getRandomElement(highRatingDescriptions);
        } else if (rating >= 2) {
          title = getRandomElement(midRatingTitles);
          description = getRandomElement(midRatingDescriptions);
        } else {
          title = getRandomElement(lowRatingTitles);
          description = getRandomElement(lowRatingDescriptions);
        }

        const reviewData = {
          userId,
          gameId: reservation.boardGameId._id,
          title,
          description,
          rating,
        };

        try {
          const response = await axios.post(
            `${baseURL}/review/${reservation.boardGameId._id}`,
            reviewData,
            {
              headers: { token },
            },
          );
          console.log("Review created successfully:", response.data);
        } catch (error) {
          console.error("Error creating review:", error);
        }
      }
    }
  }

  console.log("All reviews created successfully.");
};

const makeReservations = async (gameIds, tokens) => {
  const reservationIds = [];

  await Promise.all(
    gameIds.map(async (gameId, i) => {
      const token = tokens[i % tokens.length].token;

      try {
        const response = await axios.post(
          `${baseURL}/reservation/${gameId}`,
          {},
          {
            headers: { token },
          },
        );
        console.log(`Reservation ${i + 1}:`, response.data);
        if (
          response.data &&
          response.data.reservation &&
          response.data.reservation._id
        ) {
          reservationIds.push(response.data.reservation._id);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(
          `Error in reservation ${i + 1}:`,
          error.response ? error.response.data : error.message,
        );
      }
    }),
  );

  console.log("Reservation IDs:", reservationIds);
  return reservationIds;
};

const generateDates = () => {
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
};

const processReservations = async (reservationIds, tokens) => {
  await Promise.all(
    reservationIds.map(async (id, i) => {
      const { pickup, returnDate } = generateDates();
      const token = tokens[i % tokens.length].token;

      try {
        await axios.patch(
          `${baseURL}/reservation/${id}/accept`,
          { expirationDate: returnDate.toJSON() },
          {
            headers: { token },
          },
        );
        await axios.patch(
          `${baseURL}/reservation/${id}/pickup`,
          { newExpirationDate: returnDate.toJSON() },
          {
            headers: { token },
          },
        );
        await axios.patch(
          `${baseURL}/reservation/${id}/completed`,
          { returnDate: pickup.toJSON() },
          {
            headers: { token },
          },
        );
        console.log(`Reservation ${id} processed correctly.`);
      } catch (error) {
        console.error(
          `Error processing the reservation ${id}:`,
          error.response ? error.response.data : error.message,
        );
      }
    }),
  );
};

const mainAsyncFunction = async () => {
  try {
    await dbConnection();
    console.log("Database successfully initialized.");

    const tokens = await loginAllUsersAndReturnTokens();
    console.log("User tokens fetched:", tokens.length);
    if (specificGameIds.length === 0 || tokens.length === 0) {
      throw new Error("Insufficient game IDs or tokens to proceed.");
    }

    const selectedTokens = tokens.slice(0, Math.min(40, tokens.length));
    console.log("Random selection completed.");

    const reservationIds = await makeReservations(
      specificGameIds,
      selectedTokens,
    );
    console.log(
      "Reservations made successfully. Reservation IDs:",
      reservationIds,
    );

    await processReservations(reservationIds, selectedTokens);
    console.log("All reservations have been processed.");

    await createReviewsForUserReservations(selectedTokens);
    console.log("All reviews have been created.");
  } catch (error) {
    console.error("Error in the main flow:", error);
  }
};

mainAsyncFunction();
