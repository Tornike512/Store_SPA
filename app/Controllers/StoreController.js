/**
 @class
 */
class StoreController {
  /**
   @constructor
   @param {Object} storeModel 
   @param {Object} storeView 
   */
  constructor(storeModel, storeView) {
    this.storeModel = storeModel;
    this.storeView = storeView;
    this.initEventListeners();
  }

  /**
   @async
   @returns {Promise<void>}
   */
  async initStores() {
    try {
      this.storeView.showLoader();
      const stores = await this.storeModel.fetchAllStores();

      if (stores && Array.isArray(stores)) {
        this.storeView.renderStoreList(stores);

        const urlParams = new URLSearchParams(window.location.search);
        const storeIdFromUrl = urlParams.get("storeId");

        if (storeIdFromUrl) {
          const storeToSelect = stores.find(
            (store) => store.ID == storeIdFromUrl
          );
          if (storeToSelect) {
            this.onStoreSelect(storeToSelect.ID);
          } else {
            this.storeView.wrongUrlContainer.classList = "show-wrong-url";
            this.storeView.storeNotFoundContainer.classList =
              "hide-not-found-container";
            this.storeView.mainContent.classList = "hide-main-content";
          }
        }
      } else {
        console.error("No stores data received or data is not an array");
        this.storeView.renderStoreList([]);
      }

      this.storeView.hideLoader();
    } catch (error) {
      console.error("Failed to initialize stores:", error);
      this.storeView.hideLoader();
      this.storeView.renderStoreList([]);
    }
  }

  /**
   @async
   @param {string} storeId
   @returns {Promise<void>}
   */
  async onStoreSelect(storeId) {
    try {
      const newUrl = `${window.location.pathname}?storeId=${storeId}`;
      window.history.pushState({ storeId }, "", newUrl);

      this.storeView.storeNotFoundContainer.style.display = "none";
      this.storeView.mainContent.classList = "main-content";
      this.storeView.wrongUrlContainer.classList = "wrong-url";

      const store = await this.storeModel.getStoreById(storeId);
      if (store) {
        this.storeView.renderStoreDetails(store);

        document.dispatchEvent(
          new CustomEvent("storeSelected", { detail: { storeId } })
        );
      } else {
        this.storeView.showStoreNotFound();
      }
    } catch (error) {
      console.error("Error selecting store:", error);
    }
  }

  /**
   @async
   @param {Object} formData
   @returns {Promise<boolean>} 
   */
  async createStore(formData) {
    try {
      if (!this.validateStoreForm(formData)) {
        return false;
      }

      const date = new Date(formData.established);
      const isoDate = date.toISOString();

      const storeData = {
        Name: formData.name,
        Email: formData.email,
        PhoneNumber: formData.phoneNumber,
        Address: formData.address,
        Established: isoDate,
        FloorArea: formData.floorArea,
      };

      await this.storeModel.createStore(storeData);
      const stores = await this.storeModel.fetchAllStores();
      this.storeView.renderStoreList(stores);

      alert("Store created successfully!");
      return true;
    } catch (error) {
      alert("Error creating store: " + error.message);
      return false;
    }
  }

  /**
   @async
   @param {string} storeId 
   @returns {Promise<boolean>} 
   */
  async deleteStore(storeId) {
    try {
      await this.storeModel.deleteStore(storeId);

      this.storeView.storeDetails.innerHTML = "";
      this.storeView.showStoreNotFound();

      const stores = await this.storeModel.fetchAllStores();
      this.storeView.renderStoreList(stores);

      document.dispatchEvent(
        new CustomEvent("storeDeleted", { detail: { storeId } })
      );

      alert("Store deleted successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting store:", error);
      alert("Failed to delete store: " + error.message);
      return false;
    }
  }

  /**
   @param {string} searchTerm
   @returns {void}
   */
  searchStores(searchTerm) {
    const filteredStores = this.storeModel.filterStores(searchTerm);
    this.storeView.renderStoreList(filteredStores);
  }

  initFormValidation() {
    const inputSelectors = [
      'input[placeholder="Enter name"]',
      'input[placeholder="Enter email"]',
      'input[placeholder="Enter phone number"]',
      'input[placeholder="Enter address"]',
      'input[name="established"]',
      'input[placeholder="Enter floor area (in sq m)"]',
    ];

    inputSelectors.forEach((selector) => {
      const input = document.querySelector(selector);
      if (input) {
        input.addEventListener("input", () => {
          input.classList.remove("input-error");

          const errorMessage = input.nextElementSibling;
          if (
            errorMessage &&
            errorMessage.classList.contains("error-message")
          ) {
            errorMessage.remove();
          }
        });
      }
    });
  }

