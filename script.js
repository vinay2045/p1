document.addEventListener("DOMContentLoaded", () => {
    function capitalizeFirstLetter(text) {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    let draggedItem = null;

    const taskForm = document.getElementById("task-form");

    // Validation logic
    function showError(input, message) {
        let error = input.nextElementSibling;
        if (!error || !error.classList.contains("error-message")) {
            error = document.createElement("small");
            error.className = "error-message";
            error.style.color = "red";
            error.style.fontSize = "10px";
            error.style.display = "block";
            input.insertAdjacentElement("afterend", error);
        }
        error.textContent = message;
    }

    function clearError(input) {
        const error = input.nextElementSibling;
        if (error && error.classList.contains("error-message")) {
            error.textContent = "";
        }
    }

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect form inputs
        const titleInput = document.getElementById("task-title");
        const aboutInput = document.getElementById("task-about");
        const startInput = document.getElementById("task-start");
        const endInput = document.getElementById("task-end");

        let isValid = true;

        // Title validation
        if (titleInput.value.trim() === "") {
            showError(titleInput, "Task title is required");
            isValid = false;
        } else if (titleInput.value.length < 3) {
            showError(titleInput, "Task title must be at least 3 characters long");
            isValid = false;
        } else {
            clearError(titleInput);
        }

        // About validation
        if (aboutInput.value.trim() === "") {
            showError(aboutInput, "Task description is required");
            isValid = false;
        } else if (aboutInput.value.length < 10) {
            showError(aboutInput, "Description must be at least 10 characters long");
            isValid = false;
        } else {
            clearError(aboutInput);
        }

        // Start date validation
        if (startInput.value === "") {
            showError(startInput, "Start date is required");
            isValid = false;
        } else {
            clearError(startInput);
        }

        // End date validation
        if (endInput.value === "") {
            showError(endInput, "End date is required");
            isValid = false;
        } else if (new Date(endInput.value) < new Date(startInput.value)) {
            showError(endInput, "End date cannot be earlier than start date");
            isValid = false;
        } else {
            clearError(endInput);
        }

        // If all inputs are valid
        if (isValid) {
            const title = capitalizeFirstLetter(titleInput.value);
            const about = capitalizeFirstLetter(aboutInput.value);
            const start = startInput.value;
            const end = endInput.value;
            const priority = document.getElementById("task-priority").value;

            // Create task element
            const task = document.createElement("div");
            task.classList.add("tasks");
            task.style.backgroundColor = getPriorityColor(priority);

            task.innerHTML = `
                <div class="tasks-h1">
                    <div class="tasks-part1">
                        <h5>${title}</h5>
                        <p>From: ${start}</p>
                        <p>---</p>
                        <p>End: ${end}</p>
                    </div>
                    <div class="tasks-part1-part1">
                        <i class='bx bxs-edit-alt edit-btn'></i>
                        <i class='bx bxs-trash-alt delete-btn'></i>
                    </div>
                </div>
                <div class="tasks-part2">
                    <p>${about}</p>
                </div>
            `;

            // Add the task to the respective priority group
            document.getElementById(priority).appendChild(task);

            // Enable dragging functionality for the task
            task.draggable = true;
            task.addEventListener("dragstart", () => { draggedItem = task; });

            // Reset the form after adding the task
            this.reset();
        }
    });// Updated edit functionality
    document.addEventListener("click", function (e) {
        if (e.target.classList.contains("edit-btn")) {
            // Edit functionality
            const task = e.target.closest(".tasks");
    
            // Get task details
            const title = task.querySelector("h5").innerText;
            const about = task.querySelector(".tasks-part2 p").innerText;
            const start = task.querySelector(".tasks-part1 p:nth-child(2)").innerText.replace('From: ', '');
            const end = task.querySelector(".tasks-part1 p:nth-child(4)").innerText.replace('End: ', '');
            const backgroundColor = getComputedStyle(task).backgroundColor; // Get the computed background color (rgb format)
    
            // Map the RGB color back to priority
            const priorityMap = {
                "rgb(255, 224, 211)": "urgent",
                "rgb(255, 242, 198)": "little-urgent",
                "rgb(207, 232, 255)": "no-urgent"
            };
    
            const taskPriority = priorityMap[backgroundColor] || 'no-urgent'; // Default to no-urgent if no match
    
            // Populate form fields with current task details
            document.getElementById("task-title").value = title;
            document.getElementById("task-about").value = about;
            document.getElementById("task-start").value = start;
            document.getElementById("task-end").value = end;
            document.getElementById("task-priority").value = taskPriority;
    
            // Remove the task after editing
            task.remove();
        }
    
        if (e.target.classList.contains("delete-btn")) {
            // Delete functionality
            const task = e.target.closest(".tasks");
            task.remove();
        }
    });
    document.querySelectorAll(".tasks-group, #completed").forEach((container) => {
        container.addEventListener("dragover", (e) => {
            e.preventDefault();
            container.classList.add("drag-over"); // Add highlight style during dragover
        });
    
        container.addEventListener("dragleave", () => {
            container.classList.remove("drag-over"); // Remove highlight style when leaving
        });
    
        container.addEventListener("drop", (e) => {
            e.preventDefault();
            container.classList.remove("drag-over"); // Remove dragover highlight
    
            // Add dropping effect
            container.classList.add("dropped");
    
            // Remove the dropping effect after animation completes
            setTimeout(() => {
                container.classList.remove("dropped");
            }, 500); // Matches the transition duration in CSS
    
            if (draggedItem) {
                container.appendChild(draggedItem);
    
                // Update background color based on the new parent container
                const newPriority = container.id; // The ID of the container (urgent, little-urgent, no-urgent)
                draggedItem.style.backgroundColor = getPriorityColor(newPriority);
    
                draggedItem = null; // Clear the dragged item
            }
        });
    });
    


    // Helper function to get background color based on priority
    function getPriorityColor(priority) {
        switch (priority) {
            case "urgent":
                return "#FFE0D3";
            case "little-urgent":
                return "#FFF2C6";
            case "no-urgent":
                return "#CFE8FF";
        }
    }
});
