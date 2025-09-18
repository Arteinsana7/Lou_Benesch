export function createFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";

  footer.innerHTML = `
    <div class="footer-links">
      <div class="icons" onclick="location.href='#'"><img src="../assets/icons8-facebook-nouveau-50.svg" alt="facebook"></div>
      <div class="icons" onclick="location.href='#'"><img src="../assets/icons8-instagram-50.svg" alt="insta"></div>
      <div class="icons" onclick="location.href='#'"><img src="../assets/icons8-tic-tac-50.svg" alt="tiktok"></div>
    </div>
    <p>&copy; 2025 Lou Benesch. Tous droits réservés.</p>
  `;

  document.body.appendChild(footer);
}
