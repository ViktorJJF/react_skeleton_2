import { useState } from 'react';

interface TodoComponentProps {
  todo: {
    id: number;
    content: string;
    completed: boolean;
  };
  onUpdate: (id: number, content: string) => void;
}

const TodoComponent: React.FC<TodoComponentProps> = ({ todo, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      {isEditing ? (
        <input
          type="text"
          value={todo.content}
          onChange={(e) => onUpdate(todo.id, e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          onBlur={() => setIsEditing(false)} // Stop editing on blur
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setIsEditing(false);
            }
          }}
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:text-blue-700 cursor-pointer py-2 px-4 rounded"
        >
          {todo.content}
        </span>
      )}
    </div>
  );
};

export default TodoComponent;
