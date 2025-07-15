import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTodoSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { InsertTodo } from "@shared/schema";

const formSchema = insertTodoSchema.extend({
  title: insertTodoSchema.shape.title.min(1, "Title is required"),
});

export default function TodoForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InsertTodo>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      completed: false,
    },
  });

  const createTodoMutation = useMutation({
    mutationFn: async (data: InsertTodo) => {
      const response = await apiRequest("POST", "/api/todos", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Todo created successfully!",
      });
      reset();
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
        description: "Failed to create todo. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertTodo) => {
    setIsSubmitting(true);
    await createTodoMutation.mutateAsync(data);
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Todo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter todo title"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  {...register("description")}
                  placeholder="Enter todo description"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isSubmitting || createTodoMutation.isPending}
              className="flex items-center gap-2"
            >
              {isSubmitting || createTodoMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add Todo
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
