const defaultProjectIdeas = [
  {
    title: "Line Follower Robot",
    description: "Chassis, sensors, motor driver, code, and calibration guide.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80",
    images: [],
    videoUrl: "",
    longDescription: "Complete robotics project idea with parts planning, wiring approach, code support, and tuning guidance.",
    specs: ["IR sensor based tracking", "Motor driver control", "Student project friendly"]
  },
  {
    title: "IoT Weather Station",
    description: "DHT sensor, OLED display, ESP8266, web dashboard, and enclosure plan.",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=900&q=80",
    images: [],
    videoUrl: "",
    longDescription: "IoT weather station project with local display, cloud dashboard option, and sensor reading workflow.",
    specs: ["ESP8266/ESP32 compatible", "Temperature and humidity display", "Dashboard option"]
  },
  {
    title: "RFID Attendance System",
    description: "RFID module, LCD, buzzer, Google Sheet logging, and support video.",
    image: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=900&q=80",
    images: [],
    videoUrl: "",
    longDescription: "RFID attendance project concept for schools and colleges with card scanning, display, and logging support.",
    specs: ["RFID card scan", "LCD/buzzer feedback", "Attendance logging idea"]
  }
];

function getStoreData() {
  const defaultData = window.STORE_DATA || {};
  try {
    const savedData = localStorage.getItem("STORE_DATA_OVERRIDE");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return {
        ...defaultData,
        ...parsedData,
        featuredProject: {
          ...(defaultData.featuredProject || {}),
          ...(parsedData.featuredProject || {})
        },
        products: mergeProducts(defaultData.products || [], parsedData.products || []),
        projectIdeas: mergeProjects(defaultData.projectIdeas || defaultProjectIdeas, parsedData.projectIdeas || [])
      };
    }
  } catch (error) {
    console.warn("Could not load saved admin preview data.", error);
  }
  return defaultData;
}

function mergeProducts(defaultProducts, savedProducts) {
  if (!savedProducts.length) return defaultProducts;
  return savedProducts.map((product) => {
    const defaultProduct = defaultProducts.find((item) => item.id === product.id) || {};
    return {
      ...defaultProduct,
      ...product,
      images: product.images?.length ? product.images : defaultProduct.images || [],
      longDescription: product.longDescription || defaultProduct.longDescription || product.description || "",
      specs: product.specs?.length ? product.specs : defaultProduct.specs || []
    };
  });
}

function mergeProjects(defaultProjects, savedProjects) {
  if (!savedProjects.length) return defaultProjects;
  return savedProjects.map((project, index) => {
    const defaultProject = defaultProjects[index] || {};
    return {
      ...defaultProject,
      ...project,
      image: project.image || defaultProject.image || "",
      images: project.images?.length ? project.images : defaultProject.images || [],
      videoUrl: project.videoUrl || defaultProject.videoUrl || "",
      longDescription: project.longDescription || defaultProject.longDescription || project.description || "",
      specs: project.specs?.length ? project.specs : defaultProject.specs || []
    };
  });
}

const storeData = getStoreData();
const products = storeData.products || [];

const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const filterTabs = document.querySelectorAll("[data-filter]");
const cartDrawer = document.querySelector("#cartDrawer");
const cartButton = document.querySelector("#cartButton");
const closeCart = document.querySelector("#closeCart");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const cartCount = document.querySelector("#cartCount");
const featureButton = document.querySelector("[data-add-feature]");
const projectList = document.querySelector("#projectList");
const sendWhatsappEnquiry = document.querySelector("#sendWhatsappEnquiry");
const sendEmailEnquiry = document.querySelector("#sendEmailEnquiry");
const checkoutWhatsapp = document.querySelector("#checkoutWhatsapp");
const videoModal = document.querySelector("#videoModal");
const videoFrame = document.querySelector("#videoFrame");
const closeVideo = document.querySelector("#closeVideo");
const productDetail = document.querySelector("#productDetail");
const backToProducts = document.querySelector("#backToProducts");
const detailImage = document.querySelector("#detailImage");
const detailVideoBox = document.querySelector("#detailVideoBox");
const detailFullDescriptionBox = document.querySelector("#detailFullDescriptionBox");
const detailFullDescription = document.querySelector("#detailFullDescription");
const detailSpecsBox = document.querySelector("#detailSpecsBox");
const detailSpecs = document.querySelector("#detailSpecs");
const detailTag = document.querySelector("#detailTag");
const detailName = document.querySelector("#detailName");
const detailDescription = document.querySelector("#detailDescription");
const detailPrice = document.querySelector("#detailPrice");
const detailRating = document.querySelector("#detailRating");
const detailAddCart = document.querySelector("#detailAddCart");
const detailBuyWhatsapp = document.querySelector("#detailBuyWhatsapp");
const enquiryFields = ["#enquiryName", "#enquiryProduct", "#enquiryMessage"].map((selector) =>
  document.querySelector(selector)
);

