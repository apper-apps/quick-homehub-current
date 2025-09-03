import React from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const PropertyFilters = ({ filters, onChange, onClear, onApply }) => {
  const handleFilterChange = (key, value) => {
    onChange({
      ...filters,
      [key]: value
    });
  };

  const handlePropertyTypeChange = (type) => {
    const currentTypes = filters.propertyType || [];
    const updatedTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    
    handleFilterChange("propertyType", updatedTypes);
  };

  const propertyTypes = ["House", "Condo", "Townhouse", "Apartment"];
  const hasActiveFilters = Object.values(filters).some(value => 
    value && (Array.isArray(value) ? value.length > 0 : true)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="X" className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Price Range</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder="Min Price"
            value={filters.priceMin || ""}
            onChange={(e) => handleFilterChange("priceMin", e.target.value ? parseInt(e.target.value) : null)}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={filters.priceMax || ""}
            onChange={(e) => handleFilterChange("priceMax", e.target.value ? parseInt(e.target.value) : null)}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <Input
          label="Location"
          placeholder="City, State, or ZIP"
          value={filters.location || ""}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        />
      </div>

      {/* Property Type */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Property Type</h4>
        <div className="grid grid-cols-2 gap-2">
          {propertyTypes.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-2 p-2 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                type="checkbox"
                checked={(filters.propertyType || []).includes(type)}
                onChange={() => handlePropertyTypeChange(type)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Min Bedrooms"
          value={filters.bedrooms || ""}
          onChange={(e) => handleFilterChange("bedrooms", e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </Select>
        
        <Select
          label="Min Bathrooms"
          value={filters.bathrooms || ""}
          onChange={(e) => handleFilterChange("bathrooms", e.target.value ? parseFloat(e.target.value) : null)}
        >
          <option value="">Any</option>
          <option value="1">1+</option>
          <option value="1.5">1.5+</option>
          <option value="2">2+</option>
          <option value="2.5">2.5+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </Select>
      </div>

      {/* Keywords */}
      <div>
        <Input
          label="Keywords"
          placeholder="Pool, garage, fireplace, etc."
          value={filters.keywords || ""}
          onChange={(e) => handleFilterChange("keywords", e.target.value)}
        />
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={onApply}
      >
        <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
        Apply Filters
      </Button>
    </div>
  );
};

export default PropertyFilters;