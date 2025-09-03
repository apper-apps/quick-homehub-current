import propertiesData from "../mockData/properties.json";

class PropertyService {
  constructor() {
    this.properties = [...propertiesData];
  }

  // Simulate API delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll(filters = {}) {
    await this.delay();
    
    let filteredProperties = [...this.properties];

    // Apply filters
    if (filters.priceMin) {
      filteredProperties = filteredProperties.filter(p => p.price >= filters.priceMin);
    }
    
    if (filters.priceMax) {
      filteredProperties = filteredProperties.filter(p => p.price <= filters.priceMax);
    }
    
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filteredProperties = filteredProperties.filter(p => 
        p.address.city.toLowerCase().includes(location) ||
        p.address.state.toLowerCase().includes(location) ||
        p.title.toLowerCase().includes(location)
      );
    }
    
    if (filters.propertyType && filters.propertyType.length > 0) {
      filteredProperties = filteredProperties.filter(p => 
        filters.propertyType.includes(p.type)
      );
    }
    
    if (filters.bedrooms) {
      filteredProperties = filteredProperties.filter(p => p.bedrooms >= filters.bedrooms);
    }
    
    if (filters.bathrooms) {
      filteredProperties = filteredProperties.filter(p => p.bathrooms >= filters.bathrooms);
    }
    
    if (filters.keywords) {
      const keywords = filters.keywords.toLowerCase();
      filteredProperties = filteredProperties.filter(p => 
        p.title.toLowerCase().includes(keywords) ||
        p.description.toLowerCase().includes(keywords) ||
        p.amenities.some(amenity => amenity.toLowerCase().includes(keywords))
      );
    }

    return filteredProperties;
  }

  async getById(id) {
    await this.delay(200);
    const property = this.properties.find(p => p.Id === parseInt(id));
    if (!property) {
      throw new Error(`Property with Id ${id} not found`);
    }
    return { ...property };
  }

  async getFeatured(limit = 6) {
    await this.delay();
    // Return properties sorted by price (descending) as "featured"
    return this.properties
      .sort((a, b) => b.price - a.price)
      .slice(0, limit)
      .map(p => ({ ...p }));
  }

  async getMapProperties(bounds = null) {
    await this.delay(250);
    // In a real app, would filter by map bounds
    return this.properties.map(p => ({
      Id: p.Id,
      title: p.title,
      price: p.price,
      address: p.address,
      coordinates: p.coordinates,
      images: [p.images[0]], // Just first image for map markers
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      sqft: p.sqft,
      type: p.type
    }));
  }
}

export default new PropertyService();