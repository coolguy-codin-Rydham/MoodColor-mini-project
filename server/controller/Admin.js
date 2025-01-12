import bcrypt from "bcrypt";
import AdminModel from "../model/Admin.js";
import { MoodModel } from "../model/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createMood = async (req, res) => {
  const mood = req.params.mood.toLowerCase();
  const palette = req.body.palette;

  if(palette.length==0){
    return res.status(400).json({
      message: "Palette was empty"
    })
  }

  for(let i = 0; i < palette.length;i++){
    if(palette[i].length==0){
      return res.status(400).json({
        message: "Palette colors were empty"
      })
    }
  }

  try {
    const paletteIfFound = await MoodModel.findOne({ name: mood });
    if (paletteIfFound) {
      return res.status(409).json({
        message: "Palette corresponding to the mood already exists",
      });
    }

    const createdPalette = await MoodModel.create({
      name: mood,
      palette: palette,
    });

    res.status(201).json({
      palette: createdPalette,
      message: "Palette created successfully",
    });
  } catch (error) {
    console.error("Error creating palette:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateMood = async (req, res) => {
  const mood = req.params.mood;
  const palette = req.body.palette;

  if(palette.length==0){
    return res.status(400).json({
      message: "Palette was empty"
    })
  }

  for(let i = 0; i < palette.length;i++){
    if(palette[i].length==0){
      return res.status(400).json({
        message: "Palette colors were empty"
      })
    }
  }

  try {
    const paletteToUpdate = await MoodModel.findOne({ name: mood });

    if (!paletteToUpdate) {
      return res.status(404).json({
        message: "Palette not found",
      });
    }

    paletteToUpdate.palette = palette;
    await paletteToUpdate.save();

    res.status(200).json({
      message: "Palette updated successfully",
      palette: paletteToUpdate,
    });
  } catch (error) {
    console.error("Error updating palette:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getAllMoods = async (_, res) => {
  try {
    const allPalettes = await MoodModel.find();
    if (allPalettes.length === 0) {
      return res.status(200).json({
        message: "No palettes found",
        palettes: [],
        size: 0,
      });
    }

    return res.status(200).json({
      message: "All Palettes",
      palettes: allPalettes,
      size: allPalettes.length,
    });
  } catch (error) {
    console.error("Error fetching palettes:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getMoodByMood = async (req, res) => {
  const mood = req.params.mood;
  try {
    const palette = await MoodModel.findOne({ name: mood });
    if (!palette) {
      return res.status(404).json({
        message: "Palette not found",
      });
    }

    res.status(200).json({
      palette: palette,
    });
  } catch (error) {
    console.error("Error fetching palette:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
const deleteMood = async (req, res) => {
  const mood = req.params.mood;
  try {
    const palette = await MoodModel.deleteOne({ name: mood });
    if (!palette.deletedCount) {
      // Check if a document was deleted
      return res.status(404).json({
        message: "Palette not found",
      });
    }

    return res.status(200).json({
      message: "Palette deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const createNewAdmin = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const AdminIFExist = await AdminModel.findOne({ username: username });
    if (AdminIFExist) {
      // Ensure no further code executes after sending the response
      return res.status(400).json({
        message: "Admin with this username already exists",
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const Admin = await AdminModel.create({
      name,
      username,
      password: hash,
    });
    // Return after sending the response to avoid further execution
    return res.status(201).json({
      message: "Admin created successfully",
      admin: Admin,
    });
  } catch (error) {
    console.error(error);
    // Make sure to return after sending the error response
    return res.status(500).json({
      message: "Error creating admin",
      error: error.message,
    });
  }
};

const adminSignIn = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await AdminModel.findOne({ username: username });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    const comp = await bcrypt.compare(password, admin.password);

    if (!comp) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);

    res.cookie("token", token);

    return res.status(200).json({
      message: "Login successful",
      admin: admin,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error signing in",
      error: error.message,
    });
  }
};


const authMe = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(404).json({
      message: "No cookie found",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id = decoded.id;

    const admin = await AdminModel.findOne({ _id: id });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      admin: admin,
    });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
export {
  createMood,
  updateMood,
  getAllMoods,
  adminSignIn,
  getMoodByMood,
  createNewAdmin,
  deleteMood,
  authMe,
};
