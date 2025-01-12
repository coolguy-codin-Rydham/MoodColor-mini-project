import mongoose from "mongoose";

const MoodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Title is required"]
    },
    palette: {
        type: [String],
        required: [true, "Pallette is required"]
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

MoodSchema.pre("save", function(next) {
    this.updatedAt = new Date();
    next();
});

const MoodModel = mongoose.model("Mood", MoodSchema);

export default MoodModel;
