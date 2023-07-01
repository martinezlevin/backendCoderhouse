const getUserData = async () => {
  try {
    let res = await fetch("/api/sessions/current");
    let user = await res.json();
    sessionStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.log(error);
  }
};

const setFilters = () => {
  let paramsForm = document.getElementById("paramsForm");
  let categorySelect = document.getElementById("categorySelect");
  let statusSelect = document.getElementById("statusSelect");
  let sortSelect = document.getElementById("sortSelect");
  let limitSelect = document.getElementById("limitSelect");
  let pageSelect = document.getElementById("pageSelect");
  let applyFiltersBtn = document.getElementById("applyFiltersBtn");
  let pageSelectorBtns = document.getElementsByClassName("pageSelectorBtn");

  const btnsHrefUpdate = () => {
    categorySelect.value =
      JSON.parse(sessionStorage.getItem("categorySelect")) || "";
    statusSelect.value =
      JSON.parse(sessionStorage.getItem("statusSelect")) || "";
    sortSelect.value = JSON.parse(sessionStorage.getItem("sortSelect")) || "";
    limitSelect.value = JSON.parse(sessionStorage.getItem("limitSelect")) || 10;
    pageSelect.value = JSON.parse(sessionStorage.getItem("pageSelect")) || 1;
    applyFiltersBtn.href = "/products/";

    let params = [];
    categorySelect.value && params.push(["category", categorySelect.value]);
    statusSelect.value && params.push(["status", statusSelect.value]);
    sortSelect.value && params.push(["sort", sortSelect.value]);
    limitSelect.value && params.push(["limit", limitSelect.value]);
    pageSelect.value && params.push(["page", pageSelect.value]);
    if (params.length) {
      for (let i = 0; i < params.length; i++) {
        let nexus = i === 0 ? "?" : "&";
        let key = params[i][0];
        let value = params[i][1];
        applyFiltersBtn.href += `${nexus}${key}=${value}`;
        if (key !== "page") {
          for (let j = 0; j < pageSelectorBtns.length; j++) {
            const element = pageSelectorBtns[j];
            element.href += `&${key}=${value}`;
          }
        }
      }
    }
  };

  for (let i = 0; i < paramsForm.elements.length; i++) {
    paramsForm.elements[i].addEventListener("change", (e) => {
      sessionStorage.setItem(e.target.id, JSON.stringify(e.target.value));
      btnsHrefUpdate();
    });
  }

  for (let i = 0; i < pageSelectorBtns.length; i++) {
    pageSelectorBtns[i].addEventListener("click", (e) => {
      sessionStorage.setItem("page", JSON.stringify(e.target.innerText));
      btnsHrefUpdate();
    });
  }

  btnsHrefUpdate();
};

const setPagination = () => {
  let nextPageAnchor = document.getElementById("next-page-anchor");
  let prevPageAnchor = document.getElementById("prev-page-anchor");

  nextPageAnchor &&
    nextPageAnchor.addEventListener("click", () => {
      let pageInputValue = JSON.parse(sessionStorage.getItem("pageInput")) || 1;
      pageInputValue++;
      sessionStorage.setItem("pageInput", pageInputValue);
    });

  prevPageAnchor &&
    prevPageAnchor.addEventListener("click", () => {
      let pageInputValue = JSON.parse(sessionStorage.getItem("pageInput"));
      pageInputValue--;
      sessionStorage.setItem("pageInput", pageInputValue);
    });
};

const submittingForm = (status) => {
  let btnsSubmit = document.getElementsByClassName("btnSubmit");
  let btnsSubmitTexts = document.getElementsByClassName("btnSubmitText");
  let btnsSubmitSpinners = document.getElementsByClassName("btnSubmitSpinner");
  if (status) {
    for (let i = 0; i < btnsSubmit.length; i++) {
      btnsSubmit[i].disabled = true;
      btnsSubmitTexts[i].innerText = "Actualizando pedido...";
      btnsSubmitSpinners[i].classList.remove("visually-hidden");
    }
  } else {
    for (let i = 0; i < btnsSubmit.length; i++) {
      btnsSubmit[i].disabled = false;
      btnsSubmitTexts[i].innerText = "Agregar al pedido";
      btnsSubmitSpinners[i].classList.add("visually-hidden");
    }
  }
};

const showToast = (body) => {
  const toastBody = document.getElementById("toastBody");
  toastBody.innerText = body;
  const toastLive = document.getElementById("liveToast");
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);
  toastBootstrap.show();
};

const showModal = (title, body) => {
  const modalTitle = document.getElementById("staticBackdropLabel");
  const modalBody = document.getElementById("staticBackdropBody");
  const modal = new bootstrap.Modal("#staticBackdrop");
  modalTitle.innerText = title;
  modalBody.innerText = body;
  modal.show();
};

const enableCartLink = (addedQuantity) => {
  let cartLink = document.getElementById("cartLink");
  let cartLinkBadge = document.getElementById("cartLinkBadge");
  cartLink.classList.remove("disabled");
  cartLinkBadge.innerText = Number(cartLinkBadge.innerText)+Number(addedQuantity);
  cartLinkBadge.classList.remove("visually-hidden");
}

const setAddToCartForms = () => {
  let addToCartForms = document.getElementsByClassName("addToCartForm");
  for (let i = 0; i < addToCartForms.length; i++) {
    let subtractBtn = addToCartForms[i][0];
    let addBtn = addToCartForms[i][2];
    subtractBtn.addEventListener("click", (e) => {
      let qtyInput = subtractBtn.nextElementSibling;
      if (qtyInput.value > 1) qtyInput.value--;
    });
    addBtn.addEventListener("click", (e) => {
      let qtyInput = addBtn.previousElementSibling;
      qtyInput.value++;
    });

    addToCartForms[i].addEventListener("submit", async (e) => {
      try {
        e.preventDefault();
        let user = JSON.parse(sessionStorage.getItem("user"));
        let productOwner = e.target.dataset.owner;
        if (productOwner !== "admin" && productOwner === user._id) {
          showModal(
            "No autorizado",
            "No puedes comprar tus propios productos."
          );
        } else {
          submittingForm(true);
          let productId = e.target.id;
          let quantity = e.target[1].value;
          let url = `/api/carts/${user.cart}/product/${productId}`;
          let data = { qty: quantity };
          let res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          });
          if (res.status === 201) {
            showToast("Producto agregado al carrito");
            enableCartLink(quantity);
          } else {
            showModal(
              "Error",
              "No se pudo agregar el producto al pedido. Por favor, vuelva a intentarlo."
            );
          }
          submittingForm(false);
        }
        e.target.reset();
      } catch (error) {
        console.log(error);
        showModal(
          "Error",
          "No se pudo agregar el producto al pedido. Por favor, vuelva a intentarlo."
        );
      }
    });
  }
};

const init = () => {
  getUserData();
  setFilters();
  setPagination();
  setAddToCartForms();
};

init();