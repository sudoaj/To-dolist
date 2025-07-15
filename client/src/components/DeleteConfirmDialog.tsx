import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Todo } from "@shared/schema";

interface DeleteConfirmDialogProps {
  todo: Todo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteConfirmDialog({ todo, open, onOpenChange }: DeleteConfirmDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteTodoMutation = useMutation({
    mutationFn: async () => {
      if (!todo) throw new Error("No todo selected");
      await apiRequest("DELETE", `/api/todos/${todo.id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Todo deleted successfully!",
      });
      onOpenChange(false);
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
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    deleteTodoMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{todo?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteTodoMutation.isPending}
            >
              {deleteTodoMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              Delete
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
