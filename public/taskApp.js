import { LitElement, html, css } from 'lit';

class TodoApp extends LitElement {
	
    static properties = {
        tasks: { type: Array },
        isEditing: { type: Boolean },
        editTaskId: { type: String }
    };

    constructor() {
        super();
        this.tasks = [];
        this.isEditing = false;
        this.editTaskId = '';
    }

    static styles = css`
        body {
        font-family: Arial, sans-serif;
        padding: 20px;
        background-color: #f5f5f5;
    }

    h1 {
        text-align: center;
    }

    .main-body {
        display: grid;
        grid-template-columns: 70% auto;
        justify-items: center;
    }

    .new-task-form-container {
        width: 30em;
    }

    form {
        margin-bottom: 20px;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    label {
        font-weight: bold;
    }

    input, textarea, select, button {
        display: block;
        width: 100%;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }

    button {
        background-color: #28a745;
        color: #fff;
        border: none;
        cursor: pointer;
    }

    button:hover {
        background-color: #218838;
    }

    .my-tasks-data {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: 5em 4em auto;
        width: 95%;
    }

    .table-container, .my-tasks-header {
        grid-column: 1 / span 2;
    }

    .table-container {
        max-height: 33em;
        overflow-x: auto;  /* Enable horizontal scrolling */
        display: block;
        margin-top: 20px;
        border: solid 1px black;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        border: 1px solid #ccc;
        padding: 10px;
        text-align: left;
        text-align: center;
        word-wrap: break-word;
        white-space: normal;
        overflow: hidden;
    }

    th {
        background-color: #f2f2f2;
    }

    .header-title {
        width: 15%;
    }
    .header-desc {
        width: 30%;
        max-width: 30%;
    }
    .header-assignedto {
        width: 11%;
    }
    .header-duedate {
        width: 10%;
    }
    .header-priority {
        width: 8%;
    }
    .header-status {
        width: 10%;
    }
    .header-actions {
        width: auto;
    }

    td button {
        padding: 5px 10px;
        margin-right: 5px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }

    .filter-input-field {
        justify-self: right;
        max-width: 20em;
        min-height: 3.2em;
        margin-bottom: 0;
        align-self: center;
    }

    #new-task-button {
        justify-self: left;
        align-self: center;
        max-width: 10em;
        min-height: 3em;
    }

    td .edit-task-button, td .delete-task-button, #new-task-button {
        color: #fff;
        padding: 0.5em 0em;
        margin: 1em 0em;
    }

    td .edit-task-button, td .delete-task-button {
        max-width: 5em;
    }

    td .edit-task-button {
        background-color: #007bff;
    }

    td .edit-task-button:hover {
        background-color: #0056b3;
    }

    td .delete-task-button {
        background-color: #dc3545;
        color: #fff;
    }

    td .delete-task-button:hover {
        background-color: #c82333;
    }

    .actions-list {
        display: flex;
        gap: 0.5em;
        justify-content: center;
    }

    .alert-no-task {
        height: 5em;
        font-style: italic;
    }

    .message {
        color: red;
        font-size: small;
        margin-left: 1em;
    }

    @media all and (max-width: 1500px) {
        .main-body {
            grid-template-columns: 1fr;
            row-gap: 3em;
        }
    }

    /* Alternating row colors */
    .even-row {
        background-color: #d3d3d3;
    }

    .odd-row {
        background-color: #ffffff;
    }

    /* Apply colors based on priority */
    td[data-priority="High"] {
        background-color: #ffcccc;
    }

    td[data-priority="Medium"] {
        background-color: #fff0b3;
    }

    td[data-priority="Low"] {
        background-color: #d9f2d9;
    }
    `;

    connectedCallback() {
        super.connectedCallback();
        this.displayTasks();
    }

    render() {
        return html`
        <main>
            <div class="main-body">
            <div class="my-tasks-data">
                <h1 class="my-tasks-header">🚀 TaskTrack ✅</h1>
                <button @click="${this.showAddForm}">New Task</button>
                <input type="search" class="filter-input-field" placeholder="Filter by keyword..." @input="${this.filterTasks}">
                <div class="table-container">
                <table id="tasksTable">
                    <thead>
                    <tr>
                        <th class="header-title">Title</th>
                        <th class="header-desc">Description</th>
                        <th class="header-assignedto">Assigned To</th>
                        <th class="header-duedate">Due Date</th>
                        <th class="header-priority">Priority</th>
                        <th class="header-status">Status</th>
                        <th class="header-actions">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${this.tasks.length
                        ? this.tasks.map(task => this.createTaskRow(task))
                        : html`<tr><td colspan="7" class="alert-no-task">No tasks available. Add a new one!</td></tr>`}
                    </tbody>
                </table>
                </div>
            </div>
            ${this.renderForm()}
            </div>
        </main>
        `;
    }

