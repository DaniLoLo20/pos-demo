import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import PrivateRoute from "./routes/PrivateRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import ProductsPage from "./pages/ProductsPage";
import PosPage from "./pages/PosPage";
import ReportsPage from "./pages/ReportsPage";
import UsersPage
 from "./pages/UsersPage";
function App() {
  return (
    
 <>
      <Navbar />  

    <Routes>
      {/* redirección raíz */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* protegida (logueado) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* solo admin */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />

      {/* acceso denegado */}
      <Route path="/403" element={<ForbiddenPage />} />

      {/* productos (solo admin) */}
<Route
  path="/products"
  element={
    <AdminRoute>
      <ProductsPage />
    </AdminRoute>
  }
/>

<Route
  path="/users"
  element={
    <AdminRoute>
      <UsersPage />
    </AdminRoute>
  }
/>


<Route
  path="/reports"
  element={
    <AdminRoute>
      <ReportsPage />
    </AdminRoute>
  }
/>

{/* POS / ventas (logueado) */}
<Route
  path="/pos"
  element={
    <ProtectedRoute>
      <PosPage />
    </ProtectedRoute>
  }
/>


    </Routes>
 </>
    
  );
}

export default App;
``