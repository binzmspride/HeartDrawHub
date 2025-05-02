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
import { db } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

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

// Session store setup
const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Drawing operations
  async getDrawings(userId: number): Promise<Drawing[]> {
    return await db.select().from(drawings).where(eq(drawings.userId, userId));
  }

  async getDrawing(id: number): Promise<Drawing | undefined> {
    const [drawing] = await db.select().from(drawings).where(eq(drawings.id, id));
    return drawing || undefined;
  }

  async createDrawing(userId: number, insertDrawing: InsertDrawing): Promise<Drawing> {
    const [drawing] = await db
      .insert(drawings)
      .values({ ...insertDrawing, userId })
      .returning();
    return drawing;
  }

  async updateDrawing(id: number, updateData: Partial<InsertDrawing>): Promise<Drawing | undefined> {
    const [updated] = await db
      .update(drawings)
      .set(updateData)
      .where(eq(drawings.id, id))
      .returning();
    return updated;
  }

  async deleteDrawing(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(drawings)
      .where(eq(drawings.id, id))
      .returning();
    return !!deleted;
  }
}

// In-memory storage implementation (kept for reference)
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

// Switch to database storage
export const storage = new DatabaseStorage();
