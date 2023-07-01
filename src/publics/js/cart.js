let cart = document.getElementById("cart");
let cartId = cart.dataset._id;
let cartTotalItems = cart.dataset.totalitems;
let removeItemBtns = document.getElementsByClassName("removeItemBtn");
let sendOrderBtn = document.getElementById("sendOrderBtn");
let closeModalBtn = document.getElementById("closeModalBtn");

const updatingOrder = (status) => {
  if (status) {
    sendOrderBtn.classList.add("disabled");
    for (let i = 0; i < removeItemBtns.length; i++) {
      removeItemBtns[i].classList.add("disabled");
    }
  } else {
    sendOrderBtn.classList.remove("disabled");
    for (let i = 0; i < removeItemBtns.length; i++) {
      removeItemBtns[i].classList.remove("disabled");
    }
  }
};

const showModal = (title, body) => {
  const modal = new bootstrap.Modal("#staticBackdrop");
  const modalTitle = document.getElementById("staticBackdropLabel");
  const modalBody = document.getElementById("staticBackdropBody");
  modalTitle.innerText = title;
  modalBody.innerText = body;
  modal.show();
};

if (cartTotalItems <= 0) {
  location.replace("/products");
}

for (let i = 0; i < removeItemBtns.length; i++) {
  removeItemBtns[i].addEventListener("click", async (event) => {
    try {
      event.preventDefault();
      updatingOrder(true);
      let productId = event.target.dataset._id;
      let url = `/api/carts/${cartId}/product/${productId}`;
      let res = await fetch(url, {
        method: "delete",
      });
      if (res.status === 200) {
        location.reload();
      } else {
        showModal(
          "Error",
          "No se pudo actualizar el pedido. Por favor, vuelva a intentarlo."
        );
        updatingOrder(false);
      }
    } catch (error) {
      console.log(error);
      showModal(
        "Error",
        "No se pudo actualizar el pedido. Por favor, vuelva a intentarlo."
      );
      updatingOrder(false);
    }
  });
}

sendOrderBtn.addEventListener("click", async (event) => {
  try {
    event.preventDefault();
    updatingOrder(true);
    let url = sendOrderBtn.dataset.href;
    let res = await fetch(url, { method: "POST" });
    let jsonRes = await res.json();
    if (res.status === 201) {
      closeModalBtn.dataset["bsDismiss"] = null;
      showModal(
        "Pedido enviado!",
        `Código de pedido: ${jsonRes.result}`,
      );
      updatingOrder(false);
    } else {
      showModal(
        "Error",
        "No se pudo enviar el pedido. Por favor, vuelva a intentarlo."
      );
      updatingOrder(false);
    }
  } catch (error) {
    console.log(error);
    showModal(
      "Error",
      "No se pudo enviar el pedido. Por favor, vuelva a intentarlo."
    );
    updatingOrder(false);
  }
});