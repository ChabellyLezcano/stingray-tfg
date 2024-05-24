const { Boardgame } = require("../models/Boardgame");
const { User } = require("../models/User");
const { generateRandCode } = require("../helpers/generateRandCode");
const extractPublicId = require("../helpers/extractPublicIdImage");
const { Review } = require("../models/Review");
const cloudinary = require("cloudinary").v2;

// Controller to create boardgame
const createBoardGame = async (req, res) => {
  const { title, description, tags, status } = req.body;
  const userId = req.id;

  try {
    // Check if the user exists and has admin permissions
    const user = await User.findById(userId);
    if (!user || user.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "No estás autorizado para crear juegos de mesa",
      });
    }

    // Generate a unique code for the new game
    let code;
    let isCodeUnique = false;
    while (!isCodeUnique) {
      code = generateRandCode();
      const existingGame = await Boardgame.findOne({ code });
      if (!existingGame) {
        isCodeUnique = true;
      }
    }

    // Get the URL of the main photo from Cloudinary
    const mainPhoto =
      req.files["mainPhoto"] && req.files["mainPhoto"][0]
        ? req.files["mainPhoto"][0].path
        : "";

    // Get the URLs of the photo gallery from Cloudinary
    const photoGallery = req.files["photoGallery"]
      ? req.files["photoGallery"].map((file) => file.path)
      : [];

    // Adapt the fields to the new schema, including the photos
    const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

    const newBoardGame = new Boardgame({
      code: code,
      title: title,
      description,
      status,
      mainPhoto,
      photoGallery,
      tags: tagsArray,
    });

    // Save the new board game in the database
    const createdGame = await newBoardGame.save();

    res.status(201).json({
      ok: true,
      msg: "Juego de mesa creado correctamente",
      game: createdGame,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error al crear el juego de mesa",
    });
  }
};

// Controller to delete boardgame
const deleteBoardGame = async (req, res) => {
  const { id } = req.params;
  const userId = req.id;

  try {
    // Check if the user exists and has admin permissions
    const user = await User.findById(userId);
    if (!user || user.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "No estás autorizado para eliminar juegos de mesa",
      });
    }

    // Search for the game by its ID
    const boardgame = await Boardgame.findById(id);
    if (!boardgame) {
      return res.status(404).json({
        ok: false,
        msg: "Juego de mesa no encontrado",
      });
    }

    // Delete associated images from Cloudinary
    if (boardgame.mainPhoto) {
      const mainPhotoId = extractPublicId(boardgame.mainPhoto); // Extract the public_id from the main photo URL
      await cloudinary.uploader.destroy(mainPhotoId); // Destroy the image in Cloudinary using the extracted public_id
    }
    for (const photoUrl of boardgame.photoGallery) {
      const photoId = extractPublicId(photoUrl); // Extract the public_id from each URL in the gallery
      await cloudinary.uploader.destroy(photoId); // Destroy the image in Cloudinary using the extracted public_id
    }

    // Delete associated reviews from the database
    await Review.deleteMany({ boardGameId: id });

    // Delete the game from the database
    await boardgame.deleteOne();

    res.json({
      ok: true,
      msg: "Juego de mesa eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar el juego de mesa",
    });
  }
};

// Controller to update boardgame
const updateBoardGame = async (req, res) => {
  const { id } = req.params; // Assumes the ID of the boardgame is passed as a URL parameter
  const { title, description, tags, status } = req.body;
  const userId = req.id;

  try {
    // Verify if the user exists and has admin permissions
    const user = await User.findById(userId);
    if (!user || user.role !== "Admin") {
      return res.status(401).json({
        ok: false,
        msg: "No estás autorizado para actualizar juegos de mesa",
      });
    }

    // Search for the boardgame by its ID
    const boardgame = await Boardgame.findById(id);
    if (!boardgame) {
      return res.status(404).json({
        ok: false,
        msg: "Juego de mesa no encontrado",
      });
    }

    // Update the main photo if necessary and delete the old one from Cloudinary
    if (req.files["mainPhoto"] && req.files["mainPhoto"][0]) {
      if (boardgame.mainPhoto) {
        const mainPhotoId = extractPublicId(boardgame.mainPhoto);
        await cloudinary.uploader.destroy(mainPhotoId);
      }
      boardgame.mainPhoto = req.files["mainPhoto"][0].path;
    }

    // Update the photo gallery if necessary and delete the old ones from Cloudinary
    if (req.files["photoGallery"]) {
      for (const photoUrl of boardgame.photoGallery) {
        const photoId = extractPublicId(photoUrl);
        await cloudinary.uploader.destroy(photoId);
      }
      boardgame.photoGallery = req.files["photoGallery"].map(
        (file) => file.path,
      );
    }

    // Update the boardgame fields
    if (title) boardgame.title = title;
    if (description) boardgame.description = description;
    if (tags) boardgame.tags = tags.split(",").map((tag) => tag.trim());
    if (status) boardgame.status = status;

    // Save the updated boardgame in the database
    const updatedBoardGame = await boardgame.save();

    res.json({
      ok: true,
      msg: "Juego de mesa actualizado correctamente",
      boardgame: updatedBoardGame,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error actualizando juego de mesa",
    });
  }
};

// Controller to list all boardgames
const listBoardGames = async (req, res) => {
  try {
    // Fetch all boardgames from the database
    const boardgames = await Boardgame.find({});

    // Check if boardgames exist
    if (!boardgames || boardgames.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontraron juegos de mesa",
      });
    }

    // Calculate the average rating for each boardgame using MongoDB aggregation
    const ratings = await Review.aggregate([
      {
        $group: {
          _id: "$boardGameId",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // Create a map of ratings for quick lookup
    const ratingsMap = ratings.reduce((map, rating) => {
      map[rating._id] = rating.averageRating.toFixed(1);
      return map;
    }, {});

    // Update each boardgame with the calculated average rating
    const boardgamesWithRatings = boardgames.map((boardgame) => {
      const averageRating = ratingsMap[boardgame._id] || 0;
      return {
        ...boardgame.toObject(),
        averageRating,
      };
    });

    // Return the list of boardgames with average ratings
    res.json({
      ok: true,
      msg: "Juegos de mesa recuperados con éxito",
      boardgames: boardgamesWithRatings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al recuperar los juegos de mesa",
    });
  }
};

// Controller to view boardgame Details
const viewBoardGameDetails = async (req, res) => {
  const { id } = req.params; // Assumes the ID of the boardgame is passed as a URL parameter

  try {
    // Search for the boardgame by its ID
    const boardgame = await Boardgame.findById(id);

    if (!boardgame) {
      return res.status(404).json({
        ok: false,
        msg: "Juego de mesa no encontrado",
      });
    }

    // Return the boardgame details
    res.json({
      ok: true,
      msg: "Detalles del juego de mesa recuperados con éxito",
      boardgame,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al recuperar los detalles del juego de mesa",
    });
  }
};

module.exports = {
  createBoardGame,
  deleteBoardGame,
  updateBoardGame,
  listBoardGames,
  viewBoardGameDetails,
};
