import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import savedPropertiesService from "@/services/api/savedPropertiesService";
import { toast } from "react-toastify";

const PropertyCard = ({ property, isSaved: initialSaved = false, onSaveToggle }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    setSaving(true);

    try {
      if (isSaved) {
        await savedPropertiesService.remove(property.Id.toString());
        setIsSaved(false);
        toast.success("Property removed from saved list");
      } else {
        await savedPropertiesService.add(property.Id.toString());
        setIsSaved(true);
        toast.success("Property saved successfully");
      }
      
      if (onSaveToggle) {
        onSaveToggle(property.Id, !isSaved);
      }
    } catch (error) {
      toast.error("Failed to update saved properties");
    } finally {
      setSaving(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/property/${property.Id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatAddress = (address) => {
    return `${address.city}, ${address.state}`;
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-sm border hover:shadow-lg cursor-pointer overflow-hidden group transition-all duration-300"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="primary" className="backdrop-blur-sm bg-white/90 text-primary-700 font-medium">
            {property.type}
          </Badge>
        </div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveToggle}
          disabled={saving}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isSaved
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          {saving ? (
            <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
          ) : (
            <ApperIcon 
              name="Heart" 
              className={`w-5 h-5 ${isSaved ? "fill-current" : ""} ${
                isSaved ? "animate-heart-beat" : ""
              }`} 
            />
          )}
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-display font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-primary-700 transition-colors">
          {property.title}
        </h3>

        {/* Address */}
        <p className="text-gray-600 flex items-center">
          <ApperIcon name="MapPin" className="w-4 h-4 mr-1 text-gray-400" />
          {formatAddress(property.address)}
        </p>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="flex items-center">
            <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
            {property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center">
            <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
            {property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center">
            <ApperIcon name="Square" className="w-4 h-4 mr-1" />
            {property.sqft.toLocaleString()} sq ft
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-2xl font-display font-bold text-gray-900">
            {formatPrice(property.price)}
          </span>
          <ApperIcon 
            name="ArrowRight" 
            className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" 
          />
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;