import { products, supports, variants } from "./data.js";

const setProductInfo = (product) => {
  const photoContainer = document.getElementById("photo-illustration");
  const titleContainer = document.getElementById("title-product");
  const descriptionContainer = document.getElementById("description-product");
  if (photoContainer) {
    const photoIllustration = `<img src="${product.image[0]}" alt="${product.name}" />`;
    photoContainer.insertAdjacentHTML("afterbegin", photoIllustration);
  }
  if (titleContainer) titleContainer.textContent = product.name;
  if (descriptionContainer)
    descriptionContainer.textContent =
      product.description || "Aucun descriptif disponible pour le moment.";
};

const setDefaultQuantity = (product, quantitySelect) => {
  if (quantitySelect && product.quantity) {
    quantitySelect.value = String(product.quantity);
  }
};

const setPrice = (product, priceContainer) => {
  if (priceContainer) {
    if (product.price === "-") {
      priceContainer.textContent = "- €";
    } else {
      priceContainer.textContent = `${product.price} €`;
    }
  }
};

const handleTShirtSelection =(quantity, priceContainer, colorSelect) => {
  const photoContainer = document.getElementById("photo-illustration");
  let price = supports.tshirt.price * quantity;
  if (colorSelect) {
    colorSelect.style.display = "";
    colorSelect.disabled = false;

    const selectedColor =
      colorSelect.options[colorSelect.selectedIndex].text.toLowerCase();
    const productId = new URLSearchParams(window.location.search).get("id");
    const productIndex = products.findIndex((p) => String(p.id) === productId);

    let imgSrc = null;
    switch (selectedColor) {
      case "blanc":
        imgSrc = variants.tshirt.blanc && variants.tshirt.blanc[productIndex];
        break;
      case "noir":
        imgSrc = variants.tshirt.noir && variants.tshirt.noir[productIndex];
        break;
      case "jaune":
        imgSrc = variants.tshirt.jaune && variants.tshirt.jaune[productIndex];
        break;
      default:
        imgSrc = null;
    }
    if (photoContainer && imgSrc) {
      const newImg = document.createElement("img");
      newImg.src = `.${imgSrc}`;
      newImg.alt = `T-Shirt ${selectedColor} ${productId}`;
      newImg.style.opacity = 0;
      newImg.style.transition = "opacity 0.5s";

      photoContainer.innerHTML = "";
      photoContainer.appendChild(newImg);

      setTimeout(() => {
        newImg.style.opacity = 1;
      }, 30);
    }
  }
  priceContainer.textContent = price ? `${price.toFixed(2)} €` : "- €";
}

const handleAgendaSelection = (quantity, priceContainer, colorSelect) => {
  const photoContainer = document.getElementById("photo-illustration");
  let price = supports.agenda.price * quantity;
  if (colorSelect) {
    colorSelect.style.display = "none";
    colorSelect.disabled = true;
  }

  const productId = new URLSearchParams(window.location.search).get("id");
  const productIndex = products.findIndex((p) => String(p.id) === productId);

  let imgSrc = null;
  if (variants.agenda.design[productIndex]) {
    imgSrc = variants.agenda.design[productIndex];

  }
  if (photoContainer && imgSrc) {
    const newImg = document.createElement("img");
    newImg.src = '.'+ imgSrc;
    newImg.alt = `Agenda ${productId}`;
    newImg.style.opacity = 0;
    newImg.style.transition = "opacity 0.5s";
    photoContainer.innerHTML = "";
    photoContainer.appendChild(newImg);
    setTimeout(() => {
      newImg.style.opacity = 1;
    }, 30);
  }

  priceContainer.textContent = price ? `${price.toFixed(2)} €` : "- €";
}

const updatePriceAndColor = (
  supportSelect,
  quantitySelect,
  priceContainer,
  colorSelect
) => {
  let selectedSupport = supportSelect.value;
  let quantity = parseInt(quantitySelect.value) || 1;
  if (selectedSupport === "T-Shirt" && supports.tshirt) {
    handleTShirtSelection(quantity, priceContainer, colorSelect);
  } else if (selectedSupport === "Agenda" && supports.agenda) {
    handleAgendaSelection(quantity, priceContainer, colorSelect);
  } else {
    if (colorSelect) {
      colorSelect.style.display = "";
      colorSelect.disabled = false;
    }
    priceContainer.textContent = "- €";
  }
};

