/**
 * @class
 */
class AppController {
  /**
   * @constructor
   */
  constructor() {
    this.storeModel = new StoreModel();
    this.productModel = new ProductModel();

    this.storeView = new StoreView();
    this.productView = new ProductView();

    this.storeController = new StoreController(this.storeModel, this.storeView);
    this.productController = new ProductController(
      this.productModel,
      this.productView
    );

    this.init();
  }

  /**
   * @async
   * @returns {Promise<void>}
   */
  async init() {
    this.initUIComponents();

    await this.storeController.initStores();
  }

  /**
   * @returns {void}
   */
  initUIComponents() {
    const sidebar = document.querySelector(".sidebar");
    const dropupButton = document.querySelector(".dropup-button");

    /**
     * @returns {void}
     */
    const handleScroll = () => {
      const pinButton = document.querySelector(".pin-button");
      const hideFromTop = 60;

      if (sidebar.scrollTop > hideFromTop) {
        pinButton.style.display = "none";
        document.querySelector("#dropdown-icon").src =
          "./images/dropup-icon.png";
      } else {
        pinButton.style.display = "block";
        document.querySelector("#dropdown-icon").src =
          "./images/dropdown-icon.png";
      }
    };

    sidebar.addEventListener("scroll", handleScroll);
    handleScroll();

    dropupButton.addEventListener("click", () => {
      sidebar.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/**
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
  const app = new AppController();
});
