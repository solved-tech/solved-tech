const job = document.querySelector("#job");
const ask = document.querySelector("#ask");
const write = () => {
  const subject = encodeURIComponent(`Garden visit: ${job.value}`);
  ask.href = `mailto:vyasgardeningservice@hotmail.com?subject=${subject}`;
};
job.addEventListener("change", write);
write();
