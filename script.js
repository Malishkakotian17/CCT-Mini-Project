document.addEventListener("DOMContentLoaded", function () {
    const prices = {
        pizza: 150, burger: 100, pasta: 120, samosa: 40, chicken_roll: 130,
        coke: 50, lemonade: 60, coffee: 80, mojito: 70, milkshake: 90,
        vanilla: 60, chocolate: 70, strawberry: 65, butterscotch: 75, mango: 80,
        brownie: 110, pastry: 130, donut: 80, cupcake: 90, muffin: 85
    };

    const quantities = {};
    let selectedPayment = null;

    // Initialize quantities
    for (const item in prices) {
        quantities[item] = 0;
    }

    function updateTotalBill() {
        let total = 0;
        let orderSummary = [];

        for (const item in quantities) {
            const quantity = quantities[item];
            if (quantity > 0) {
                total += quantity * prices[item];
                orderSummary.push({ name: item, quantity: quantity });
            }
        }

        const totalElement = document.getElementById("total-bill");
        if (totalElement) {
            totalElement.innerHTML = "Total Bill: ₹ " + total;

            // Pulse animation
            totalElement.classList.remove("pop");
            void totalElement.offsetWidth;
            totalElement.classList.add("pop");
        }

        localStorage.setItem("orderSummary", JSON.stringify(orderSummary));
    }

    // Event listeners for +/- buttons
    document.querySelectorAll(".qty-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const item = this.dataset.item;
            const isPlus = this.classList.contains("plus");

            if (isPlus) {
                quantities[item]++;
            } else {
                if (quantities[item] > 0) {
                    quantities[item]--;
                }
            }

            // Update display
            const span = document.getElementById(`qty-${item}`);
            if (span) {
                span.textContent = quantities[item];

                // Pop animation for the number
                span.classList.remove("pop");
                void span.offsetWidth;
                span.classList.add("pop");
            }

            updateTotalBill();
        });
    });

    // Payment Selection
    window.selectPayment = function (mode) {
        selectedPayment = mode;
        document.querySelectorAll(".payment-option").forEach(opt => {
            opt.classList.remove("selected");
        });

        // Find the clicked element (might be the div or its children)
        const options = document.querySelectorAll(".payment-option");
        options.forEach(opt => {
            if (opt.textContent.toLowerCase().includes(mode)) {
                opt.classList.add("selected");
            }
        });
    };
});

function goToConfirmation() {
    // Save Order to History
    const orderSummary = JSON.parse(localStorage.getItem("orderSummary"));
    const totalElement = document.getElementById("total-bill");

    if (orderSummary && orderSummary.length > 0 && totalElement) {
        const totalText = totalElement.innerText;
        const totalAmount = totalText.split("₹ ")[1];

        const recentOrder = {
            items: orderSummary,
            total: totalAmount,
            date: new Date().toLocaleDateString()
        };
        localStorage.setItem("recentOrder", JSON.stringify(recentOrder));
    }

    window.location.href = "thank.html";
}
