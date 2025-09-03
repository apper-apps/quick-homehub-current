import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Browse from "@/components/pages/Browse";
import PropertyDetail from "@/components/organisms/PropertyDetail";
import SavedProperties from "@/components/pages/SavedProperties";
import NotFound from "@/components/pages/NotFound";
import MapView from "@/components/organisms/MapView";
import savedPropertiesService from "@/services/api/savedPropertiesService";

function App() {
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    loadSavedCount();
  }, []);

  const loadSavedCount = async () => {
    try {
      const savedIds = await savedPropertiesService.getSavedPropertyIds();
      setSavedCount(savedIds.length);
    } catch (error) {
      console.error("Failed to load saved count:", error);
    }
  };

  // Update saved count when properties are saved/unsaved
  useEffect(() => {
    const interval = setInterval(loadSavedCount, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header savedCount={savedCount} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Browse />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/saved" element={<SavedProperties />} />
            <Route path="/map" element={
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                  <h1 className="text-2xl font-display font-bold text-gray-900">Property Map</h1>
                  <p className="text-gray-600 mt-1">Explore properties on the interactive map</p>
                </div>
                <div className="h-[600px]">
                  <MapView />
                </div>
              </div>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;