import { 
  users, 
  drawings,
  type User, 
  type InsertUser, 
  type Drawing, 
  type InsertDrawing 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Drawing operations
  getDrawings(userId: number): Promise<Drawing[]>;
  getDrawing(id: number): Promise<Drawing | undefined>;
  createDrawing(userId: number, drawing: InsertDrawing): Promise<Drawing>;
  updateDrawing(id: number, drawing: Partial<InsertDrawing>): Promise<Drawing | undefined>;
  deleteDrawing(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private drawings: Map<number, Drawing>;
  private userIdCounter: number;
  private drawingIdCounter: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.drawings = new Map();
    this.userIdCounter = 1;
    this.drawingIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Drawing operations
  async getDrawings(userId: number): Promise<Drawing[]> {
    return Array.from(this.drawings.values()).filter(
      (drawing) => drawing.userId === userId
    );
  }

  async getDrawing(id: number): Promise<Drawing | undefined> {
    return this.drawings.get(id);
  }

  async createDrawing(userId: number, insertDrawing: InsertDrawing): Promise<Drawing> {
    const id = this.drawingIdCounter++;
    const now = new Date();
    const drawing: Drawing = { 
      ...insertDrawing, 
      id, 
      userId, 
      createdAt: now.toISOString() 
    };
    this.drawings.set(id, drawing);
    return drawing;
  }

  async updateDrawing(id: number, updateData: Partial<InsertDrawing>): Promise<Drawing | undefined> {
    const drawing = this.drawings.get(id);
    if (!drawing) return undefined;
    
    const updatedDrawing = { ...drawing, ...updateData };
    this.drawings.set(id, updatedDrawing);
    return updatedDrawing;
  }

  async deleteDrawing(id: number): Promise<boolean> {
    return this.drawings.delete(id);
  }
}

export const storage = new MemStorage();
