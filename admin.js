const storageKey = "STORE_DATA_OVERRIDE";
const githubSettingsKey = "GITHUB_PUBLISH_SETTINGS";
const productEditor = document.querySelector("#productEditor");
const projectEditor = document.querySelector("#projectEditor");
const toast = document.querySelector("#toast");

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

let data = loadData();
let githubSettings = loadGithubSettings();

function loadData() {
  const defaultData = structuredClone(window.STORE_DATA || {});
  try {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      return {
        ...defaultData,
        ...JSON.parse(savedData),
        featuredProject: {
          ...(defaultData.featuredProject || {}),
          ...(JSON.parse(savedData).featuredProject || {})
        },
        products: mergeProducts(defaultData.products || [], JSON.parse(savedData).products || []),
        projectIdeas: mergeProjects(defaultData.projectIdeas || defaultProjectIdeas, JSON.parse(savedData).projectIdeas || [])
      };
    }
  } catch (error) {
    console.warn("Saved admin data could not be loaded.", error);
  }
  return {
    ...defaultData,
    products: defaultData.products || [],
    projectIdeas: defaultData.projectIdeas?.length ? defaultData.projectIdeas : defaultProjectIdeas
  };
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

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 3000);
}

function inputValue(id) {
  return document.querySelector(`#${id}`).value.trim();
}

function setInput(id, value) {
  document.querySelector(`#${id}`).value = value ?? "";
}

function fillForm() {
  setInput("brandName", data.brandName);
  setInput("brandSubtitle", data.brandSubtitle);
  setInput("logoUrl", data.logoUrl);
  setInput("whatsappNumber", data.whatsappNumber);
  setInput("phoneDisplay", data.phoneDisplay);
  setInput("email", data.email);
  setInput("youtubeUrl", data.youtubeUrl);
  setInput("featureTitle", data.featuredProject?.title);
  setInput("featureProductId", data.featuredProject?.productId);
  setInput("featureDescription", data.featuredProject?.description);
  setInput("githubOwner", githubSettings.owner);
  setInput("githubRepo", githubSettings.repo);
  setInput("githubBranch", githubSettings.branch || "main");
  setInput("githubPath", githubSettings.path || "content.js");
  setInput("githubToken", githubSettings.token);
  renderProducts();
  renderProjects();
}

function loadGithubSettings() {
  try {
    const savedSettings = localStorage.getItem(githubSettingsKey);
    if (savedSettings) return JSON.parse(savedSettings);
  } catch (error) {
    console.warn("Saved GitHub settings could not be loaded.", error);
  }
  return {
    owner: "ktech4",
    repo: "electrobuild-store",
    branch: "main",
    path: "content.js",
    token: ""
  };
}

function collectGithubSettings() {
  githubSettings = {
    owner: inputValue("githubOwner"),
    repo: inputValue("githubRepo"),
    branch: inputValue("githubBranch") || "main",
    path: inputValue("githubPath") || "content.js",
    token: inputValue("githubToken")
  };
  localStorage.setItem(githubSettingsKey, JSON.stringify(githubSettings));
}

function collectForm() {
  data.brandName = inputValue("brandName");
  data.brandSubtitle = inputValue("brandSubtitle");
  data.logoUrl = inputValue("logoUrl");
  data.whatsappNumber = inputValue("whatsappNumber").replace(/[^\d]/g, "");
  data.phoneDisplay = inputValue("phoneDisplay");
  data.email = inputValue("email");
  data.youtubeUrl = inputValue("youtubeUrl");
  data.featuredProject = {
    title: inputValue("featureTitle"),
    description: inputValue("featureDescription"),
    productId: Number(inputValue("featureProductId")) || 1
  };
  collectProducts();
  collectProjects();
}

