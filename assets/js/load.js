window.addEventListener("load", () => {
  const preloader = document.querySelector("#page-preloader");

  if (!preloader) {
    return;
  }

  setTimeout(() => {
    preloader.classList.add("preloader-hidden");

    preloader.addEventListener(
      "transitionend",
      () => {
        preloader.remove();
      },
      { once: true },
    );
  }, 1000);
});
