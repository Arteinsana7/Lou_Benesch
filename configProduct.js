// configProduct.js - Gestion de la configuration des produits
// Basé sur le code de ta collègue mais intégré au système de panier dynamique

import { products, supports, variants } from "../data.js";

class ProductConfig {
  constructor() {
    this.currentProduct = null;
    this.products = products;
    this.supports = supports;
    this.variants = variants;
    this.init();
  }

  init() {
    this.renderProductConfig();
    // Fonction globale pour debug
    window.debugConfigPage = () => this.debugInfo();
  }

  // Fonction principale basée sur le code de ta collègue
  renderProductConfig() {
    // Récupérer l'ID depuis l'URL (paramètre "id" comme dans le code de ta collègue)
    const productId = new URLSearchParams(window.location.search).get("id");
    const product = this.products.find((p) => String(p.id) === productId);

    if (!product) {
      console.warn("Produit non trouvé, utilisation du produit par défaut");
      // Utiliser le premier produit par défaut
      this.currentProduct = this.products[0];
    } else {
      this.currentProduct = product;
    }

    // Récupérer les éléments dans le DOM
    const photoContainer = document.getElementById("photo-illustration");
    const titleContainer = document.getElementById("title-product");
    const descriptionContainer = document.getElementById("description-product");
    const quantitySelect = document.getElementById("quantity-select");
    const priceContainer =
      document.getElementById("product-price") ||
      document.querySelector(".prix");
    const supportSelect = document.getElementById("dropdown-choices");

    if (!this.currentProduct) return;

    // Ajouter les données du produit dans le DOM
    if (photoContainer) {
      const photoIllustration = `
                <img src="${this.currentProduct.image[0]}" alt="${this.currentProduct.name}" style="background: white; padding: 20px; border-radius: 10px;" />
            `;
      photoContainer.innerHTML = ""; // Vider d'abord
      photoContainer.insertAdjacentHTML("afterbegin", photoIllustration);
    }

    if (titleContainer) {
      titleContainer.textContent = this.currentProduct.name;
    }

    if (descriptionContainer) {
      descriptionContainer.textContent = this.getProductDescription(
        this.currentProduct.name
      );
    }

    // Gérer la logique de la quantité et du prix
    this.setupQuantityLogic(quantitySelect);
    this.setupPriceLogic(priceContainer);
    this.setupSupportLogic(supportSelect, priceContainer, quantitySelect);
    this.setupColorLogic();
    this.setupFormSubmission();
  }

  // Générer une description pour chaque produit
  getProductDescription(productName) {
    const descriptions = {
      "The Dance":
        "Une illustration expressive capturant l'énergie et le mouvement de la danse avec des lignes fluides et dynamiques.",
      "The Dress":
        "Un portrait élégant mettant en valeur la beauté et l'élégance du vêtement dans un style artistique raffiné.",
      Sing: "Une création artistique célébrant la musique et l'expression vocale, inspirée de l'art contemporain.",
      Game: "Une illustration ludique et créative inspirée de l'univers du jeu, alliant modernité et nostalgie.",
      "The Kiss":
        "Une œuvre romantique et poétique explorant les thèmes de l'amour et de la connexion humaine.",
    };
    return (
      descriptions[productName] ||
      "Une illustration unique créée par Lou Benesch, alliant créativité et expression artistique moderne."
    );
  }

  // Configuration de la logique des quantités
  setupQuantityLogic(quantitySelect) {
    if (quantitySelect && this.currentProduct.quantity) {
      quantitySelect.value = String(this.currentProduct.quantity);
    }
  }

  // Configuration de la logique des prix
  setupPriceLogic(priceContainer) {
    if (!priceContainer) return;

    if (this.currentProduct.price === "-") {
      priceContainer.textContent = "Sélectionnez un support";
      priceContainer.style.color = "#666";
    } else {
      priceContainer.textContent = `${this.currentProduct.price}€`;
    }
  }

