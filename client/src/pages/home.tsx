import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CheckSquare, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import TodoFilters from "@/components/TodoFilters";
import { motion } from "framer-motion";

export default function Home() {
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-border"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckSquare className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">Todo List</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {user?.firstName || user?.email || "User"}
              </span>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center overflow-hidden">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-secondary-foreground" />
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <TodoForm />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TodoFilters />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TodoList />
        </motion.div>
      </main>
    </div>
  );
}
