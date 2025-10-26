const tableBody = document.querySelector("#productTable tbody");
let billData = [];

function addRow() {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" placeholder="Product"></td>
    <td><input type="number" placeholder="Qty" min="1"></td>
    <td><input type="number" placeholder="Price" min="0"></td>
    <td><span>0.00</span></td>
  `;
  tableBody.appendChild(row);
}

function calculateBill() {
  billData = [];
  let subtotal = 0;

  const rows = tableBody.querySelectorAll("tr");
  rows.forEach((row) => {
    const name = row.cells[0].children[0].value || "Unnamed";
    const qty = parseFloat(row.cells[1].children[0].value) || 0;
    const price = parseFloat(row.cells[2].children[0].value) || 0;
    const total = qty * price;

    row.cells[3].children[0].textContent = total.toFixed(2);
    subtotal += total;

    billData.push({ name, qty, price, total });
  });

  const discountPercent = parseFloat(document.getElementById("discountInput").value) || 0;
  const discount = (subtotal * discountPercent) / 100;
  const gst = (subtotal - discount) * 0.05;
  const final = subtotal - discount + gst;

  const now = new Date().toLocaleString();

  document.getElementById("result").innerHTML = `
    <h2>🧾 Final Bill</h2>
    <p><strong>Date & Time:</strong> ${now}</p>
    <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
    <p><strong>Discount (${discountPercent}%):</strong> ₹${discount.toFixed(2)}</p>
    <p><strong>GST (5%):</strong> ₹${gst.toFixed(2)}</p>
    <h3>Total Payable: ₹${final.toFixed(2)}</h3>
  `;

  billData.push({ subtotal, discount, gst, final, discountPercent, now });
}

function downloadBill() {
  if (billData.length === 0) {
    alert("Please generate the bill first!");
    return;
  }

  let text = "-----------------------------\n";
  text += "     SMART BILLING SYSTEM\n";
  text += "-----------------------------\n";
  text += `Date & Time: ${billData[billData.length - 1].now}\n\n`;
  text += "Product\tQty\tPrice\tTotal\n";

  billData.forEach((item) => {
    if (item.name) {
      text += `${item.name}\t${item.qty}\t${item.price}\t${item.total}\n`;
    }
  });

  text += "\n-----------------------------\n";
  text += `Subtotal: ₹${billData[billData.length - 1].subtotal.toFixed(2)}\n`;
  text += `Discount (${billData[billData.length - 1].discountPercent}%): ₹${billData[billData.length - 1].discount.toFixed(2)}\n`;
  text += `GST (5%): ₹${billData[billData.length - 1].gst.toFixed(2)}\n`;
  text += `Final Amount: ₹${billData[billData.length - 1].final.toFixed(2)}\n`;
  text += "-----------------------------\nThank you for shopping!\n";

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Bill.txt";
  link.click();
}

function resetBill() {
  tableBody.innerHTML = "";
  document.getElementById("result").innerHTML = "";
  document.getElementById("discountInput").value = "";
}
