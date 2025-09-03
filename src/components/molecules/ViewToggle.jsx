import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ViewToggle = ({ currentView, onViewChange, className = "" }) => {
  const views = [
    { id: "grid", icon: "Grid3X3", label: "Grid" },
    { id: "list", icon: "List", label: "List" },
    { id: "map", icon: "Map", label: "Map" }
  ];

  return (
    <div className={`flex items-center bg-gray-100 rounded-lg p-1 ${className}`}>
      {views.map((view) => (
        <motion.button
          key={view.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onViewChange(view.id)}
          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            currentView === view.id
              ? "bg-white text-primary-700 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <ApperIcon name={view.icon} className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{view.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default ViewToggle;