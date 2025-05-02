import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Routes } from "./Routes.tsx";

// Define a component tree with proper nesting of providers
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Routes />
  </QueryClientProvider>
);
