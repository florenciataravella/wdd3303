import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement){

  const formData = new FormData(formElement);
  const convertedJSON = {}

  formData.forEach((value, key) =>{
    convertedJSON[key] = value;
  })
  return convertedJSON
}

function packageItems(items){

  const simplifiedItems = items.map((item) => {
    console.log(item)
    return {
      id: item.product.Id,
      price: item.product.FinalPrice,
      name: item.product.Name,
      quantity: item.quantity,
    };
  });
  return simplifiedItems;
}
  export default class CheckoutProcess{

  constructor(key, outputSelector){
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.tax = 0;
    this.shipping = 0;
    this.itemTotal = 0;
    this.orderTotal = 0;
  }

init() {
  this.list = getLocalStorage(this.key);
  console.log("so-cart:", this.key)
  console.log("list: ", this.list)
  this.calculateItemSummary()
  
  

}
calculateItemSummary(){
  const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal"
  )
  const itemNumElement = document.querySelector(
    this.outputSelector + " #num-items"
  )

  let itemNum = 0;
  this.list.forEach(item =>{
    itemNum = itemNum + item.quantity;
  })
  itemNumElement.innerText = itemNum;
  
 this.list.forEach(item =>{
  this.itemTotal = this.itemTotal + (item.product.FinalPrice) * item.quantity; 
 })

  summaryElement.innerHTML = `$${this.itemTotal}`;;
  
}
calculateOrderTotals(){
  this.tax = (this.itemTotal * 0.6);

   let itemNum = 0;
  this.list.forEach(item =>{
    itemNum = itemNum + item.quantity;
  });

  this.shipping = (itemNum - 1) * 2 + 10;
  this.orderTotal = (
      parseFloat(this.itemTotal) + 
      parseFloat(this.tax) + 
      parseFloat(this.shipping)
  );
this.displayOrderTotals();
}
displayOrderTotals(){
  const taxElement = document.querySelector(
    this.outputSelector + " #tax"
  )
  const shippingElement = document.querySelector(
    this.outputSelector + " #shipping"
  )
  const orderTotalElement = document.querySelector(
    this.outputSelector + " #orderTotal"
  )
taxElement.innerHTML = `$${this.tax.toFixed(2)}`;
shippingElement.innerHTML = `$${this.shipping.toFixed(2)}`;
orderTotalElement.innerHTML = `$${this.orderTotal.toFixed(2)}`;
}
clearTotals(){
  const taxElement = document.querySelector(
    this.outputSelector + " #tax"
  )
  const shippingElement = document.querySelector(
    this.outputSelector + " #shipping"
  )
  const orderTotalElement = document.querySelector(
    this.outputSelector + " #orderTotal"
  )
  const summaryElement = document.querySelector(
      this.outputSelector + " #cartTotal"
  )
  const itemNumElement = document.querySelector(
    this.outputSelector + " #num-items"
  )
itemNumElement.innerText = "";
summaryElement.innerHTML = "";  
taxElement.innerHTML = "";
shippingElement.innerHTML = "";
orderTotalElement.innerHTML = "";

}

async checkout(){
    const formElement = document.forms["checkout"];
    const order = formDataToJSON(formElement);
    order.orderDate = new Date().toISOString();
    order.orderTotal = Number(this.orderTotal.toFixed(2));
    order.tax = Number(this.tax.toFixed(2));
    order.shipping = Number(this.shipping.toFixed(2));
    order.items = packageItems(this.list);
     
    try{
      const response = await services.checkout(order)  //ExternalServices asyn method that sends the order to the server
      console.log(response);  
      
    }
    catch (err){
      console.log(err)
      
      
    }
  this.clearTotals();
  }  
}


