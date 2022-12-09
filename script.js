const form = document.querySelector(".form");
const formButtons = document.querySelector(".formButtons");
const list = document.querySelector(".paragonContent");
const quantityElement = document.getElementById("quantity");
const productElement = document.getElementById("product");
const priceElement = document.getElementById("price");
const sumElement = document.getElementById("sumValue");
let products = JSON.parse(localStorage.getItem("products") || "[]");
const arrowDown = document.getElementById("arrowDown");
const arrowUp = document.getElementById("arrowUp");

let id, product, quantity, price, tempId;
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
    arrowDown.style.visibility = "hidden";
    arrowUp.style.visibility = "hidden";
    id = tempId;
  } else {
    this.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    pickedRow = this;
    deleteButton.style.visibility = "visible";
    editButton.textContent = "edytuj";
    editButton.className = "edit";
    editButton.setAttribute("type", "button");
    form.product.value = pickedRow.children[1].textContent;
    form.quantity.value = pickedRow.children[0].textContent;
    form.price.value = pickedRow.children[2].textContent;
    product = products.find(
      (product) => product.productName == pickedRow.children[1].textContent
    );
    arrowDown.style.visibility = "visible";
    arrowUp.style.visibility = "visible";
    tempId = id;
    id = product.id;
  }
}

function upHandler() {
  const index = products.findIndex(
    (product) => product.productName == pickedRow.children[1].textContent
  );

  if (index == 0) return;

  product = products.find(
    (product) => product.productName == pickedRow.children[1].textContent
  );

  products[index] = products[index - 1];
  products[index - 1] = product;
  console.log(products);

  let delProduct = list.lastChild;
  while (delProduct) {
    list.removeChild(delProduct);
    delProduct = list.lastChild;
  }

  sum = 0;
  products.forEach((p, index) => {
    addItem(p, products[index].id);
  });

  localStorage.setItem("products", JSON.stringify(products));
  pickedRow = document.getElementById(product.id.toString());
  pickedRow.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
}

function downHandler() {
  const index = products.findIndex(
    (product) => product.productName == pickedRow.children[1].textContent
  );

  if (index == products.length - 1) return;

  product = products.find(
    (product) => product.productName == pickedRow.children[1].textContent
  );

  products[index] = products[index + 1];
  products[index + 1] = product;

  let delProduct = list.lastChild;
  while (delProduct) {
    list.removeChild(delProduct);
    delProduct = list.lastChild;
  }
  sum = 0;
  products.forEach((p, index) => {
    addItem(p, products[index].id);
  });

  localStorage.setItem("products", JSON.stringify(products));
  pickedRow = document.getElementById(product.id.toString());
  pickedRow.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  // pickedRow. = "black";
}

arrowUp.onclick = upHandler;

arrowDown.onclick = downHandler;

const addItem = (p, ident) => {
  const receiptRow = document.createElement("div");
  // const rowId = document.createElement("p");
  const rowQuantity = document.createElement("p");
  const rowProduct = document.createElement("p");
  const rowPrice = document.createElement("p");
  const rowSum = document.createElement("p");
  // rowId.textContent = p.id;
  rowQuantity.textContent = p.quantity;
  rowProduct.textContent = p.productName;
  rowPrice.textContent = p.price;
  rowSum.textContent = p.sum;
  // rowId.className = "header";
  rowQuantity.className = "header";
  rowProduct.className = "header";
  rowProduct.className += " product";
  rowPrice.className = "header";
  rowSum.className = "header";
  // receiptRow.appendChild(rowId);
  receiptRow.appendChild(rowQuantity);
  receiptRow.appendChild(rowProduct);
  receiptRow.appendChild(rowPrice);
  receiptRow.appendChild(rowSum);
  receiptRow.className = "row";
  receiptRow.onclick = selectHandler;

  editButton.onclick = function editItem() {
    const index = products.findIndex((product) => product.id == id);
    const editedProduct = {
      id: id,
      productName: form.product.value,
      quantity: form.quantity.value,
      price: form.price.value,
      sum: Math.round(form.price.value * form.quantity.value * 100) / 100,
    };
    console.log(id);
    sum -= products[index].sum;
    sum += editedProduct.sum;
    if (index != -1) products[index] = editedProduct;
    sumElement.textContent = sum + " zł";
    pickedRow.children[0].textContent = editedProduct.quantity;
    pickedRow.children[1].textContent = editedProduct.productName;
    pickedRow.children[2].textContent = editedProduct.price;
    pickedRow.children[3].textContent = editedProduct.sum;
    console.log(products);
    localStorage.setItem("products", JSON.stringify(products));
  };

  deleteButton.onclick = function deleteItem() {
    let isExecuted = confirm("Czy na pewno chcesz usunąć ten zapis?");
    if (isExecuted == true) {
      const index = products.findIndex((product) => product.id == id);
      sum -= products[index].sum;
      sumElement.textContent = sum + " zł";
      products.splice(index, 1);
      localStorage.setItem("products", JSON.stringify(products));
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
  };

  receiptRow.id = ident;
  list.appendChild(receiptRow);

  sum += p.sum;
  sum = Math.round(sum * 100) / 100;
  sumElement.textContent = sum + " zł";
};

products.forEach((p, index) => {
  addItem(p, products[index].id);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  id = Math.random();
  quantity = quantityElement.value;
  product = productElement.value;
  price = priceElement.value;

  const productObject = {
    id: id,
    productName: product,
    quantity: quantity,
    price: price,
    sum: Math.round(price * quantity * 100) / 100,
  };
  console.log(productObject);

  addItem(productObject, id);

  products.push(productObject);

  localStorage.setItem("products", JSON.stringify(products));

  form.product.value = "";
  form.quantity.value = "";
  form.price.value = "";
});
