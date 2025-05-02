import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDrawingSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Unauthorized");
  };

  // Get all drawings for the logged in user
  app.get("/api/drawings", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const drawings = await storage.getDrawings(userId);
      res.json(drawings);
    } catch (error) {
      res.status(500).send("Error fetching drawings");
    }
  });

  // Get a specific drawing
  app.get("/api/drawings/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).send("Invalid drawing ID");
      }

      const drawing = await storage.getDrawing(id);
      if (!drawing) {
        return res.status(404).send("Drawing not found");
      }

      // Check if drawing belongs to user
      if (drawing.userId !== req.user!.id) {
        return res.status(403).send("Not authorized to access this drawing");
      }

      res.json(drawing);
    } catch (error) {
      res.status(500).send("Error fetching drawing");
    }
  });

  // Create a new drawing
  app.post("/api/drawings", isAuthenticated, async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertDrawingSchema.parse(req.body);
      
      // Create drawing in storage
      const drawing = await storage.createDrawing(req.user!.id, validatedData);
      
      res.status(201).json(drawing);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).send("Error creating drawing");
    }
  });

  // Update a drawing
  app.put("/api/drawings/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).send("Invalid drawing ID");
      }

      // Check if drawing exists and belongs to user
      const existingDrawing = await storage.getDrawing(id);
      if (!existingDrawing) {
        return res.status(404).send("Drawing not found");
      }
      
      if (existingDrawing.userId !== req.user!.id) {
        return res.status(403).send("Not authorized to update this drawing");
      }

      // Validate request body
      const validatedData = insertDrawingSchema.partial().parse(req.body);
      
      // Update drawing
      const updatedDrawing = await storage.updateDrawing(id, validatedData);
      
      res.json(updatedDrawing);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      res.status(500).send("Error updating drawing");
    }
  });

  // Delete a drawing
  app.delete("/api/drawings/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).send("Invalid drawing ID");
      }

      // Check if drawing exists and belongs to user
      const existingDrawing = await storage.getDrawing(id);
      if (!existingDrawing) {
        return res.status(404).send("Drawing not found");
      }
      
      if (existingDrawing.userId !== req.user!.id) {
        return res.status(403).send("Not authorized to delete this drawing");
      }

      // Delete drawing
      await storage.deleteDrawing(id);
      
      res.status(204).send();
    } catch (error) {
      res.status(500).send("Error deleting drawing");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
