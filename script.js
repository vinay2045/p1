document.addEventListener("DOMContentLoaded", () => {
    let draggedItem = null;

    document.getElementById("task-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const title = document.getElementById("task-title").value;
        const about = document.getElementById("task-about").value;
        const start = document.getElementById("task-start").value;
        const end = document.getElementById("task-end").value;
        const priority = document.getElementById("task-priority").value;

        const task = document.createElement("div");
        task.classList.add("task", priority);
        task.draggable = true;
        task.innerHTML = ` <div class="tasks">
                   <div class="tasks-part1">
                    <h5>${title} </h5>
                    <p>From : ${start}</p>
                    <p>---</p>
                    <p>End : ${end}</p>
                    <div class="tasks-part1-part1">
                        <i class='bx bxs-edit-alt' ></i>
                        <i class='bx bxs-trash-alt'></i>
                    </div>
                   </div>
                   <div class="tasks-part2">
                    <p>${about}</p>
                   </div>
                    

                </div>`;

        document.getElementById(priority).appendChild(task);
        task.addEventListener("dragstart", () => { draggedItem = task; });
        
        this.reset();
    });

    document.querySelectorAll(".tasks-group, #completed").forEach(container => {
        container.addEventListener("dragover", (e) => { e.preventDefault(); });
        container.addEventListener("drop", (e) => {
            if (draggedItem) {
                container.appendChild(draggedItem);
                draggedItem = null;
            }
        });
    });
});