let activeFilter = "all";
let cart = [];
let selectedProductId = null;

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.textContent = value;
  });
}

function setHref(selector, value) {
  document.querySelectorAll(selector).forEach((element) => {
    element.href = value;
  });
}

function applyStoreContent() {
  const brandName = storeData.brandName || "ElectroBuild";
  const brandSubtitle = storeData.brandSubtitle || "Projects & Kits";
  const logoUrl = storeData.logoUrl || "";
  const whatsappNumber = storeData.whatsappNumber || "919999999999";
  const phoneDisplay = storeData.phoneDisplay || `+${whatsappNumber}`;
  const email = storeData.email || "orders@example.com";
  const youtubeUrl = storeData.youtubeUrl || "https://www.youtube.com/";
  const featuredProject = storeData.featuredProject || {};

  document.title = `${brandName} Store | Electronics Projects, ESP Kits & Learning`;
  setText("[data-brand-name]", brandName);
  setText("[data-brand-subtitle]", brandSubtitle);
  document.querySelectorAll("[data-brand-mark]").forEach((element) => {
    element.textContent = brandName.charAt(0) || "E";
    element.classList.toggle("has-logo", Boolean(logoUrl));
    element.style.backgroundImage = logoUrl ? `url("${logoUrl}")` : "";
  });
  setText("[data-feature-title]", featuredProject.title || "Smart Home Automation with ESP32");
  setText(
    "[data-feature-description]",
    featuredProject.description ||
      "A complete electronics project package with wiring, code, and tutorial support."
  );
  setText("[data-email-link]", email);
  setText("[data-phone-link]", phoneDisplay);
  setHref("[data-youtube-link]", youtubeUrl);
  setHref("[data-whatsapp-link]", `https://wa.me/${whatsappNumber}`);
  setHref("[data-email-link]", `mailto:${email}`);
  setHref("[data-phone-link]", `tel:+${whatsappNumber}`);
  setHref(
    "[data-custom-whatsapp]",
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      "Hello, I need a custom electronics project. Please share details, price, and delivery time."
    )}`
  );
  setHref(
    "[data-custom-email]",
    `mailto:${email}?subject=${encodeURIComponent("Custom electronics project request")}&body=${encodeURIComponent(
      "Hello, I need a custom electronics project. Please share details, price, and delivery time."
    )}`
  );
}

function renderProjectIdeas() {
  const ideas = storeData.projectIdeas?.length ? storeData.projectIdeas : defaultProjectIdeas;
  projectList.innerHTML = ideas
    .map(
      (idea, index) => `
        <article data-open-project="${index}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${idea.title}</h3>
          <p>${idea.description}</p>
          <button class="details-btn" type="button" data-open-project="${index}">View Details</button>
        </article>
      `
    )
    .join("");
}

function rupees(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function visibleProducts() {
  const query = searchInput.value.trim().toLowerCase();
  return products.filter((product) => {
    const matchesFilter = activeFilter === "all" || product.category === activeFilter;
    const matchesQuery = [product.name, product.category, product.description]
      .join(" ")
      .toLowerCase()
      .includes(query);
    return matchesFilter && matchesQuery;
  });
}

function renderProducts() {
  const items = visibleProducts();
  productGrid.innerHTML = items
    .map(
      (product) => `
        <article class="product-card" data-open-product="${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-body">
            <div class="product-meta">
              <span class="badge">${product.tag}</span>
              <span class="rating">Star ${product.rating}</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="price-row">
              <span class="price">${rupees(product.price)}</span>
              <button class="details-btn" type="button" data-open-product="${product.id}">Details</button>
              <button class="add-btn" type="button" data-product-id="${product.id}">Add</button>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  if (items.length === 0) {
    productGrid.innerHTML = `<p class="empty-state">No products found. Try another search.</p>`;
  }
}

function renderVideoButton(videoUrl) {
  if (!videoUrl) return "";
  return `<button class="video-link" type="button" data-video-url="${videoUrl}">Watch Video</button>`;
}

