function getStoreData() {
  try {
    const savedData = localStorage.getItem("STORE_DATA_OVERRIDE");
    if (savedData) return JSON.parse(savedData);
  } catch (error) {
    console.warn("Could not load saved admin preview data.", error);
  }
  return window.STORE_DATA || {};
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
  const whatsappNumber = storeData.whatsappNumber || "919999999999";
  const phoneDisplay = storeData.phoneDisplay || `+${whatsappNumber}`;
  const email = storeData.email || "orders@example.com";
  const youtubeUrl = storeData.youtubeUrl || "https://www.youtube.com/";
  const featuredProject = storeData.featuredProject || {};

  document.title = `${brandName} Store | Electronics Projects, ESP Kits & Learning`;
  setText("[data-brand-name]", brandName);
  setText("[data-brand-subtitle]", brandSubtitle);
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

featureButton.addEventListener("click", () => {
  const productId = storeData.featuredProject?.productId || 1;
  addToCart(productId);
});

applyStoreContent();
renderProducts();
renderCart();
