const frame = document.querySelector("#place");
document.querySelectorAll(".menu button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".menu button").forEach((item) => item.classList.toggle("is-on", item === button));
    frame.src = button.dataset.src;
  });
});
