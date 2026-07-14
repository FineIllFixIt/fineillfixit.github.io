/**
 * main.js
 * -------
 * Builds the header + sidebar on every page from PROJECTS (nav-data.js),
 * so you only maintain the nav in one place.
 *
 * Each page just needs:
 *   <body data-page="project-1.html">   (use "index.html" for the home page)
 *   <div id="site-header"></div>
 *   <div id="site-sidebar"></div>
 *
 * No frameworks, no build step, no fetch() of partials — this all works
 * fine opened directly as a file too, and on any static host.
 */
(function () {
  const currentPage = document.body.getAttribute("data-page") || "index.html";

  // ---- Header ----
  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="Home">
        <img src="img/logo.png" width="28" height="28">
        <span class="brand-word">FINE I'LL FIX IT</span>
      </a>
      <button class="nav-toggle" id="nav-toggle" aria-label="Toggle project menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    `;
  }

  // ---- Sidebar ----
  const sidebar = document.getElementById("site-sidebar");
  if (sidebar) {
    const homeItem = `
      <li>
        <a href="index.html" class="${currentPage === "index.html" ? "active" : ""}">
          <span class="idx">00</span><span class="label">Home</span>
        </a>
      </li>`;

    const projectItems = PROJECTS.map((p, i) => {
      const num = String(i + 1).padStart(2, "0");
      const isActive = currentPage === p.file;
      return `
        <li>
          <a href="${p.file}" class="${isActive ? "active" : ""}">
            <span class="idx">${num}</span><span class="label">${p.title}</span>
          </a>
        </li>`;
    }).join("");

    sidebar.innerHTML = `
      <div class="sidebar-label">Index</div>
      <ul class="nav-list">
        ${homeItem}
        ${projectItems}
      </ul>
    `;
  }

  // ---- Mobile toggle ----
  const toggle = document.getElementById("nav-toggle");
  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    sidebar.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        sidebar.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
