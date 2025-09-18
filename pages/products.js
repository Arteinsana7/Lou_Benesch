import { products, supports, variants } from "../data.js";

class ProductManager {
  constructor() {
    // Données du fichier data.js
    this.products = products.map((product) => ({
      ...product,
      featured: [1, 3, 5].includes(product.id), // Définir certains comme populaires
      description: this.getProductDescription(product.name),
    }));

    this.supports = supports;
    this.variants = variants;

    this.init();
  }

  // Générer une description pour chaque produit
  getProductDescription(productName) {
    const descriptions = {
      "The Dance":
        "Une illustration expressive capturant l'énergie de la danse",
      "The Dress":
        "Un portrait élégant mettant en valeur la beauté du vêtement",
      Sing: "Une création artistique célébrant la musique et l'expression vocale",
      Game: "Une illustration ludique inspirée de l'univers du jeu",
      "The Kiss": "Une œuvre romantique et poétique sur l'amour",
    };
    return (
      descriptions[productName] || "Une illustration unique de Lou Benesch"
    );
  }

  init() {
    this.renderProducts();
    this.bindEvents();
    // Fonction globale pour debug
    window.debugProducts = () => this.debugInfo();
  }

  // Afficher les produits sur la page
  renderProducts() {
    const container = document.getElementById("product-list");
    if (!container) {
      console.warn("Container product-list non trouvé");
      return;
    }

    // Vider le container
    container.innerHTML = "";

    // Ajouter du style CSS pour la grille
    container.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 30px;
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        `;

    // Générer HTML pour chaque produit
    this.products.forEach((product) => {
      const productElement = this.createProductElement(product);
      container.appendChild(productElement);
    });
  }

  // Créer l'élément HTML pour un produit
  createProductElement(product) {
    const productDiv = document.createElement("div");
    productDiv.className = "product-card";
    productDiv.style.cssText = `
            background: #f8f8f8;
            border-radius: 12px;
            overflow: hidden;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

    // Utiliser la première image du produit (SVG)
    const productImage = Array.isArray(product.image)
      ? product.image[0]
      : product.image;

    // Obtenir les prix des supports disponibles
    const priceRange = this.getPriceRange();

    productDiv.innerHTML = `
            <div class="product-image-container" style="position: relative; background: white;">
                <img src="${productImage}" 
                     alt="${product.name}"
                     style="width: 100%; height: 280px; object-fit: contain; padding: 30px;"
                     onerror="this.src='../assets/default-product.png'">
                ${
                  product.featured
                    ? '<div class="featured-badge" style="position: absolute; top: 15px; right: 15px; background: linear-gradient(45deg, #d1af0e, #f4d03f); color: white; padding: 8px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">Populaire</div>'
                    : ""
                }
            </div>
            <div class="product-info" style="padding: 25px;">
                <h3 class="product-title" style="margin: 0 0 12px 0; font-size: 1.3em; color: #333; font-family: 'Open Sans', sans-serif; font-weight: 800; line-height: 1.3;">${
                  product.name
                }</h3>
                <p class="product-description" style="margin: 0 0 18px 0; color: #666; font-size: 0.95em; line-height: 1.5; height: 3em; overflow: hidden;">${
                  product.description
                }</p>
                <div class="product-pricing" style="margin-bottom: 18px;">
                    <span style="font-weight: bold; color: #625E49; font-size: 1.1em;">À partir de ${priceRange}€</span>
                    <br>
                    <small style="color: #999; font-size: 0.85em;">Disponible en T-shirt et agenda</small>
                </div>
                <button class="btn-configure" 
                        data-product-id="${product.id}"
                        style="
                            width: 100%;
                            padding: 15px;
                            background: linear-gradient(45deg, #625E49, #7a7560);
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-size: 1em;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            font-family: 'Open Sans', sans-serif;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        ">
                    Configurer & Commander
                </button>
            </div>
        `;

    // Ajouter les effets hover
    productDiv.addEventListener("mouseenter", () => {
      productDiv.style.transform = "translateY(-8px)";
      productDiv.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";

      const button = productDiv.querySelector(".btn-configure");
      button.style.background = "linear-gradient(45deg, #7a7560, #625E49)";
      button.style.transform = "scale(1.02)";
    });

    productDiv.addEventListener("mouseleave", () => {
      productDiv.style.transform = "translateY(0)";
      productDiv.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";

      const button = productDiv.querySelector(".btn-configure");
      button.style.background = "linear-gradient(45deg, #625E49, #7a7560)";
      button.style.transform = "scale(1)";
    });

    return productDiv;
  }

  // Obtenir la gamme de prix
  getPriceRange() {
    const prices = Object.values(this.supports).map((support) => support.price);
    const minPrice = Math.min(...prices);
    return minPrice.toFixed(2);
  }

  // Lier les événements
  bindEvents() {
    // Événement pour les boutons de configuration
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-configure")) {
        const productId = e.target.getAttribute("data-product-id");
        this.goToConfiguration(productId);
      }
    });

    // Événement pour cliquer sur le produit entier
    document.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product-card");
      if (productCard && !e.target.classList.contains("btn-configure")) {
        const button = productCard.querySelector(".btn-configure");
        const productId = button
          ? button.getAttribute("data-product-id")
          : null;
        if (productId) {
          this.goToConfiguration(productId);
        }
      }
    });
  }

  // Naviguer vers la page de configuration
  goToConfiguration(productId) {
    if (!productId) {
      console.error("ID produit manquant");
      return;
    }

    const product = this.products.find((p) => p.id === parseInt(productId));
    if (!product) {
      console.error("Produit non trouvé:", productId);
      return;
    }

    // Redirection vers la page de configuration avec l'ID du produit
    // Utiliser "id" comme paramètre (comme dans le code de ta collègue)
    window.location.href = `./config-page.html?id=${productId}`;
  }

  // Filtrer les produits (fonctionnalité future)
  filterProducts(criteria) {
    // Exemple de filtre par featured
    if (criteria === "featured") {
      return this.products.filter((product) => product.featured);
    }

    // Retourner tous les produits par défaut
    return this.products;
  }

  // Rechercher des produits
  searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
  }

  // Obtenir un produit par ID
  getProductById(id) {
    return this.products.find((product) => product.id === parseInt(id));
  }

  // Informations de debug
  debugInfo() {
    console.log("=== Debug Product Manager ===");
    console.log("Produits chargés:", this.products.length);
    console.log("Supports disponibles:", Object.keys(this.supports));
    console.log("Variants disponibles:", Object.keys(this.variants));
    console.log(
      "Produits populaires:",
      this.products.filter((p) => p.featured).map((p) => p.name)
    );
    console.log(
      "Gamme de prix:",
      this.getPriceRange() +
        "€ - " +
        Math.max(...Object.values(this.supports).map((s) => s.price)).toFixed(
          2
        ) +
        "€"
    );
  }

  // Méthode pour ajouter dynamiquement des produits
  addProduct(productData) {
    this.products.push({
      ...productData,
      id: Math.max(...this.products.map((p) => p.id)) + 1,
      description: this.getProductDescription(productData.name),
    });
    this.renderProducts();
  }

  // Méthode pour mettre à jour les supports
  updateSupports(newSupports) {
    this.supports = { ...this.supports, ...newSupports };
  }
}

// Initialiser le gestionnaire de produits au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  window.productManager = new ProductManager();
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = ProductManager;
}
