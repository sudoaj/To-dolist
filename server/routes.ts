import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTodoSchema, updateTodoSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Todo routes
  app.get('/api/todos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const todos = await storage.getTodos(userId);
      res.json(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ message: "Failed to fetch todos" });
    }
  });

  app.get('/api/todos/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const todoId = parseInt(req.params.id);
      
      if (isNaN(todoId)) {
        return res.status(400).json({ message: "Invalid todo ID" });
      }

      const todo = await storage.getTodo(todoId, userId);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.json(todo);
    } catch (error) {
      console.error("Error fetching todo:", error);
      res.status(500).json({ message: "Failed to fetch todo" });
    }
  });

  app.post('/api/todos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validation = insertTodoSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }

      const todo = await storage.createTodo(validation.data, userId);
      res.status(201).json(todo);
    } catch (error) {
      console.error("Error creating todo:", error);
      res.status(500).json({ message: "Failed to create todo" });
    }
  });

  app.patch('/api/todos/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const todoId = parseInt(req.params.id);
      
      if (isNaN(todoId)) {
        return res.status(400).json({ message: "Invalid todo ID" });
      }

      const validation = updateTodoSchema.safeParse(req.body);
      
      if (!validation.success) {
        const errorMessage = fromZodError(validation.error);
        return res.status(400).json({ message: errorMessage.toString() });
      }

      const todo = await storage.updateTodo(todoId, validation.data, userId);
      if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.json(todo);
    } catch (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ message: "Failed to update todo" });
    }
  });

  app.delete('/api/todos/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const todoId = parseInt(req.params.id);
      
      if (isNaN(todoId)) {
        return res.status(400).json({ message: "Invalid todo ID" });
      }

      const deleted = await storage.deleteTodo(todoId, userId);
      if (!deleted) {
        return res.status(404).json({ message: "Todo not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ message: "Failed to delete todo" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
