import { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend,
} from 'recharts';
import { listarColaboradores, listarWorkshops } from '../api';
import { Loading, ErrorState, EmptyState } from '../components/UI';

const PALETTE = ['#2E6CE0', '#8FC7DE', '#F2A93B', '#1B3E86', '#D8483F', '#6FA8DC', '#F4C874', '#4C5C74'];

export default function Dashboard() {
  const [colaboradores, setColaboradores] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [status, setStatus] = useState('loading');
  const [erroMsg, setErroMsg] = useState('');
  const [filtroColaborador, setFiltroColaborador] = useState('todos');

  async function carregar() {
    setStatus('loading');
    try {
      const [c, w] = await Promise.all([listarColaboradores(), listarWorkshops()]);
      setColaboradores(c);
      setWorkshops(w);
      setStatus('ready');
    } catch (err) {
      setErroMsg(err.response?.data?.mensagem || 'Falha ao buscar dados para o dashboard.');
      setStatus('error');
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  // A API não retorna esse agregado pronto (quantos workshops cada
  // colaborador participou), então calculamos aqui: partimos de todos os
  // colaboradores com total zerado e, para cada workshop, incrementamos o
  // total de quem esteve presente nele.
  const participacaoPorColaborador = useMemo(() => {
    const contagem = new Map(
      colaboradores.map((c) => {
        const id = String(c.id ?? c.Id);
        return [id, { id, nome: c.nome ?? c.Nome, total: 0 }];
      })
    );
    workshops.forEach((w) => {
      (w.colaboradores ?? w.Colaboradores ?? []).forEach((c) => {
        const key = String(c.id ?? c.Id);
        if (contagem.has(key)) contagem.get(key).total += 1;
      });
    });
    return [...contagem.values()].sort((a, b) => b.total - a.total);
  }, [colaboradores, workshops]);

  // 'todos' é um valor sentinela (não é um ID de colaborador de verdade),
  // usado só para representar a opção "sem filtro" no dropdown.
  const dadosBarra = useMemo(() => {
    if (filtroColaborador === 'todos') return participacaoPorColaborador;
    return participacaoPorColaborador.filter((c) => c.id === filtroColaborador);
  }, [participacaoPorColaborador, filtroColaborador]);

  const dadosPizza = useMemo(
    () =>
      workshops.map((w) => ({
        nome: w.nome ?? w.Nome,
        value: (w.colaboradores ?? w.Colaboradores ?? []).length,
      })).filter((w) => w.value > 0),
    [workshops]
  );

  const mediaPresenca = workshops.length
    ? (workshops.reduce((acc, w) => acc + (w.colaboradores ?? w.Colaboradores ?? []).length, 0) / workshops.length)
    : 0;

  if (status === 'loading') return <Loading label="Carregando métricas…" />;
  if (status === 'error') return <ErrorState message={erroMsg} onRetry={carregar} />;

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Métricas</div>
          <h1 className="page-title">Dashboard de participação</h1>
          <p className="page-subtitle">Visão geral da presença dos colaboradores nos workshops trimestrais.</p>
        </div>
      </div>

      <div className="stat-row">
        <div className="card stat-card">
          <div className="stat-value">{colaboradores.length}</div>
          <div className="stat-label">Colaboradores</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{workshops.length}</div>
          <div className="stat-label">Workshops realizados</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{mediaPresenca.toFixed(1)}</div>
          <div className="stat-label">Presença média por workshop</div>
        </div>
      </div>

      {workshops.length === 0 || colaboradores.length === 0 ? (
        <EmptyState
          title="Ainda não há dados suficientes"
          message="Cadastre colaboradores, workshops e registre presenças para visualizar os gráficos."
        />
      ) : (
        <div className="dash-grid">
          <div className="card chart-card">
            <div className="chart-card-head">
              <h3>Workshops por colaborador</h3>
              <select value={filtroColaborador} onChange={(e) => setFiltroColaborador(e.target.value)}>
                <option value="todos">Todos os colaboradores</option>
                {participacaoPorColaborador.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={Math.max(260, dadosBarra.length * 34)}>
              <BarChart data={dadosBarra} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#DCE4EE" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#4C5C74' }} />
                <YAxis
                  type="category"
                  dataKey="nome"
                  width={120}
                  tick={{ fontSize: 12, fill: '#16233D' }}
                />
                <Tooltip
                  formatter={(value) => [`${value} workshop${value === 1 ? '' : 's'}`, 'Participações']}
                  contentStyle={{ borderRadius: 10, borderColor: '#DCE4EE', fontSize: 13 }}
                />
                <Bar dataKey="total" radius={[0, 6, 6, 0]} fill="#2E6CE0" maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card chart-card">
            <div className="chart-card-head">
              <h3>Colaboradores por workshop</h3>
            </div>
            {dadosPizza.length === 0 ? (
              <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--fs-sm)' }}>
                Nenhuma presença registrada ainda.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={360}>
                <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                  <Pie
                    data={dadosPizza}
                    dataKey="value"
                    nameKey="nome"
                    cx="50%"
                    cy="42%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {dadosPizza.map((_, i) => (
                      <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} colaboradores`, '']} />
                  <Legend
                    layout="horizontal"
                    align="center"
                    verticalAlign="bottom"
                    iconSize={10}
                    wrapperStyle={{
                      fontSize: 12,
                      color: '#4C5C74',
                      paddingTop: 12,
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      rowGap: 4,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </>
  );
}