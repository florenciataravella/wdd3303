import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.dataSource = dataSource;
    this.product = {};
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
  this.renderProductDetails();

    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }


addProductToCart() {
  
  const cartItems = getLocalStorage("so-cart") || [];
  //localStorage.removeItem("so-cart");
  let existingItem = null;

  cartItems.forEach(item => {
    console.log("item:", item);
    if (this.productId === item.product.Id) {
      existingItem = item;
       
    }
  });

  if (existingItem) {
    existingItem.quantity += 1;
    
  } else {
    cartItems.push({
      product: this.product,
      quantity: 1
    });
  }

  setLocalStorage("so-cart", cartItems);
}
/*
 addProductToCart() {
    
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
 }*/

  renderProductDetails() {
    const container = document.querySelector(".product-detail");
    const discount = Math.round (
      (1 - this.product.FinalPrice / this.product.SuggestedRetailPrice) * 100 
    );

    container.innerHTML = `
      <h3>${this.product.Brand.Name}</h3>
      <h2 class="divider">${this.product.NameWithoutBrand}</h2>

      <img class="divider" src="${this.product.Images.PrimaryLarge}" alt="${this.product.NameWithoutBrand}" />

      <p class="product-card__price"><span class="final-price">$${this.product.FinalPrice}</span></p>

      <span class="retail-price">$${this.product.SuggestedRetailPrice}</span>

      <span class="discount-badge"> - ${discount} % </span>

      <p class="product__color">${this.product.Colors[0].ColorName}</p>

      <p class="product__description">${this.product.DescriptionHtmlSimple}</p>

      <div class="product-detail__add">
        <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
      </div>
    `;
  }
  
}
