/**
 @class
 */
class StoreModel {
  /**
   @constructor
   */
  constructor() {
    this.stores = [];
    this.currentStore = null;
  }

  /**
   @async
   @returns {Promise<Array>} 
   @throws {Error}
   */
  async fetchAllStores() {
    try {
      const response = await fetch("http://localhost:5000/api/stores");
      const data = await response.json();
      this.stores = data.stores;

      return this.stores;
    } catch (error) {
      console.error("Error fetching stores:", error);
      throw error;
    }
  }

  /**
   @async
   @param {string} id
   @returns {Promise<Object|null>} 
   @throws {Error} 
   */
  async getStoreById(id) {
    try {
      const store = this.stores.find((store) => store.ID == id);
      if (store) {
        this.currentStore = store;
        return store;
      }
      return null;
    } catch (error) {
      console.error("Error getting store:", error);
      throw error;
    }
  }

  /**
   @async
   @param {Object} storeData 
   @returns {Promise<Object>}
   @throws {Error}
   */
  async createStore(storeData) {
    try {
      const response = await fetch("http://localhost:5000/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });

      if (!response.ok) {
        throw new Error("Failed to create store");
      }

      const data = await response.json();
      await this.fetchAllStores();
      return data;
    } catch (error) {
      console.error("Error creating store:", error);
      throw error;
    }
  }

  /**
   @async
   @param {string} storeId 
   @returns {Promise<boolean>} 
   @throws {Error}
   */
  async deleteStore(storeId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/stores/${storeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error removing store: ${response.status}`);
      }

      this.currentStore = null;
      await this.fetchAllStores();
      return true;
    } catch (error) {
      console.error("Error deleting store:", error);
      throw error;
    }
  }

  /**
   @param {string} searchTerm 
   @returns {Array}
   */
  filterStores(searchTerm) {
    if (!searchTerm) return this.stores;

    return this.stores.filter((store) => {
      return (
        store.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.Address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(store.FloorArea) === String(searchTerm.toLowerCase())
      );
    });
  }
}