  /**
   @param {Object} data
   @returns {boolean}
   */
  validateStoreForm(data) {
    let isValid = true;

    document.querySelectorAll(".error-message").forEach((el) => el.remove());

    if (
      !data.name ||
      !data.email ||
      !data.phoneNumber ||
      !data.address ||
      !data.established ||
      !data.floorArea
    ) {
      isValid = false;

      if (!data.name) {
        this.createErrorMessage(
          'input[placeholder="Enter name"]',
          "Name is required"
        );
      }
      if (!data.email) {
        this.createErrorMessage(
          'input[placeholder="Enter email"]',
          "Email is required"
        );
      }
      if (!data.phoneNumber) {
        this.createErrorMessage(
          'input[placeholder="Enter phone number"]',
          "Phone number is required"
        );
      }
      if (!data.address) {
        this.createErrorMessage(
          'input[placeholder="Enter address"]',
          "Address is required"
        );
      }
      if (!data.established) {
        this.createErrorMessage(
          'input[name="established"]',
          "Establishment date is required"
        );
      }
      if (!data.floorArea) {
        this.createErrorMessage(
          'input[placeholder="Enter floor area (in sq m)"]',
          "Floor area is required"
        );
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      isValid = false;
      this.createErrorMessage(
        'input[placeholder="Enter email"]',
        "Please enter a valid email address"
      );
    }

    const phoneRegex = /^\d{9,15}$/;
    if (data.phoneNumber && !phoneRegex.test(data.phoneNumber)) {
      isValid = false;
      this.createErrorMessage(
        'input[placeholder="Enter phone number"]',
        "Please enter a valid phone number"
      );
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (data.established && !dateRegex.test(data.established)) {
      isValid = false;
      this.createErrorMessage(
        'input[name="established"]',
        "Please enter a valid date in YYYY-MM-DD format"
      );
    }

    this.initFormValidation();

    return isValid;
  }

  /**
   * @param {string} inputSelector
   * @param {string} message
   */
  createErrorMessage(inputSelector, message) {
    const inputElement = document.querySelector(inputSelector);
    if (!inputElement) return;

    inputElement.classList.add("input-error");

    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.style.color = "red";
    errorElement.style.fontSize = "12px";
    errorElement.style.marginTop = "4px";
    errorElement.textContent = message;

    inputElement.parentNode.insertBefore(
      errorElement,
      inputElement.nextSibling
    );
  }

  /**
   @returns {void}
   */
  initEventListeners() {
    this.storeView.storeListContainer.addEventListener("click", (event) => {
      const storeItem = event.target.closest(".store-item");
      if (storeItem) {
        const storeId = storeItem.dataset.storeId;
        this.onStoreSelect(storeId);
      }
    });

    this.storeView.searchButton.addEventListener("click", () => {
      const searchTerm = this.storeView.searchInput.value.toLowerCase();
      this.searchStores(searchTerm);
    });

    this.storeView.cancelSearchButton.addEventListener("click", () => {
      this.storeView.searchInput.value = "";
      this.initStores();
    });

    this.storeView.createStoreButton.addEventListener("click", () => {
      this.storeView.showCreateStoreForm();
    });

    this.storeView.cancelFormButton.addEventListener("click", () => {
      this.storeView.hideCreateStoreForm();
    });

    this.storeView.createFormButton.addEventListener("click", async (event) => {
      event.preventDefault();

      const formData = this.storeView.getStoreFormData();

      document.querySelectorAll(".input-error").forEach((input) => {
        input.classList.remove("input-error");
      });

      if (!this.validateStoreForm(formData)) {
        if (!formData.name) {
          document
            .querySelector('input[placeholder="Enter name"]')
            .classList.add("input-error");
        }
        if (!formData.email) {
          document
            .querySelector('input[placeholder="Enter email"]')
            .classList.add("input-error");
        }
        if (!formData.phoneNumber) {
          document
            .querySelector('input[placeholder="Enter phone number"]')
            .classList.add("input-error");
        }
        if (!formData.address) {
          document
            .querySelector('input[placeholder="Enter address"]')
            .classList.add("input-error");
        }
        if (!formData.established) {
          document
            .querySelector('input[name="established"]')
            .classList.add("input-error");
        }
        if (!formData.floorArea) {
          document
            .querySelector('input[placeholder="Enter floor area (in sq m)"]')
            .classList.add("input-error");
        }

        return false;
      }

      const success = await this.createStore(formData);

      if (success) {
        this.storeView.hideCreateStoreForm();
      }

      return false;
    });

    this.storeView.deleteStoreButton.addEventListener("click", () => {
      this.storeView.showDeleteStoreConfirmation();
    });

    this.storeView.cancelStoreDelete.addEventListener("click", () => {
      this.storeView.hideDeleteStoreConfirmation();
    });

    this.storeView.confirmStoreDelete.addEventListener("click", () => {
      this.storeView.hideDeleteStoreConfirmation();
      const storeId = this.storeModel.currentStore?.ID;
      if (storeId) {
        this.deleteStore(storeId);
      }
    });
  }
}
