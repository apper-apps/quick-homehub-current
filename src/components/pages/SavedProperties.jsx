import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import savedPropertiesService from "@/services/api/savedPropertiesService";
import propertyService from "@/services/api/propertyService";
import { toast } from "react-toastify";

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get saved property IDs
      const savedIds = await savedPropertiesService.getSavedPropertyIds();
      
      // Fetch full property details for each saved ID
      const propertyPromises = savedIds.map(id => propertyService.getById(parseInt(id)));
      const properties = await Promise.all(propertyPromises);
      
      setSavedProperties(properties);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async (propertyId, isSaved) => {
    if (!isSaved) {
      // Remove from local state immediately for better UX
      setSavedProperties(prev => prev.filter(p => p.Id !== propertyId));
      toast.success("Property removed from saved list");
    }
  };

  const handleClearAll = async () => {
    try {
      // Remove all saved properties
      const promises = savedProperties.map(property => 
        savedPropertiesService.remove(property.Id.toString())
      );
      await Promise.all(promises);
      
      setSavedProperties([]);
      toast.success("All saved properties cleared");
    } catch (error) {
      toast.error("Failed to clear saved properties");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadSavedProperties} />;
  }

  if (savedProperties.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Saved Properties</h1>
          <p className="text-gray-600">Properties you've saved for later</p>
        </motion.div>

        <Empty
          title="No saved properties yet"
          description="Start browsing properties and save the ones you like. They'll appear here for easy access."
          action={() => window.location.href = "/"}
          actionLabel="Browse Properties"
          icon="Heart"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Saved Properties</h1>
          <p className="text-gray-600 mt-2">
            {savedProperties.length} propert{savedProperties.length !== 1 ? "ies" : "y"} saved
          </p>
        </div>
        
        {savedProperties.length > 0 && (
          <Button
            variant="secondary"
            onClick={handleClearAll}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </motion.div>

      {/* Properties Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {savedProperties.map((property, index) => (
          <motion.div
            key={property.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PropertyCard
              property={property}
              isSaved={true}
              onSaveToggle={handleSaveToggle}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-8">
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
            Ready to find more properties?
          </h3>
          <p className="text-gray-600 mb-6">
            Continue browsing to discover more homes that match your preferences.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = "/"}
          >
            <ApperIcon name="Search" className="w-5 h-5 mr-2" />
            Browse More Properties
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SavedProperties;