function getVideoEmbedUrl(videoUrl) {
  try {
    const url = new URL(videoUrl);
    let videoId = "";
    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.replace("/", "");
    }
    if (url.hostname.includes("youtube.com")) {
      videoId = url.searchParams.get("v") || url.pathname.split("/").pop();
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0`;
    }
  } catch (error) {
    return "";
  }
  return videoUrl;
}

function openVideo(videoUrl) {
  videoFrame.src = getVideoEmbedUrl(videoUrl);
  videoModal.classList.add("is-open");
  videoModal.setAttribute("aria-hidden", "false");
}

function closeVideoModal() {
  videoFrame.src = "";
  videoModal.classList.remove("is-open");
  videoModal.setAttribute("aria-hidden", "true");
}

function buildSingleProductMessage(product) {
  return [
    "Hello, I want to buy this product from your website.",
    "",
    `Product: ${product.name}`,
    `Price: ${rupees(product.price)}`,
    `Category: ${product.category}`,
    "",
    "Please share availability, delivery charge, payment method, and delivery time."
  ].join("\n");
}

function renderDetailVideo(product) {
  if (product.videoUrl) {
    detailVideoBox.innerHTML = `
      <iframe
        src="${getVideoEmbedUrl(product.videoUrl)}"
        title="${product.name} video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      ></iframe>
    `;
    return;
  }

  detailVideoBox.innerHTML = `
    <div class="video-placeholder">
      Add a YouTube video link for this product in admin to show autoplay video here.
    </div>
  `;
}

function productImages(product) {
  return [product.image, ...(product.images || [])].filter(Boolean);
}

function projectImages(project) {
  return [project.image, ...(project.images || [])].filter(Boolean);
}

function renderDetailImages(product) {
  const images = productImages(product);
  detailImage.src = images[0] || "";
  detailImage.alt = product.name;

  const oldThumbs = document.querySelector(".detail-thumbs");
  if (oldThumbs) oldThumbs.remove();
  if (images.length < 2) return;

  const thumbs = document.createElement("div");
  thumbs.className = "detail-thumbs";
  thumbs.innerHTML = images
    .map(
      (image, index) => `
        <button class="${index === 0 ? "is-active" : ""}" type="button" data-detail-image="${image}">
          <img src="${image}" alt="${product.name} image ${index + 1}">
        </button>
      `
    )
    .join("");
  detailImage.insertAdjacentElement("afterend", thumbs);
  thumbs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-detail-image]");
    if (!button) return;
    detailImage.src = button.dataset.detailImage;
    thumbs.querySelectorAll("button").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
  });
}

function renderDetailSections(product) {
  const fullDescription = product.longDescription || product.description || "";
  const specs = product.specs || [];
  detailFullDescription.textContent = fullDescription;
  detailFullDescriptionBox.hidden = !fullDescription;
  detailSpecs.innerHTML = specs.map((spec) => `<li>${spec}</li>`).join("");
  detailSpecsBox.hidden = specs.length === 0;
}

function openProductDetail(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  selectedProductId = productId;

  renderDetailImages(product);
  detailTag.textContent = product.tag || product.category;
  detailName.textContent = product.name;
  detailDescription.textContent = product.description;
  detailPrice.textContent = rupees(product.price);
  detailRating.textContent = `Star ${product.rating || "4.8"}`;
  detailBuyWhatsapp.href = `https://wa.me/${storeData.whatsappNumber || "919999999999"}?text=${encodeURIComponent(
    buildSingleProductMessage(product)
  )}`;
  renderDetailVideo(product);
  renderDetailSections(product);

  productDetail.hidden = false;
  productDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildProjectMessage(project) {
  return [
    "Hello, I want details for this electronics project.",
    "",
    `Project: ${project.title}`,
    project.description ? `Short details: ${project.description}` : "",
    "",
    "Please share kit price, included parts, delivery charge, payment method, and completion time."
  ]
    .filter(Boolean)
    .join("\n");
}

function openProjectDetail(projectIndex) {
  const project = (storeData.projectIdeas?.length ? storeData.projectIdeas : defaultProjectIdeas)[projectIndex];
  if (!project) return;
  selectedProductId = null;

  const detailProject = {
    id: 0,
    name: project.title,
    tag: `Project ${String(projectIndex + 1).padStart(2, "0")}`,
    category: "project",
    price: 0,
    rating: "Custom",
    image: project.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    images: project.images || [],
    videoUrl: project.videoUrl || "",
    description: project.description || "",
    longDescription: project.longDescription || project.description || "",
    specs: project.specs || []
  };

  renderDetailImages(detailProject);
  detailTag.textContent = detailProject.tag;
  detailName.textContent = detailProject.name;
  detailDescription.textContent = detailProject.description;
  detailPrice.textContent = "Custom Quote";
  detailRating.textContent = "Project kit / custom build";
  detailBuyWhatsapp.href = `https://wa.me/${storeData.whatsappNumber || "919999999999"}?text=${encodeURIComponent(
    buildProjectMessage(project)
  )}`;
  detailBuyWhatsapp.textContent = "Request on WhatsApp";
  detailAddCart.hidden = true;
  renderDetailVideo(detailProject);
  renderDetailSections(detailProject);

  productDetail.hidden = false;
  productDetail.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeProductDetail() {
  selectedProductId = null;
  detailVideoBox.innerHTML = "";
  detailAddCart.hidden = false;
  detailBuyWhatsapp.textContent = "Buy on WhatsApp";
  productDetail.hidden = true;
  document.querySelector("#products").scrollIntoView({ behavior: "smooth", block: "start" });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;
  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  renderCart();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function renderCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartCount.textContent = totalItems;
  cartTotal.textContent = rupees(totalPrice);
  updateCheckoutLink();

  cartItems.innerHTML =
    cart.length === 0
      ? `<p>Your cart is empty.</p>`
      : cart
          .map(
            (item) => `
              <article class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                  <h3>${item.name}</h3>
                  <p>${item.quantity} x ${rupees(item.price)}</p>
                </div>
                <button type="button" data-remove-id="${item.id}">Remove</button>
              </article>
            `
          )
          .join("");
}

function buildCheckoutMessage() {
  if (cart.length === 0) {
    return "Hello, I want to buy from your electronics project store. Please share product details and prices.";
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const lines = cart.map(
    (item, index) =>
      `${index + 1}. ${item.name}\nQty: ${item.quantity}\nPrice: ${rupees(item.price)}\nSubtotal: ${rupees(
        item.price * item.quantity
      )}`
  );

  return [
    "Hello, I want to place this order from your website.",
    "",
    ...lines,
    "",
    `Total: ${rupees(totalPrice)}`,
    "",
    "Please confirm availability, delivery charge, payment method, and delivery time."
  ].join("\n");
}

function updateCheckoutLink() {
  const whatsappNumber = storeData.whatsappNumber || "919999999999";
  checkoutWhatsapp.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildCheckoutMessage())}`;
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCartDrawer() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

