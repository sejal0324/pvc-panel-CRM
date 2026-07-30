import ClientForm from "./components/ClientForm";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import ProtectedRoute from "./components/ProtectedRoutes";
import ClientDashboard from "./components/ClientDashboard.jsx";
import Navbar from "./components/Navbar";
import ClientDetails from "./components/ClientDetails";
import LeadDashboard from "./components/LeadDashboard";
import LeadDetails from "./components/LeadDetails";
import TasksPage from "./components/TasksPage";
import InventoryPage from "./components/InventoryPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <ClientDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clients/:id/edit"
          element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clientDashboard"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leadDashboard"
          element={
            <ProtectedRoute>
              <LeadDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads/:id"
          element={
            <ProtectedRoute>
              <LeadDetails />
            </ProtectedRoute>
          }
        />
         <Route
    path="/tasks"
    element={<TasksPage/>}
/>
<Route
    path="/inventory"
    element={<InventoryPage/>}
/>
      </Routes>

      

    </BrowserRouter>
  );
   
}

export default App;
