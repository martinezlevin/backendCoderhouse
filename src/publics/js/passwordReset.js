console.log("passwordReset funciona correctamente");

let passwordResetForm = document.getElementById("passwordResetForm");

passwordResetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let email = e.target[0].value;
  let token = e.target[1].value;
  let newPassword = e.target[2].value;
  let url = "/api/sessions/passwordresetend";
  let data = { email, token, newPassword };
  try {
    let res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    let json = await res.json();
    if (json.status === "success") {
      alert("Contraseña restablecida");
      window.location.href = "http://localhost:8080/login";
    } else {
      switch (json.error) {
        case "Enlace expirado":
          alert("El enlace ha expirado. Vuelva a ingresar su correo electrónico para enviarle un nuevo enlace.");
          window.location.href = "http://localhost:8080/forgotPassword";
          break;
        case "Contraseña igual":
          alert("La nueva contraseña debe ser distinta de la anterior");
          window.location.reload();
          break;
        default:
          alert("Hubo un error. Vuelva a ingresar su correo electrónico para enviarle un nuevo enlace.");
          window.location.href = "http://localhost:8080/forgotPassword";
          break;
      }
    }
  } catch (error) {
    console.log(error);
    alert("Hubo un error. Vuelva a ingresar su correo electrónico para enviarle un nuevo enlace.");
    window.location.href = "http://localhost:8080/forgotPassword";
  }
  e.target.reset();
});