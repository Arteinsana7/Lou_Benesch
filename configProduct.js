import { products, supports } from "./data.js";

function renderProductConfig() {
  const productId = new URLSearchParams(window.location.search).get("id");
  const product = products.find((p) => String(p.id) === productId);
  if (!product) return;

  // on récupère les éléments dans le DOM
  const photoContainer = document.getElementById("photo-illustration");
  const titleContainer = document.getElementById("title-product");
  const descriptionContainer = document.getElementById("description-product");
  const quantitySelect = document.getElementById("quantity-select");
  const priceContainer =
    document.getElementById("product-price") || document.querySelector(".prix");
  const supportSelect = document.getElementById("dropdown-choices");

  // ici, on ajoute les données du produit dans le DOM
  const photoIllustration = `
      <img src="${product.image[0]}" alt="${product.name}" />
  `;

  photoContainer.insertAdjacentHTML("afterbegin", photoIllustration);

  titleContainer.textContent = product.name;
  descriptionContainer.textContent =
    product.description || "Aucun descriptif disponible pour le moment.";

  // ici, on gère la logic de la quantité et du prix

  // QUANTITY
  if (quantitySelect && product.quantity) {
    quantitySelect.value = String(product.quantity);
  }

  // PRICE
  if (priceContainer) {
    if (product.price === "-") {
      priceContainer.textContent = "- €";
    } else {
      priceContainer.textContent = `${product.price} €`;
    }
  }

  if (supportSelect && priceContainer && quantitySelect) {
    supportSelect.addEventListener("change", () => {
      let selectedSupport = supportSelect.value;
      let quantity = parseInt(quantitySelect.value) || 1;
      let price = 0;
      if (selectedSupport === "T-Shirt" && supports.tshirt) {
        price = supports.tshirt.price * quantity;
      } else if (selectedSupport === "Agenda" && supports.agenda) {
        price = supports.agenda.price * quantity;
      }
      priceContainer.textContent = price ? `${price.toFixed(2)} €` : "- €";
    });

    quantitySelect.addEventListener("change", () => {
      let selectedSupport = supportSelect.value;
      let quantity = parseInt(quantitySelect.value) || 1;
      let price = 0;
      if (selectedSupport === "T-Shirt" && supports.tshirt) {
        price = supports.tshirt.price * quantity;
      } else if (selectedSupport === "Agenda" && supports.agenda) {
        price = supports.agenda.price * quantity;
      }
      priceContainer.textContent = price ? `${price.toFixed(2)} €` : "- €";
    });
  }

  // Afficher l'image sur support avec la couleur par défault

  // COLOR --> ajouter la logique pour afficher l'image selon la couleur : quand le support est choisi, mettre par défaut une couleur puis afficher l'image

  const form = document.getElementById("product-config-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const support = form.elements["support"].value;
      const color = form.elements["color"].value;
      const size = form.elements["size"].value;
      const quantity = form.elements["quantity"].value;

      const productCart = { support, color, size, quantity, ...product };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(productCart);

      localStorage.setItem("cart", JSON.stringify(cart));

      alert("Produit ajouté au panier !");

      console.log("Produit ajouté au panier :", productCart);
    });
  }
}

if (window.location.pathname.includes("config-page.html")) {
  document.addEventListener("DOMContentLoaded", renderProductConfig);
}
