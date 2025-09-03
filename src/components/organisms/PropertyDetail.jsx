import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ImageGallery from "@/components/molecules/ImageGallery";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import propertyService from "@/services/api/propertyService";
import savedPropertiesService from "@/services/api/savedPropertiesService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadProperty();
    checkIfSaved();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getById(id);
      setProperty(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const saved = await savedPropertiesService.isPropertySaved(id);
      setIsSaved(saved);
    } catch (error) {
      console.error("Failed to check saved status:", error);
    }
  };

  const handleSaveToggle = async () => {
    setSaving(true);

    try {
      if (isSaved) {
        await savedPropertiesService.remove(id);
        setIsSaved(false);
        toast.success("Property removed from saved list");
      } else {
        await savedPropertiesService.add(id);
        setIsSaved(true);
        toast.success("Property saved successfully");
      }
    } catch (error) {
      toast.error("Failed to update saved properties");
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  if (loading) {
    return <Loading type="property-detail" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProperty} />;
  }

  if (!property) {
    return <Error message="Property not found" onRetry={() => navigate("/")} />;
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: "Info" },
    { id: "features", label: "Features", icon: "Star" },
    { id: "location", label: "Location", icon: "MapPin" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
          Back to Results
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ImageGallery images={property.images} title={property.title} />
          </motion.div>

          {/* Property Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <p className="text-lg text-gray-600 flex items-center">
                  <ApperIcon name="MapPin" className="w-5 h-5 mr-2 text-gray-400" />
                  {property.address.street}, {property.address.city}, {property.address.state} {property.address.zipCode}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-display font-bold text-gray-900 mb-1">
                  {formatPrice(property.price)}
                </div>
                <Badge variant="primary">{property.type}</Badge>
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex items-center gap-6 text-gray-600">
              <span className="flex items-center font-medium">
                <ApperIcon name="Bed" className="w-5 h-5 mr-2" />
                {property.bedrooms} Bedroom{property.bedrooms !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center font-medium">
                <ApperIcon name="Bath" className="w-5 h-5 mr-2" />
                {property.bathrooms} Bathroom{property.bathrooms !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center font-medium">
                <ApperIcon name="Square" className="w-5 h-5 mr-2" />
                {property.sqft.toLocaleString()} sq ft
              </span>
              <span className="flex items-center font-medium text-sm">
                <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                Listed {formatDate(property.listingDate)}
              </span>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border-b border-gray-200"
          >
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {activeTab === "overview" && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>
            )}

            {activeTab === "features" && (
              <div>
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">Property Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <ApperIcon name="Check" className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-900 font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "location" && (
              <div>
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">Location Details</h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Address</h4>
                      <p className="text-gray-700">
                        {property.address.street}<br />
                        {property.address.city}, {property.address.state} {property.address.zipCode}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Coordinates</h4>
                      <p className="text-gray-700">
                        Lat: {property.coordinates.lat}<br />
                        Lng: {property.coordinates.lng}
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 h-48 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <ApperIcon name="Map" className="w-12 h-12 mx-auto mb-2" />
                      <p>Interactive map would be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Contact Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Interested in this property?
            </h3>
            
            <div className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => toast.info("Contact feature would be implemented here")}
              >
                <ApperIcon name="Phone" className="w-5 h-5 mr-2" />
                Schedule Viewing
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => toast.info("Message feature would be implemented here")}
              >
                <ApperIcon name="MessageCircle" className="w-5 h-5 mr-2" />
                Send Message
              </Button>

              <Button
                variant={isSaved ? "danger" : "accent"}
                size="lg"
                className="w-full"
                onClick={handleSaveToggle}
                disabled={saving}
              >
                {saving ? (
                  <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <ApperIcon 
                    name="Heart" 
                    className={`w-5 h-5 mr-2 ${isSaved ? "fill-current" : ""}`} 
                  />
                )}
                {isSaved ? "Remove from Saved" : "Save Property"}
              </Button>
            </div>
          </div>

          {/* Property Summary */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
              Property Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-primary-200 last:border-b-0">
                <span className="text-gray-700">Property Type</span>
                <span className="font-medium text-gray-900">{property.type}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-primary-200 last:border-b-0">
                <span className="text-gray-700">Bedrooms</span>
                <span className="font-medium text-gray-900">{property.bedrooms}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-primary-200 last:border-b-0">
                <span className="text-gray-700">Bathrooms</span>
                <span className="font-medium text-gray-900">{property.bathrooms}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-primary-200 last:border-b-0">
                <span className="text-gray-700">Square Feet</span>
                <span className="font-medium text-gray-900">{property.sqft.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-primary-200 last:border-b-0">
                <span className="text-gray-700">Status</span>
                <Badge variant="success">{property.status}</Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetail;