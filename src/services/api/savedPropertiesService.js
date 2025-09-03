class SavedPropertiesService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    this.tableName = 'saved_property_c';
  }

  // Get all saved properties
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id_c" } },
          { field: { Name: "saved_date_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [
          {
            fieldName: "saved_date_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      // Transform database response to expected format
      return response.data.map(savedProperty => ({
        Id: savedProperty.Id,
        propertyId: savedProperty.property_id_c?.Id || savedProperty.property_id_c,
        savedDate: savedProperty.saved_date_c,
        notes: savedProperty.notes_c || ""
      }));
    } catch (error) {
      console.error("Error fetching saved properties:", error?.response?.data?.message || error);
      return [];
    }
  }

  // Add property to saved list
  async add(propertyId) {
    try {
      // Check if already saved
      const isAlreadySaved = await this.isPropertySaved(propertyId);
      if (isAlreadySaved) {
        return { propertyId: propertyId, savedDate: new Date().toISOString() };
      }

      const params = {
        records: [
          {
            Name: `Saved Property ${propertyId}`,
            property_id_c: parseInt(propertyId),
            saved_date_c: new Date().toISOString(),
            notes_c: ""
          }
        ]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error("Failed to save property");
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to save property ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to save property");
        }
        
        const savedRecord = successfulRecords[0];
        return {
          Id: savedRecord.data.Id,
          propertyId: propertyId,
          savedDate: savedRecord.data.saved_date_c
        };
      }
    } catch (error) {
      console.error("Error adding saved property:", error?.response?.data?.message || error);
      throw new Error("Failed to save property");
    }
  }

  // Remove property from saved list
  async remove(propertyId) {
    try {
      // First find the saved property record
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id_c" } }
        ],
        where: [
          {
            FieldName: "property_id_c",
            Operator: "EqualTo",
            Values: [parseInt(propertyId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        return false;
      }

      const savedPropertyRecord = response.data[0];
      
      // Delete the record
      const deleteParams = {
        RecordIds: [savedPropertyRecord.Id]
      };

      const deleteResponse = await this.apperClient.deleteRecord(this.tableName, deleteParams);
      
      if (!deleteResponse.success) {
        console.error(deleteResponse.message);
        return false;
      }

      if (deleteResponse.results) {
        const failedDeletions = deleteResponse.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete saved property ${failedDeletions.length} records:${failedDeletions}`);
          return false;
        }
        
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error removing saved property:", error?.response?.data?.message || error);
      return false;
    }
  }

  // Check if property is saved
  async isPropertySaved(propertyId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "property_id_c" } }
        ],
        where: [
          {
            FieldName: "property_id_c",
            Operator: "EqualTo",
            Values: [parseInt(propertyId)]
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        return false;
      }

      return response.data && response.data.length > 0;
    } catch (error) {
      console.error("Error checking saved property:", error?.response?.data?.message || error);
      return false;
    }
  }

  // Get saved property IDs
  async getSavedPropertyIds() {
    try {
      const params = {
        fields: [
          { field: { Name: "property_id_c" } }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(savedProperty => {
        const propertyId = savedProperty.property_id_c?.Id || savedProperty.property_id_c;
        return propertyId.toString();
      });
    } catch (error) {
      console.error("Error fetching saved property IDs:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new SavedPropertiesService();