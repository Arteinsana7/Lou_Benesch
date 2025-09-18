import THE_DANCE from "./assets/Dance.svg";
import THE_DRESS from "./assets/Dress.svg";
import SING from "./assets/Sing.svg";
import GAME from "./assets/Game.svg";
import THE_KISS from "./assets/Kiss.svg";

const products = [
  {
    id: 1,
    name: "The Dance",
    price: "-",
    image: [THE_DANCE],
    quantity: 1,
  },
  {
    id: 2,
    name: "The Dress",
    price: "-",
    image: [THE_DRESS],
    quantity: 1,
  },
  {
    id: 3,
    name: "Sing",
    price: "-",
    image: [SING],
    quantity: 1,
  },
  {
    id: 4,
    name: "Game",
    price: "-",
    image: [GAME],
    quantity: 1,
  },
  {
    id: 5,
    name: "The Kiss",
    price: "-",
    image: [THE_KISS],
    quantity: 1,
  },
];

const supports = {
  tshirt: {
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Noir", "Blanc", "Beige"],
    price: 24.99,
  },
  agenda: {
    sizes: ["A5", "A6"],
    colors: ["Noir", "Blanc", "Jaune"],
    price: 19.99,
  },
};

const variants = {
  tshirt: {
    Noir: ["lien de l'image"],
    Blanc: ["lien de l'image"],
    Jaune: ["lien de l'image"],
  },
  agenda: {
    Bleu: ["lien de l'image"],
    Blanc: ["lien de l'image"],
    Jaune: ["lien de l'image"],
  },
};

export { products, supports, variants };
