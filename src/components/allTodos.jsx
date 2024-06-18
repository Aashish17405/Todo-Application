import { useState, useEffect } from "react";
import CreateTodos from "./createTodos";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ThreeDots } from "react-loader-spinner";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://todo-application-60gq.onrender.com");
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast.error("Failed to fetch todos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  const handleComplete = async (todoId, currentStatus) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://todo-application-60gq.onrender.com/update", {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todoId,
          todoCompleted: !currentStatus,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      toast.success("Completed todo successfully");
      fetchAllTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error("Failed to complete todo");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (todoId) => {
    setIsLoading(true);
    try {
      const response = await fetch("https://todo-application-60gq.onrender.com/delete", {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          todoId,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      toast.success("Deleted todo successfully");
      fetchAllTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error("Failed to delete todo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className='ml-10 text-5xl mt-24 font-extrabold'>Todo Application</h1>
      <CreateTodos />      
      <ul className="flex space-x-10 mt-5">
        <button className="bg-black border border-gray-300 py-2 px-4 rounded-full ml-6 hover:bg-red hover:text-black hover:border-black" onClick={() => navigate('/')}>All Todos</button>
        <button className="bg-black border border-gray-300 py-2 px-4 rounded-full hover:bg-red hover:text-black hover:border-black" onClick={() => navigate('/c')}>CompletedTodos</button>
        <button className="bg-black border border-gray-300 py-2 px-4 rounded-full hover:bg-red hover:text-black hover:border-black" onClick={() => navigate('/i')}>Active Todos</button>
      </ul>
      <div>
        {todos && todos.map((tod) => (
          <div key={tod._id} className="m-3 mb-4  mt-6 flex items-center">
            <input
              className="custom-checkbox"
              type="checkbox"
              onChange={() => handleComplete(tod._id, tod.completed)}
              checked={tod.completed} 
              disabled={tod.completed ? true : false}
            />
            <label className="px-2">{tod.todo}</label>
            <button onClick={() => deleteTodo(tod._id)} className="rounded-full px-2 py-1 hover:bg-blue hover:text-black hover:border-black">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <ThreeDots
            visible={true}
            height={80}
            width={80}
            color="#74F0ED"
            radius={9}
            ariaLabel="three-dots-loading"
          />
        </div>
      )}
    </div>
  );
}

export default Todos;
