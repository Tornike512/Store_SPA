/**
 @class
 */
class StoreView {
  /**
   @constructor
   */
  constructor() {
    this.storeListContainer = document.querySelector(".store-list");
    this.searchInput = document.querySelector(".search-input");
    this.searchButton = document.querySelector(".search-button");
    this.cancelSearchButton = document.querySelector(".cancel-button");
    this.reloadSearchButton = document.querySelector(".retry-button");
    this.createStoreButton = document.querySelector(".sidebar-create-button");
    this.sidebar = document.querySelector(".sidebar");
    this.sidebarLoader = document.querySelector(".loader");

    this.storeDetails = document.querySelector(".store-details");
    this.wrongUrlContainer = document.querySelector(".wrong-url");
    this.storeNotFoundContainer = document.querySelector(".store-not-found");
    this.mainContent = document.querySelector(".main-content");
    this.deleteStoreButton = document.querySelector(".delete-button");
    this.deleteStorePopup = document.querySelector(".remove-store-popup");
    this.confirmStoreDelete = document.querySelector(".remove-store-button");
    this.cancelStoreDelete = document.querySelector(
      ".remove-store-button:not(.primary)"
    );

    this.modalBackground = document.querySelector(".modal-background");
    this.addForm = document.querySelector("#add-form");
    this.cancelFormButton = document.querySelector("button.btn.btn-default");
    this.createFormButton = document.querySelector("button.btn.btn-primary");
  }

  /**
   @param {Array} stores 
   @returns {void}
   */
  renderStoreList(stores) {
    this.storeListContainer.innerHTML = "";

    if (!stores || !Array.isArray(stores)) {
      console.warn("No stores data available or invalid format");
      return;
    }

    stores.forEach((store) => {
      const storeElement = this.createStoreElement(store);
      this.storeListContainer.appendChild(storeElement);
    });
  }

  /**
   @param {Object} store
   @returns {HTMLLIElement} 
   */
  createStoreElement(store) {
    const listItem = document.createElement("li");
    listItem.className = "store-item";
    listItem.dataset.storeId = store.ID;

    const article = document.createElement("article");

    const header = document.createElement("header");
    const storeName = document.createElement("h3");
    storeName.className = "store-name";
    storeName.textContent = store.Name;

    const storeLocation = document.createElement("p");
    storeLocation.className = "store-location";
    storeLocation.textContent = store.Address;

    header.appendChild(storeName);
    header.appendChild(storeLocation);

    const footer = document.createElement("footer");
    const storeId = document.createElement("p");
    storeId.className = "store-id";
    storeId.textContent = store.FloorArea;

    const storeDistance = document.createElement("p");
    storeDistance.className = "store-distance";
    storeDistance.textContent = "sq.m";

    footer.appendChild(storeId);
    footer.appendChild(storeDistance);

    article.appendChild(header);
    article.appendChild(footer);
    listItem.appendChild(article);

    return listItem;
  }

  /**
   @param {Object} store 
   @returns {void}
   */
  renderStoreDetails(store) {
    this.storeDetails.innerHTML = "";

    const article = document.createElement("article");
    article.className = "user-info-wrapper";

    const contactSection = document.createElement("section");

    const emailPara = document.createElement("p");
    const emailBold = document.createElement("b");
    emailBold.textContent = "Email: ";
    emailPara.appendChild(emailBold);
    emailPara.appendChild(document.createTextNode(store.Email));

    const phonePara = document.createElement("p");
    const phoneBold = document.createElement("b");
    phoneBold.textContent = "Phone Number: ";
    phonePara.appendChild(phoneBold);
    phonePara.appendChild(document.createTextNode(store.PhoneNumber));

    const addressPara = document.createElement("p");
    const addressBold = document.createElement("b");
    addressBold.textContent = "Address: ";
    addressPara.appendChild(addressBold);
    addressPara.appendChild(document.createTextNode(store.Address));

    contactSection.appendChild(emailPara);
    contactSection.appendChild(phonePara);
    contactSection.appendChild(addressPara);

    const propertySection = document.createElement("section");

    const datePara = document.createElement("p");
    const dateBold = document.createElement("b");
    dateBold.textContent = "Established Date: ";
    datePara.appendChild(dateBold);
    datePara.appendChild(document.createTextNode(store.Established));

    const areaPara = document.createElement("p");
    const areaBold = document.createElement("b");
    areaBold.textContent = "Floor Area: ";
    areaPara.appendChild(areaBold);
    areaPara.appendChild(document.createTextNode(store.FloorArea));

    propertySection.appendChild(datePara);
    propertySection.appendChild(areaPara);

    article.appendChild(contactSection);
    article.appendChild(propertySection);

    this.storeDetails.appendChild(article);
  }

  /**
   @returns {void}
   */
  showStoreNotFound() {
    this.storeNotFoundContainer.style.display = "block";
    this.storeDetails.innerHTML = "";
  }

  /**
   @returns {void}
   */
  showCreateStoreForm() {
    this.modalBackground.style.display = "flex";
  }

  /**
   @returns {void}
   */
  hideCreateStoreForm() {
    this.modalBackground.style.display = "none";
    this.addForm.reset();
  }

  /**
   @returns {void}
   */
  showDeleteStoreConfirmation() {
    this.deleteStorePopup.classList = "show-remove-store-popup";
  }

  /**
   @returns {void}
   */
  hideDeleteStoreConfirmation() {
    this.deleteStorePopup.classList = "remove-store-popup";
  }

  /**
   @returns {Object} 
   */
  getStoreFormData() {
    const name = document.querySelector(
      'input[placeholder="Enter name"]'
    ).value;
    const email = document.querySelector(
      'input[placeholder="Enter email"]'
    ).value;
    const phoneNumber = document.querySelector(
      'input[placeholder="Enter phone number"]'
    ).value;
    const address = document.querySelector(
      'input[placeholder="Enter address"]'
    ).value;
    const established = document.getElementById("established").value;
    const floorArea = document.querySelector(
      'input[placeholder="Enter floor area (in sq m)"]'
    ).value;

    return { name, email, phoneNumber, address, established, floorArea };
  }

  /**
   @returns {void}
   */
  showLoader() {
    this.sidebarLoader.classList.add("show-loader");
  }

  /**
   @returns {void}
   */
  hideLoader() {
    this.sidebarLoader.classList.remove("show-loader");
  }
}
