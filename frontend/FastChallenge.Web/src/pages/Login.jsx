import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function BrandMark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#2E6CE0" />
      <path d="M6 14L14 7L26 17L18 24Z" fill="#FFFFFF" />
      <path d="M6 21L12 15L20 22L14 27Z" fill="#8FC7DE" />
    </svg>
  );
}

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const origem = location.state?.from;
  const destino = origem ? `${origem.pathname}${origem.search ?? ''}` : '/workshops';

  if (isAuthenticated) {
    return <Navigate to={destino} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);
    try {
      await login(usuario, senha);
      navigate(destino, { replace: true });
    } catch (err) {
      const status = err.response?.status;
      setErro(
        status === 401 || status === 400
          ? 'Usuário ou senha inválidos.'
          : 'Não foi possível conectar à API. Confirme se o backend está rodando.'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <BrandMark />
          <div>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-md)' }}>
              Fast Workshops
            </strong>
          </div>
        </div>

        <h1 className="login-title">Entrar</h1>
        <p className="login-subtitle">Acesse com as credenciais da API para gerenciar workshops.</p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="usuario">Usuário</label>
            <input
              id="usuario"
              autoFocus
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          {erro && <p className="field-error" style={{ marginBottom: 16 }}>{erro}</p>}

          <button className="btn btn-primary" type="submit" disabled={carregando} style={{ width: '100%', justifyContent: 'center' }}>
            {carregando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <div className="login-hint">
          usuario: admin · senha: 123456
        </div>
      </div>
    </div>
  );
}