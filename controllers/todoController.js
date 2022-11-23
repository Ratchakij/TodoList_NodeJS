const { v4: uuidv4 } = require("uuid");
const { readTodo, writeTodo } = require("../dbs/file");

exports.getAllTodos = async (req, res, next) => {
  try {
    const oldTodos = await readTodo();
    res.status(200).json({ todos: oldTodos, total: oldTodos.length });
  } catch (err) {
    next(err);
  }
};

exports.getTodoById = async (req, res) => {
  try {
    const { id } = req.params;
    const todoLists = await readTodo();
    const todo = todoLists.find((item) => item.id === id) ?? null;
    res.json({ todo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createTodos = async (req, res) => {
  try {
    const { title, completed = false, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "title is required" });
    }
    if (typeof completed !== "boolean") {
      return res.status(400).json({ message: "completed must a boolean" });
    }
    if (dueDate === undefined || isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({ message: "Invalid dueDate" });
    }

    const newTodo = { id: uuidv4(), title, completed, dueDate };
    const todoLists = await readTodo();
    todoLists.unshift(newTodo);
    await writeTodo(todoLists);
    res.status(201).json({ todo: newTodo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { title, completed, dueDate } = req.body;
    const { id } = req.params;
    const todoLists = await readTodo();
    const newTodo = { title, completed, dueDate, id };
    const newTodos = todoLists.map((item) => (item.id === id ? newTodo : item));
    await writeTodo(newTodos);
    res.status(200).json({ todo: newTodo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todoLists = await readTodo();
    const newTodos = todoLists.filter((item) => item.id !== id);
    await writeTodo(newTodos);
    res.status(200).json({ message: "Success Delete" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
