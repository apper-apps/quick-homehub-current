import savedPropertiesData from "../mockData/savedProperties.json";

class SavedPropertiesService {
  constructor() {
    this.savedProperties = [...savedPropertiesData];
  }

  // Simulate API delay
  delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.savedProperties];
  }

  async add(propertyId) {
    await this.delay();
    const existingIndex = this.savedProperties.findIndex(sp => sp.propertyId === propertyId);
    
    if (existingIndex === -1) {
      const newSaved = {
        Id: this.savedProperties.length > 0 ? Math.max(...this.savedProperties.map(sp => sp.Id)) + 1 : 1,
        propertyId: propertyId,
        savedDate: new Date().toISOString(),
        notes: ""
      };
      this.savedProperties.push(newSaved);
      return { ...newSaved };
    }
    
    return this.savedProperties[existingIndex];
  }

  async remove(propertyId) {
    await this.delay();
    const index = this.savedProperties.findIndex(sp => sp.propertyId === propertyId);
    if (index !== -1) {
      this.savedProperties.splice(index, 1);
      return true;
    }
    return false;
  }

  async isPropertySaved(propertyId) {
    await this.delay(100);
    return this.savedProperties.some(sp => sp.propertyId === propertyId);
  }

  async getSavedPropertyIds() {
    await this.delay(100);
    return this.savedProperties.map(sp => sp.propertyId);
  }
}

export default new SavedPropertiesService();