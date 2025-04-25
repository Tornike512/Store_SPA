/**
 @class
 */
class ProductModel {
  /**
   @constructor
   */
  constructor() {
    this.products = [];
    this.currentSortHeader = "name";
    this.currentSortDirection = "asc";
    this.currentStatusFilter = "all";
  }

  /**
   @async
   @param {string} storeId
   @returns {Promise<Array>} 
   @throws {Error} 
   */
  async fetchProductsByStoreId(storeId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${storeId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`error status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        this.products = data;
      } else if (data && typeof data === "object" && data.ID) {
        this.products = [data];
      } else {
        console.error("Invalid API response format:", data);
        this.products = [];
      }

      return this.products;
    } catch (error) {
      console.error("Error fetching products:", error);
      this.products = [];
      throw error;
    }
  }

  /**
   @async
   @param {string} storeId 
   @param {Object} productData
   @returns {Promise<Object>} 
   @throws {Error}
   */
  async createProduct(storeId, productData) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/product/${storeId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to add product: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      await this.fetchProductsByStoreId(storeId);
      return result;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  /**
   @async
   @param {string} productId 
   @param {Object} productData 
   @returns {Promise<boolean>}
   @throws {Error} 
   */
  async updateProduct(productId, productData) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update product: Status ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  /**
   
   @async
   @param {string} productId 
   @returns {Promise<boolean>}
   @throws {Error} 
   */
  async deleteProduct(productId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete product`);
      }

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  /**
   @returns {Array}
   */
  filterProducts() {
    if (!this.products || !Array.isArray(this.products)) {
      console.warn("Products not loaded or invalid format");
      return [];
    }
    let filteredProducts = [...this.products];

    if (this.currentStatusFilter !== "all") {
      filteredProducts = this.products.filter((product) => {
        if (this.currentStatusFilter === "ok") {
          return product.Status === "OK";
        } else if (this.currentStatusFilter === "warning") {
          return product.Status === "STORAGE";
        } else if (this.currentStatusFilter === "error") {
          return product.Status === "OUT_OF_STOCK";
        }
        return true;
      });
    }

    return this.sortProducts(filteredProducts, this.currentSortHeader);
  }

  /**
   @param {Array} products
   @param {string} header 
   @returns {Array}
   */
  sortProducts(products, header) {
    if (header === "name") {
      return products.sort((a, b) => {
        return this.currentSortDirection === "asc"
          ? a.Name.localeCompare(b.Name)
          : b.Name.localeCompare(a.Name);
      });
    } else if (header === "price") {
      return products.sort((a, b) => {
        return this.currentSortDirection === "asc"
          ? a.Price_amount - b.Price_amount
          : b.Price_amount - a.Price_amount;
      });
    } else if (header === "specs") {
      return products.sort((a, b) => {
        return this.currentSortDirection === "asc"
          ? a.Specs.localeCompare(b.Specs)
          : b.Specs.localeCompare(a.Specs);
      });
    } else if (header === "supplier-info") {
      return products.sort((a, b) => {
        return this.currentSortDirection === "asc"
          ? a.SupplierInfo.localeCompare(b.SupplierInfo)
          : b.SupplierInfo.localeCompare(a.SupplierInfo);
      });
    } else if (header === "country") {
      return products.sort((a, b) => {
        return this.currentSortDirection === "asc"
          ? a.MadeIn.localeCompare(b.MadeIn)
          : b.MadeIn.localeCompare(a.MadeIn);
      });
    } else if (header === "company") {
      return products.sort((a, b) => {
        return this.currentSortDirection === "asc"
          ? a.ProductionCompanyName.localeCompare(b.ProductionCompanyName)
          : b.ProductionCompanyName.localeCompare(a.ProductionCompanyName);
      });
    } else if (header === "rating") {
      return products.sort((a, b) => {
        return this.currentSortDirection === "asc"
          ? a.Rating - b.Rating
          : b.Rating - a.Rating;
      });
    }
    return products;
  }

  /**
   @param {string} searchTerm
   @returns {Array}
   */
  searchProducts(searchTerm) {
    return this.products.filter((product) =>
      product.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   @param {string} header
   @returns {void}
   */
  setSortHeader(header) {
    if (this.currentSortHeader === header) {
      this.currentSortDirection =
        this.currentSortDirection === "asc" ? "desc" : "asc";
    } else {
      this.currentSortHeader = header;
      this.currentSortDirection = "asc";
    }
  }

  /**
   @param {string} status
   @returns {void}
   */
  setStatusFilter(status) {
    this.currentStatusFilter = status;
  }
}
