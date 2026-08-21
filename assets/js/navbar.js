// ===== MENU =====
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const links = document.querySelectorAll(".nav-link");
const SCROLL_THRESHOLD = 30;

// ===== NAVBAR SCROLL =====
function handleScroll() {
  if (window.scrollY > SCROLL_THRESHOLD) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}
window.addEventListener("scroll", handleScroll, { passive: true });

// ===== SIDEBAR TOGGLE =====
function openSidebar() {
  sidebar.classList.add("open");
  sidebar.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
  // Previne scroll do body
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebar.setAttribute("aria-hidden", "true");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  document.body.style.overflow = "";
}

menuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  if (sidebar.classList.contains("open")) closeSidebar();
  else openSidebar();
});

sidebarLinks.forEach((link) => {
  link.addEventListener("click", () => closeSidebar());
});

document.addEventListener("click", (e) => {
  if (
    sidebar.classList.contains("open") &&
    !sidebar.contains(e.target) &&
    !menuToggle.contains(e.target)
  ) {
    closeSidebar();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && sidebar.classList.contains("open")) {
    closeSidebar();
  }
});

// ===== SCROLL SPY =====
const sections = document.querySelectorAll("section[id]");

function setActiveLink() {
  const scrollPos = window.scrollY + 150;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    const desktopLink = document.querySelector(`.nav-link[href="#${id}"]`);
    const sidebarLink = document.querySelector(`.sidebar-link[href="#${id}"]`);

    if (scrollPos >= top && scrollPos < top + height) {
      links.forEach((l) => l.classList.remove("active"));
      sidebarLinks.forEach((l) => l.classList.remove("active"));
      if (desktopLink) desktopLink.classList.add("active");
      if (sidebarLink) sidebarLink.classList.add("active");
    }
  });
}
window.addEventListener("scroll", setActiveLink, { passive: true });

// ===== INIT =====
handleScroll();
setActiveLink();
