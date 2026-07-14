document.addEventListener('DOMContentLoaded', () => {
  const year = new Date().getFullYear();
  const footer = document.querySelector('footer');

  if (footer) {
    footer.textContent = `© ${year} Riley — Photography`;
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      document.documentElement.style.scrollBehavior = 'smooth';
    });
  });
});
