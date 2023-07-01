let formLogup = document.getElementById("formLogup");
let inputRepeatEmail = document.getElementById("inputRepeatEmail");
let inputRepeatPassword = document.getElementById("inputRepeatPassword");
const modal = new bootstrap.Modal("#staticBackdrop");

const submittingForm = (status) => {
  let btnSubmit = document.getElementById("btnSubmit");
  let btnSubmitText = document.getElementById("btnSubmitText");
  let btnSubmitSpinner = document.getElementById("btnSubmitSpinner");
  if (status) {
    btnSubmit.disabled = true;
    btnSubmitText.innerText = "Registrando";
    btnSubmitSpinner.classList.remove("visually-hidden");
  } else {
    btnSubmit.disabled = false;
    btnSubmitText.innerText = "Registrarme";
    btnSubmitSpinner.classList.add("visually-hidden");
  }
};

Array.from(formLogup.elements).forEach((element) => {
  if (element.type !== "submit") {
    element.addEventListener("change", (event) => {
      event.target.value = event.target.value.trim();
      if (event.target.id === "inputEmail") {
        inputRepeatEmail.pattern = event.target.value.trim();
      }
      if (event.target.id === "inputPassword") {
        inputRepeatPassword.pattern = event.target.value.trim();
      }
    });
  }
});

formLogup.addEventListener(
  "submit",
  async (event) => {
    try {
      event.preventDefault();
      event.stopPropagation();
      formLogup.classList.add("was-validated");
      if (formLogup.checkValidity()) {
        submittingForm(true);
        let formData = new URLSearchParams(new FormData(event.target));
        let res = await fetch("/api/sessions/logup", {
          method: "POST",
          body: formData,
        });
        if (res.status !== 201) throw new Error();
        modal.show();
        formLogup.reset();
        formLogup.classList.remove("was-validated");
        submittingForm(false);
      }
    } catch (error) {
      window.location.replace("/error");
    }
  },
  false
);