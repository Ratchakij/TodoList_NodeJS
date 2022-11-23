// todo objects => {
// id: String, Unique, Required
// title: String, Required
// completed: Boolean, Required,
// dueDate: String
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