  // Configuration de la logique des supports
  setupSupportLogic(supportSelect, priceContainer, quantitySelect) {
    if (!supportSelect || !priceContainer || !quantitySelect) return;

    // Événement changement de support
    supportSelect.addEventListener("change", () => {
      const selectedSupport = supportSelect.value;
      this.updateColorOptions(selectedSupport);
      this.updateSizeOptions(selectedSupport);
      this.updatePriceDisplay(supportSelect, priceContainer, quantitySelect);
      this.updateProductPreview();
    });

    // Événement changement de quantité
    quantitySelect.addEventListener("change", () => {
      this.updatePriceDisplay(supportSelect, priceContainer, quantitySelect);
    });
  }

  // Mettre à jour l'affichage du prix
  updatePriceDisplay(supportSelect, priceContainer, quantitySelect) {
    const selectedSupport = supportSelect.value;
    const quantity = parseInt(quantitySelect.value) || 1;
    let price = 0;

    if (selectedSupport === "T-Shirt" && this.supports.tshirt) {
      price = this.supports.tshirt.price * quantity;
    } else if (selectedSupport === "Agenda" && this.supports.agenda) {
      price = this.supports.agenda.price * quantity;
    }

    priceContainer.textContent = price
      ? `${price.toFixed(2)}€`
      : "Sélectionnez un support";
    priceContainer.style.color = price ? "#625E49" : "#666";
    priceContainer.style.fontWeight = price ? "bold" : "normal";
  }

