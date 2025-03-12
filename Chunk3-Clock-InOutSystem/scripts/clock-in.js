document.addEventListener("DOMContentLoaded", () => {
    const clockInBtn = document.getElementById("clock-in-btn");
    const clockOutBtn = document.getElementById("clock-out-btn");
    const statusMessage = document.getElementById("status-message");
    const taskList = document.getElementById("task-list");

    function sendClockInData(latitude, longitude) {
        fetch("http://localhost:3000/clock-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude, timestamp: new Date() })
        })
        .then(response => response.json())
        .then(data => {
            statusMessage.textContent = data.message;
            clockInBtn.disabled = true;
            clockOutBtn.disabled = false;
            loadTasks();
        })
        .catch(error => console.error("Error:", error));
    }

    clockInBtn.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                sendClockInData(position.coords.latitude, position.coords.longitude);
            }, () => {
                statusMessage.textContent = "GPS permission denied!";
            });
        } else {
            statusMessage.textContent = "Geolocation is not supported.";
        }
    });

    clockOutBtn.addEventListener("click", () => {
        fetch("http://localhost:3000/clock-out", { method: "POST" })
            .then(response => response.json())
            .then(data => {
                statusMessage.textContent = data.message;
                clockInBtn.disabled = false;
                clockOutBtn.disabled = true;
            })
            .catch(error => console.error("Error:", error));
    });

    function loadTasks() {
        fetch("http://localhost:3000/tasks")
            .then(response => response.json())
            .then(tasks => {
                taskList.innerHTML = "";
                tasks.forEach(task => {
                    let li = document.createElement("li");
                    li.textContent = task.name;
                    taskList.appendChild(li);
                });
            })
            .catch(error => console.error("Error loading tasks:", error));
    }
});
