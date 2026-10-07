let expenses = [];


// CHANGE PAGE

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");

    if (pageId === "expenseListPage") {
        displayExpenses();
    }

    if (pageId === "monthlyPage") {
        calculateTotal();
    }
}


// SIGN IN

function login() {

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    if (username !== "" && password !== "") {

        document.getElementById("loginMessage").innerText = "";

        showPage("homePage");

    } else {

        document.getElementById("loginMessage").innerText =
            "Please enter username and password.";
    }
}


// ADD EXPENSE

function addExpense() {

    let name = document.getElementById("expenseName").value;
    let amount = Number(document.getElementById("expenseAmount").value);
    let category = document.getElementById("expenseCategory").value;

    if (name === "" || amount <= 0) {

        document.getElementById("expenseMessage").innerText =
            "Please enter valid expense details.";

        return;
    }

    expenses.push({
        name: name,
        amount: amount,
        category: category
    });

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";

    document.getElementById("expenseMessage").innerText =
        "Expense added successfully!";

    calculateTotal();
}


// DISPLAY EXPENSES

function displayExpenses() {

    let list = document.getElementById("expenseList");

    if (expenses.length === 0) {

        list.innerHTML = "<p>No expenses added yet.</p>";

        return;
    }

    list.innerHTML = "";

    expenses.forEach(function(expense) {

        list.innerHTML += `
            <div class="expense-item">
                <div>
                    <strong>${expense.name}</strong>
                    <br>
                    <small>${expense.category}</small>
                </div>

                <strong>₹${expense.amount}</strong>
            </div>
        `;
    });
}


// CALCULATE TOTAL

function calculateTotal() {

    let total = 0;

    expenses.forEach(function(expense) {
        total += expense.amount;
    });

    document.getElementById("totalAmount").innerText = total;
}