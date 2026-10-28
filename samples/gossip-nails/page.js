const photo = document.querySelector("#service-photo");
const buttons = [...document.querySelectorAll(".services button")];

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    buttons.forEach((item) => item.classList.toggle("is-on", item === button));
    photo.src = button.dataset.photo;
    photo.alt = button.dataset.alt;
  });
});
