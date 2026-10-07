let expenses = [];
let total = 0;

function addExpense() {

    let name = document.getElementById("expenseName").value;
    let amount = document.getElementById("expenseAmount").value;
    let category = document.getElementById("expenseCategory").value;
    let date = document.getElementById("expenseDate").value;

    if (name === "" || amount === "" || date === "") {
        alert("Please fill all the fields");
        return;
    }

    let expense = {
        name: name,
        amount: Number(amount),
        category: category,
        date: date
    };

    expenses.push(expense);

    displayExpenses();

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseDate").value = "";
}

function displayExpenses() {

    let expenseList = document.getElementById("expenseList");

    expenseList.innerHTML = "";

    total = 0;

    for (let i = 0; i < expenses.length; i++) {

        total = total + expenses[i].amount;

        let row = document.createElement("tr");

        row.innerHTML =
            "<td>" + expenses[i].name + "</td>" +
            "<td>₹" + expenses[i].amount + "</td>" +
            "<td>" + expenses[i].category + "</td>" +
            "<td>" + expenses[i].date + "</td>" +
            "<td><button class='delete-button' onclick='deleteExpense(" + i + ")'>Delete</button></td>";

        expenseList.appendChild(row);
    }

    document.getElementById("totalAmount").innerText = total;
}

function deleteExpense(index) {

    expenses.splice(index, 1);

    displayExpenses();
}