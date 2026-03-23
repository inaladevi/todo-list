import { createProject } from "./project.js";
import { createTodo } from "./todo.js";

const projects = [];

export function saveToStorage() {
  localStorage.setItem("my-todo-data", JSON.stringify(projects));
}

export function loadFromStorage() {
  const savedData = localStorage.getItem("my-todo-data");

if (!savedData) {
  const routineProject = createProject("Daily Routine");

  routineProject.addTodo(
    createTodo(
      "Hit the gym",
      "Push day. Make sure to hit the daily protein goal.",
      "2026-03-24",
      "High",
    ),
  );
  routineProject.addTodo(
    createTodo(
      "Groceries",
      "Eggs, milk, oats, and coffee.",
      "2026-03-23",
      "High",
    ),
  );
  routineProject.addTodo(
    createTodo(
      "Fix sleep schedule",
      "Stop scrolling after 11:30 PM. Read a book instead.",
      "",
      "Medium",
    ),
  );

  const studyProject = createProject("Coding & Study");

  studyProject.addTodo(
    createTodo(
      "Finish Todo App",
      "Wrap up the CSS layout and test local storage.",
      "2026-03-25",
      "High",
    ),
  );
  studyProject.addTodo(
    createTodo(
      "Review JS Concepts",
      "Go over closures and factory functions again.",
      "",
      "Medium",
    ),
  );
  studyProject.addTodo(
    createTodo(
      "Update Resume",
      "Format properly to fit on one page and add recent projects.",
      "2026-03-26",
      "Medium",
    ),
  );

  const adminProject = createProject("Life Admin");

  adminProject.addTodo(
    createTodo(
      "Pay bills",
      "Check electricity and Wi-Fi before the due dates hit.",
      "2026-03-24",
      "High",
    ),
  );
  adminProject.addTodo(
    createTodo(
      "Clean desk",
      "Getting too cluttered. Hard to focus.",
      "",
      "Low",
    ),
  );
  adminProject.addTodo(
    createTodo(
      "Backup Laptop",
      "Move important files to the external drive.",
      "",
      "Low",
    ),
  );

  projects.push(routineProject, studyProject, adminProject);
  saveToStorage();
  return;
}

  const parsedData = JSON.parse(savedData);

  parsedData.forEach(function(parsedProject) {
    const rebuiltProject = createProject(parsedProject.name);
    parsedProject.todos.forEach(function(savedTodo) {
      rebuiltProject.addTodo(savedTodo);
    });

    projects.push(rebuiltProject);
  });
}

export function getProjects() {
  return projects;
}

export function addProject(name) {
  const newProject = createProject(name);
  projects.push(newProject);
  saveToStorage();
  return newProject; 
}

export function deleteProject(projectIndex) {
  projects.splice(projectIndex, 1);
  saveToStorage();
}

