const getUserData = async () => {
  try {
    let res = await fetch("/api/sessions/current");
    let json = await res.json();
    user = json.result;
    sessionStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.log(error);
  }
}

const setFilters = () => {
  let paramsForm = document.getElementById("paramsForm");
  let categorySelect = document.getElementById("categorySelect");
  let statusSelect = document.getElementById("statusSelect");
  let sortSelect = document.getElementById("sortSelect");
  let limitInput = document.getElementById("limitInput");
  let pageInput = document.getElementById("pageInput");

  const goAnchorHrefUpdate = () => {
    categorySelect.value = JSON.parse(sessionStorage.getItem("categorySelect")) || "";
    statusSelect.value = JSON.parse(sessionStorage.getItem("statusSelect")) || "";
    sortSelect.value = JSON.parse(sessionStorage.getItem("sortSelect")) || "";
    limitInput.value = JSON.parse(sessionStorage.getItem("limitInput")) || 10;
    pageInput.value = JSON.parse(sessionStorage.getItem("pageInput")) || 1;

    let goAnchor = document.getElementById("goAnchor");
    let goHref = "/products";
    let params = [];
    let category = JSON.parse(sessionStorage.getItem("categorySelect"));
    let status = JSON.parse(sessionStorage.getItem("statusSelect"));
    let sort = JSON.parse(sessionStorage.getItem("sortSelect"));
    let limit = JSON.parse(sessionStorage.getItem("limitInput"));
    let page = JSON.parse(sessionStorage.getItem("pageInput"));
    category && params.push(["category", category]);
    status && params.push(["status", status]);
    sort && params.push(["sort", sort]);
    limit && params.push(["limit", limit]);
    page && params.push(["page", page]);
    if (params.length) {
      goHref += "/";
      for (let i = 0; i < params.length; i++) {
        let nexus = i === 0 ? "?" : "&";
        goHref += `${nexus}${params[i][0]}=${params[i][1]}`;
      }
    }
    goAnchor.href = goHref;
  };

  for (let i = 0; i < paramsForm.elements.length; i++) {
    paramsForm.elements[i].addEventListener("change", (e) => {
      sessionStorage.setItem(e.target.id, JSON.stringify(e.target.value));
      goAnchorHrefUpdate();
    });
  }

  goAnchorHrefUpdate();
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

const setAddToCartForms = () => {
  let addToCartForms = document.getElementsByClassName("addToCartForm");
  for (let i = 0; i < addToCartForms.length; i++) {
    addToCartForms[i].addEventListener("submit", async (e) => {
      e.preventDefault();
      let user = JSON.parse(sessionStorage.getItem("user"));
      let productOwner = e.target.dataset.owner;
      if (productOwner !== "admin" && productOwner === user.id) {
        alert("Producto no agregado. No puedes comprar tus propios productos");
      } else {
        let productId = e.target.id;
        let quantity = e.target[0].value;
        let url = `/api/carts/${user.cart}/product/${productId}`;
        let data = { qty: quantity };
        try {
          let res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
          if (res.status === 201) {
            alert("Producto agregado al carrito");
          } else {
            alert("Error. Producto no agregado. Vuelva a intentarlo");
          }
        } catch (error) {
          console.log(error);
          alert("Error. Producto no agregado. Vuelva a intentarlo");
        }
      }
      e.target.reset();
    });
  }
}

const init = () => {
  getUserData();
  setFilters();
  setPagination();
  setAddToCartForms();
};

init();