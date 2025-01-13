import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronRight, Copy, Check, Loader2 } from "lucide-react";
// import Loader from "../components/Loader";

const Home = () => {
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [error, setError] = useState("");
  const [copiedColor, setCopiedColor] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAllMoods = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/mood/`,
        {
          withCredentials: true,
        }
      );
      
      if (response?.data?.palettes) {
        setMoods(response.data.palettes);
      } else {
        throw new Error("Invalid API response structure.");
      }
    } catch (error) {
      console.error(error.message);
      setError("Failed to load moods. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyColor = (color) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  useEffect(() => {
    getAllMoods();
  }, []);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) {
    // return <Loader/>;
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={100}/>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-purple-100 to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Find Your Perfect Color Mood
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of mood-based color palettes to
            inspire your next project
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Grid of Mood Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moods && moods.length > 0 ? (
            moods.map((mood) => (
              <div
                key={mood.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Mood Header */}
                <div
                  className="p-4 border-b cursor-pointer"
                  onClick={() =>
                    setSelectedMood(selectedMood === mood ? null : mood)
                  }
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {capitalizeFirstLetter(mood.name)}
                    </h2>
                    <ChevronRight
                      className={`transform transition-transform duration-200 ${
                        selectedMood === mood ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Preview Stripe */}
                <div className="h-3 flex">
                  {mood.palette?.map((color, index) => (
                    <div
                      key={index}
                      className="flex-1"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Expanded Color Details */}
                {selectedMood === mood && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {mood.palette?.map((color, index) => (
                        <div
                          key={index}
                          className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50"
                        >
                          {/* Color Preview */}
                          <div
                            className="w-16 h-16 rounded-lg shadow-inner"
                            style={{ backgroundColor: color }}
                          />

                          {/* Color Code and Copy Button */}
                          <div className="flex-1 flex items-center justify-between">
                            <span className="font-mono text-gray-700">
                              {color}
                            </span>
                            <button
                              onClick={() => handleCopyColor(color)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                              title="Copy color code"
                            >
                              {copiedColor === color ? (
                                <Check className="w-5 h-5 text-green-500" />
                              ) : (
                                <Copy className="w-5 h-5 text-gray-500" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No mood palettes available at the moment.
              </p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {moods.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No mood palettes available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
