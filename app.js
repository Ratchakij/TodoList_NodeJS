const express = require("express");
const { v4: uuidv4 } = require("uuid");

//เวลา handle
// asynchronous เขียนในรูปแบบ promise
// ถ้าไม่มี promises เขียนในรูปแบบ call back function
const { readFile, writeFile } = require("fs/promises");
const { readTodo, writeTodo } = require("./dbs/file");

const app = express(); // ทำหน้าที่เหมือนสร้างตัว server

// ให้ app ดึงค่าข้อมูลจาก request body มาใช้ได้
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/todos", async (req, res) => {
  try {
    const todoLists = await readTodo();
    res.status(200).json({ todos: todoLists, total: todoLists.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todoLists = await readTodo();
    const todo = todoLists.find((item) => item.id === id) ?? null;
    res.json({ todo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/todos", (req, res) => {
  const { title, completed = false, dueDate } = req.body;

  if (!title || !title.trim()) {
    res.status(400).json({ message: "title is required" });
  } else if (typeof completed !== "boolean") {
    res.status(400).json({ message: "completed must a boolean" });
  } else if (dueDate === undefined || isNaN(new Date(dueDate).getTime())) {
    res.status(400).json({ message: "Invalid dueDate" });
  } else {
    const newTodo = { id: uuidv4(), title, completed, dueDate };
    readFile("dbs/todolist.json", "utf-8")
      .then((data) => {
        const todoLists = JSON.parse(data);
        todoLists.unshift(newTodo);

        return writeFile(
          "dbs/todolist.json",
          JSON.stringify(todoLists),
          "utf-8"
        );
      })
      .then(() => {
        res.status(201).json({ todo: newTodo });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  }
});

app.put("/todos/:id", async (req, res) => {
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
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todoLists = await readTodo();
    const newTodos = todoLists.filter((item) => item.id !== id);
    await writeTodo(newTodos);
    res.status(200).json({ message: "Success Delete" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(8000, () => console.log("server running on port 8000")); // รอรับ request ที่ port 8000

// todo objects => {
//    id: String, Unique, Required
//    title: String, Required
//    completed: Boolean, Required,
//    dueDate: String
// }

// Design by REST API
// 1. Find all
// Method: Get, Endpoint URL: /todos
// Input: Query {title, completed, dueDate, offset, limit, sort}
// Output: Array todo object, total

// 2. Find by id
// Method: GET, Endpoint URL:/todos/:id
// Input: Param (id)
// Output: todo object or null

// 3. Create
// Method: POST, Endpoint URL: /todos
// Input: Body(title: Required, completed, dueDate: -)
// Output: New todo object or Error Message

// 4. Edit
// Method: PUT, Endpoint URL: /todos/:id
// Input: Body(title: Required, completed, dueDate: -)
// Output: Update todo object or Error

// 5. Delete
// Method: DELETE, Endpoint URL: /todos/:id
// Input: Param (id)
// Output: Success Message Or Error message
