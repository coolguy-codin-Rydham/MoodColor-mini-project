const Loader = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Maintain the same hero section structure during loading */}
      <div className="bg-gradient-to-b from-purple-100 to-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            {/* Animated loader */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute animate-ping h-16 w-16 rounded-full bg-purple-200 opacity-75"></div>
              <div className="relative h-12 w-12 rounded-full bg-purple-400 animate-pulse"></div>
            </div>
            
            <div className="text-xl text-gray-600 animate-pulse">
              Loading color palettes...
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Skeleton header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              
              <div className="h-3 flex">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gray-200 animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loader;