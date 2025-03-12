document.addEventListener("DOMContentLoaded", () => {
    const supplyItem = document.getElementById("supply-item");
    const supplyQuantity = document.getElementById("supply-quantity");
    const requestBtn = document.getElementById("request-supply-btn");
    const requestMessage = document.getElementById("request-message");
    const lowStockList = document.getElementById("low-stock-list");

    async function fetchLowStockItems() {
        try {
            const response = await fetch("http://localhost:3000/low-stock");
            if (!response.ok) throw new Error("Failed to fetch low stock");

            const items = await response.json();
            lowStockList.innerHTML = ""; 

            if (items.length === 0) {
                lowStockList.innerHTML = "<p>All supplies are stocked.</p>";
            } else {
                items.forEach(item => {
                    let li = document.createElement("li");
                    li.textContent = `⚠️ ${item.name} - Only ${item.stock} left!`;
                    lowStockList.appendChild(li);
                });
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    requestBtn.addEventListener("click", async () => {
        const item = supplyItem.value;
        const quantity = parseInt(supplyQuantity.value);

        if (!quantity || quantity < 1) {
            requestMessage.textContent = "Please enter a valid quantity.";
            requestMessage.style.color = "red";
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/request-supply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ item, quantity })
            });

            const data = await response.json();
            requestMessage.textContent = data.message;
            requestMessage.style.color = "green";
            fetchLowStockItems(); 

        } catch (error) {
            console.error("Error:", error);
            requestMessage.textContent = "Failed to request supply.";
            requestMessage.style.color = "red";
        }
    });

    fetchLowStockItems(); 
});
