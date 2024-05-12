document.addEventListener('DOMContentLoaded', function() {
    // Get current date
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1; // January is 0
    const currentYear = currentDate.getFullYear();

    // Get task list from localStorage if available
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to render tasks
    function renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        tasks.forEach(function(task) {
            const taskItem = document.createElement('li');
            taskItem.classList.add('list-group-item');
            if (task.completed) {
                taskItem.classList.add('complete');
            }
            taskItem.innerHTML = `
                ${task.text} (${task.frequency})
                <span class="badge badge-danger delete-btn" data-id="${task.id}">Delete</span>
            `;
            taskList.appendChild(taskItem);
        });
    }

    // Function to add task
    function addTask(taskText, frequency) {
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            frequency: frequency
        };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Function to delete task
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id != taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Function to show notification
    function showNotification(taskText) {
        // Check if browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support system notifications");
        }
        // Check if permission is granted
        else if (Notification.permission === "granted") {
            // Create notification
            const notification = new Notification("Todo List", {
                body: `Task "${taskText}" has been postponed to tomorrow.`,
            });
        }
        // If permission is not granted, ask for permission
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(function (permission) {
                // If the user accepts, create notification
                if (permission === "granted") {
                    const notification = new Notification("Todo List", {
                        body: `Task "${taskText}" has been postponed to tomorrow.`,
                    });
                }
            });
        }
    }

    // Function to handle task completion
    function completeTask(taskId) {
        tasks.forEach(function(task) {
            if (task.id === taskId) {
                task.completed = true;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }

    // Add task button click event
    document.getElementById('addTaskBtn').addEventListener('click', function() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();
        const frequencySelect = document.getElementById('taskFrequency');
        const frequency = frequencySelect.options[frequencySelect.selectedIndex].text;
        if (taskText !== '') {
            addTask(taskText, frequency);
            taskInput.value = '';
        }
    });

    // Delete task click event
    document.getElementById('taskList').addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const taskId = parseInt(e.target.getAttribute('data-id'));
            deleteTask(taskId);
        }
    });

    // Task completion click event
    document.getElementById('taskList').addEventListener('click', function(e) {
        if (!e.target.classList.contains('delete-btn')) {
            const taskId = parseInt(e.target.parentElement.getAttribute('data-id'));
            completeTask(taskId);
        }
    });

    // Render initial tasks
    renderTasks();
});

