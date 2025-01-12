import { MoodModel } from "../model/index.js";

const getMood = async (req, res) => {
  const mood = req.params.mood;
  try {
    const pallette = await MoodModel.findOne({ name: mood });
    if (!pallette) {
      return res.status(404).json({
        message: "Pallette Not Found for this mood",
      });
    }

    res.status(200).json({
      pallette: pallette,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "Internal Server Error",
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
export{
    getMood,
    getAllMoods
}