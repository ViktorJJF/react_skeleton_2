import React, { useState } from 'react';
import TodoComponent from '@/views/TodoComponent';

interface TestViewProps {
  title: string;
}

interface Todo {
  id: number;
  content: string;
  completed: boolean;
}
const titlePage = 'Este es mi primer test...';
const testObject = {
  name: 'John',
  age: 30,
  city: 'New York',
};
const dogNames = ['lilith', 'luna', 'lily', 'lola', 'luna 2'];

const TestView: React.FC<TestViewProps> = ({}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoContent, setNewTodoContent] = useState<string>('');

  function createTodo(content: string) {
    const newTodo: Todo = { id: todos.length + 1, content, completed: false };
    setTodos([...todos, newTodo]);
    setNewTodoContent(''); // Clear the input after adding
  }

  function updateTodo(id: number, content: string) {
    console.log('updateTodo new content', id, content);
    setTodos(
      todos.map((todo) => (todo.id === id ? { ...todo, content } : todo)),
    );
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoContent(e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{titlePage}</h1>
      <div> {JSON.stringify(testObject)} </div>
      {/* Add your content here */}
      <h3 className="text-lg font-semibold mb-2">My first todo App</h3>
      <div>
        Here are my dogs:
        {dogNames.map((el) => (
          <span key={el}>{el}</span>
        ))}
      </div>
      <div className="flex items-center mb-4">
        <input
          type="text"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="New todo"
          value={newTodoContent}
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline"
          onClick={() => createTodo(newTodoContent)}
        >
          Add Todo
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            setTodos([
              ...todos,
              { id: todos.length + 1, content: 'New Todo', completed: false },
            ]);
          }}
        >
          Add Todo
        </button>
      </div>
      <ul className="list-disc pl-5">
        {todos.map((todo: Todo) => (
          <TodoComponent key={todo.id} todo={todo} onUpdate={updateTodo} />
        ))}
      </ul>
      <div className="flex">
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 focus:outline-none focus:shadow-outline"
          onClick={() => (todos.length > 0 ? deleteTodo(todos[0].id) : null)}
        >
          Delete Todo
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() =>
            todos.length > 0 ? updateTodo(todos[0].id, 'Updated Todo') : null
          }
        >
          Update Todo
        </button>
      </div>
    </div>
  );
};

export default TestView;
