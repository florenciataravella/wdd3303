import { getLocalStorage } from "./utils.mjs";
import { loadHeaderFooter} from "./utils.mjs";

loadHeaderFooter();

/*window.addEventListener("beforeunload", () => {
  localStorage.removeItem("so-cart");
});*/

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
 
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".cart-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
   const product = item.product || item;
   const quantity = item.quantity || 1;  
   const image = product.Images?.PrimaryMedium || product.Image; 
  const newItem = `<li class="cart-card divider">
  <span class="cart-remove" data-id="${product.Id}">✕</span>
  <a href="#" class="cart-card__image">
    <img
      src="${image}"
      alt="${product.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${product.Name}</h2>
  </a>
  <p class="cart-card__color">${product.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: ${quantity || 0 }</p>
  <p class="cart-card__price">$${product.FinalPrice}</p>
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
const checkoutBtn = document.getElementById("checkout");
checkoutBtn.addEventListener("click", ()=>{
  window.location.href = "/checkout/index.html"
})

