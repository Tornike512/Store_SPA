/**
 @class
 */
class ProductView {
  /**
   @constructor
   */
  constructor() {
    this.listedItems = document.querySelector(".listed-items");
    this.statsValue = document.querySelector(".stat-value");
    this.listedItemsLoader = document.querySelector(".listed-items-loader");

    this.okButton = document.getElementById("ok");
    this.warningButton = document.getElementById("warning");
    this.errorButton = document.getElementById("error");

    this.nameHeader = document.querySelector("#name");
    this.priceHeader = document.querySelector("#price");
    this.specsHeader = document.querySelector("#specs");
    this.supplierInfoHeader = document.querySelector("#supplier-info");
    this.countryHeader = document.querySelector("#country");
    this.companyHeader = document.querySelector("#company");
    this.ratingHeader = document.querySelector("#rating");

    this.searchProductsInput = document.querySelector(".products-search-input");
    this.searchProductsButton = document.querySelector(
      ".product-search-button"
    );

    this.startCreateProductButton = document.querySelector(
      ".actions-main-add-button"
    );
    this.addProductModalBackground = document.querySelector(
      ".add-product-modal-background"
    );
    this.cancelProductButton = document.querySelector(
      ".add-product-button.add-product-button-cancel"
    );
    this.createProductButton = document.querySelector(
      ".add-product-button.add-product-button-create"
    );
    this.productForm = document.querySelector(".add-product-form");

    this.deleteProductPopup = document.querySelector(".remove-product-popup");
    this.confirmProductDelete = document.querySelector(
      "button.dialog-button.primary"
    );
    this.cancelProductDelete = document.querySelector(
      "button.dialog-button:not(.primary)"
    );

    this.editProductPopup = document.querySelector(".edit-product-background");
    this.cancelProductEditButton = document.querySelector(".btn-secondary");
    this.editButtonForm = document.querySelector("#edit-product-form");

    this.createProductName = document.querySelector(".add-product-input");

    this.errorContainer = document.createElement("div");
    this.errorContainer.className = "validation-errors";
    this.errorContainer.style.color = "red";
    this.errorContainer.style.marginBottom = "10px";

    if (this.productForm) {
      this.productForm.insertBefore(
        this.errorContainer.cloneNode(true),
        this.productForm.firstChild
      );
    }
    if (this.editButtonForm) {
      this.editButtonForm.insertBefore(
        this.errorContainer.cloneNode(true),
        this.editButtonForm.firstChild
      );
    }

    this.initSortIndicators();
    this.initValidation();
  }

