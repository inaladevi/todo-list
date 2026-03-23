import { getProjects, addProject, saveToStorage, deleteProject } from "./appController.js";
import { createTodo } from "./todo.js";
import { format, parseISO } from "date-fns";

let activeView = "Home";

export function updateScreen() {
  const appDiv = document.getElementById("app");
  appDiv.innerHTML = "";

  const projectSelect = document.getElementById("new-todo-project");
  projectSelect.innerHTML = "";

  const sidebarNav = document.getElementById("sidebar-nav");
  sidebarNav.innerHTML = "";

  const projects = getProjects();

  projects.forEach(function (project, index) {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = project.name;
    projectSelect.appendChild(option);
  });

  const homeLi = document.createElement("li");
  homeLi.innerHTML = '<i class="fas fa-home"></i> Home (All Tasks)';
  homeLi.classList.add("nav-item");
  if (activeView === "Home") homeLi.classList.add("active-nav");
  homeLi.addEventListener("click", () => {
    activeView = "Home";
    updateScreen();
  });
  sidebarNav.appendChild(homeLi);

  projects.forEach((project, index) => {
    const projLi = document.createElement("li");
    projLi.innerHTML = `<i class="fas fa-folder"></i> ${project.name}`;
    projLi.classList.add("nav-item", "nav-project-item");
    if (activeView === index) projLi.classList.add("active-nav");
    projLi.addEventListener("click", () => {
      activeView = index;
      updateScreen();
    });
    sidebarNav.appendChild(projLi);
  });

  const headerContainer = document.createElement("div");
  headerContainer.classList.add("main-header-container");

  const mainHeader = document.createElement("h2");
  mainHeader.textContent = activeView === "Home" ? "All Tasks" : projects[activeView].name;
  mainHeader.classList.add("main-header-title");
  headerContainer.appendChild(mainHeader);

  if (activeView !== "Home") {
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("project-header-actions");

    const editProjectBtn = document.createElement("button");
    editProjectBtn.textContent = "Edit Project";
    editProjectBtn.classList.add("btn-project");

    editProjectBtn.addEventListener("click", function () {
      const newName = prompt("Rename project:", projects[activeView].name);
      if (newName && newName.trim() !== "") {
        projects[activeView].name = newName;
        saveToStorage();
        updateScreen();
      }
    });

    const deleteProjectBtn = document.createElement("button");
    deleteProjectBtn.textContent = "Delete Project";
    deleteProjectBtn.classList.add("btn-project", "btn-delete");

    deleteProjectBtn.addEventListener("click", function () {
      if (confirm(`Delete project "${projects[activeView].name}" and all its tasks?`)) {
        deleteProject(activeView);
        activeView = "Home";
        updateScreen();
      }
    });

    actionsDiv.appendChild(editProjectBtn);
    actionsDiv.appendChild(deleteProjectBtn);
    headerContainer.appendChild(actionsDiv);
  }

  appDiv.appendChild(headerContainer);

  projects.forEach(function (project, masterIndex) {
    if (activeView !== "Home" && activeView !== masterIndex) {
      return;
    }

    const todos = project.getTodos();
    const todoList = document.createElement("ul");

    todos.forEach(function (todo, taskIndex) {
      const todoItem = document.createElement("li");
      
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;

      checkbox.addEventListener("change", function () {
        project.toggleTodoComplete(taskIndex);
        saveToStorage();
        updateScreen();
      });

      const textContainer = document.createElement("div");
      textContainer.classList.add("task-text-container");
      
      const topRow = document.createElement("div");
      topRow.classList.add("task-top-row");

      const prioritySpan = document.createElement("span");
      prioritySpan.textContent = todo.priority;
      prioritySpan.classList.add("priority-badge");

      if (todo.priority === "High") prioritySpan.classList.add("prio-high");
      if (todo.priority === "Medium") prioritySpan.classList.add("prio-medium");
      if (todo.priority === "Low") prioritySpan.classList.add("prio-low");
      
      const titleSpan = document.createElement("span");
      titleSpan.textContent = todo.title;
      titleSpan.classList.add("task-title");
      
      let displayDate = "";
      if (todo.dueDate) {
        const parsedDate = parseISO(todo.dueDate);
        displayDate = format(parsedDate, "MMM do, yyyy");
      }
      
      const dateSpan = document.createElement("span");
      dateSpan.textContent = displayDate ? `Due: ${displayDate}` : "";
      dateSpan.classList.add("task-date-badge");
      if (!displayDate) dateSpan.classList.add("hidden");

      topRow.appendChild(titleSpan);
      topRow.appendChild(prioritySpan);
      topRow.appendChild(dateSpan);

      const descSpan = document.createElement("span");
      descSpan.textContent = todo.description;
      descSpan.classList.add("task-desc");

      if (todo.completed) {
        titleSpan.classList.add("completed-title");
        dateSpan.classList.add("completed-badge");
        descSpan.classList.add("completed-desc");
      }

      textContainer.appendChild(topRow);
      if (todo.description !== "") textContainer.appendChild(descSpan);

      let isEditing = false;

      const editBtn = document.createElement("button");
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';

      editBtn.addEventListener("click", function () {
        if (!isEditing) {
          isEditing = true;

          textContainer.innerHTML = "";
          
          const editTitle = document.createElement("input");
          editTitle.type = "text";
          editTitle.value = todo.title;
          editTitle.classList.add("edit-task-input");

          const editDesc = document.createElement("input");
          editDesc.type = "text";
          editDesc.value = todo.description;
          editDesc.placeholder = "Description...";
          editDesc.classList.add("edit-task-input");

          const editDate = document.createElement("input");
          editDate.type = "date";
          editDate.value = todo.dueDate; 
          editDate.classList.add("edit-task-input");

          const editPriority = document.createElement("select");
          editPriority.classList.add("edit-task-input");
          
          const options = ["Low", "Medium", "High"];
          options.forEach(p => {
            const opt = document.createElement("option");
            opt.value = p;
            opt.textContent = p + " Priority";
            if (todo.priority === p) opt.selected = true; 
            editPriority.appendChild(opt);
          });

          textContainer.appendChild(editTitle);
          textContainer.appendChild(editDesc);
          textContainer.appendChild(editDate);
          textContainer.appendChild(editPriority);

          editBtn.innerHTML = '<i class="fas fa-save"></i>';
          editTitle.focus();
        } else {
          const inputs = textContainer.querySelectorAll("input");
          const selectBox = textContainer.querySelector("select");
          const newTitle = inputs[0].value;
          const newDesc = inputs[1].value;
          const newDate = inputs[2].value;
          const newPriority = selectBox.value;

          if (newTitle.trim() !== "") {
            todo.title = newTitle;
            todo.description = newDesc;
            todo.dueDate = newDate;
            todo.priority = newPriority;
          }
          
          saveToStorage();
          updateScreen();
        }
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.classList.add("btn-delete"); 

      deleteBtn.addEventListener("click", function () {
        project.deleteTodo(taskIndex);
        saveToStorage();
        updateScreen();
      });

      const actionContainer = document.createElement("div");
      actionContainer.classList.add("task-actions");

      actionContainer.appendChild(editBtn);
      actionContainer.appendChild(deleteBtn);

      todoItem.appendChild(checkbox);
      todoItem.appendChild(textContainer);
      todoItem.appendChild(actionContainer);

      todoList.appendChild(todoItem); 
    });

    appDiv.appendChild(todoList); 
  });
}

export function setupEventListeners() {
  const addProjectBtn = document.getElementById("add-project-btn");
  const newProjectInput = document.getElementById("new-project-name");
  const addTodoBtn = document.getElementById("add-todo-btn");

  addProjectBtn.addEventListener("click", function() {
    const projectName = newProjectInput.value;
    
    if (projectName === "") return; 
    addProject(projectName);
    newProjectInput.value = "";

    updateScreen(); 
  });

  addTodoBtn.addEventListener("click", function() {
    const titleInput = document.getElementById("new-todo-title");
    const descInput = document.getElementById("new-todo-desc");
    const dateInput = document.getElementById("new-todo-date");
    const prioritySelect = document.getElementById("new-todo-priority");
    const projectSelect = document.getElementById("new-todo-project");

    const title = titleInput.value;
    const desc = descInput.value;
    const date = dateInput.value;
    const priority = prioritySelect.value;  
    const projectIndex = projectSelect.value; 
    const projects = getProjects();

    if (title === "") return; 

    const newTodo = createTodo(title, desc, date, priority);

    const selectedProject = projects[projectIndex];

    selectedProject.addTodo(newTodo);
    saveToStorage();

    titleInput.value = "";
    descInput.value = "";
    dateInput.value = "";

    updateScreen();
  });

}
