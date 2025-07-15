import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Edit2, Trash2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import type { Todo } from "@shared/schema";

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
}

export default function TodoItem({ todo, onEdit, onDelete }: TodoItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleTodoMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      const response = await apiRequest("PATCH", `/api/todos/${todo.id}`, { completed });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Todo ${todo.completed ? 'unmarked' : 'marked'} as ${todo.completed ? 'incomplete' : 'complete'}!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/todos"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleToggle = () => {
    toggleTodoMutation.mutate(!todo.completed);
  };

  const timeAgo = todo.createdAt ? formatDistanceToNow(new Date(todo.createdAt), { addSuffix: true }) : '';

  return (
    <motion.div
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-white rounded-lg border border-border p-4 transition-all duration-200",
        "hover:shadow-md",
        todo.completed && "opacity-70"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            disabled={toggleTodoMutation.isPending}
            className={cn(
              "w-5 h-5 p-0 border-2 rounded hover:border-green-500 transition-colors mt-0.5",
              todo.completed 
                ? "bg-green-500 border-green-500 text-white hover:bg-green-600" 
                : "border-border"
            )}
          >
            {todo.completed && <Check className="w-3 h-3" />}
          </Button>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium",
              todo.completed && "line-through text-muted-foreground"
            )}>
              {todo.title}
            </h3>
            {todo.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {todo.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Created {timeAgo}</span>
              <Badge variant={todo.completed ? "secondary" : "outline"} className="h-5">
                {todo.completed ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Completed
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1" />
                    Active
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(todo)}
            className="p-1 h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(todo)}
            className="p-1 h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
