import {
  users,
  todos,
  type User,
  type UpsertUser,
  type Todo,
  type InsertTodo,
  type UpdateTodo,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Todo operations
  getTodos(userId: string): Promise<Todo[]>;
  getTodo(id: number, userId: string): Promise<Todo | undefined>;
  createTodo(todo: InsertTodo, userId: string): Promise<Todo>;
  updateTodo(id: number, updates: UpdateTodo, userId: string): Promise<Todo | undefined>;
  deleteTodo(id: number, userId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Todo operations
  async getTodos(userId: string): Promise<Todo[]> {
    return await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(desc(todos.createdAt));
  }

  async getTodo(id: number, userId: string): Promise<Todo | undefined> {
    const [todo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));
    return todo;
  }

  async createTodo(todo: InsertTodo, userId: string): Promise<Todo> {
    const [newTodo] = await db
      .insert(todos)
      .values({
        ...todo,
        userId,
      })
      .returning();
    return newTodo;
  }

  async updateTodo(id: number, updates: UpdateTodo, userId: string): Promise<Todo | undefined> {
    const [updatedTodo] = await db
      .update(todos)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(and(eq(todos.id, id), eq(todos.userId, userId)))
      .returning();
    return updatedTodo;
  }

  async deleteTodo(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(todos)
      .where(and(eq(todos.id, id), eq(todos.userId, userId)));
    return (result.rowCount ?? 0) > 0;
  }
}

export const storage = new DatabaseStorage();
