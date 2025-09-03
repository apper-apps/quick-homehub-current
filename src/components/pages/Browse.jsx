import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import PropertyFilters from "@/components/molecules/PropertyFilters";
import ViewToggle from "@/components/molecules/ViewToggle";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import propertyService from "@/services/api/propertyService";
import MapView from "@/components/organisms/MapView";

const Browse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceMin: null,
    priceMax: null,
    location: "",
    propertyType: [],
    bedrooms: null,
    bathrooms: null,
    keywords: ""
  });

  useEffect(() => {
    // Parse URL parameters
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("search");
    
    if (searchTerm) {
      setFilters(prev => ({ ...prev, location: searchTerm }));
    }
    
    loadProperties();
  }, [location.search]);

  const loadProperties = async (searchFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getAll(searchFilters);
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFiltersApply = () => {
    loadProperties(filters);
    setShowFilters(false);
    
    // Update URL if location filter is set
    if (filters.location) {
      navigate(`/?search=${encodeURIComponent(filters.location)}`);
    }
  };

  const handleFiltersClear = () => {
    const clearedFilters = {
      priceMin: null,
      priceMax: null,
      location: "",
      propertyType: [],
      bedrooms: null,
      bathrooms: null,
      keywords: ""
    };
    setFilters(clearedFilters);
    loadProperties(clearedFilters);
    navigate("/");
  };

  const handleRetry = () => {
    loadProperties();
  };

  if (viewType === "map") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Property Map</h1>
            <p className="text-gray-600 mt-1">Explore properties on the interactive map</p>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle currentView={viewType} onViewChange={setViewType} />
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="h-[600px]"
        >
          <MapView />
        </motion.div>
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
          <h1 className="text-3xl font-display font-bold text-gray-900">Browse Properties</h1>
          <p className="text-gray-600 mt-2">Discover your next home from our curated listings</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <ViewToggle currentView={viewType} onViewChange={setViewType} />
        </div>
      </motion.div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`w-80 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
        >
          <div className="sticky top-24">
            <PropertyFilters
              filters={filters}
              onChange={handleFiltersChange}
              onClear={handleFiltersClear}
              onApply={handleFiltersApply}
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 min-w-0"
        >
          {/* Results Header */}
          {!loading && !error && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {properties.length} propert{properties.length !== 1 ? "ies" : "y"} found
              </p>
              
              {/* Sort Options - for future enhancement */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white">
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="newest">Newest First</option>
                  <option value="beds">Most Bedrooms</option>
                </select>
              </div>
            </div>
          )}

          {/* Property Grid */}
          <PropertyGrid
            properties={properties}
            loading={loading}
            error={error}
            onRetry={handleRetry}
            viewType={viewType}
          />
        </motion.div>
      </div>

      {/* Mobile Filters Overlay */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-auto"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-4">
              <PropertyFilters
                filters={filters}
                onChange={handleFiltersChange}
                onClear={handleFiltersClear}
                onApply={handleFiltersApply}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Browse;