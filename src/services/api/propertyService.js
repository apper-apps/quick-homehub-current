class PropertyService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    this.tableName = 'property_c';
  }

  // Get all properties with advanced filtering
  async getAll(filters = {}) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "street_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "sqft_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "amenities_c" } },
          { field: { Name: "lat_c" } },
          { field: { Name: "lng_c" } },
          { field: { Name: "listing_date_c" } },
          { field: { Name: "status_c" } }
        ],
        where: [],
        orderBy: [
          {
            fieldName: "Id",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 50,
          offset: 0
        }
      };

      // Apply filters
      if (filters.priceMin) {
        params.where.push({
          FieldName: "price_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceMin]
        });
      }
      
      if (filters.priceMax) {
        params.where.push({
          FieldName: "price_c",
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceMax]
        });
      }
      
      if (filters.location) {
        params.where.push({
          FieldName: "city_c",
          Operator: "Contains",
          Values: [filters.location]
        });
      }
      
      if (filters.propertyType && filters.propertyType.length > 0) {
        params.where.push({
          FieldName: "type_c",
          Operator: "ExactMatch",
          Values: filters.propertyType
        });
      }
      
      if (filters.bedrooms) {
        params.where.push({
          FieldName: "bedrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bedrooms]
        });
      }
      
      if (filters.bathrooms) {
        params.where.push({
          FieldName: "bathrooms_c",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.bathrooms]
        });
      }
      
      if (filters.keywords) {
        params.where.push({
          FieldName: "description_c",
          Operator: "Contains",
          Values: [filters.keywords]
        });
      }

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform database response to expected format
      return response.data.map(property => ({
        Id: property.Id,
        title: property.title_c || property.Name,
        price: property.price_c || 0,
        address: {
          street: property.street_c || '',
          city: property.city_c || '',
          state: property.state_c || '',
          zipCode: property.zip_code_c || ''
        },
        bedrooms: property.bedrooms_c || 0,
        bathrooms: property.bathrooms_c || 0,
        sqft: property.sqft_c || 0,
        type: property.type_c || 'House',
        images: property.images_c ? property.images_c.split('\n').filter(img => img.trim()) : [],
        description: property.description_c || '',
        amenities: property.amenities_c ? property.amenities_c.split('\n').filter(amenity => amenity.trim()) : [],
        coordinates: {
          lat: property.lat_c || 0,
          lng: property.lng_c || 0
        },
        listingDate: property.listing_date_c || new Date().toISOString().split('T')[0],
        status: property.status_c || 'Active'
      }));
    } catch (error) {
      console.error("Error fetching properties:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Get property by ID
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "street_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "sqft_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "amenities_c" } },
          { field: { Name: "lat_c" } },
          { field: { Name: "lng_c" } },
          { field: { Name: "listing_date_c" } },
          { field: { Name: "status_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || `Property with Id ${id} not found`);
      }

      const property = response.data;
      
      // Transform database response to expected format
      return {
        Id: property.Id,
        title: property.title_c || property.Name,
        price: property.price_c || 0,
        address: {
          street: property.street_c || '',
          city: property.city_c || '',
          state: property.state_c || '',
          zipCode: property.zip_code_c || ''
        },
        bedrooms: property.bedrooms_c || 0,
        bathrooms: property.bathrooms_c || 0,
        sqft: property.sqft_c || 0,
        type: property.type_c || 'House',
        images: property.images_c ? property.images_c.split('\n').filter(img => img.trim()) : [],
        description: property.description_c || '',
        amenities: property.amenities_c ? property.amenities_c.split('\n').filter(amenity => amenity.trim()) : [],
        coordinates: {
          lat: property.lat_c || 0,
          lng: property.lng_c || 0
        },
        listingDate: property.listing_date_c || new Date().toISOString().split('T')[0],
        status: property.status_c || 'Active'
      };
    } catch (error) {
      console.error("Error fetching property:", error?.response?.data?.message || error);
      throw new Error(`Property with Id ${id} not found`);
    }
  }

  // Get featured properties
  async getFeatured(limit = 6) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "street_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "zip_code_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "sqft_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "images_c" } }
        ],
        orderBy: [
          {
            fieldName: "price_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform database response to expected format
      return response.data.map(property => ({
        Id: property.Id,
        title: property.title_c || property.Name,
        price: property.price_c || 0,
        address: {
          street: property.street_c || '',
          city: property.city_c || '',
          state: property.state_c || '',
          zipCode: property.zip_code_c || ''
        },
        bedrooms: property.bedrooms_c || 0,
        bathrooms: property.bathrooms_c || 0,
        sqft: property.sqft_c || 0,
        type: property.type_c || 'House',
        images: property.images_c ? property.images_c.split('\n').filter(img => img.trim()) : []
      }));
    } catch (error) {
      console.error("Error fetching featured properties:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Get map properties
  async getMapProperties(bounds = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "price_c" } },
          { field: { Name: "city_c" } },
          { field: { Name: "state_c" } },
          { field: { Name: "bedrooms_c" } },
          { field: { Name: "bathrooms_c" } },
          { field: { Name: "sqft_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "images_c" } },
          { field: { Name: "lat_c" } },
          { field: { Name: "lng_c" } }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform database response to expected format for map
      return response.data.map(property => ({
        Id: property.Id,
        title: property.title_c || property.Name,
        price: property.price_c || 0,
        address: {
          city: property.city_c || '',
          state: property.state_c || ''
        },
        coordinates: {
          lat: property.lat_c || 0,
          lng: property.lng_c || 0
        },
        images: property.images_c ? [property.images_c.split('\n').filter(img => img.trim())[0]] : [],
        bedrooms: property.bedrooms_c || 0,
        bathrooms: property.bathrooms_c || 0,
        sqft: property.sqft_c || 0,
        type: property.type_c || 'House'
      }));
    } catch (error) {
      console.error("Error fetching map properties:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new PropertyService();