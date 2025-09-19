class CartManager {
  constructor() {
    this.cartKey = "cart";
    this.cart = this.loadCart();
    this.init();
  }

  // Initialisation du gestionnaire
  init() {
    this.updateCartDisplay();
    this.bindEvents();

    // Fonctions globales pour debug
    window.debugCartManager = () => this.debugInfo();
    window.clearCart = () => this.reset();
    window.showCart = () => console.log("Panier:", this.cart);
  }

  // Charger le panier depuis le stockage local
  loadCart() {
    try {
      const savedCart = localStorage.getItem(this.cartKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      return [];
    }
  }

  // Sauvegarder le panier
  saveCart() {
    try {
      localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
      this.updateCartDisplay();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier:", error);
    }
  }

  // Ajouter un produit au panier
  addItem(product) {
    // Validation des données
    if (!this.validateProduct(product)) {
      throw new Error("Données produit invalides");
    }

    // Créer un ID unique pour le produit configuré
    const itemId = this.generateItemId(product);

    // Chercher si le produit existe déjà
    const existingItemIndex = this.cart.findIndex((item) => item.id === itemId);

    if (existingItemIndex !== -1) {
      // Produit existe, augmenter la quantité
      this.cart[existingItemIndex].quantity += parseInt(product.quantity);
    } else {
      // Nouveau produit
      const cartItem = {
        id: itemId,
        name: product.name,
        image: product.image,
        support: product.support,
        color: product.color,
        size: product.size,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity),
        addedAt: Date.now(),
      };
      this.cart.push(cartItem);
    }

    this.saveCart();
    this.showAddedMessage(product.name);
  }

  // Valider les données du produit
  validateProduct(product) {
    const required = [
      "name",
      "image",
      "support",
      "color",
      "size",
      "price",
      "quantity",
    ];
    return required.every((field) => product[field] && product[field] !== "");
  }

  // Générer un ID unique basé sur les propriétés du produit
  generateItemId(product) {
    return `${product.name}-${product.support}-${product.color}-${product.size}`
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  // Supprimer un article du panier
  removeItem(itemId) {
    this.cart = this.cart.filter((item) => item.id !== itemId);
    this.saveCart();
  }

  // Mettre à jour la quantité d'un article
  updateQuantity(itemId, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const item = this.cart.find((item) => item.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.saveCart();
    }
  }

  // Vider le panier
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // Obtenir le nombre total d'articles
  getTotalItems() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Obtenir le prix total
  getTotalPrice() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Mettre à jour l'affichage du panier dans la navigation
  updateCartDisplay() {
    // Mise à jour du compteur dans le header (si présent)
    const cartLinks = document.querySelectorAll(
      'a[href="./cart.html"], a[href="cart.html"]'
    );
    const totalItems = this.getTotalItems();

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

    // Si on est sur la page panier, mettre à jour l'affichage complet
    if (window.location.pathname.includes("cart.html")) {
      this.renderCartPage();
    }
  }

  // Rendu de la page panier
  renderCartPage() {
    const cartTable = document.querySelector(".cart-table");
    const itemsCountElement = document.querySelector(".items");

    if (!cartTable) return;

    // Mise à jour du compteur d'articles
    if (itemsCountElement) {
      const totalItems = this.getTotalItems();
      itemsCountElement.textContent = `tems ${totalItems}`;
    }

    // Effacer le contenu existant (garder l'en-tête)
    const existingRows = cartTable.querySelectorAll(
      "tr:not(.cart-items-header):not(.cart-total)"
    );
    existingRows.forEach((row) => row.remove());

    // Si le panier est vide
    if (this.cart.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `
                <td colspan="4" style="text-align: center; padding: 40px; color: #666;">
                    Votre panier est vide
                    <br><br>
                    <a href="./shop.html" style="color: #d1af0e; text-decoration: underline;">
                        Continuer mes achats
                    </a>
                </td>
            `;
      cartTable.appendChild(emptyRow);

      // Masquer le bouton de validation
      const checkoutButton = document.querySelector(".checkout-button");
      if (checkoutButton) {
        checkoutButton.style.display = "none";
      }
      return;
    }

    // Afficher les articles du panier
    const totalRow = cartTable.querySelector(".cart-total");
    this.cart.forEach((item) => {
      const row = document.createElement("tr");
      row.className = "cart-items";
      row.innerHTML = `
                <td class="img-row">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <img class="cart-img-product" src="${
                          item.image
                        }" alt="${item.name}" />
                        <div style="text-align: left;">
                            <strong>${item.name}</strong><br>
                            <small style="color: #666;">
                                ${item.support} - ${item.color} - ${item.size}
                            </small>
                            <br>
                            <button onclick="cartManager.removeItem('${
                              item.id
                            }')" 
                                    style="color: #d11f1f; background: none; border: none; cursor: pointer; font-size: 12px; margin-top: 5px;">
                                Supprimer
                            </button>
                        </div>
                    </div>
                </td>
                <td>${item.price.toFixed(2)}€</td>
                <td>
                    <input type="number" value="${
                      item.quantity
                    }" min="1" max="10"
                           onchange="cartManager.updateQuantity('${
                             item.id
                           }', this.value)"
                           style="width: 60px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; text-align: center;">
                </td>
                <td><strong>${(item.price * item.quantity).toFixed(
                  2
                )}€</strong></td>
            `;

      cartTable.appendChild(row);
    });

    // Mettre à jour le total
    const totalPriceElement = cartTable.querySelector(
      ".cart-total td:last-child"
    );
    if (totalPriceElement) {
      totalPriceElement.textContent = `${this.getTotalPrice().toFixed(2)}€`;
    }

    // Afficher le bouton de validation
    const checkoutButton = document.querySelector(".checkout-button");
    if (checkoutButton) {
      checkoutButton.style.display = "block";
    }

    // Ajouter un bouton de vidage pour les tests (après le bouton checkout)
    const checkoutContainer = document.querySelector(".checkout-container");
    if (checkoutContainer && !document.getElementById("clear-cart-btn")) {
      const clearButton = document.createElement("button");
      clearButton.id = "clear-cart-btn";
      clearButton.textContent = "Vider le panier (test)";
      clearButton.style.cssText = `
                margin-left: 15px;
                padding: 15px 20px;
                background-color: #dc3545;
                color: white;
                border: none;
                border-radius: 5px;
                font-size: 1em;
                cursor: pointer;
                text-transform: uppercase;
                font-family: 'Manrope', sans-serif;
            `;
      clearButton.addEventListener("click", () => {
        if (confirm("Voulez-vous vraiment vider le panier ?")) {
          this.reset();
        }
      });
      checkoutContainer.appendChild(clearButton);
    }
  }

  // Lier les événements
  bindEvents() {
    // Événement pour l'ajout au panier depuis la page de configuration
    document.addEventListener("submit", (e) => {
      if (e.target.id === "product-config-form") {
        e.preventDefault();
        this.handleAddToCart(e.target);
      }
    });

    // Événement pour la validation du panier
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("checkout-button")) {
        this.handleCheckout();
      }
    });
  }

  // Gérer l'ajout au panier depuis le formulaire
  handleAddToCart(form) {
    try {
      const formData = new FormData(form);

      // Récupération des données du produit
      const product = {
        name:
          document.getElementById("title-product")?.textContent || "Produit",
        image:
          document.querySelector("#photo-illustration img")?.src ||
          "../assets/default-product.png",
        support: formData.get("support"),
        color: formData.get("color"),
        size: formData.get("size"),
        quantity: formData.get("quantity"),
        price: this.getProductPrice(formData.get("support")),
      };

      this.addItem(product);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      alert(
        "Erreur lors de l'ajout au panier. Veuillez vérifier vos sélections."
      );
    }
  }

  // Obtenir le prix selon le support
  getProductPrice(support) {
    // Utiliser les prix de data.js si disponible
    if (
      window.productConfig &&
      window.productConfig.supports &&
      window.productConfig.supports[support]
    ) {
      return window.productConfig.supports[support].price;
    }

    // Prix par défaut
    const defaultPrices = {
      tshirt: 24.99,
      agenda: 19.99,
      "T-Shirt": 24.99,
      Agenda: 19.99,
    };
    return defaultPrices[support] || 20.0;
  }

  // Afficher un message de confirmation
  showAddedMessage(productName) {
    // Créer une notification temporaire
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            font-family: 'Open Sans', sans-serif;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
    notification.textContent = `"${productName}" ajouté au panier !`;

    document.body.appendChild(notification);

    // Supprimer après 3 secondes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

  // Gérer la validation du panier
  handleCheckout() {
    if (this.cart.length === 0) {
      alert("Votre panier est vide !");
      return;
    }

    const total = this.getTotalPrice();
    const itemCount = this.getTotalItems();

    if (
      confirm(
        `Valider votre commande de ${itemCount} article(s) pour un total de ${total.toFixed(
          2
        )}€ ?`
      )
    ) {
      // Ici tu peux ajouter la logique de commande
      alert("Fonctionnalité de commande à implémenter !");
      // this.clearCart(); // Décommenter pour vider le panier après commande
    }
  }

  // Informations de debug
  debugInfo() {
    console.log("=== Debug Cart Manager ===");
    console.log("Panier actuel:", this.cart);
    console.log("Nombre d'articles:", this.getTotalItems());
    console.log("Prix total:", this.getTotalPrice().toFixed(2) + "€");
    console.log("Stockage local:", localStorage.getItem(this.cartKey));

    // Afficher les fonctions utiles
    console.log("Fonctions utiles:");
    console.log("- cartManager.clearCart() : Vider le panier");
    console.log("- cartManager.debugInfo() : Afficher ces infos");
    console.log("- cartManager.getTotalItems() : Nombre d'articles");
    console.log("- cartManager.getTotalPrice() : Prix total");
  }

  // Fonction pour réinitialiser complètement le système
  reset() {
    this.clearCart();
    console.log("✅ Panier vidé et système réinitialisé");

    // Recharger la page si on est sur cart.html pour voir le changement
    if (window.location.pathname.includes("cart.html")) {
      window.location.reload();
    }
  }
}

// Initialiser le gestionnaire de panier au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  window.cartManager = new CartManager();
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = CartManager;
}