  // Mettre à jour les options de couleur selon le support sélectionné
  updateColorOptions(support) {
    const colorSelect = document.querySelector('select[name="color"]');
    if (!colorSelect) return;

    // Vider les options existantes
    colorSelect.innerHTML =
      '<option value="" selected disabled>Coloris</option>';

    let colors = [];
    if (support === "T-Shirt" && this.supports.tshirt) {
      colors = this.supports.tshirt.colors;
    } else if (support === "Agenda" && this.supports.agenda) {
      colors = this.supports.agenda.colors;
    }

    // Ajouter les couleurs disponibles
    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      colorSelect.appendChild(option);
    });

    // Sélectionner automatiquement la première couleur
    if (colors.length > 0) {
      colorSelect.value = colors[0];
      this.updateProductPreview();
    }
  }

  // Mettre à jour les options de taille selon le support sélectionné
  updateSizeOptions(support) {
    const sizeSelect = document.querySelector('select[name="size"]');
    if (!sizeSelect) return;

    // Vider les options existantes
    sizeSelect.innerHTML = '<option value="" selected disabled>Taille</option>';

    let sizes = [];
    if (support === "T-Shirt" && this.supports.tshirt) {
      sizes = this.supports.tshirt.sizes;
    } else if (support === "Agenda" && this.supports.agenda) {
      sizes = this.supports.agenda.sizes;
    }

    // Ajouter les tailles disponibles
    sizes.forEach((size) => {
      const option = document.createElement("option");
      option.value = size;
      option.textContent = size;
      sizeSelect.appendChild(option);
    });
  }

  // Configuration de la logique des couleurs
  setupColorLogic() {
    const colorSelect = document.querySelector('select[name="color"]');
    if (colorSelect) {
      colorSelect.addEventListener("change", () => {
        this.updateProductPreview();
      });
    }
  }

  // Mettre à jour l'aperçu du produit selon les sélections
  updateProductPreview() {
    const supportSelect = document.getElementById("dropdown-choices");
    const colorSelect = document.querySelector('select[name="color"]');

    if (!supportSelect || !colorSelect || !this.currentProduct) return;

    const selectedSupport = supportSelect.value;
    const selectedColor = colorSelect.value;

    if (!selectedSupport || !selectedColor) return;

    // Trouver l'image correspondante dans les variants
    let previewImage = null;
    const productIndex = this.currentProduct.id - 1; // Les arrays commencent à 0

    if (selectedSupport === "T-Shirt" && this.variants.tshirt[selectedColor]) {
      previewImage = this.variants.tshirt[selectedColor][productIndex];
    } else if (selectedSupport === "Agenda" && this.variants.agenda.design) {
      previewImage = this.variants.agenda.design[productIndex];
    }

    // Mettre à jour l'image d'aperçu
    if (previewImage) {
      const photoContainer = document.getElementById("photo-illustration");
      if (photoContainer) {
        const img = photoContainer.querySelector("img");
        if (img) {
          img.src = previewImage;
          img.style.background = "transparent";
          img.style.padding = "0";
          img.style.borderRadius = "10px";
        }
      }
    }
  }

  // Configuration de la soumission du formulaire
  setupFormSubmission() {
    const form = document.getElementById("product-config-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      // Validation du formulaire
      const support = form.elements["support"].value;
      const color = form.elements["color"].value;
      const size = form.elements["size"].value;
      const quantity = form.elements["quantity"].value;

      if (!support || !color || !size || !quantity) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
      }

      // Créer l'objet produit pour le panier
      const productCart = {
        id: this.generateItemId(support, color, size),
        name: this.currentProduct.name,
        image:
          document.querySelector("#photo-illustration img")?.src ||
          this.currentProduct.image[0],
        support,
        color,
        size,
        quantity: parseInt(quantity),
        price: this.getProductPrice(support),
        productData: { ...this.currentProduct },
      };

      // Utiliser le gestionnaire de panier global s'il existe
      if (window.cartManager) {
        try {
          window.cartManager.addItem(productCart);
        } catch (error) {
          console.error("Erreur avec cartManager:", error);
          this.fallbackAddToCart(productCart);
        }
      } else {
        // Fallback: utiliser localStorage directement
        this.fallbackAddToCart(productCart);
      }

      console.log("Produit ajouté au panier :", productCart);
    });
  }

  // Méthode fallback pour ajouter au panier
  fallbackAddToCart(productCart) {
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Chercher si le produit existe déjà
      const existingItemIndex = cart.findIndex(
        (item) => item.id === productCart.id
      );

      if (existingItemIndex !== -1) {
        // Augmenter la quantité
        cart[existingItemIndex].quantity += productCart.quantity;
      } else {
        // Ajouter le nouveau produit
        cart.push(productCart);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Produit ajouté au panier !");

      // Mettre à jour l'affichage du compteur panier
      this.updateCartBadge(cart);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      alert("Erreur lors de l'ajout au panier.");
    }
  }

  // Générer un ID unique pour le produit configuré
  generateItemId(support, color, size) {
    return `${this.currentProduct.name}-${support}-${color}-${size}`
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  // Obtenir le prix selon le support
  getProductPrice(support) {
    if (support === "T-Shirt" && this.supports.tshirt) {
      return this.supports.tshirt.price;
    } else if (support === "Agenda" && this.supports.agenda) {
      return this.supports.agenda.price;
    }
    return 20.0; // Prix par défaut
  }

  // Mettre à jour le badge du panier
  updateCartBadge(cart) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartLinks = document.querySelectorAll(
      'a[href="./cart.html"], a[href="cart.html"]'
    );

    cartLinks.forEach((link) => {
      // Supprimer l'ancien badge s'il existe
      const existingBadge = link.querySelector(".cart-badge");
      if (existingBadge) {
        existingBadge.remove();
      }

      // Ajouter le nouveau badge si il y a des articles
      if (totalItems > 0) {
        const badge = document.createElement("span");
        badge.className = "cart-badge";
        badge.textContent = totalItems;
        badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #d11f1f;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                `;
        link.style.position = "relative";
        link.appendChild(badge);
      }
    });
  }

  // Informations de debug
  debugInfo() {
    console.log("=== Debug Product Config ===");
    console.log("Produit actuel:", this.currentProduct);
    console.log(
      "URL params:",
      new URLSearchParams(window.location.search).toString()
    );
    console.log("Supports disponibles:", this.supports);
    console.log("Variants disponibles:", Object.keys(this.variants));

    // État du formulaire
    const form = document.getElementById("product-config-form");
    if (form) {
      const formData = new FormData(form);
      const formState = {};
      for (let [key, value] of formData.entries()) {
        formState[key] = value;
      }
      console.log("État du formulaire:", formState);
    }
  }
}

// Initialiser seulement sur la page de configuration
if (window.location.pathname.includes("config-page.html")) {
  document.addEventListener("DOMContentLoaded", () => {
    window.productConfig = new ProductConfig();
  });
}

// Export pour utilisation en module
if (typeof module !== "undefined" && module.exports) {
  module.exports = ProductConfig;
}