function buildEnquiryMessage() {
  const name = document.querySelector("#enquiryName").value.trim();
  const product = document.querySelector("#enquiryProduct").value.trim();
  const message = document.querySelector("#enquiryMessage").value.trim();
  return [
    "New website enquiry",
    name ? `Name: ${name}` : "",
    product ? `Product/Project: ${product}` : "",
    message ? `Message: ${message}` : ""
  ]
    .filter(Boolean)
    .join("\n");
}

function updateEnquiryLinks() {
  const whatsappNumber = storeData.whatsappNumber || "919999999999";
  const email = storeData.email || "orders@example.com";
  const message = buildEnquiryMessage();

  sendWhatsappEnquiry.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  sendEmailEnquiry.href = `mailto:${email}?subject=${encodeURIComponent("Website enquiry")}&body=${encodeURIComponent(
    message
  )}`;
}

filterTabs.forEach((button) => {
  button.addEventListener("click", () => {
    filterTabs.forEach((tab) => tab.classList.remove("is-active"));
    button.classList.add("is-active");
    activeFilter = button.dataset.filter;
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

productGrid.addEventListener("click", (event) => {
  const videoButton = event.target.closest("[data-video-url]");
  if (videoButton) {
    openVideo(videoButton.dataset.videoUrl);
    return;
  }
  const button = event.target.closest("[data-product-id]");
  if (button) {
    event.stopPropagation();
    addToCart(Number(button.dataset.productId));
    return;
  }
  const openTarget = event.target.closest("[data-open-product]");
  if (openTarget) openProductDetail(Number(openTarget.dataset.openProduct));
});

projectList.addEventListener("click", (event) => {
  const videoButton = event.target.closest("[data-video-url]");
  if (videoButton) {
    openVideo(videoButton.dataset.videoUrl);
    return;
  }
  const openTarget = event.target.closest("[data-open-project]");
  if (openTarget) openProjectDetail(Number(openTarget.dataset.openProject));
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-id]");
  if (button) removeFromCart(Number(button.dataset.removeId));
});

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);
cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCartDrawer();
});
closeVideo.addEventListener("click", closeVideoModal);
videoModal.addEventListener("click", (event) => {
  if (event.target === videoModal) closeVideoModal();
});
backToProducts.addEventListener("click", closeProductDetail);
detailAddCart.addEventListener("click", () => {
  if (selectedProductId) addToCart(selectedProductId);
});
enquiryFields.forEach((field) => field.addEventListener("input", updateEnquiryLinks));
sendWhatsappEnquiry.addEventListener("click", updateEnquiryLinks);
sendEmailEnquiry.addEventListener("click", updateEnquiryLinks);

featureButton.addEventListener("click", () => {
  const productId = storeData.featuredProject?.productId || 1;
  addToCart(productId);
});

applyStoreContent();
renderProjectIdeas();
renderProducts();
renderCart();
updateEnquiryLinks();
