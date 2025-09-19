// configProduct.js - Gestion de la page de configuration produit

import { products, supports } from "../data.js";

let currentProduct = null;

// Charger le produit depuis l'URL
function loadProductFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));

  if (!productId) {
    console.error("Aucun ID de produit dans l'URL");
    return;
  }

  currentProduct = products.find((p) => p.id === productId);

  if (!currentProduct) {
    console.error("Produit non trouvé");
    document.getElementById("title-product").textContent = "Produit non trouvé";
    return;
  }

  displayProduct();
}

// Afficher les informations du produit
function displayProduct() {
  if (!currentProduct) return;

  // Titre du produit
  document.getElementById("title-product").textContent = currentProduct.name;

  // Image du produit
  const photoContainer = document.getElementById("photo-illustration");
  if (photoContainer && currentProduct.image && currentProduct.image[0]) {
    photoContainer.innerHTML = `<img src="${currentProduct.image[0]}" alt="${currentProduct.name}" style="max-width: 100%; height: auto;">`;
  }

  // Description (vous pouvez l'ajouter à vos données produit si nécessaire)
  const descriptionElement = document.getElementById("description-product");
  if (descriptionElement) {
    descriptionElement.textContent = `Illustration "${currentProduct.name}" disponible sur différents supports.`;
  }

  // Prix initial (sera mis à jour selon le support choisi)
  updatePrice();
}

// Mettre à jour le prix selon le support sélectionné
function updatePrice() {
  const supportSelect = document.querySelector('select[name="support"]');
  const priceElement = document.getElementById("product-price");

  if (!priceElement) return;

  let price = 0;
  const selectedSupport = supportSelect ? supportSelect.value : null;

  if (selectedSupport === "T-Shirt") {
    price = 24.99;
  } else if (selectedSupport === "Agenda") {
    price = 19.99;
  }

  if (price > 0) {
    priceElement.textContent = `${price.toFixed(2)}€`;
  } else {
    priceElement.textContent = "Sélectionnez un support";
  }
}

// Gérer la soumission du formulaire
function handleFormSubmit(event) {
  event.preventDefault();

  if (!currentProduct) {
    alert("Erreur: aucun produit sélectionné");
    return;
  }

  // Récupérer les valeurs du formulaire
  const formData = new FormData(event.target);
  const support = formData.get("support");
  const color = formData.get("color");
  const size = formData.get("size");
  const quantity = parseInt(formData.get("quantity")) || 1;

  // Vérifier que tous les champs sont remplis
  if (!support || !color || !size) {
    alert(
      "Veuillez sélectionner toutes les options (support, couleur, taille)"
    );
    return;
  }

  // Vérifier que le gestionnaire de panier existe
  if (typeof window.cartManager === "undefined") {
    console.error(
      "CartManager non trouvé. Assurez-vous que cart.js est chargé."
    );
    alert("Erreur: système de panier non disponible");
    return;
  }

  // Ajouter au panier (pour chaque quantité)
  for (let i = 0; i < quantity; i++) {
    const supportType = support === "T-Shirt" ? "tshirt" : "agenda";

    const product = {
      name: currentProduct.name,
      image: currentProduct.image[0],
      support: support, // "T-Shirt" ou "Agenda"
      color: color,
      size: size,
      quantity: 1,
      price: support === "T-Shirt" ? 24.99 : 19.99,
    };
    window.cartManager.addToCart(product);
  }

  // Optionnel: rediriger vers le panier ou afficher un message de confirmation
  const goToCart = confirm(
    `${quantity} x ${currentProduct.name} ajouté(s) au panier !\n\nVoulez-vous voir votre panier ?`
  );
  if (goToCart) {
    window.location.href = "./cart.html";
  }
}

// Initialisation quand la page est chargée
document.addEventListener("DOMContentLoaded", function () {
  loadProductFromUrl();

  // Écouter les changements de support pour mettre à jour le prix
  const supportSelect = document.querySelector('select[name="support"]');
  if (supportSelect) {
    supportSelect.addEventListener("change", updatePrice);
  }

  // Écouter la soumission du formulaire
  const form = document.getElementById("product-config-form");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  console.log("ConfigProduct.js initialisé");
});

// Fonction utilitaire pour débugger
window.debugConfigPage = function () {
  console.log("Produit actuel:", currentProduct);
  console.log(
    "CartManager disponible:",
    typeof window.cartManager !== "undefined"
  );
  console.log(
    "URL params:",
    new URLSearchParams(window.location.search).get("id")
  );
};
