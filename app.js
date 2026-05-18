const defaultProjectIdeas = [
  {
    title: "Line Follower Robot",
    description: "Chassis, sensors, motor driver, code, and calibration guide."
  },
  {
    title: "IoT Weather Station",
    description: "DHT sensor, OLED display, ESP8266, web dashboard, and enclosure plan."
  },
  {
    title: "RFID Attendance System",
    description: "RFID module, LCD, buzzer, Google Sheet logging, and support video."
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
        products: parsedData.products?.length ? parsedData.products : defaultData.products || [],
        projectIdeas: parsedData.projectIdeas?.length
          ? parsedData.projectIdeas
          : defaultData.projectIdeas || defaultProjectIdeas
      };
    }
  } catch (error) {
    console.warn("Could not load saved admin preview data.", error);
  }
  return defaultData;
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

let activeFilter = "all";
let cart = [];

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
}

function renderProjectIdeas() {
  const ideas = storeData.projectIdeas?.length ? storeData.projectIdeas : defaultProjectIdeas;
  projectList.innerHTML = ideas
    .map(
      (idea, index) => `
        <article>
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${idea.title}</h3>
          <p>${idea.description}</p>
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
        <article class="product-card">
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

function sendEnquiry(type) {
  const whatsappNumber = storeData.whatsappNumber || "919999999999";
  const email = storeData.email || "orders@example.com";
  const message = buildEnquiryMessage();

  if (type === "whatsapp") {
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  } else {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(
      "Website enquiry"
    )}&body=${encodeURIComponent(message)}`;
  }
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
  const button = event.target.closest("[data-product-id]");
  if (button) addToCart(Number(button.dataset.productId));
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
sendWhatsappEnquiry.addEventListener("click", () => sendEnquiry("whatsapp"));
sendEmailEnquiry.addEventListener("click", () => sendEnquiry("email"));

featureButton.addEventListener("click", () => {
  const productId = storeData.featuredProject?.productId || 1;
  addToCart(productId);
});

applyStoreContent();
renderProjectIdeas();
renderProducts();
renderCart();
