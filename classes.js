// Online classes section. Reads courses from content.js (window.STORE_DATA.courses).
// Relies on storeData and openVideo() from app.js.
(function () {
  const data = typeof storeData !== "undefined" ? storeData : window.STORE_DATA || {};
  const courses = Array.isArray(data.courses) ? data.courses : [];
  const settings = data.classSettings || {};
  const grid = document.querySelector("#classGrid");
  const tabs = document.querySelector("#classTabs");
  const intro = document.querySelector("#classesIntro");
  const band = document.querySelector("#memberBand");
  const modal = document.querySelector("#courseModal");
  if (!grid || !modal) return;

  let activeCategory = "All";

  const esc = (v = "") =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");
  const wa = (text) => `https://wa.me/${data.whatsappNumber || ""}?text=${encodeURIComponent(text)}`;

  function renderTabs() {
    const cats = ["All", ...new Set(courses.map((c) => c.category).filter(Boolean))];
    tabs.innerHTML = cats
      .map((c) => `<button class="tab ${c === activeCategory ? "is-active" : ""}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`)
      .join("");
  }

  function renderGrid() {
    const list = courses.filter((c) => activeCategory === "All" || c.category === activeCategory);
    if (!list.length) {
      grid.innerHTML = '<p class="empty-state">No classes yet. Add courses in the admin page.</p>';
      return;
    }
    grid.innerHTML = list
      .map(
        (c) => `<article class="product-card class-card" data-course="${esc(c.id)}" tabindex="0" role="button" aria-label="Open ${esc(c.title)}">
          <img src="${esc(c.image)}" alt="" loading="lazy" />
          <div class="class-card-body">
            <span class="badge">${esc(c.level)}</span>
            <h3>${esc(c.title)}</h3>
            <p>${esc(c.description)}</p>
            <small class="class-meta">${esc(c.duration)} · ${(c.lessons || []).length} lessons · Certificate</small>
            <div class="class-card-foot"><strong>${money(c.price)}</strong><span class="text-link">View class</span></div>
          </div>
        </article>`
      )
      .join("");
  }

  function renderBand() {
    const m = Number(settings.membershipMonthly) || 0;
    const y = Number(settings.membershipYearly) || 0;
    const parts = [];
    if (m || y) {
      parts.push(`<div><h3>All-access membership</h3><p>Every course, new projects each week and a doubt group.</p>
        <p class="member-prices">${m ? `<b>${money(m)}</b> / month` : ""}${m && y ? " &nbsp;or&nbsp; " : ""}${y ? `<b>${money(y)}</b> / year` : ""}</p></div>
        <a class="primary-btn" target="_blank" rel="noreferrer" href="${wa("Hi, I want the all-access membership. Please share the details.")}">Join on WhatsApp</a>`);
    }
    if (settings.telegramUrl) {
      parts.push(`<a class="secondary-form-btn" target="_blank" rel="noreferrer" href="${esc(settings.telegramUrl)}">Join free Telegram group</a>`);
    }
    band.innerHTML = parts.join("");
    band.hidden = !parts.length;
  }

  function openCourse(id) {
    const c = courses.find((x) => String(x.id) === String(id));
    if (!c) return;
    document.querySelector("#cmImage").src = c.image || "";
    document.querySelector("#cmCat").textContent = c.category || "Class";
    document.querySelector("#cmTitle").textContent = c.title;
    document.querySelector("#cmDesc").textContent = c.description || "";
    document.querySelector("#cmMeta").textContent = `${c.level} · ${c.duration} · ${(c.lessons || []).length} lessons · Certificate`;
    document.querySelector("#cmPrice").textContent = money(c.price);
    document.querySelector("#cmLessons").innerHTML = (c.lessons || [])
      .map((l) => {
        const free = l.free && l.videoUrl;
        return `<li><span>${esc(l.title)}</span>${
          free
            ? `<button class="video-link" type="button" data-lesson-video="${esc(l.videoUrl)}">Watch free</button>`
            : '<small class="locked">After enrollment</small>'
        }</li>`;
      })
      .join("");
    document.querySelector("#cmWhatsapp").href = wa(`Hi, I want to enroll in "${c.title}" (${money(c.price)}). Please share the payment details.`);
    const upi = document.querySelector("#cmUpi");
    if (settings.upiId) {
      upi.href = `upi://pay?pa=${encodeURIComponent(settings.upiId)}&pn=${encodeURIComponent(data.brandName || "Store")}&am=${Number(c.price) || 0}&cu=INR&tn=${encodeURIComponent(c.title)}`;
      upi.hidden = false;
    } else upi.hidden = true;
    const pay = document.querySelector("#cmPay");
    if (c.payUrl) {
      pay.href = c.payUrl;
      pay.hidden = false;
    } else pay.hidden = true;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeCourse() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  tabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    activeCategory = b.dataset.cat;
    renderTabs();
    renderGrid();
  });
  grid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-course]");
    if (card) openCourse(card.dataset.course);
  });
  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest("[data-course]");
    if (card) {
      e.preventDefault();
      openCourse(card.dataset.course);
    }
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeCourse();
    const v = e.target.closest("[data-lesson-video]");
    if (v && typeof openVideo === "function") openVideo(v.dataset.lessonVideo);
  });
  document.querySelector("#cmClose").addEventListener("click", closeCourse);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeCourse();
  });

  if (intro) intro.textContent = settings.intro || "";
  renderTabs();
  renderGrid();
  renderBand();
})();
