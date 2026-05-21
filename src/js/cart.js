import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".cart-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <span class="cart-remove" data-id="${item.product.Id}">✕</span>
  <a href="#" class="cart-card__image">
    <img
      src="${item.product.Images.PrimaryMedium}"
      alt="${item.product.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.product.Name}</h2>
  </a>
  <p class="cart-card__color">${item.product.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${item.quantity}</p>
  <p class="cart-card__price">$${item.product.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
document.querySelector(".cart-list").addEventListener("click", (event) => {
  const removeBtn = event.target.closest(".cart-remove");
  if (!removeBtn) return;

  const idToRemove = removeBtn.dataset.id;
  removeFromCart(idToRemove);
});

function removeFromCart(id) {
  const cart = getLocalStorage("so-cart") || []; // Read the current cart from local storage
  const updatedCart = cart.filter((item) => item.product.Id != id);  // Create a new cart without the item we want to remove
  localStorage.setItem("so-cart", JSON.stringify(updatedCart));   // Save the updated cart

  renderCartContents(); // Re-render the cart contents
}
