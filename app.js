const products = [
  {
    id: 1,
    name: "ESP32 Smart Home Kit",
    category: "kit",
    price: 1499,
    rating: "4.9",
    tag: "Hot",
    image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80",
    description: "Relay, ESP32, jumper wires, mobile control guide, and code support."
  },
  {
    id: 2,
    name: "Arduino Robot Car Bundle",
    category: "project",
    price: 1899,
    rating: "4.8",
    tag: "Ready",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    description: "Chassis, wheels, L298N driver, sensors, battery holder, and tutorial."
  },
  {
    id: 3,
    name: "ESP8266 IoT Starter Pack",
    category: "kit",
    price: 899,
    rating: "4.7",
    tag: "Value",
    image: "https://images.unsplash.com/photo-1603732551658-5fabbafa84eb?auto=format&fit=crop&w=800&q=80",
    description: "NodeMCU, breadboard, LEDs, resistors, sensors, and cloud dashboard demo."
  },
  {
    id: 4,
    name: "Sensor Module Collection",
    category: "module",
    price: 699,
    rating: "4.6",
    tag: "10 pcs",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    description: "IR, ultrasonic, DHT, soil moisture, LDR, flame, buzzer, and more."
  },
  {
    id: 5,
    name: "RFID Attendance Project",
    category: "project",
    price: 2199,
    rating: "4.8",
    tag: "School",
    image: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=800&q=80",
    description: "RFID reader, cards, LCD, buzzer, code, wiring, and report format."
  },
  {
    id: 6,
    name: "OLED Display Module",
    category: "module",
    price: 249,
    rating: "4.7",
    tag: "I2C",
    image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?auto=format&fit=crop&w=800&q=80",
    description: "Compact OLED screen for ESP, Arduino, weather, clock, and menu projects."
  },
  {
    id: 7,
    name: "Mini Weather Station Kit",
    category: "project",
    price: 1299,
    rating: "4.9",
    tag: "IoT",
    image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80",
    description: "ESP8266, DHT sensor, OLED, code, enclosure suggestion, and dashboard."
  },
  {
    id: 8,
    name: "Relay Control Module 4CH",
    category: "module",
    price: 399,
    rating: "4.5",
    tag: "4CH",
    image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
    description: "For automation projects, fan/light control, pumps, and IoT switching."
  }
];

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
              <span class="rating">★ ${product.rating}</span>
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
                  <p>${item.quantity} × ${rupees(item.price)}</p>
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

featureButton.addEventListener("click", () => addToCart(1));

renderProducts();
renderCart();
