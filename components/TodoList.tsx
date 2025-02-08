'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { addTodo, toggleTodo, deleteTodo, editTodo } from '@/lib/store/todoSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
    <div className="max-w-2xl mx-auto p-6">
      <Card className="p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Todo List</h1>
        
        <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1"
          />
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </form>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-3 bg-secondary rounded-lg group"
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => dispatch(toggleTodo(todo.id))}
                className="h-5 w-5"
              />
              
              {editingId === todo.id ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleSaveEdit(todo.id)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 ${
                      todo.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStartEdit(todo.id, todo.text)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dispatch(deleteTodo(todo.id))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
          
          {todos.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              No todos yet. Add one above!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}