    renderForm() {
        return html`
        <div class="new-task-form-container">
            <h1>${this.isEditing ? 'Edit Task' : 'New Task'}</h1>
            <form @submit="${this.isEditing ? this.saveEditedTask : this.addTask}">
            <label for="title">Title</label><span class="message"></span><br>
            <input type="text" id="title" name="title"><br>

            <label for="description">Task Description</label><span class="message"></span><br>
            <textarea id="description" rows="3" cols="50"></textarea><br>
            
            <label for="assignedTo">Assigned To</label><span class="message"></span><br>
            <input type="text" id="assignedTo"><br>
            
            <label for="dueDate">Due Date</label><span class="message"></span><br>
            <input type="date" id="dueDate"><br>
            
            <label for="priority">Priority</label><span class="message"></span><br>
            <select id="priority">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
            </select><br>
            
            <label for="status">Status</label><span class="message"></span><br>
            <select id="status">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select><br>
            
            <button type="submit">${this.isEditing ? 'Save' : 'Add'}</button>
            </form>
        </div>
        `;
    }

    // Display tasks
    displayTasks() {
        fetch('/tasks')
        // .then(response => response.json())
        .then(response => {
            console.log('Response:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(tasks => {
            this.tasks = tasks;
        })
        .catch(err => console.error('Error:', err));
    }

    // Function to add a new task
    addTask(event) {
        event.preventDefault();

        const newTask = this.getFormValues();

        if (this.validateFormData(newTask)) {
        fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        })
            .then(() => {
            this.displayTasks();
            this.hideForm();
            })
            .catch(err => console.error('Error:', err));
        }
    }

    // Function to save the edited task
    saveEditedTask(event) {
        event.preventDefault();

        const taskId = this.editTaskId;
        const editedTask = this.getFormValues();

        if (this.validateFormData(editedTask)) {
        fetch(`/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedTask)
        })
            .then(() => {
            this.displayTasks();
            this.hideForm();
            this.isEditing = false;
            })
            .catch(err => console.error('Error:', err));
        }
    }

    // Function to delete a task
    deleteTask(taskId) {
        fetch(`/tasks/${taskId}`, { method: 'DELETE' })
        .then(() => this.displayTasks())
        .catch(err => console.error('Error:', err));
    }

    // Function to handle editing a task
    editTask(taskId) {
        fetch(`/tasks/${taskId}`)
        .then(response => response.json())
        .then(task => {
            this.isEditing = true;
            this.editTaskId = taskId;
            this.populateForm(task);
        })
        .catch(err => alert('Task not found!'));
    }

    // Filtering tasks by search text
    filterTasks(event) {
        const searchText = event.target.value.toLowerCase();

        fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            const filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchText) ||
            task.description.toLowerCase().includes(searchText) ||
            task.assignedTo.toLowerCase().includes(searchText) ||
            task.dueDate.toLowerCase().includes(searchText) ||
            task.priority.toLowerCase().includes(searchText) ||
            task.status.toLowerCase().includes(searchText)
            );
            this.tasks = filteredTasks;
        })
        .catch(err => console.error('Error:', err));
    }

    getFormValues() {
        return {
        title: this.shadowRoot.getElementById('title').value,
        description: this.shadowRoot.getElementById('description').value,
        assignedTo: this.shadowRoot.getElementById('assignedTo').value,
        dueDate: this.shadowRoot.getElementById('dueDate').value,
        priority: this.shadowRoot.getElementById('priority').value,
        status: this.shadowRoot.getElementById('status').value
        };
    }

    validateFormData(task) {
        const requiredFields = ['title', 'description', 'assignedTo', 'dueDate', 'priority', 'status'];
        for (const field of requiredFields) {
        if (!task[field]) {
            alert(`Please enter a valid ${field}`);
            return false;
        }
        }
        return true;
    }

    hideForm() {
        this.shadowRoot.getElementById('taskForm').reset();
        this.isEditing = false;
    }

    populateForm(task) {
        this.shadowRoot.getElementById('title').value = task.title;
        this.shadowRoot.getElementById('description').value = task.description;
        this.shadowRoot.getElementById('assignedTo').value = task.assignedTo;
        this.shadowRoot.getElementById('dueDate').value = task.dueDate;
        this.shadowRoot.getElementById('priority').value = task.priority;
        this.shadowRoot.getElementById('status').value = task.status;
    }

    createTaskRow(task) {
        return html`
        <tr>
            <td>${task.title}</td>
            <td>${task.description}</td>
            <td>${task.assignedTo}</td>
            <td>${task.dueDate}</td>
            <td data-priority="${task.priority}">${task.priority}</td>
            <td>${task.status}</td>
            <td class="actions-list">
            <button @click="${() => this.editTask(task.id)}">Edit</button>
            <button @click="${() => this.deleteTask(task.id)}">Delete</button>
            </td>
        </tr>
        `;
    }
}

customElements.define('todo-app', TodoApp);