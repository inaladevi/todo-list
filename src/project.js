export function createProject(name) {
  const todos = [];

  function addTodo(todo) {
    todos.push(todo);
  }

  function getTodos() {
    return todos;
  }

  function deleteTodo(taskIndex) {
    todos.splice(taskIndex, 1);
  }

  function toggleTodoComplete(taskIndex) {
    const task = todos[taskIndex];
    task.completed = !task.completed;
  }

  return {
    name,
    todos,
    addTodo,
    getTodos,
    deleteTodo,
    toggleTodoComplete
  };
}
