const form = document.getElementById('inventoryForm');
const tableBody = document.getElementById('inventoryTable');
const searchBar = document.getElementById('searchBar');
const totalValue = document.getElementById('totalValue');

let inventory = JSON.parse(localStorage.getItem('inventoryData')) || [];

function renderTable(items = inventory) {
  tableBody.innerHTML = '';
  let total = 0;

  items.forEach((item, i) => {
    const row = document.createElement('tr');
    total += item.quantity * item.price;

    row.innerHTML = `
      <td>${item.productName}</td>
      <td>${item.sku}</td>
      <td>${item.category}</td>
      <td>${item.quantity}</td>
      <td>${item.supplier}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.location}</td>
      <td>
        <button class="btn btn-sm btn-warning me-2" onclick="editItem(${i})"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-danger" onclick="deleteItem(${i})"><i class="bi bi-trash"></i></button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  totalValue.textContent = `💵 Total Inventory Value: $${total.toFixed(2)}`;
  localStorage.setItem('inventoryData', JSON.stringify(inventory));
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newItem = {
    productName: document.getElementById('productName').value,
    sku: document.getElementById('sku').value,
    category: document.getElementById('category').value,
    quantity: parseInt(document.getElementById('quantity').value),
    supplier: document.getElementById('supplier').value,
    price: parseFloat(document.getElementById('price').value),
    location: document.getElementById('location').value
  };

  const editIndex = document.getElementById('editIndex').value;

  const duplicate = inventory.find((item, idx) => item.sku === newItem.sku && idx != editIndex);
  if (duplicate) {
    alert('⚠️ SKU already exists! Please use a unique SKU.');
    return;
  }

  if (editIndex === '') {
    inventory.push(newItem);
  } else {
    inventory[editIndex] = newItem;
  }

  form.reset();
  document.getElementById('editIndex').value = '';
  renderTable();
});

function editItem(i) {
  const item = inventory[i];
  document.getElementById('editIndex').value = i;
  document.getElementById('productName').value = item.productName;
  document.getElementById('sku').value = item.sku;
  document.getElementById('category').value = item.category;
  document.getElementById('quantity').value = item.quantity;
  document.getElementById('supplier').value = item.supplier;
  document.getElementById('price').value = item.price;
  document.getElementById('location').value = item.location;
}

function deleteItem(i) {
  if (confirm('Are you sure you want to delete this item?')) {
    inventory.splice(i, 1);
    renderTable();
  }
}

searchBar.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = inventory.filter(item =>
    item.productName.toLowerCase().includes(query) ||
    item.sku.toLowerCase().includes(query)
  );
  renderTable(filtered);
});

renderTable();