let sendOrderBtn = document.getElementById("sendOrderBtn");

sendOrderBtn.addEventListener("click", async () => {
  let userdata = await fetch("/api/sessions/current");
  let parsedUserData = await userdata.json();
  let user = parsedUserData.result
  let body = JSON.stringify(user);
  let url = sendOrderBtn.dataset.href;

  try {
    let response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    if (response.status === 201) {
      alert("Orden enviada éxitosamente.");
      location.reload();
    } else {
      alert("Error. La orden no fue enviada. Intentarlo nuevamente.");
    }
  } catch (error) {
    console.log(error);
    alert("Error. La orden no fue enviada. Intentarlo nuevamente.");
  }
});