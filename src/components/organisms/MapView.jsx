import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import propertyService from "@/services/api/propertyService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    loadMapProperties();
  }, []);

  const loadMapProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getMapProperties();
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadMapProperties} />;
  }

  return (
    <div className="h-full bg-gray-100 rounded-lg overflow-hidden relative">
      {/* Mock Map Background */}
      <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-blue-50 relative">
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="text-gray-400">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Mock Map Elements */}
        <div className="absolute inset-0">
          {/* Mock Roads */}
          <div className="absolute top-1/3 left-0 right-0 h-2 bg-gray-300 opacity-60"></div>
          <div className="absolute top-2/3 left-0 right-0 h-1 bg-gray-300 opacity-40"></div>
          <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-gray-300 opacity-40"></div>
          <div className="absolute top-0 bottom-0 left-2/3 w-2 bg-gray-300 opacity-60"></div>

          {/* Mock Parks */}
          <div className="absolute top-1/4 left-1/2 w-16 h-16 bg-green-300 rounded-full opacity-40"></div>
          <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-green-300 rounded-lg opacity-40"></div>
        </div>

        {/* Property Markers */}
        {properties.map((property, index) => {
          const x = 10 + (index % 4) * 20;
          const y = 15 + Math.floor(index / 4) * 15;
          
          return (
            <motion.div
              key={property.Id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="absolute cursor-pointer"
              style={{ 
                left: `${x}%`, 
                top: `${y}%`,
                transform: "translate(-50%, -100%)"
              }}
              onClick={() => handlePropertySelect(property)}
            >
              {/* Marker Pin */}
              <div className={`relative ${
                selectedProperty?.Id === property.Id ? "z-20" : "z-10"
              }`}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-primary-600 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg transition-all ${
                    selectedProperty?.Id === property.Id 
                      ? "bg-accent-500 scale-110 shadow-xl" 
                      : "hover:bg-primary-700"
                  }`}
                >
                  {formatPrice(property.price)}
                </motion.div>
                {/* Pin pointer */}
                <div className={`w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent ${
                  selectedProperty?.Id === property.Id 
                    ? "border-t-accent-500" 
                    : "border-t-primary-600"
                } mx-auto`}></div>
              </div>

              {/* Property Info Popup */}
              {selectedProperty?.Id === property.Id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-xl border p-4 w-64 z-30"
                >
                  <div className="flex gap-3">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
                        {property.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {property.address.city}, {property.address.state}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span>{property.bedrooms}bd</span>
                        <span>{property.bathrooms}ba</span>
                        <span>{property.sqft.toLocaleString()}sf</span>
                      </div>
                      <Button
                        size="sm"
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/property/${property.Id}`, "_blank");
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(null);
                    }}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" className="w-3 h-3" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm">
          <ApperIcon name="Plus" className="w-4 h-4" />
        </Button>
        <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm">
          <ApperIcon name="Minus" className="w-4 h-4" />
        </Button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 bg-primary-600 rounded"></div>
          <span className="text-gray-700">Available Properties</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-accent-500 rounded"></div>
          <span className="text-gray-700">Selected Property</span>
        </div>
      </div>

      {/* Properties Counter */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
        <span className="text-sm font-medium text-gray-700">
          {properties.length} Properties
        </span>
      </div>
    </div>
  );
};

export default MapView;