function renderProducts() {
  productEditor.innerHTML = data.products
    .map(
      (product, index) => `
        <article class="product-card" data-product-index="${index}">
          <h3>Product ${index + 1}: ${escapeHtml(product.name || "New Product")}</h3>
          <label>
            Product ID
            <input data-field="id" type="number" min="1" value="${product.id ?? index + 1}">
          </label>
          <label>
            Name
            <input data-field="name" type="text" value="${escapeAttribute(product.name)}">
          </label>
          <label>
            Category
            <select data-field="category">
              ${option("kit", product.category, "Kit")}
              ${option("module", product.category, "Module")}
              ${option("project", product.category, "Project")}
            </select>
          </label>
          <label>
            Price
            <input data-field="price" type="number" min="0" value="${product.price ?? 0}">
          </label>
          <label>
            Rating
            <input data-field="rating" type="text" value="${escapeAttribute(product.rating)}">
          </label>
          <label>
            Tag
            <input data-field="tag" type="text" value="${escapeAttribute(product.tag)}">
          </label>
          <label class="wide">
            Image Link
            <input data-field="image" type="url" value="${escapeAttribute(product.image)}">
          </label>
          <label class="wide">
            More Image Links
            <textarea data-field="images" placeholder="Add 4 to 6 product image links, one per line">${escapeHtml((product.images || []).join("\n"))}</textarea>
          </label>
          <label class="wide">
            YouTube Video Link
            <input data-field="videoUrl" type="url" value="${escapeAttribute(product.videoUrl)}">
          </label>
          <label class="wide">
            Short Description
            <textarea data-field="description">${escapeHtml(product.description)}</textarea>
          </label>
          <label class="wide">
            Full Product Description
            <textarea data-field="longDescription" placeholder="Long professional details for the product page">${escapeHtml(product.longDescription)}</textarea>
          </label>
          <label class="wide">
            Specifications
            <textarea data-field="specs" placeholder="One specification per line">${escapeHtml((product.specs || []).join("\n"))}</textarea>
          </label>
          <div class="product-actions">
            <button type="button" data-action="up">Move Up</button>
            <button type="button" data-action="down">Move Down</button>
            <button class="danger" type="button" data-action="remove">Remove</button>
          </div>
        </article>
      `
    )
    .join("");
}

function option(value, selectedValue, label) {
  const selected = value === selectedValue ? "selected" : "";
  return `<option value="${value}" ${selected}>${label}</option>`;
}

function collectProducts() {
  data.products = Array.from(document.querySelectorAll("[data-product-index]")).map((card, index) => ({
    id: Number(card.querySelector('[data-field="id"]').value) || index + 1,
    name: card.querySelector('[data-field="name"]').value.trim(),
    category: card.querySelector('[data-field="category"]').value,
    price: Number(card.querySelector('[data-field="price"]').value) || 0,
    rating: card.querySelector('[data-field="rating"]').value.trim(),
    tag: card.querySelector('[data-field="tag"]').value.trim(),
    image: card.querySelector('[data-field="image"]').value.trim(),
    images: linesFromTextarea(card.querySelector('[data-field="images"]').value),
    videoUrl: card.querySelector('[data-field="videoUrl"]').value.trim(),
    description: card.querySelector('[data-field="description"]').value.trim(),
    longDescription: card.querySelector('[data-field="longDescription"]').value.trim(),
    specs: linesFromTextarea(card.querySelector('[data-field="specs"]').value)
  }));
}

function linesFromTextarea(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function renderProjects() {
  data.projectIdeas = data.projectIdeas || [];
  projectEditor.innerHTML = data.projectIdeas
    .map(
      (project, index) => `
        <article class="product-card" data-project-index="${index}">
          <h3>Project ${index + 1}: ${escapeHtml(project.title || "New Project")}</h3>
          <label class="wide">
            Project Title
            <input data-field="title" type="text" value="${escapeAttribute(project.title)}">
          </label>
          <label class="wide">
            Project Description
            <textarea data-field="description">${escapeHtml(project.description)}</textarea>
          </label>
          <label class="wide">
            Main Project Image Link
            <input data-field="image" type="url" value="${escapeAttribute(project.image)}">
          </label>
          <label class="wide">
            More Project Image Links
            <textarea data-field="images" placeholder="Add 4 to 6 project image links, one per line">${escapeHtml((project.images || []).join("\n"))}</textarea>
          </label>
          <label class="wide">
            YouTube Video Link
            <input data-field="videoUrl" type="url" value="${escapeAttribute(project.videoUrl)}">
          </label>
          <label class="wide">
            Full Project Details
            <textarea data-field="longDescription" placeholder="Full professional project details">${escapeHtml(project.longDescription)}</textarea>
          </label>
          <label class="wide">
            Parts / Specifications
            <textarea data-field="specs" placeholder="One part or specification per line">${escapeHtml((project.specs || []).join("\n"))}</textarea>
          </label>
          <div class="product-actions">
            <button type="button" data-project-action="up">Move Up</button>
            <button type="button" data-project-action="down">Move Down</button>
            <button class="danger" type="button" data-project-action="remove">Remove</button>
          </div>
        </article>
      `
    )
    .join("");
}

function collectProjects() {
  data.projectIdeas = Array.from(document.querySelectorAll("[data-project-index]")).map((card) => ({
    title: card.querySelector('[data-field="title"]').value.trim(),
    description: card.querySelector('[data-field="description"]').value.trim(),
    image: card.querySelector('[data-field="image"]').value.trim(),
    images: linesFromTextarea(card.querySelector('[data-field="images"]').value),
    videoUrl: card.querySelector('[data-field="videoUrl"]').value.trim(),
    longDescription: card.querySelector('[data-field="longDescription"]').value.trim(),
    specs: linesFromTextarea(card.querySelector('[data-field="specs"]').value)
  }));
}

function addProduct() {
  collectForm();
  const nextId = Math.max(0, ...data.products.map((product) => Number(product.id) || 0)) + 1;
  data.products.push({
    id: nextId,
    name: "New Product",
    category: "kit",
    price: 0,
    rating: "4.8",
    tag: "New",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    images: [],
    videoUrl: "",
    description: "Write product details here.",
    longDescription: "Add full product details, included parts, use cases, and delivery notes.",
    specs: ["Tested before shipping", "Video support available"]
  });
  renderProducts();
  showToast("Product added.");
}

function addProject() {
  collectForm();
  data.projectIdeas = data.projectIdeas || [];
  data.projectIdeas.push({
    title: "New Project Idea",
    description: "Write project details here.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    images: [],
    videoUrl: "",
    longDescription: "Add full project details, working explanation, included parts, code support, and delivery notes.",
    specs: ["Parts list available", "Video support available", "Custom build option"]
  });
  renderProjects();
  showToast("Project added.");
}

function moveProduct(index, direction) {
  collectForm();
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= data.products.length) return;
  const [product] = data.products.splice(index, 1);
  data.products.splice(targetIndex, 0, product);
  renderProducts();
}

