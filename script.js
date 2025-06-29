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
            <td>₹${parseFloat(account.balance).toFixed(2)}</td>
            <td>${account.branch}</td>
            <td>
              <button class="action-btn edit-btn" onclick="editAccount(${account.id})">Edit</button>
              <button class="action-btn delete-btn" onclick="deleteAccount(${account.id})">Delete</button>
            </td>
          </tr>
        `;
      });
    })
    .catch(err => {
      alert("Error fetching accounts: " + err);
    });
}

function addAccount() {
  const data = {
    accountNumber: document.getElementById("accountNumber").value.trim(),
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    type: document.getElementById("type").value.trim(),
    balance: parseFloat(document.getElementById("balance").value.trim()),
    branch: document.getElementById("branch").value.trim()
  };

  // Basic form validation
  if (!data.accountNumber || !data.name || !data.email || !data.type || isNaN(data.balance) || !data.branch) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const method = editingId ? "PUT" : "POST";
  const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => {
      if (!res.ok) throw new Error("Server error");
      return res.json();
    })
    .then(() => {
      fetchAccounts();
      editingId = null;
      clearForm();
    })
    .catch(err => {
      alert("Error saving account: " + err);
    });
}

function deleteAccount(id) {
  if (!confirm("Are you sure you want to delete this account?")) return;

  fetch(`${API_BASE}/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Delete failed");
      return res;
    })
    .then(fetchAccounts)
    .catch(err => alert("Error deleting account: " + err));
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
    })
    .catch(err => {
      alert("Error loading account for editing: " + err);
    });
}

function clearForm() {
  document.querySelectorAll(".form-card input").forEach(input => input.value = "");
}

window.onload = fetchAccounts;
