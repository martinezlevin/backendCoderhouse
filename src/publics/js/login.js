const form = document.getElementById("loginForm");
form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const body = { email, password };
  
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      document.location.href = "/products";
    });
});