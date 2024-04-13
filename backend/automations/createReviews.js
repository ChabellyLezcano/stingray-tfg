const mongoose = require("mongoose");
const axios = require("axios");
const { User } = require("../models/User");
const { Reservation } = require("../models/Reservation");
const { Review } = require("../models/Review");
const { Game } = require("../models/Boardgame");

const baseURL = "http://localhost:4000/api";

const highRatingTitles = [
  "Estrategia y diversión",
  "Aventura emocionante",
  "Jugabilidad excepcional",
  "Reglas innovadoras",
  "Experiencia inmersiva",
  "Desafíos inteligentes",
  "Una joya del diseño",
  "Creatividad sin fin",
  "Recomendado para familias",
  "Un clásico imprescindible",
  "Risas aseguradas",
  "Experiencia cooperativa única",
  "Noches de juegos memorables",
  "Táctica y estrategia",
  "Componentes de calidad",
  "Interacciones fascinantes",
  "Perfecto para reuniones",
  "Gran replayabilidad",
  "Un viaje épico",
  "Jugabilidad rápida",
  "Ideal para estrategas",
  "Diversión competitiva",
  "Estrategia profunda",
  "Amantes de los juegos de mesa. Este es vuestro juego",
  "Fácil de aprender",
  "Vueltas de tuerca",
  "Competitivo hasta el final",
  "Diversión garantizada",
  "Para conquistar a todos",
  "Magia en el tablero",
  "Desafíos constantes",
  "Innovador y clásico",
  "Para todas las edades",
  "Desafiante y complicado",
  "Adictivamente divertido",
  "Dinámica envolvente",
  "Estrategia pura",
  "Diversión en familia",
  "Juego de culto",
  "Sorpresas en cada turno",
];

const highRatingDescriptions = [
  "Desde la primera partida, me quedé completamente enamorado de la mecánica y la temática del juego. Es desafiante, pero increíblemente gratificante.",
  "Este juego superó todas mis expectativas con su diseño inteligente y su capacidad para mantenernos a todos comprometidos durante horas.",
  "¡Qué joya! La estrategia profunda combinada con reglas simples hacen de este juego un imprescindible para cualquier noche de juegos.",
  "Me sorprendió gratamente cómo cada componente del juego contribuye a una experiencia tan rica y envolvente.",
  "Es difícil encontrar juegos que capturan tan bien el espíritu de competencia y diversión. Este lo hace y es absolutamente brillante.",
  "Perfecto para jugar en familia, este juego trae risas, estrategia y un poco de competencia sana. Nos encanta.",
  "La replayabilidad es uno de sus puntos fuertes. No importa cuántas veces juguemos, siempre hay algo nuevo que descubrir.",
  "La calidad de los materiales es notable. Tablero resistente, piezas detalladas y cartas duraderas.",
  "Este juego es un viaje emocionante de principio a fin. Las reglas son claras y el ritmo es perfecto.",
  "Con una combinación perfecta de táctica y suerte, este juego ha sido un éxito rotundo en todas nuestras reuniones.",
  "Las reglas son fáciles de aprender pero el juego es difícil de dominar, ofreciendo un desafío constante.",
  "La temática del juego es fascinante y está muy bien ejecutada, sumergiendo a los jugadores completamente.",
  "Adoro cómo este juego equilibra la estrategia con elementos de azar. Hace que cada partida sea impredecible y emocionante.",
  "Este juego ha sido una adición espectacular a nuestra colección. Es ideal tanto para principiantes como para veteranos.",
  "Lo que más destaco es cómo el juego fomenta la interacción entre los jugadores. Es perfecto para romper el hielo.",
  "La innovación en el diseño de este juego es evidente. Ofrece una experiencia única que no he visto en otros juegos.",
  "Aunque es competitivo, el juego tiene un gran sentido del humor y una estética encantadora que lo hacen accesible para todos.",
  "Es un juego que desafía la mente y provoca el debate. Cada partida termina siendo una discusión sobre estrategias y tácticas.",
  "Lo hemos jugado innumerables veces y nunca nos cansamos. Hay tantas estrategias posibles que siempre se siente fresco.",
  "Este juego es un triunfo en diseño y diversión. Combina habilidad y suerte de manera que siempre quieres volver a jugar.",
  "La diversión que este juego aporta a nuestras noches de juego es incomparable. Su mecánica ingeniosa y las variadas formas de ganar mantienen a todos al borde de sus asientos.",
  "Un espectáculo visual y táctico, este juego no solo es bonito sino que ofrece una profundidad estratégica que satisface incluso al jugador más exigente.",
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
  "Es raro encontrar un juego que sea tan divertido como educativo. Este juego enseña economía y matemáticas básicas de una manera increíblemente divertida.",
  "Con una duración de juego perfecta, este juego mantiene a todos interesados sin que se sienta demasiado largo o corto. Es ideal para cualquier noche de juego.",
  "La creatividad en el diseño de este juego es palpable. Cada partida revela una nueva capa de profundidad y estrategia que mantiene el juego fresco y emocionante.",
  "Este juego no solo es un placer visual, sino que sus mecánicas son tan robustas que cada decisión cuenta, haciendo cada partida intensamente satisfactoria.",
  "Con una gran variedad de escenarios y personajes, este juego ofrece una rejugabilidad que muchos otros envidiarían. Nunca te cansas de jugarlo.",
  "Este juego es un excelente catalizador para la risa y la diversión. Combina elementos de suerte y estrategia de manera que todos pueden disfrutar de cada ronda.",
  "A pesar de su sencillez, este juego es sorprendentemente profundo. Las decisiones que tomas realmente afectan el resultado, lo que lo hace emocionante cada vez.",
  "Si estás buscando un juego que sea fácil de configurar pero difícil de dominar, este es el ideal. Es perfecto para jugadores de todas las edades y niveles de habilidad.",
];

