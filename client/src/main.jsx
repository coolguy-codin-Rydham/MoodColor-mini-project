import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";
import "./index.css"

const router = createBrowserRouter([
  {
    path : "/",
    element : <Home/>
  },
  {
    path: "/admin",
    element : <Admin/>
  }
])

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <StrictMode>
      <RouterProvider router={router}/>
      <ToastContainer/>
    </StrictMode>
  </QueryClientProvider>
);
