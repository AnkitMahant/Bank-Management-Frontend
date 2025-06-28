const API_BASE = "http://localhost:8080/api/accounts";
let editingId = null;

function fetchAccounts() {
  fetch(API_BASE)
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("accountsTable");
      table.innerHTML = "";
      data.forEach(account => {
        table.innerHTML += `
          <tr>
            <td>${account.id}</td>
            <td>${account.accountNumber}</td>
            <td>${account.name}</td>
             <td>${account.email}</td>
            <td>${account.type}</td>
            <td>${account.balance}</td>
            <td>${account.branch}</td>
            <td>
              <button onclick="editAccount(${account.id})">Edit</button>
              <button class="delete" onclick="deleteAccount(${account.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    });
}

function addAccount() {
  const data = {
    accountNumber: document.getElementById("accountNumber").value,
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    type: document.getElementById("type").value,
    balance: parseFloat(document.getElementById("balance").value),
    branch: document.getElementById("branch").value
  };

  const method = editingId ? "PUT" : "POST";
  const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(() => {
      fetchAccounts();
      editingId = null;
      document.querySelectorAll(".form input").forEach(input => input.value = "");
    });
}

function deleteAccount(id) {
  fetch(`${API_BASE}/${id}`, { method: "DELETE" })
    .then(fetchAccounts);
}

function editAccount(id) {
  fetch(`${API_BASE}/${id}`)
    .then(res => res.json())
    .then(account => {
      document.getElementById("accountNumber").value = account.accountNumber;
      document.getElementById("name").value = account.name;
       document.getElementById("email").value = account.email;
      document.getElementById("type").value = account.type;
      document.getElementById("balance").value = account.balance;
      document.getElementById("branch").value = account.branch;

      editingId = id;
    });
}

window.onload = fetchAccounts;
