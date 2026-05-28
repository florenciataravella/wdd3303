const baseURL = import.meta.env.VITE_SERVER_URL

/*function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}*/

async function convertToJson(res) {
  const data = await res.json();    //if data is not ok, then, it won´t be converted to json and data will be the response of   the server like: wrong credit card number.  
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

export default class ExternalServices {


  constructor() {
   
  }
async getData(category) {
  const response = await fetch(`${baseURL}products/search/${category} `);
  const data = await convertToJson(response);
  return data.Result;
}
  /*async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }*/
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id} `);
    const data = await convertToJson(response);
    return data.Result;  //data is the full object returned by the API. Result is a property (a key) inside the JSON object returned by the server (the name is chosen by whoever created the API).
 
}
async checkout(payload) {
  const jsonResponse = JSON.stringify(payload)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      //body: JSON.stringify(payload),
      body: jsonResponse
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}
