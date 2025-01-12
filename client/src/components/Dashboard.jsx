import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { ChevronRight, Edit, Plus, Save, Trash2 } from "lucide-react";
import JsCookie from "js-cookie";
import PropTypes from "prop-types"
const api_url = "http://localhost:3000/api/admin";

const Dashboard = ({user, setUser}) => {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState({
    mood: "",
    colors: ["", "", "", "", ""],
  });
  const [newMood, setNewMood] = useState({
    mood: "",
    colors: ["", "", "", "", ""],
  });
  const [editingMood, setEditingMood] = useState(null);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh(!refresh);

  const getAllMood = async () => {
    try {
      const response = await axios.get(`${api_url}/mood/all`, {
        withCredentials: true,
      });
      setMoods(response.data.palettes);
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const createNewMood = async () => {
    try {
      await axios.post(
        `${api_url}/mood/${newMood.mood}`,
        { palette: newMood.colors },
        { withCredentials: true }
      );
      showToast("Mood Created!");
      triggerRefresh();
      setNewMood({ mood: "", colors: ["", "", "", "", ""] });
    } catch (error) {
      setError(error.message);
      if (error.status == 409) {
        toast.error(`Error: Palette already exists`);
        return;
      }
      toast.error(`Error: ${error.message}`);
    }
  };

  const updateMood = async (mood) => {
    console.log("palettes", mood);
    try {
      await axios.patch(
        `${api_url}/mood/${mood.name}`,
        { palette: mood.editedPalette },
        { withCredentials: true }
      );
      showToast("Palette Updated Successfully");
      setEditingMood(null);
      triggerRefresh();
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const deleteMood = async (mood) => {
    try {
      await axios.delete(`${api_url}/mood/${mood}`, {
        withCredentials: true,
      });
      showToast("Mood Deleted!");
      triggerRefresh();
    } catch (error) {
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const logoutAdmin = async () => {
    try {
      toast("Logged Out Successfully");
      await new Promise((resolve) => {
        setUser(null);
        setTimeout(() => {
          JsCookie.remove("token");
          resolve();
        }, 1000);
      });
      
    } catch (error) {
      console.log("Error Logging out ", error);
      toast.error("Logout", {
        autoClose: 2500,
      });
    } finally {
      triggerRefresh();
    }
  };

  const showToast = (message, type = "success") => {
    toast[type](message, { autoClose: 2500 });
  };

  function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  useEffect(() => {
    if(user){
        getAllMood();
        setError("");
    }
  }, [refresh, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 relative to-indigo-50 p-6 h-full">
      <button
        className="absolute top-6 right-6 px-4 py-2 border-blue-600 border-2 bg-blue-500 rounded-xl text-white"
        onClick={logoutAdmin}
      >
        Logout
      </button>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Moody Base Admin Panel
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4">
            Create New Mood Palette
          </h2>
          <div className="space-y-4 flex flex-col items-center justify-center">
            <input
              type="text"
              value={newMood.mood}
              onChange={(e) => setNewMood({ ...newMood, mood: e.target.value })}
              placeholder="Enter mood name"
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              {newMood.colors.map((color, index) => (
                <input
                  key={index}
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...newMood.colors];
                    newColors[index] = e.target.value;
                    setNewMood({ ...newMood, colors: newColors });
                  }}
                  className="h-10 w-16"
                />
              ))}
            </div>
            <button
              onClick={createNewMood}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2"
            >
              <Plus size={16} /> Add Mood
            </button>
          </div>
        </div>

        <div className="bg-white p-6 h-full rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Existing Mood Palettes
          </h2>
          <div className="space-y-4 h-full">
            {moods.length == 0 && (
              <p className="font-medium text-slate-800 text-center">
                No Mood Palettes found
              </p>
            )}
            {moods &&
              moods.map((mood) => {
                const isEditing = editingMood?.name === mood.name;
                return (
                  <details
                    key={mood.id}
                    open={
                      selectedMood.mood.length != 0 &&
                      selectedMood.mood == mood.name
                    }
                    className="border-black/10 border rounded-md p-4 flex w-full h-full justify-around items-center"
                  >
                    <summary className="flex items-center">
                      <ChevronRight
                        size={16}
                        onClick={() => {
                          setSelectedMood({
                            mood:
                              selectedMood && selectedMood?.mood.length != 0
                                ? ""
                                : mood.name,
                            colors:
                              selectedMood && selectedMood?.colors.length != 0
                                ? []
                                : mood.palette,
                          });
                        }}
                      />
                      <div className="flex flex-col">
                        <h6 className="text-[0.5rem] text-gray-500">Mood</h6>
                        <h2 className="font-bold text-2xl">
                          {capitalizeFirstLetter(mood.name)}
                        </h2>
                      </div>
                    </summary>
                    <div className="flex justify-center flex-col items-start h-full gap-4">
                      Color Palette
                      <div className="flex w-full items-center gap-10 justify-around">
                        {(isEditing
                          ? editingMood.editedPalette
                          : mood.palette
                        ).map((color, index) => (
                          <div
                            key={`${mood.id}${index}`}
                            className="flex flex-col rounded-lg gap-3 w-full items-center"
                          >
                            {isEditing ? (
                              <input
                                type="color"
                                value={color}
                                onChange={(e) => {
                                  const newPalette = [
                                    ...editingMood.editedPalette,
                                  ];
                                  newPalette[index] = e.target.value;
                                  setEditingMood({
                                    ...editingMood,
                                    editedPalette: newPalette,
                                  });
                                }}
                                className="h-10 w-full rounded-md"
                              />
                            ) : (
                              <div
                                style={{ background: color }}
                                className="h-10 w-full rounded-md"
                              />
                            )}
                            <div>{color}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-full h-full flex items-center justify-end gap-10 mt-5">
                      {isEditing ? (
                        <button
                          className="cursor-pointer flex items-center justify-center text-center bg-green-500 text-white px-4 py-1 rounded-lg transition-all duration-200 border-green-600 hover:bg-green-600 active:bg-green-700 text-md border-b-[4px]"
                          onClick={() => updateMood(editingMood)}
                        >
                          <Save className="mr-2" size={16} />
                          Save Changes
                        </button>
                      ) : (
                        <button
                          className="cursor-pointer flex items-center justify-center text-center bg-blue-500 text-white px-4 py-1 rounded-lg transition-all duration-200 border-blue-600 hover:bg-blue-600 active:bg-indigo-500 text-md border-b-[4px]"
                          onClick={() =>
                            setEditingMood({
                              name: mood.name,
                              editedPalette: [...mood.palette],
                            })
                          }
                        >
                          <Edit className="mr-2" size={16} />
                          Edit Mood
                        </button>
                      )}
                      <button
                        className="cursor-pointer flex items-center justify-center text-center bg-red-500 text-white px-4 py-1 rounded-lg transition-all duration-200 border-red-600 hover:bg-red-600 active:bg-red-800 text-md border-b-[4px]"
                        onClick={() => {
                          deleteMood(mood.name);
                        }}
                      >
                        <Trash2 className="mr-2" size={16} />
                        Delete Mood
                      </button>
                    </div>
                  </details>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
    user: PropTypes.object.isRequired,
    setUser: PropTypes.func.isRequired,
}
export default Dashboard;
