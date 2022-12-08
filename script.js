const form = document.querySelector(".form");
const formButtons = document.querySelector(".formButtons");
const list = document.querySelector(".paragonContent");
let idElement = 0;
const quantityElement = document.getElementById("quantity");
const productElement = document.getElementById("product");
const priceElement = document.getElementById("price");
const sumElement = document.getElementById("sumValue");
let products = JSON.parse(localStorage.getItem("products") || "[]");

let id, product, quantity, price;
let sum = 0;

let pickedRow = null;

const deleteButton = document.querySelector(".del");
const editButton = document.querySelector(".submit");

function selectHandler() {
  const rows = document.getElementsByClassName("row");
  Array.from(rows).forEach((row) => {
    row.style.backgroundColor = "transparent";
  });
  if (this == pickedRow) {
    this.style.backgroundColor = "transparent";
    pickedRow = null;
    deleteButton.style.visibility = "hidden";
    editButton.textContent = "dodaj";
    editButton.className = "submit";
    editButton.setAttribute("type", "submit");
    form.product.value = "";
    form.quantity.value = "";
    form.price.value = "";
  } else {
    this.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    pickedRow = this;
    deleteButton.style.visibility = "visible";
    editButton.textContent = "edytuj";
    editButton.className = "edit";
    editButton.setAttribute("type", "button");
    form.product.value = pickedRow.children[2].textContent;
    form.quantity.value = pickedRow.children[1].textContent;
    form.price.value = pickedRow.children[3].textContent;
  }
}


const addItem = (p) => {
  const receiptRow = document.createElement("div");
  const rowId = document.createElement("p");
  const rowQuantity = document.createElement("p");
  const rowProduct = document.createElement("p");
  const rowPrice = document.createElement("p");
  const rowSum = document.createElement("p");
  rowId.textContent = p.id;
  rowQuantity.textContent = p.quantity;
  rowProduct.textContent = p.productName;
  rowPrice.textContent = p.price;
  rowSum.textContent = p.sum;
  rowId.className = "header";
  rowQuantity.className = "header";
  rowProduct.className = "header";
  rowProduct.className += " product";
  rowPrice.className = "header";
  rowSum.className = "header";
  receiptRow.appendChild(rowId);
  receiptRow.appendChild(rowQuantity);
  receiptRow.appendChild(rowProduct);
  receiptRow.appendChild(rowPrice);
  receiptRow.appendChild(rowSum);
  receiptRow.className = "row";
  receiptRow.onclick = selectHandler;


  editButton.onclick = function editItem(){
    console.log(pickedRow.children)
    console.log(form.price.value);
   
    const index = products.findIndex(product => product.productName == form.product.value);
    //const index = products.findIndex(product => product.id == id);
    const editedProduct = {
      id: id,
      productName: form.product.value,
      quantity: form.quantity.value,
      price: form.price.value
    };
    console.log(id);
    products[index] = editedProduct;
    pickedRow.children[1].textContent = editedProduct.quantity;
    pickedRow.children[2].textContent = editedProduct.productName;
    pickedRow.children[3].textContent = editedProduct.price;
    console.log(products);
    localStorage.setItem("products", JSON.stringify(products));
  }

  deleteButton.onclick = function deleteItem(){
    let isExecuted = confirm("Czy na pewno chcesz usunąć ten zapis?");
    if(isExecuted == true){
      const index = products.findIndex(product => product.productName == form.product.value);
      //const index = products.findIndex(product => product.id == id);
      products.splice(index, 1);
      localStorage.setItem("products",JSON.stringify(products));
      pickedRow.remove();
      deleteButton.style.visibility = "hidden";
      editButton.textContent = "dodaj";
      editButton.className = "submit";
      editButton.setAttribute("type", "submit");
      form.product.value = "";
      form.quantity.value = "";
      form.price.value = "";
    } else {
      return;
    }
  }

  list.appendChild(receiptRow);

  sum += p.sum;
  sum = Math.round(sum * 100) / 100;
  sumElement.textContent = sum + " zł";
};

products.forEach((p) => {
  addItem(p);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  id = idElement;
  quantity = quantityElement.value;
  product = productElement.value;
  price = priceElement.value;

  const productObject = {
    id: id,
    productName: product,
    quantity: quantity,
    price: price,
    sum: sum,
  };

  addItem(productObject);

  products.push(productObject);

  localStorage.setItem("products", JSON.stringify(products));

  form.product.value = "";
  form.quantity.value = "";
  form.price.value = "";
});

