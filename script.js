const proxyBase = "https://proxy-backend-a5jn.onrender.com";
const input = document.getElementById("urlInput");
const button = document.getElementById("goBtn");
const frame = document.getElementById("proxyFrame");

button.addEventListener("click", () => {
  let url = input.value.trim();
  if (!url.startsWith("http")) url = "https://" + url;
  frame.src = `${proxyBase}/?url=${encodeURIComponent(url)}`;
});