const updatePrice = (supportSelect, quantitySelect, priceContainer) => {
  let selectedSupport = supportSelect.value;
  let quantity = parseInt(quantitySelect.value) || 1;
  let price = 0;
  if (selectedSupport === "T-Shirt" && supports.tshirt) {
    price = supports.tshirt.price * quantity;
  } else if (selectedSupport === "Agenda" && supports.agenda) {
    price = supports.agenda.price * quantity;
  }
  priceContainer.textContent = price ? `${price.toFixed(2)} €` : "- €";
};

const updateCartBadge = (cart) => {
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

const handleAddToCart = (form, product) => {
  const addToCartButton = document.getElementById("add-to-cart-button");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const support = form.elements["support"].value;
    const color = form.elements["color"].value;
    const size = form.elements["size"].value;
    const quantity = form.elements["quantity"].value;

    let image = product.image;
    if (Array.isArray(image)) {
      image = image[0] || "../assets/default-product.png";
    }
    
    const calculatePrice = () => {

   let price = 0;
    if (support.toLowerCase() === "t-shirt" && supports.tshirt) {
      price = supports.tshirt.price * parseInt(quantity);
    } else if (support.toLowerCase() === "agenda" && supports.agenda) {
      price = supports.agenda.price * parseInt(quantity);
    } else if (!isNaN(parseFloat(product.price))) {
      price = parseFloat(product.price) * parseInt(quantity);
    } else {
      price = 0;
    }
    return price
    }

 
  
    const itemId = `${product.name}-${support}-${color}-${size}`.toLowerCase().replace(/\s+/g, "-");

    const productCart = {
      id: itemId,
      name: product.name,
      image: image,
      support: support,
      color: color,
      size: size,
      price: calculatePrice(),
      quantity: parseInt(quantity),
      addedAt: Date.now(),
    };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push(productCart);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produit ajouté au panier !");
    updateCartBadge(cart);
    console.log("Produit ajouté au panier :", productCart);
  });
};




const renderProductConfig = () => {
  const productId = new URLSearchParams(window.location.search).get("id");
  const product = products.find((p) => String(p.id) === productId);
  if (!product) return;

  setProductInfo(product);
  const quantitySelect = document.getElementById("quantity-select");
  const priceContainer =
    document.getElementById("product-price") || document.querySelector(".prix");
  const supportSelect = document.getElementById("dropdown-choices");
  setDefaultQuantity(product, quantitySelect);
  setPrice(product, priceContainer);

  if (supportSelect && priceContainer && quantitySelect) {
    const colorSelect = document.querySelector('select[name="color"]');
    const sizeSelect = document.querySelector('select[name="size"]');

    if (colorSelect)
      colorSelect.disabled =
        supportSelect.selectedIndex === 0 || supportSelect.value === "Support";
    if (sizeSelect)
      sizeSelect.disabled =
        supportSelect.selectedIndex === 0 || supportSelect.value === "Support";

    supportSelect.addEventListener("change", () => {
      if (sizeSelect) {
        sizeSelect.disabled =
          supportSelect.selectedIndex === 0 ||
          supportSelect.value === "Support";
      }
      if (
        (supportSelect.selectedIndex === 0 ||
          supportSelect.value === "Support") &&
        colorSelect
      ) {
        for (let i = 0; i < colorSelect.options.length; i++) {
          if (colorSelect.options[i].disabled) {
            colorSelect.selectedIndex = i;
            break;
          }
        }
      } else if (supportSelect.value === "T-Shirt" && colorSelect) {
        for (let i = 0; i < colorSelect.options.length; i++) {
          if (colorSelect.options[i].text.toLowerCase() === "blanc") {
            colorSelect.selectedIndex = i;
            break;
          }
        }
      }
      updatePriceAndColor(
        supportSelect,
        quantitySelect,
        priceContainer,
        colorSelect
      );
    });
    quantitySelect.addEventListener("change", () => {
      updatePrice(supportSelect, quantitySelect, priceContainer);
    });

    if (colorSelect) {
      colorSelect.addEventListener("change", () => {
        if (supportSelect.value === "T-Shirt") {
          handleTShirtSelection(
            parseInt(quantitySelect.value) || 1,
            priceContainer,
            colorSelect
          );
        }
      });
    }
  }

  const form = document.getElementById("product-config-form");
  if (form) {
    handleAddToCart(form, product);
  }
};

if (window.location.pathname.includes("config-page.html")) {
  document.addEventListener("DOMContentLoaded", renderProductConfig);
}





