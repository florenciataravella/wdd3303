import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";
import { modalHandler } from "./utils.mjs";
loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init();

document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotals.bind(order));

// listening for click on the button
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();

  const myForm = document.forms["checkout"];
  const check_status = myForm.checkValidity();
  myForm.reportValidity();
  
  if(check_status){
      order.checkout();
      console.log("The form has been submitted")
      console.log(order)
      myForm.reset();
      modalHandler();
  }
  else{
    console.log("The form has not been submitted")
  }
});
