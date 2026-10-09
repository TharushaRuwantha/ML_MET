// ---------------------------------------------------------------------
// Shared site behaviour: highlights the active page in the nav menu.
// ---------------------------------------------------------------------

function highlightActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.main-nav a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", highlightActiveNavLink);
