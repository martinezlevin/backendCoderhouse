let formLogin = document.getElementById("formLogin");
const modal = new bootstrap.Modal("#staticBackdrop");

const submittingForm = (status) => {
  let btnSubmit = document.getElementById("btnSubmit");
  let btnSubmitText = document.getElementById("btnSubmitText");
  let btnSubmitSpinner = document.getElementById("btnSubmitSpinner");
  if (status) {
    btnSubmit.disabled = true;
    btnSubmitText.innerText = "Ingresando...";
    btnSubmitSpinner.classList.remove("visually-hidden");
  } else {
    btnSubmit.disabled = false;
    btnSubmitText.innerText = "Ingresar";
    btnSubmitSpinner.classList.add("visually-hidden");
  }
};

Array.from(formLogin.elements).forEach((element) => {
  if (element.type !== "submit") {
    element.addEventListener("change", (event) => {
      event.target.value = event.target.value.trim();
    });
  }
});

formLogin.addEventListener(
  "submit",
  async (event) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      formLogin.classList.add("was-validated");
      if (formLogin.checkValidity()) {
        submittingForm(true);
        let formData = new URLSearchParams(new FormData(event.target));
        let res = await fetch("/api/sessions/login", {
          method: "POST",
          body: formData,
        });
        formLogin.reset();
        formLogin.classList.remove("was-validated");
        submittingForm(false);
        if (res.status !== 200) {
          modal.show();
        } else {
          window.location.replace("/products");
        };
      }
    } catch (error) {
      window.location.replace("/error");
    }
  },
  false
);