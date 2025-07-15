import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";
import EditTodoDialog from "./EditTodoDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import type { Todo } from "@shared/schema";

export default function TodoList() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);

  const { data: todos = [], isLoading, error } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
    retry: false,
  });

  // Handle unauthorized errors
  if (error && isUnauthorizedError(error)) {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
  }

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <TodoFilters onFilterChange={setFilter} />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-border p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive">
          Failed to load todos. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TodoFilters onFilterChange={setFilter} />
      
      <AnimatePresence mode="wait">
        {filteredTodos.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
              <ClipboardList className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {filter === 'all' ? 'No todos yet' : 
               filter === 'active' ? 'No active todos' : 
               'No completed todos'}
            </h3>
            <p className="text-muted-foreground">
              {filter === 'all' ? 'Add your first todo item to get started!' : 
               filter === 'active' ? 'All your todos are completed!' : 
               'Complete some todos to see them here.'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <AnimatePresence>
              {filteredTodos.map((todo, index) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TodoItem
                    todo={todo}
                    onEdit={setEditingTodo}
                    onDelete={setDeletingTodo}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <EditTodoDialog
        todo={editingTodo}
        open={!!editingTodo}
        onOpenChange={(open) => !open && setEditingTodo(null)}
      />

      <DeleteConfirmDialog
        todo={deletingTodo}
        open={!!deletingTodo}
        onOpenChange={(open) => !open && setDeletingTodo(null)}
      />
    </div>
  );
}
