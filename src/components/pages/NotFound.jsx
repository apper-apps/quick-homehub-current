import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="Home" className="w-12 h-12 text-primary-600" />
        </motion.div>

        <h1 className="text-6xl font-display font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-display font-semibold text-gray-900 mb-3">
          Property Not Found
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, the property you're looking for doesn't exist or may have been moved. 
          Let's help you find your perfect home instead.
        </p>

        <div className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = "/"}
            className="w-full sm:w-auto"
          >
            <ApperIcon name="Home" className="w-5 h-5 mr-2" />
            Browse Properties
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => window.location.href = "/map"}
              className="flex-1 sm:flex-none"
            >
              <ApperIcon name="Map" className="w-4 h-4 mr-2" />
              Map View
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.location.href = "/saved"}
              className="flex-1 sm:flex-none"
            >
              <ApperIcon name="Heart" className="w-4 h-4 mr-2" />
              Saved Properties
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;