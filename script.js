const form = document.querySelector(".form");
const list = document.querySelector(".paragonContent");
const quantityElement = document.getElementById("quantity");
const productElement = document.getElementById("product");
const priceElement = document.getElementById("price");
const sumElement = document.getElementById("sumValue");
let products = JSON.parse(localStorage.getItem("products") || "[]");

let product, quantity, price;
let sum = 0;

let pickedRow = null;

function selectHandler() {
  const rows = document.getElementsByClassName("row");
  Array.from(rows).forEach((row) => {
    row.style.backgroundColor = "transparent";
  });
  if (this == pickedRow) {
    this.style.backgroundColor = "transparent";
    pickedRow = null;
  } else {
    this.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    pickedRow = this;
  }
}

const addItem = (p) => {
  const receiptRow = document.createElement("div");
  const rowQuantity = document.createElement("p");
  const rowProduct = document.createElement("p");
  const rowPrice = document.createElement("p");
  const rowSum = document.createElement("p");
  rowQuantity.textContent = p.quantity;
  rowProduct.textContent = p.productName;
  rowPrice.textContent = p.price;
  rowSum.textContent = p.sum;
  rowQuantity.className = "header";
  rowProduct.className = "header";
  rowProduct.className += " product";
  rowPrice.className = "header";
  rowSum.className = "header";
  receiptRow.appendChild(rowQuantity);
  receiptRow.appendChild(rowProduct);
  receiptRow.appendChild(rowPrice);
  receiptRow.appendChild(rowSum);
  receiptRow.className = "row";
  receiptRow.onclick = selectHandler;

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
  quantity = quantityElement.value;
  product = productElement.value;
  price = priceElement.value;

  const productObject = {
    productName: product,
    quantity: quantity,
    price: price,
    sum: sum,
  };

  addItem(productObject);

  products.push(productObject);

  localStorage.setItem("products", JSON.stringify(products));
});
