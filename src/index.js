import { getProjects, addProject } from "./appController.js";
import { createTodo } from "./todo.js";
import { updateScreen, setupEventListeners } from "./screenController.js";
import { loadFromStorage } from "./appController.js";
import "./style.css";

console.log("App is running...");

loadFromStorage();
setupEventListeners();
updateScreen();