function removeProduct(index) {
  collectForm();
  data.products.splice(index, 1);
  renderProducts();
  showToast("Product removed.");
}

function moveProject(index, direction) {
  collectForm();
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= data.projectIdeas.length) return;
  const [project] = data.projectIdeas.splice(index, 1);
  data.projectIdeas.splice(targetIndex, 0, project);
  renderProjects();
}

function removeProject(index) {
  collectForm();
  data.projectIdeas.splice(index, 1);
  renderProjects();
  showToast("Project removed.");
}

function savePreview() {
  collectForm();
  localStorage.setItem(storageKey, JSON.stringify(data));
  showToast("Preview saved. Open the website in this browser to see changes.");
}

function exportContentFile() {
  collectForm();
  const fileText = buildContentFile();
  const blob = new Blob([fileText], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "content.js";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("content.js downloaded. Upload it to GitHub to update the live site.");
}

function buildContentFile() {
  return `// Website content generated from admin.html.\nwindow.STORE_DATA = ${JSON.stringify(data, null, 2)};\n`;
}

function toBase64Unicode(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

async function publishToGithub() {
  collectForm();
  collectGithubSettings();

  const { owner, repo, branch, path, token } = githubSettings;
  if (!owner || !repo || !branch || !path || !token) {
    showToast("Fill GitHub username, repo, branch, file path, and token first.");
    return;
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28"
  };

  try {
    showToast("Publishing to GitHub...");
    const currentFileResponse = await fetch(`${apiUrl}?ref=${encodeURIComponent(branch)}`, { headers });
    const currentFile = currentFileResponse.ok ? await currentFileResponse.json() : {};

    if (!currentFileResponse.ok && currentFileResponse.status !== 404) {
      throw new Error(currentFile.message || "Could not read existing file from GitHub.");
    }

    const updateResponse = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: "Update website content from admin page",
        content: toBase64Unicode(buildContentFile()),
        branch,
        sha: currentFile.sha
      })
    });
    const updateResult = await updateResponse.json();

    if (!updateResponse.ok) {
      throw new Error(updateResult.message || "GitHub update failed.");
    }

    localStorage.setItem(storageKey, JSON.stringify(data));
    showToast("Published to GitHub. GitHub Pages updates in 1-3 minutes.");
  } catch (error) {
    showToast(`Publish failed: ${error.message}`);
  }
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value = "") {
  return escapeHtml(value);
}

document.querySelector("#addProductButton").addEventListener("click", addProduct);
document.querySelector("#addProjectButton").addEventListener("click", addProject);
document.querySelector("#previewButton").addEventListener("click", savePreview);
document.querySelector("#exportButton").addEventListener("click", exportContentFile);
document.querySelector("#publishButton").addEventListener("click", publishToGithub);

productEditor.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const card = button.closest("[data-product-index]");
  const index = Number(card.dataset.productIndex);
  const action = button.dataset.action;

  if (action === "up") moveProduct(index, -1);
  if (action === "down") moveProduct(index, 1);
  if (action === "remove") removeProduct(index);
});

projectEditor.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project-action]");
  if (!button) return;
  const card = button.closest("[data-project-index]");
  const index = Number(card.dataset.projectIndex);
  const action = button.dataset.projectAction;

  if (action === "up") moveProject(index, -1);
  if (action === "down") moveProject(index, 1);
  if (action === "remove") removeProject(index);
});

fillForm();
