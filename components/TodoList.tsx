'use client'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { addTodo, toggleTodo, deleteTodo, editTodo } from '@/lib/store/todoSlice';
import { Pencil, Trash2, Plus, Check, X } from 'lucide-react';

export function TodoList() {
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  
  const todos = useSelector((state: RootState) => state.todos.todos);
  const dispatch = useDispatch();

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  const handleStartEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      dispatch(editTodo({ id, text: editText.trim() }));
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-medium mb-8 text-gray-800">Tasks</h1>
        
        <form onSubmit={handleAddTodo} className="flex gap-3 mb-8">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 text-sm bg-gray-50 border-0 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>

        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="group"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => dispatch(toggleTodo(todo.id))}
                  className="w-4 h-4 rounded-full border-2 border-gray-300 checked:bg-blue-500 checked:border-blue-500 transition-colors cursor-pointer"
                />
                
                {editingId === todo.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-3 py-1 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-100"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(todo.id)}
                      className="p-1.5 text-green-600 hover:text-green-700 rounded-md hover:bg-green-50"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1.5 text-red-600 hover:text-red-700 rounded-md hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 text-sm ${
                        todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleStartEdit(todo.id, todo.text)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => dispatch(deleteTodo(todo.id))}
                        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {todos.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">
                No tasks yet. Add one above!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}