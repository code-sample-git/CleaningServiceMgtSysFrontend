document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("task-list");
    const loadingMessage = document.getElementById("loading-message");

    async function fetchTasks() {
        try {
            const response = await fetch("http://localhost:3000/tasks");
            if (!response.ok) throw new Error("Failed to fetch tasks");

            const tasks = await response.json();
            loadingMessage.style.display = "none"; 

            if (tasks.length === 0) {
                taskList.innerHTML = "<p>No tasks assigned yet.</p>";
            } else {
                tasks.forEach(task => {
                    let li = document.createElement("li");
                    li.textContent = `🔹 ${task.name} - Due: ${task.deadline}`;
                    taskList.appendChild(li);
                });
            }
        } catch (error) {
            console.error("Error:", error);
            loadingMessage.textContent = "Failed to load tasks.";
        }
    }

    fetchTasks();
});