  /**
   * @returns {void}
   */
  initValidation() {
    const addProductFields = [
      "add-product-name",
      "add-product-price",
      "add-product-rating",
    ];

    const editProductFields = ["edit-name", "edit-price", "edit-rating"];

    addProductFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener("blur", () => this.validateField(field));
      }
    });

    editProductFields.forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener("blur", () => this.validateField(field));
      }
    });

    if (this.createProductButton) {
      this.createProductButton.addEventListener("click", (e) => {
        if (!this.validateAddProductForm()) {
          e.preventDefault();
        }
      });
    }

    if (this.editButtonForm) {
      this.editButtonForm.addEventListener("submit", (e) => {
        if (!this.validateEditProductForm()) {
          e.preventDefault();
        }
      });
    }
  }

  /**
   * @param {HTMLElement} field
   * @returns {boolean}
   */
  validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    field.classList.remove("field-error");
    field.classList.remove("input-error");

    if (fieldId.includes("name") && value === "") {
      isValid = false;
      errorMessage = "Product name is required";
    } else if (fieldId.includes("price")) {
      if (value === "") {
        isValid = false;
        errorMessage = "Price is required";
      } else if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
        isValid = false;
        errorMessage = "Price must be a positive number";
      }
    } else if (fieldId.includes("rating")) {
      if (
        value !== "" &&
        (isNaN(parseFloat(value)) ||
          parseFloat(value) < 1 ||
          parseFloat(value) > 5)
      ) {
        isValid = false;
        errorMessage = "Rating must be a number between 1 and 5";
      }
    }

    if (!isValid) {
      field.classList.add("field-error");
      field.classList.add("input-error");

      let errorSpan = field.nextElementSibling;
      if (!errorSpan || !errorSpan.classList.contains("error-message")) {
        errorSpan = document.createElement("span");
        errorSpan.classList.add("error-message");
        errorSpan.style.color = "red";
        errorSpan.style.fontSize = "12px";
        errorSpan.style.display = "block";
        field.parentNode.insertBefore(errorSpan, field.nextSibling);
      }

      errorSpan.textContent = errorMessage;
    } else {
      const errorSpan = field.nextElementSibling;
      if (errorSpan && errorSpan.classList.contains("error-message")) {
        errorSpan.textContent = "";
      }
    }

    return isValid;
  }

  /**
   * @param {string} fieldId
   * @returns {void}
   */
  markFieldAsInvalid(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add("input-error");

      if (
        !field.nextElementSibling ||
        !field.nextElementSibling.classList.contains("error-message")
      ) {
        field.setAttribute("aria-invalid", "true");
      }
    }
  }

  /**
   * @returns {boolean}
   */
  validateAddProductForm() {
    const formData = this.getAddProductFormData();
    const errors = [];
    let isValid = true;

    this.clearValidationErrors(this.productForm);

    if (!formData.name) {
      this.markFieldAsInvalid("add-product-name");
      isValid = false;
    }

    if (!formData.price) {
      this.markFieldAsInvalid("add-product-price");
      isValid = false;
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      errors.push("Price must be a positive number");
      this.markFieldAsInvalid("add-product-price");
      isValid = false;
    }

    if (
      formData.rating &&
      (isNaN(parseFloat(formData.rating)) ||
        parseFloat(formData.rating) < 1 ||
        parseFloat(formData.rating) > 5)
    ) {
      errors.push("Rating must be a number between 1 and 5");
      this.markFieldAsInvalid("add-product-rating");
      isValid = false;
    }

    if (!isValid) {
      this.showValidationErrors(this.productForm, errors);
    }

    return isValid;
  }

  /**
   * @returns {boolean}
   */
  validateEditProductForm() {
    const formData = this.getEditProductFormData();
    let isValid = true;

    this.clearValidationErrors(this.editButtonForm);

    if (!formData.name) {
      this.addErrorMessageToField("edit-name", "Name is required");
      isValid = false;
    }

    if (!formData.price) {
      this.addErrorMessageToField("edit-price", "Price is required");
      isValid = false;
    } else if (
      isNaN(parseFloat(formData.price)) ||
      parseFloat(formData.price) <= 0
    ) {
      this.addErrorMessageToField(
        "edit-price",
        "Price must be a positive number"
      );
      isValid = false;
    }

    if (
      formData.rating &&
      (isNaN(parseFloat(formData.rating)) ||
        parseFloat(formData.rating) < 1 ||
        parseFloat(formData.rating) > 5)
    ) {
      this.addErrorMessageToField(
        "edit-rating",
        "Rating must be a number between 1 and 5"
      );
      isValid = false;
    }

    if (!formData.specs) {
      this.addErrorMessageToField("edit-specs", "Specifications are required");
      isValid = false;
    }

    if (!formData.supplierInfo) {
      this.addErrorMessageToField(
        "edit-supplier-info",
        "Supplier information is required"
      );
      isValid = false;
    }

    if (!formData.madeIn) {
      this.addErrorMessageToField("edit-country", "Country is required");
      isValid = false;
    }

    if (!formData.company) {
      this.addErrorMessageToField("edit-company", "Company name is required");
      isValid = false;
    }

    return isValid;
  }

  /**
   * @param {HTMLElement} form
   * @param {Array<string>} errors
   * @returns {void}
   */
  showValidationErrors(form, errors) {
    if (!form) return;

    const errorContainer = form.querySelector(".validation-errors");
    if (errorContainer) {
      errorContainer.innerHTML = "";

      if (errors.length > 0) {
        const errorList = document.createElement("ul");
        errorList.style.paddingLeft = "20px";
        errorList.style.margin = "5px 0";

        errors.forEach((error) => {
          const errorItem = document.createElement("li");
          errorItem.textContent = error;
          errorList.appendChild(errorItem);
        });

        errorContainer.appendChild(errorList);
      }
    }
  }

  /**
   * @param {HTMLElement} form
   * @returns {void}
   */
  clearValidationErrors(form) {
    if (!form) return;

    const errorContainer = form.querySelector(".validation-errors");
    if (errorContainer) {
      errorContainer.innerHTML = "";
    }

    const errorFields = form.querySelectorAll(".field-error, .input-error");
    errorFields.forEach((field) => {
      field.classList.remove("field-error");
      field.classList.remove("input-error");
    });

    const errorMessages = form.querySelectorAll(".error-message");
    errorMessages.forEach((message) => {
      message.textContent = "";
    });
  }
  /**
   * @param {string} fieldId
   * @param {string} errorMessage
   * @returns {void}
   */
  addErrorMessageToField(fieldId, errorMessage) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.classList.add("input-error");

      let errorSpan = field.nextElementSibling;
      if (!errorSpan || !errorSpan.classList.contains("error-message")) {
        errorSpan = document.createElement("span");
        errorSpan.classList.add("error-message");
        errorSpan.style.color = "red";
        errorSpan.style.fontSize = "12px";
        errorSpan.style.display = "block";
        field.parentNode.insertBefore(errorSpan, field.nextSibling);
      }

      errorSpan.textContent = errorMessage;
    }
  }

  /**
   @param {Array} products
   @returns {void}
   */
  renderProducts(products) {
    this.listedItems.innerHTML = "";
    products.forEach((product) => {
      const tr = this.createProductRow(product);
      this.listedItems.appendChild(tr);
    });
    this.updateCount(products.length);
  }

  /**
   @param {Object} product
   @returns {HTMLTableRowElement}
   */
  createProductRow(product) {
    const tr = document.createElement("tr");
    tr.dataset.productId = product.ID;

    const td1 = document.createElement("td");
    const bold1 = document.createElement("b");
    bold1.textContent = product.Name;
    td1.appendChild(bold1);
    td1.appendChild(document.createElement("br"));
    td1.appendChild(document.createTextNode("1"));

    const td2 = document.createElement("td");
    const bold2 = document.createElement("b");
    bold2.textContent = product.Price;
    td2.appendChild(bold2);
    td2.appendChild(
      document.createTextNode(
        `${product.Price_amount} ${product.Price_currency}`
      )
    );

    const td3 = document.createElement("td");
    td3.textContent = product.Specs;

    const td4 = document.createElement("td");
    td4.textContent = product.SupplierInfo;

    const td5 = document.createElement("td");
    td5.textContent = product.MadeIn;

    const td6 = document.createElement("td");
    td6.textContent = product.ProductionCompanyName;

    const td7 = document.createElement("td");
    td7.className = "rating-wrapper";
    td7.appendChild(this.createStarRatingImage(product.Rating));

    const editProduct = document.createElement("img");
    editProduct.src = "./images/edit-icon.png";
    editProduct.alt = "edit icon";
    editProduct.classList.add("edit-button");
    editProduct.dataset.productId = product.ID;
    td7.appendChild(editProduct);

    const removeProductButton = document.createElement("img");
    removeProductButton.src = "./images/cancel-search-icon.png";
    removeProductButton.alt = "Right arrow icon";
    removeProductButton.classList = "remove-button";
    removeProductButton.dataset.productId = product.ID;
    td7.appendChild(removeProductButton);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);

    return tr;
  }

  /**
   @param {number} rating 
   @returns {HTMLImageElement}
   */
  createStarRatingImage(rating) {
    const imgElement = document.createElement("img");
    if (rating >= 1 && rating <= 5) {
      const textRating = ["one", "two", "three", "four", "five"][
        Math.floor(rating) - 1
      ];
      imgElement.src = `./images/${textRating}-star-rating.png`;
      imgElement.alt = `${textRating} star rating`;
    } else {
      imgElement.src = "./images/no-rating.png";
      imgElement.alt = "No rating available";
    }
    return imgElement;
  }

  /**
   @param {number} count 
   @returns {void}
   */
  updateCount(count) {
    this.statsValue.textContent = count + " All";
  }

  /**
   @param {string} status 
   @returns {void}
   */
  updateStatusButtonStyles(status) {
    this.okButton.style.backgroundColor = "#e8f5e9";
    let buttonImage = this.okButton.querySelector("img");
    if (buttonImage) {
      buttonImage.src = "./images/tick-icon.png";
      buttonImage.style.width = "50px";
      buttonImage.style.paddingLeft = "5px";
    }

    this.warningButton.style.backgroundColor = "#fff8e1";
    buttonImage = this.warningButton.querySelector("img");
    if (buttonImage) {
      buttonImage.src = "./images/warning-icon.png";
    }

    this.errorButton.style.backgroundColor = "#ffebee";
    buttonImage = this.errorButton.querySelector("img");
    if (buttonImage) {
      buttonImage.src = "./images/error-icon.png";
      buttonImage.style.width = "40px";
      buttonImage.style.marginLeft = "3px";
    }

    if (status === "ok") {
      this.okButton.style.backgroundColor = "#71bb40";
      buttonImage = this.okButton.querySelector("img");
      if (buttonImage) {
        buttonImage.src = "./images/white-tick-icon.png";
        buttonImage.style.width = "24px";
        buttonImage.style.padding = "0";
      }
    } else if (status === "warning") {
      this.warningButton.style.backgroundColor = "#ef6b01";
      buttonImage = this.warningButton.querySelector("img");
      if (buttonImage) {
        buttonImage.src = "./images/white-warning-icon.png";
      }
    } else if (status === "error") {
      this.errorButton.style.backgroundColor = "#e1564c";
      buttonImage = this.errorButton.querySelector("img");
      if (buttonImage) {
        buttonImage.src = "./images/white-error-icon.png";
        buttonImage.style.width = "114px";
        buttonImage.style.marginLeft = "0";
      }
    }
  }

  /**
   @param {string} currentHeader 
   @param {string} currentSortDirection 
   @returns {void}
   */
  updateSortIndicators(currentHeader, currentSortDirection) {
    const headers = [
      { id: "name", element: this.nameHeader },
      { id: "price", element: this.priceHeader },
      { id: "specs", element: this.specsHeader },
      { id: "supplier-info", element: this.supplierInfoHeader },
      { id: "country", element: this.countryHeader },
      { id: "company", element: this.companyHeader },
      { id: "rating", element: this.ratingHeader },
    ];

    headers.forEach((header) => {
      const indicator = header.element.querySelector(".sort-indicator");
      if (header.id === currentHeader) {
        indicator.textContent = currentSortDirection === "asc" ? " ▲" : " ▼";
      } else {
        indicator.textContent = "";
      }
    });
  }

  /**
   @returns {void}
   */
  initSortIndicators() {
    const headers = [
      this.nameHeader,
      this.priceHeader,
      this.specsHeader,
      this.supplierInfoHeader,
      this.countryHeader,
      this.companyHeader,
      this.ratingHeader,
    ];

    headers.forEach((header) => {
      const sortIndicator = document.createElement("span");
      sortIndicator.className = "sort-indicator";
      sortIndicator.textContent = "";
      header.appendChild(sortIndicator);
    });
  }

  /**
   @returns {void}
   */
  showAddProductForm() {
    this.addProductModalBackground.style.display = "flex";
    if (this.productForm) {
      this.clearValidationErrors(this.productForm);
    }
  }

  /**
   @returns {void}
   */
  hideAddProductForm() {
    this.addProductModalBackground.style.display = "none";
    this.productForm.reset();

    if (this.productForm) {
      this.clearValidationErrors(this.productForm);
    }
  }

  /**
   @param {Object} product 
   @returns {void}
   */
  showEditProductForm(product) {
    document.getElementById("edit-name").value = product.Name || "";
    document.getElementById("edit-price").value = product.Price_amount || "";
    document.getElementById("edit-specs").value = product.Specs || "";
    document.getElementById("edit-rating").value = product.Rating || "";
    document.getElementById("edit-supplier-info").value =
      product.SupplierInfo || "";
    document.getElementById("edit-country").value = product.MadeIn || "";
    document.getElementById("edit-company").value =
      product.ProductionCompanyName || "";
    document.getElementById("edit-status").value = product.Status || "OK";

    if (this.editButtonForm) {
      this.clearValidationErrors(this.editButtonForm);
    }

    this.editProductPopup.classList = "show-edit-product-background";
  }

  /**
   @returns {void}
   */
  hideEditProductForm() {
    this.editProductPopup.classList.add("hide-edit-product-background");

    if (this.editButtonForm) {
      this.clearValidationErrors(this.editButtonForm);
    }
  }

  /**
   @returns {void}
   */
  showDeleteProductConfirmation() {
    this.deleteProductPopup.classList = "show-delete-product-popup";
  }

  /**
   @returns {void}
   */
  hideDeleteProductConfirmation() {
    this.deleteProductPopup.classList = "remove-product-popup";
  }

  /**
   @returns {Object} 
   */
  getAddProductFormData() {
    return {
      name: document.getElementById("add-product-name").value.trim(),
      price: document.getElementById("add-product-price").value.trim(),
      specs: document.getElementById("add-product-house-made").value.trim(),
      rating: document.getElementById("add-product-rating").value.trim(),
      supplierInfo: document
        .getElementById("add-product-supplier-info")
        .value.trim(),
      madeIn: document.getElementById("add-product-made-in").value.trim(),
      company: document.getElementById("add-product-production").value.trim(),
      status: document.getElementById("add-product-status").value,
    };
  }

  /**
   @returns {Object}
   */
  getEditProductFormData() {
    return {
      name: document.getElementById("edit-name").value.trim(),
      price: document.getElementById("edit-price").value.trim(),
      specs: document.getElementById("edit-specs").value.trim(),
      rating: document.getElementById("edit-rating").value.trim(),
      supplierInfo: document.getElementById("edit-supplier-info").value.trim(),
      madeIn: document.getElementById("edit-country").value.trim(),
      company: document.getElementById("edit-company").value.trim(),
      status: document.getElementById("edit-status").value,
    };
  }

  /**
   @returns {string}
   */
  getSearchTerm() {
    return this.searchProductsInput.value.trim();
  }

  /**
   @returns {void}
   */
  showLoader() {
    this.listedItemsLoader.classList.add("listed-items-loader");
  }

  /**
   @returns {void}
   */
  hideLoader() {
    this.listedItemsLoader.classList.remove("listed-items-loader");
  }
}
