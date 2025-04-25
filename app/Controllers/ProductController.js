/**
 @class
 */
class ProductController {
  /**
   @constructor
   @param {Object} productModel 
   @param {Object} productView 
   */
  constructor(productModel, productView) {
    this.productModel = productModel;
    this.productView = productView;
    this.currentStoreId = null;
    this.productToDelete = null;
    this.currentProductId = null;

    this.initEventListeners();
    this.initFilterEvents();
  }

  /**
   @async
   @param {string} storeId 
   @returns {Promise<void>}
   */
  async loadProducts(storeId) {
    try {
      this.currentStoreId = storeId;
      this.productView.showLoader();

      await this.productModel.fetchProductsByStoreId(storeId);

      const filteredProducts = this.productModel.filterProducts();
      this.productView.renderProducts(filteredProducts);
      this.productView.updateStatusButtonStyles(
        this.productModel.currentStatusFilter
      );

      this.productView.hideLoader();
    } catch (error) {
      console.error("Error loading products:", error);
      this.productView.hideLoader();
    }
  }

  /**
   @async
   @param {Object} formData
   @returns {Promise<boolean>}
   */
  async addProduct(formData) {
    if (!this.validateProductForm(formData)) {
      return false;
    }

    try {
      const productData = {
        Name: formData.name,
        Price_amount: parseFloat(formData.price),
        Rating: formData.rating ? parseFloat(formData.rating) : null,
        Specs: formData.specs,
        SupplierInfo: formData.supplierInfo,
        MadeIn: formData.madeIn,
        ProductionCompanyName: formData.company,
        Status: formData.status,
        Store_ID: this.currentStoreId,
      };

      await this.productModel.createProduct(this.currentStoreId, productData);

      await this.loadProducts(this.currentStoreId);

      this.productView.hideAddProductForm();

      return true;
    } catch (error) {
      console.error("Error adding product:", error);
      return false;
    }
  }

  /**
   @async
   @param {string} productId 
   @param {Object} formData
   @returns {Promise<boolean>}
   */
  async updateProduct(productId, formData) {
    if (!this.validateProductForm(formData)) {
      return false;
    }

    try {
      const productData = {
        Name: formData.name,
        Price_amount: parseFloat(formData.price),
        Rating: formData.rating ? parseFloat(formData.rating) : null,
        Specs: formData.specs,
        SupplierInfo: formData.supplierInfo,
        MadeIn: formData.madeIn,
        ProductionCompanyName: formData.company,
        Status: formData.status,
        Store_ID: this.currentStoreId,
      };

      await this.productModel.updateProduct(productId, productData);

      await this.loadProducts(this.currentStoreId);

      this.productView.hideEditProductForm();

      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    }
  }

  /**
   @async
   @param {string} productId 
   @returns {Promise<boolean>}
   */
  async deleteProduct(productId) {
    try {
      await this.productModel.deleteProduct(productId);

      await this.loadProducts(this.currentStoreId);

      this.productView.hideDeleteProductConfirmation();

      return true;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }

  /**
   @returns {void}
   */
  searchProducts() {
    const searchTerm = this.productView.getSearchTerm();
    if (searchTerm) {
      const filteredProducts = this.productModel.searchProducts(searchTerm);
      this.productView.renderProducts(filteredProducts);
    }
  }

  /**
   @param {Object} data
   @returns {boolean}
   */
  validateProductForm(data) {
    const errors = [];

    if (!data.name) {
      document.getElementById("add-product-name").classList.add("input-error");
      displayErrorMessage("add-product-name", "Product name is required");
    } else {
      document
        .getElementById("add-product-name")
        .classList.remove("input-error");
      displayErrorMessage("add-product-name", "");
    }

    if (!data.price) {
      document.getElementById("add-product-price").classList.add("input-error");
      displayErrorMessage("add-product-price", "Product price is required");
      errors.push("Product price is required");
    } else if (isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0) {
      document.getElementById("add-product-price").classList.add("input-error");
      displayErrorMessage(
        "add-product-price",
        "Product price must be a positive number"
      );
    } else {
      document
        .getElementById("add-product-price")
        .classList.remove("input-error");
      displayErrorMessage("add-product-price", "");
    }

    if (!data.rating) {
      const ratingValue = parseFloat(data.rating);
      if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 5) {
        document
          .getElementById("add-product-rating")
          .classList.add("input-error");
        displayErrorMessage(
          "add-product-rating",
          "Rating must be a number between 0 and 5"
        );
      }
    } else {
      document
        .getElementById("add-product-rating")
        .classList.remove("input-error");
      displayErrorMessage("add-product-rating", "");
    }

    if (!data.specs) {
      document
        .getElementById("add-product-house-made")
        .classList.add("input-error");
      displayErrorMessage("add-product-house-made", "Product spec is required");
    } else {
      document
        .getElementById("add-product-house-made")
        .classList.remove("input-error");
      displayErrorMessage("add-product-house-made", "");
    }

    if (!data.supplierInfo) {
      document
        .getElementById("add-product-supplier-info")
        .classList.add("input-error");
      displayErrorMessage(
        "add-product-supplier-info",
        "Product supplier info is required"
      );
    } else {
      document
        .getElementById("add-product-supplier-info")
        .classList.remove("input-error");
      displayErrorMessage("add-product-supplier-info", "");
    }

    if (!data.madeIn) {
      document
        .getElementById("add-product-made-in")
        .classList.add("input-error");
      displayErrorMessage("add-product-made-in", "Product country is required");
    } else {
      document
        .getElementById("add-product-made-in")
        .classList.remove("input-error");
      displayErrorMessage("add-product-made-in", "");
    }

    if (!data.company) {
      document
        .getElementById("add-product-production")
        .classList.add("input-error");
      displayErrorMessage(
        "add-product-production",
        "Product company is required"
      );
    } else {
      document
        .getElementById("add-product-production")
        .classList.remove("input-error");
      displayErrorMessage("add-product-production", "");
    }

    function displayErrorMessage(inputId, message) {
      const inputElement = document.getElementById(inputId);
      const errorElement = document.createElement("div");
      errorElement.className = "error-message";

      errorElement.textContent = message;

      const existingError =
        inputElement.parentNode.querySelector(".error-message");
      if (existingError) {
        existingError.remove();
      }

      inputElement.parentNode.insertBefore(
        errorElement,
        inputElement.nextSibling
      );
    }

    if (errors.length > 0) {
      return false;
    }

    return true;
  }

