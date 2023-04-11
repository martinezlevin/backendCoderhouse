let paramsForm = document.getElementById("paramsForm");
let categorySelect = document.getElementById("categorySelect");
let statusSelect = document.getElementById("statusSelect");
let sortSelect = document.getElementById("sortSelect");
let limitInput = document.getElementById("limitInput");
let pageInput = document.getElementById("pageInput");
let cartSelect = document.getElementById("cartSelect");
let addToCartForms = document.getElementsByClassName("addToCartForm");

categorySelect.value = JSON.parse(sessionStorage.getItem("categorySelect"));
statusSelect.value = JSON.parse(sessionStorage.getItem("statusSelect"));
sortSelect.value = JSON.parse(sessionStorage.getItem("sortSelect"));
limitInput.value = JSON.parse(sessionStorage.getItem("limitInput"));
pageInput.value = JSON.parse(sessionStorage.getItem("pageInput"));
cartSelect.value = JSON.parse(sessionStorage.getItem("cartSelect"));

const goAnchorHrefUpdate = () => {
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

cartSelect.addEventListener("change", (e) => {
  sessionStorage.setItem(e.target.id, JSON.stringify(e.target.value));
});

for (let i = 0; i < addToCartForms.length; i++) {
  addToCartForms[i].addEventListener("submit", (e) => {
    e.preventDefault();

    let cartId = JSON.parse(sessionStorage.getItem("cartSelect"));
    let productId = e.target.id;
    let quantity = e.target[0].value;

    const addToCart = async (cartId, productId, quantity) => {
      let url = `/api/cartsDB/${cartId}/product/${productId}`;
      let data = { qty: quantity };
      
      try {
        await fetch(url, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data) });
        alert("Producto agregado al carrito")
      } catch (error) {
        console.log(error);
      }
    }

    if (cartId) {
      addToCart(cartId, productId, quantity);
    } else {
      alert("Debe seleccionar un carrito");
    }

    e.target.reset();
  });
}

goAnchorHrefUpdate();