const midRatingTitles = [
  "Prometedor pero complicado",
  "Falta dinamismo",
  "Buen concepto, ejecución mejorable",
  "Repetitivo con el tiempo",
  "Calidad cuestionable",
  "Desequilibrado y confuso",
  "Entretenido pero limitado",
  "Encanto superficial",
  "Para gustos específicos",
  "No tan emocionante",
  "Necesita más claridad",
  "Demasiado azar",
  "Intenta demasiado sin lograr mucho",
  "Fácil pero superficial",
  "Tema desaprovechado",
  "Rápido pero insatisfactorio",
  "No apto para todos",
  "Buen arte, mal juego",
  "Configuración tediosa",
  "Potencial desaprovechado",
];

const midRatingDescriptions = [
  "El concepto del juego es interesante, pero la ejecución deja mucho que desear. Los turnos pueden ser demasiado largos y tediosos.",
  "Este juego tiene potencial, pero las reglas son confusas y los componentes de baja calidad no ayudan a mejorar la experiencia.",
  "Me encontré esperando más interacción entre los jugadores. Parece que cada quien juega por su cuenta sin mucha conexión.",
  "La idea es buena, pero el juego se siente repetitivo después de unas cuantas partidas. Falta variedad en las mecánicas.",
  "Los materiales del juego no están a la altura del precio. Esperaba una calidad mucho mayor en los componentes.",
  "Las mecánicas del juego son interesantes, pero no están bien balanceadas, dando como resultado partidas poco equitativas.",
  "Es divertido al principio, pero la falta de opciones estratégicas hace que pierda su encanto rápidamente.",
  "El juego promete mucho al inicio, pero no logra mantener esa promesa con mecánicas que resultan ser más superficiales de lo esperado.",
  "Aunque el diseño es atractivo, el juego en sí no ofrece suficientes desafíos para jugadores experimentados.",
  "El juego puede ser entretenido en grupos grandes, pero en partidas más pequeñas, simplemente no funciona tan bien.",
  "Una experiencia que podría ser mejorada con reglas más claras y turnos más dinámicos. Actualmente, se siente algo lento.",
  "Para un juego que se supone estratégico, hay demasiado azar involucrado, lo que puede ser frustrante para algunos jugadores.",
  "Este juego intenta incorporar demasiados elementos sin perfeccionar ninguno, resultando en una experiencia desordenada y confusa.",
  "Es un juego fácil de aprender, lo cual es positivo, pero falta profundidad para hacerlo realmente memorable o desafiante.",
  "La temática es encantadora, pero no está integrada de manera efectiva en la jugabilidad, lo que es una oportunidad perdida.",
  "Si bien es un juego rápido de jugar, a menudo las partidas se sienten apresuradas y poco satisfactorias.",
  "El juego se promociona como adecuado para todas las edades, pero las reglas pueden ser demasiado complejas para los más jóvenes.",
  "Este juego tiene un gran diseño artístico, pero las mecánicas de juego no son tan impresionantes como esperaba.",
  "La configuración inicial del juego es demasiado complicada y tediosa, lo que puede disuadir a los jugadores antes de comenzar a jugar.",
  "Este juego podría ser un gran acierto con algunos ajustes en las reglas y una mejora en la calidad de sus componentes.",
];

const lowRatingTitles = [
  "Una gran decepción",
  "Evitable a toda costa",
  "Francamente aburrido",
  "Materiales de baja calidad",
  "Nadie quiere repetir",
  "Pobremente ejecutado",
  "Excesivamente complicado",
  "Falta total de diversión",
  "Plagado de malas decisiones",
  "Incomprablemente insatisfactorio",
  "No lo jugaría otra vez",
];

