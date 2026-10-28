const book = document.querySelector("#book");
document.querySelectorAll(".slot").forEach((button) => {
  button.addEventListener("click", () => {
    book.href = `mailto:polishshine1@gmail.com?subject=${encodeURIComponent(button.dataset.slot)}`;
    book.textContent = `Email about ${button.textContent}`;
  });
});
