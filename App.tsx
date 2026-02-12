import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedLayout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import AdminLojistas from './pages/admin/Lojistas';
import AdminCategories from './pages/admin/Categories';
import AdminAuctions from './pages/admin/Auctions';
import AvailableAuctions from './pages/lojista/AvailableAuctions';
import MyProposals from './pages/lojista/MyProposals';
import CreateAuction from './pages/user/CreateAuction';
import MyAuctions from './pages/user/MyAuctions';
import AuctionDetail from './pages/user/AuctionDetail';

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (profile) return <Navigate to="/" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/setup" element={<Setup />} />

      <Route path="/" element={<ProtectedLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="lojistas" element={<AdminLojistas />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="admin-leiloes" element={<AdminAuctions />} />
        <Route path="leiloes" element={<AvailableAuctions />} />
        <Route path="propostas" element={<MyProposals />} />
        <Route path="novo-leilao" element={<CreateAuction />} />
        <Route path="meus-leiloes" element={<MyAuctions />} />
        <Route path="leilao/:id" element={<AuctionDetail />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function EnvCheck() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Variaveis de Ambiente Faltando
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            As variaveis de ambiente do Supabase nao foram encontradas.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono space-y-2">
            <div className="flex items-center justify-between">
              <span>VITE_SUPABASE_URL:</span>
              <span className={supabaseUrl ? 'text-green-600' : 'text-red-600'}>
                {supabaseUrl ? 'OK' : 'FALTANDO'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>VITE_SUPABASE_ANON_KEY:</span>
              <span className={supabaseAnonKey ? 'text-green-600' : 'text-red-600'}>
                {supabaseAnonKey ? 'OK' : 'FALTANDO'}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Verifique o arquivo .env na raiz do projeto
          </p>
        </div>
      </div>
    );
  }

  return null;
}

export default function App() {
  const envError = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (envError) {
    return <EnvCheck />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
