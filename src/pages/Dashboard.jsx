import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../layout/Spinner";

function Dashboard() {
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [priceRequest, setPriceRequest] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [todoId, setTodoId] = useState(null);
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // fetchBooks();
    fetchTodos();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  function clearForm() {
    setDescription("");
    setAuthor("");
    setPriceRequest("");
    setCategoryId("");
    setTitle("");
  }

  async function fetchTodos() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      if (!response.ok) {
        toast.error("Unable to fetch todos, try again later");
        setIsLoading(false);
        console.log(data);
        return;
      }

      setTodos(data);
      setIsLoading(false);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTodoHandler(id) {
    try {
      console.log(id, "todo id");
      setIsLoading(true);
      window.confirm("Are you sure you want to delete this todo?");

      //remove todo from todos array
      setTodos(todos.filter((todo) => todo.id !== id));

      toast.success("deleted successfully");

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function updateTodoHandler() {
    console.log(todoId, title);
    setIsLoading(true);
    try {
      //update todo in the list of todos
      setTodos(
        todos.map((todo) =>
          todo.id === todoId ? { ...todo, title: title } : todo
        )
      );

      toast.success("Updated successfully");
      setEditMode(false);
      clearForm();
      setIsLoading(false);
      return;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function submitTodoHandler() {
    console.log(title);

    setIsLoading(true);

    try {
      //create a task for todo
      let task = {
        id: Math.floor(Math.random() * 10000),
        title: title,
        completed: false,
      };

      //add to the list of todos
      setTodos([task, ...todos]);
      toast.success("Todo added successfully");
      clearForm();
      setIsLoading(false);
      return;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto mt-20">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <form
        className="bg-white shadow-md mt-14 rounded px-8 pt-6 pb-8 mb-4 mx-auto w-1/2"
        onSubmit={(e) => {
          e.preventDefault();
          editMode ? updateTodoHandler() : submitTodoHandler();
        }}
      >
        <h2 className="text-2xl font-bold mb-4">Add Task</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Task
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            type="text"
            placeholder="Enter task"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className={
              editMode
                ? "text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2"
                : "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            }
            type="submit"
          >
            {editMode ? "Update Todo" : "Add Todo"}
          </button>
        </div>
      </form>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4">Todo List</h2>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Todo Tasks
              </th>
            </tr>
          </thead>
          <tbody>
            {todos.length === 0
              ? "No Todos found. please add a todo"
              : todos.map((todo) => {
                  return (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={todo.id}
                    >
                      <td className="py-4 px-6">{todo.title}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => {
                            setEditMode(true);
                            setTodoId(todo.id);
                            setTitle(todo.title);
                          }}
                          type="button"
                          className="text-black bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2"
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteTodoHandler(todo.id);
                          }}
                          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Dashboard;
