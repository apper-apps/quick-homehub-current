import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ savedCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (searchTerm) => {
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { path: "/", label: "Browse", icon: "Home" },
    { path: "/map", label: "Map View", icon: "Map" },
    { path: "/saved", label: "Saved", icon: "Heart", count: savedCount }
  ];

  const isActivePath = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-sm"
            >
              <ApperIcon name="Home" className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-primary-800 transition-all">
              HomeHub
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <SearchBar onSearch={handleSearch} className="w-full" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActivePath(item.path)
                    ? "text-primary-700 bg-primary-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                {item.label}
                {item.count > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-accent-500 text-white rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white border-t border-gray-200"
        >
          <div className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActivePath(item.path)
                    ? "text-primary-700 bg-primary-50"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                {item.label}
                {item.count > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-sm bg-accent-500 text-white rounded-full">
                    {item.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;