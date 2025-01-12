import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Admin Name is required"],
    },
    username: {
        type: String, 
        required: [true, "Username is required for login"]
    },
    password: {
        type: String, 
        required: true
    }
})

const AdminModel = mongoose.model("Admin", AdminSchema);

export default AdminModel;