import THE_DANCE from "./assets/Dance.svg";
import THE_DRESS from "./assets/Dress.svg";
import SING from "./assets/Sing.svg";
import GAME from "./assets/Game.svg";
import THE_KISS from "./assets/Kiss.svg";

import DANSE_AGENDA from "./assets/produits/danse-agenda.jpg";
import DRESS_AGENDA from "./assets/produits/dress-agenda.jpg";
import GAME_AGENDA from "./assets/produits/game-agenda.jpg";
import KISS_AGENDA from "./assets/produits/kiss-agenda.jpg";
import SING_AGENDA from "./assets/produits/sing-agenda.jpg";

//T-SHIRTS BLANCS
import DANSE_BLANC from "./assets/produits/danse-blanc.jpg";
import DRESS_BLANC from "./assets/produits/danse-blanc.jpg";
import GAME_BLANC from "./assets/produits/danse-blanc.jpg";
import KISS_BLANC from "./assets/produits/danse-blanc.jpg";
import SING_BLANC from "./assets/produits/danse-blanc.jpg";

//T-SHIRTS NOIRS
import DANSE_NOIR from "./assets/produits/danse-noir.jpg";
import DRESS_NOIR from "./assets/produits/danse-noir.jpg";
import GAME_NOIR from "./assets/produits/danse-noir.jpg";
import KISS_NOIR from "./assets/produits/danse-noir.jpg";
import SING_NOIR from "./assets/produits/danse-noir.jpg";

//T-SHIRTS JAUNES
import DANSE_JAUNE from "./assets/produits/danse-jaune.jpg";
import DRESS_JAUNE from "./assets/produits/danse-jaune.jpg";
import GAME_JAUNE from "./assets/produits/danse-jaune.jpg";
import KISS_JAUNE from "./assets/produits/danse-jaune.jpg";
import SING_JAUNE from "./assets/produits/danse-jaune.jpg";

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
    Noir: ["DANSE_NOIR", "DRESS_NOIR", "GAME_NOIR", "KISS_NOIR", "SING_NOIR"],
    Blanc: [
      "DANSE_BLANC",
      "DRESS_BLANC",
      "GAME_BLANC",
      "KISS_BLANC",
      "SING_BLANC",
    ],
    Jaune: [
      "DANSE_JAUNE",
      "DRESS_JAUNE",
      "GAME_JAUNE",
      "KISS_JAUNE",
      "SING_JAUNE",
    ],
  },
  agenda: {
    design: [
      "DANSE_AGENDA",
      "DRESS_AGENDA",
      "GAME_AGENDA",
      "KISS_AGENDA",
      "SING_AGENDA",
    ],
  },
};

export { products, supports, variants };
