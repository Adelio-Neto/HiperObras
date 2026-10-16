// ===== MENU =====
const navbar = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const links = document.querySelectorAll(".nav-link");
const SCROLL_THRESHOLD = 30;

// ===== UTILITY FUNCTIONS =====
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===== NAVBAR SCROLL COM ANIMAÇÃO =====
let isNavbarVisible = false;
let lastScrollY = window.scrollY;

function handleScroll() {
  const currentScrollY = window.scrollY;
  const heroHeight =
    document.getElementById("hero")?.offsetHeight || window.innerHeight;

  // Verifica se passou do hero (com uma margem de 50px)
  const passedHero = currentScrollY > heroHeight - 50;

  // Mostra o navbar com animação quando passa do hero
  if (passedHero) {
    navbar.classList.add("scrolled", "visible");
    navbar.classList.remove("hidden");
    isNavbarVisible = true;
  } else {
    navbar.classList.remove("scrolled");
    navbar.classList.add("hidden");
    navbar.classList.remove("visible");
    isNavbarVisible = false;
  }

  // Efeito de sombra adicional baseado no scroll
  if (currentScrollY > SCROLL_THRESHOLD) {
    navbar.classList.add("shadow");
  } else {
    navbar.classList.remove("shadow");
  }

  lastScrollY = currentScrollY;
}

// Aplicar throttle para evitar chamadas excessivas
const throttledHandleScroll = throttle(handleScroll, 50);
window.addEventListener("scroll", throttledHandleScroll, { passive: true });

// ===== SIDEBAR TOGGLE =====
function openSidebar() {
  sidebar.classList.add("open");
  sidebar.setAttribute("aria-hidden", "false");
  menuToggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
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

// ===== SCROLL SPY OTIMIZADO =====
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

// Aplicar throttle para limitar as chamadas (100ms)
const throttledSetActiveLink = throttle(setActiveLink, 100);
window.addEventListener("scroll", throttledSetActiveLink, { passive: true });

// ===== INIT =====
// Inicializa o navbar escondido
navbar.classList.add("hidden");
handleScroll();
setActiveLink();
