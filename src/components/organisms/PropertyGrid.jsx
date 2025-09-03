import React, { useState, useEffect } from "react";
import PropertyCard from "@/components/molecules/PropertyCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import savedPropertiesService from "@/services/api/savedPropertiesService";

const PropertyGrid = ({ properties, loading, error, onRetry, viewType = "grid" }) => {
  const [savedPropertyIds, setSavedPropertyIds] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    try {
      const savedIds = await savedPropertiesService.getSavedPropertyIds();
      setSavedPropertyIds(savedIds);
    } catch (error) {
      console.error("Failed to load saved properties:", error);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleSaveToggle = (propertyId, isSaved) => {
    if (isSaved) {
      setSavedPropertyIds(prev => [...prev, propertyId.toString()]);
    } else {
      setSavedPropertyIds(prev => prev.filter(id => id !== propertyId.toString()));
    }
  };

  if (loading || loadingSaved) {
    return <Loading type={viewType} />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!properties || properties.length === 0) {
    return (
      <Empty
        title="No properties found"
        description="Try adjusting your search criteria or browse all properties."
        action={() => window.location.reload()}
        actionLabel="Refresh Results"
        icon="Search"
      />
    );
  }

  if (viewType === "list") {
    return (
      <div className="space-y-4">
        {properties.map((property) => (
          <div key={property.Id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-48 h-48 sm:h-32 flex-shrink-0">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-display font-semibold text-gray-900 line-clamp-1">
                      {property.title}
                    </h3>
                    <span className="text-xl font-bold text-gray-900 ml-4">
                      ${property.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">
                    {property.address.city}, {property.address.state}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{property.bedrooms} beds</span>
                    <span>{property.bathrooms} baths</span>
                    <span>{property.sqft.toLocaleString()} sq ft</span>
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded text-xs font-medium">
                      {property.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.Id}
          property={property}
          isSaved={savedPropertyIds.includes(property.Id.toString())}
          onSaveToggle={handleSaveToggle}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;