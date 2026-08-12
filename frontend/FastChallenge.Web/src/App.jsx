import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Colaboradores from './pages/Colaboradores';
import Workshops from './pages/Workshops';
import WorkshopDetalhe from './pages/WorkshopDetalhe';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/workshops/:id" element={<WorkshopDetalhe />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/" element={<Navigate to="/workshops" replace />} />
          <Route path="*" element={<Navigate to="/workshops" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}