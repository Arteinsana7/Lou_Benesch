import { products } from "./data.js";

function renderProducts() {
  const productList = document.getElementById("product-list");
  if (!productList) return;
  productList.innerHTML = products
    .map((product) => {
      const imgUrl = Array.isArray(product.image)
        ? product.image[0]
        : product.image;
      return `
          <div class="product-card" style="cursor:pointer" onclick="window.location.href='config-page.html?id=${product.id}'">
    <img src="${imgUrl}"
      alt="${product.name}" />
          <div class="description-illustration">
            <b>${product.name}</b><br />
          </div>
        </div>
      `;
    })
    .join("");
}

if (window.location.pathname.includes("shop.html")) {
  document.addEventListener("DOMContentLoaded", renderProducts);
}
