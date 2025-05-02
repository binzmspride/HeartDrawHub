import { Router as WouterRouter } from "wouter";
import { AppContent } from "./AppWrapper";

// This is a simple wrapper that doesn't use any hooks
function App() {
  return (
    <WouterRouter>
      <AppContent />
    </WouterRouter>
  );
}

export default App;
