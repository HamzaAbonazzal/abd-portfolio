(function () {
  try {
    var theme = localStorage.getItem("theme");
    if (!theme) {
      theme = "dark";
    }
    document.documentElement.classList.add(theme);
    document.documentElement.style.colorScheme = theme;
  } catch (e) {}
})();
