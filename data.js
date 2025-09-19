// agenda
const agendaProducts = [
  "./assets/produits/danse-agenda.jpg",
  "./assets/produits/dress-agenda.jpg",
  "./assets/produits/sing-agenda.jpg",
  "./assets/produits/game-agenda.jpg",
  "./assets/produits/kiss-agenda.jpg",
];

//T-SHIRTS BLANCS
const tshirtBlancProducts = [
  "./assets/produits/danse-blanc.jpg",
  "./assets/produits/dress-blanc.jpg",
  "./assets/produits/sing-blanc.jpg",
  "./assets/produits/game-blanc.jpg",
  "./assets/produits/kiss-blanc.jpg",
];

//T-SHIRTS NOIRS
const tshirtNoirProducts = [
  "./assets/produits/danse-noir.jpg",
  "./assets/produits/dress-noir.jpg",
  "./assets/produits/sing-noir.jpg",
  "./assets/produits/game-noir.jpg",
  "./assets/produits/kiss-noir.jpg",
];

//T-SHIRTS JAUNES
const tshirtJauneProducts = [
  "./assets/produits/danse-jaune.jpg",
  "./assets/produits/dress-jaune.jpg",
  "./assets/produits/sing-jaune.jpg",
  "./assets/produits/game-jaune.jpg",
  "./assets/produits/kiss-jaune.jpg",
];

const products = [
  {
    id: 1,
    name: "The Dance",
    price: "-",
    image: ["../assets/Dance.svg"],
    quantity: 1,
  },
  {
    id: 2,
    name: "The Dress",
    price: "-",
    image: ["../assets/The-Dress.svg"],
    quantity: 1,
  },
  {
    id: 3,
    name: "Sing",
    price: "-",
    image: ["../assets/Sing.svg"],
    quantity: 1,
  },
  {
    id: 4,
    name: "Game",
    price: "-",
    image: ["../assets/Game.svg"],
    quantity: 1,
  },
  {
    id: 5,
    name: "The Kiss",
    price: "-",
    image: ["../assets/The-Kiss.svg"],
    quantity: 1,
  },
];

const supports = {
  tshirt: {
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Noir", "Blanc", "Jaune"],
    price: 24.99,
  },
  agenda: {
    sizes: ["A5", "A6"],
    colors: ["Bleu", "Blanc", "Jaune"],
    price: 19.99,
  },
};

const variants = {
  tshirt: {
    blanc: tshirtBlancProducts,
    noir: tshirtNoirProducts,
    jaune: tshirtJauneProducts,
  },
  agenda: {
    design: agendaProducts,
  },
};

export { products, supports, variants };
