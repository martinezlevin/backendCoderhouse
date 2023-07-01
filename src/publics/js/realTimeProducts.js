const socket = io();

let addProductForm = document.getElementById("addProductForm");
let deleteProductForm = document.getElementById("deleteProductForm");
let toast = document.getElementById("toast");

deleteProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let productId = e.target[0].value.trim();
  await fetch(`/api/products/${productId}`, { method: "DELETE" });
  socket.emit("productsCollectionUpdated");
  e.target.reset();
});

addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  let formData = new FormData(e.target);
  await fetch("/api/products/", {
    method: "POST",
    body: formData,
  })
    .then((res) => {
      console.dir(res);
      if (res.status !== 201) throw new Error;
      return res.json();
    })
    .then((res) => {
      console.dir(res);
    })
    .catch((error => {
      window.location.replace("/error");
    }))
    .finally(() => {
      socket.emit("productsCollectionUpdated");
    });
});

const showToast = (message) => {
  toast.innerHTML = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2000);
};

showToast("Lista actualizada");

socket.on("productsCollectionUpdated", () => {
  location.reload();
});