  /**
   @param {string} status
   @returns {void}
   */
  filterByStatus(status) {
    this.productModel.setStatusFilter(status);
    const filteredProducts = this.productModel.filterProducts();
    this.productView.renderProducts(filteredProducts);
    this.productView.updateStatusButtonStyles(status);
  }

  /**
   @param {string} header
   @returns {void}
   */
  sortByHeader(header) {
    this.productModel.setSortHeader(header);
    const filteredProducts = this.productModel.filterProducts();
    this.productView.renderProducts(filteredProducts);
    this.productView.updateSortIndicators(
      this.productModel.currentSortHeader,
      this.productModel.currentSortDirection
    );
  }

  /**
   @returns {void}
   */
  initFilterEvents() {
    this.productView.okButton.addEventListener("click", () => {
      this.filterByStatus("ok");
    });

    this.productView.warningButton.addEventListener("click", () => {
      this.filterByStatus("warning");
    });

    this.productView.errorButton.addEventListener("click", () => {
      this.filterByStatus("error");
    });

    this.productView.statsValue.addEventListener("click", () => {
      this.filterByStatus("all");
    });

    this.productView.nameHeader.addEventListener("click", () => {
      this.sortByHeader("name");
    });

    this.productView.priceHeader.addEventListener("click", () => {
      this.sortByHeader("price");
    });

    this.productView.specsHeader.addEventListener("click", () => {
      this.sortByHeader("specs");
    });

    this.productView.supplierInfoHeader.addEventListener("click", () => {
      this.sortByHeader("supplier-info");
    });

    this.productView.countryHeader.addEventListener("click", () => {
      this.sortByHeader("country");
    });

    this.productView.companyHeader.addEventListener("click", () => {
      this.sortByHeader("company");
    });

    this.productView.ratingHeader.addEventListener("click", () => {
      this.sortByHeader("rating");
    });
  }

  /**
   @returns {void}
   */
  initEventListeners() {
    document.addEventListener("storeSelected", (event) => {
      const { storeId } = event.detail;
      this.loadProducts(storeId);
    });

    document.addEventListener("storeDeleted", () => {
      this.productView.listedItems.innerHTML = "";
      this.productView.updateCount(0);
    });

    this.productView.startCreateProductButton.addEventListener("click", () => {
      this.productView.showAddProductForm();
    });

    this.productView.cancelProductButton.addEventListener("click", () => {
      this.productView.hideAddProductForm();
    });

    this.productView.productForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = this.productView.getAddProductFormData();
      this.addProduct(formData);
    });

    this.productView.searchProductsButton.addEventListener("click", () => {
      this.searchProducts();
    });

    this.productView.searchProductsInput.addEventListener(
      "keypress",
      (event) => {
        if (event.key === "Enter") {
          this.searchProducts();
        }
      }
    );

    this.productView.listedItems.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-button")) {
        const productId = event.target.dataset.productId;
        this.currentProductId = productId;

        const product = this.productModel.products.find(
          (p) => p.ID === productId
        );
        if (product) {
          this.productView.showEditProductForm(product);
        }
      } else if (event.target.classList.contains("remove-button")) {
        const productId = event.target.dataset.productId;
        this.productToDelete = productId;
        this.productView.showDeleteProductConfirmation();
      }
    });

    this.productView.cancelProductEditButton.addEventListener("click", () => {
      this.productView.hideEditProductForm();
    });

    this.productView.editButtonForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = this.productView.getEditProductFormData();
      this.updateProduct(this.currentProductId, formData);
    });

    this.productView.confirmProductDelete.addEventListener("click", () => {
      if (this.productToDelete) {
        this.deleteProduct(this.productToDelete);
        this.productToDelete = null;
      }
    });

    this.productView.cancelProductDelete.addEventListener("click", () => {
      this.productView.hideDeleteProductConfirmation();
      this.productToDelete = null;
    });
  }
}
