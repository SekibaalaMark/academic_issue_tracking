import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // React Router for routing
import App from "./App"; // Main App Component
import "./index.css"; // Global styles (if any)
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