const lowRatingDescriptions = [
  "Desafortunadamente, este juego fue una gran decepción. Las mecánicas son torpes y no ofrecen una experiencia de juego agradable.",
  "Probablemente uno de los peores juegos que he jugado. Es aburrido y las reglas son demasiado complicadas para lo poco que ofrece.",
  "Este juego es extremadamente lento y frustrante. La falta de dinamismo y diversión lo hace difícil de recomendar.",
  "Los componentes del juego son de muy baja calidad y no justifican su precio. Es difícil disfrutar de un juego que se siente barato.",
  "Jugamos una vez y nadie quiso volver a jugarlo. No solo es poco entretenido, sino que también es predecible y monótono.",
  "La calidad de este juego es cuestionable, y las mecánicas de juego son decepcionantes. No cumplió con nuestras expectativas.",
  "Este juego es más complicado de lo que debería, sin ninguna recompensa real por el esfuerzo invertido en aprenderlo.",
  "La jugabilidad es tan deficiente que se siente como una pérdida de tiempo. No hay momentos memorables o divertidos.",
  "Un juego que podría haber sido interesante, pero está plagado de decisiones de diseño pobres que arruinan la experiencia.",
  "Totalmente insatisfactorio, desde la calidad de los materiales hasta la ejecución de las mecánicas. No recomendaría este juego a nadie.",
];

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
      console.log(response);
      userTokens.push({ userId: user._id, token: response.data.token });
    } catch (error) {
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango de 2xx
        console.error("Error creating review:", error.response.status);
        console.error("Headers:", error.response.headers);
        console.error("Data:", error.response.data);
      } else if (error.request) {
        // La solicitud fue hecha pero no se recibió respuesta
        console.error("No response received:", error.request);
      } else {
        // Algo salió mal en la configuración de la solicitud
        console.error("Error setting up the request:", error.message);
      }
      console.error("Config:", error.config);
    }
  }

  return userTokens;
};
/*
  const generateRating = () => {
    // Genera un número aleatorio entre 0 y 1
    const random = Math.random();
    if (random < 0.9) {
      // 70% de probabilidad de ser 4 o 5
      return Math.floor(Math.random() * 2) + 4;
    } else if (random < 0.9) {
      // 20% de probabilidad de ser 2 o 3
      return Math.floor(Math.random() * 2) + 2;
    } else {
      // 10% de probabilidad de ser 1
      return 1;
    }
  };
  */

const generateRating = () => {
  // Genera un número aleatorio entre 0 y 1
  const random = Math.random();
  if (random < 0.9) {
    // 90% de probabilidad de ser 5
    return 5;
  } else {
    // 10% de probabilidad de ser entre 1 y 4
    return Math.floor(Math.random() * 4) + 1;
  }
};

// Function to create reviews for each user's reservations using their authenticated token
const createReviewsForUserReservations = async () => {
  try {
    const userTokens = await loginAllUsersAndReturnTokens();

    for (const { userId, token } of userTokens) {
      const reservations = await Reservation.find({ userId }).populate(
        "boardGameId",
      );

      for (const reservation of reservations) {
        const rating = generateRating();
        let title, description;

        if (rating >= 4) {
          title =
            highRatingTitles[
              Math.floor(Math.random() * highRatingTitles.length)
            ];
          description =
            highRatingDescriptions[
              Math.floor(Math.random() * highRatingDescriptions.length)
            ];
        } else if (rating >= 2) {
          title =
            midRatingTitles[Math.floor(Math.random() * midRatingTitles.length)];
          description =
            midRatingDescriptions[
              Math.floor(Math.random() * midRatingDescriptions.length)
            ];
        } else {
          title =
            lowRatingTitles[Math.floor(Math.random() * lowRatingTitles.length)];
          description =
            lowRatingDescriptions[
              Math.floor(Math.random() * lowRatingDescriptions.length)
            ];
        }

        const reviewData = {
          userId: userId,
          gameId: reservation.boardGameId._id,
          title: title,
          description: description,
          rating: rating,
        };

        try {
          const response = await axios.post(
            `${baseURL}/review/${reservation.boardGameId._id}`,
            reviewData,
            {
              headers: { token: `${token}` },
            },
          );
          // Registro en consola de la respuesta del servidor al crear la reseña
          console.log("Review created successfully:", response.data);
        } catch (error) {
          if (error.response) {
            // El servidor respondió con un código de estado fuera del rango de 2xx
            console.error("Error creating review:", error.response.status);
            console.error("Headers:", error.response.headers);
            console.error("Data:", error.response.data);
          } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error("No response received:", error.request);
          } else {
            // Algo salió mal en la configuración de la solicitud
            console.error("Error setting up the request:", error.message);
          }
          console.error("Config:", error.config);
        }
      }
    }

    console.log("All reviews created successfully.");
  } catch (error) {
    console.error("Error creating reviews:", error.message);
  }
};

createReviewsForUserReservations();
