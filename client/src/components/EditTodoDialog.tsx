import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTodoSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import type { Todo, UpdateTodo } from "@shared/schema";

interface EditTodoDialogProps {
  todo: Todo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = updateTodoSchema.extend({
  title: z.string().min(1, "Title is required"),
});

export default function EditTodoDialog({ todo, open, onOpenChange }: EditTodoDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTodo>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (todo) {
      reset({
        title: todo.title,
        description: todo.description || "",
      });
    }
  }, [todo, reset]);

  const updateTodoMutation = useMutation({
    mutationFn: async (data: UpdateTodo) => {
      if (!todo) throw new Error("No todo selected");
      const response = await apiRequest("PATCH", `/api/todos/${todo.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Todo updated successfully!",
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
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UpdateTodo) => {
    updateTodoMutation.mutate(data);
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
            <DialogTitle>Edit Todo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                {...register("title")}
                placeholder="Enter todo title"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                {...register("description")}
                placeholder="Enter todo description"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateTodoMutation.isPending}>
                {updateTodoMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
