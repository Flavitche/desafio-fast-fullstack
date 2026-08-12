import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UserPlus, X, Trash2 } from 'lucide-react';
import { obterWorkshop, registrarPresenca, removerPresenca, excluirWorkshop, listarColaboradores } from '../api';
import { Loading, ErrorState } from '../components/UI';
import { parseDataLocal } from '../utils';

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

export default function WorkshopDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState(null);
  const [todosColaboradores, setTodosColaboradores] = useState([]);
  const [status, setStatus] = useState('loading');
  const [erroMsg, setErroMsg] = useState('');
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState('');
  const [processandoId, setProcessandoId] = useState(null);

  async function carregar() {
    setStatus('loading');
    try {
      const [w, todos] = await Promise.all([obterWorkshop(id), listarColaboradores()]);
      setWorkshop(w);
      setTodosColaboradores(todos);
      setStatus('ready');
    } catch (err) {
      setErroMsg(err.response?.data?.mensagem || 'Falha ao buscar os dados deste workshop.');
      setStatus('error');
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (status === 'loading') return <Loading label="Carregando workshop…" />;
  if (status === 'error') return <ErrorState message={erroMsg} onRetry={carregar} />;
  if (!workshop) return null;

  // O acesso "campo ?? Campo" (ex: nome ?? Nome) é uma tolerância proposital
  // a diferentes convenções de serialização JSON do backend (camelCase ou
  // PascalCase), dependendo de como o System.Text.Json estiver configurado.
  const nome = workshop.nome ?? workshop.Nome;
  const descricao = workshop.descricao ?? workshop.Descricao;
  const presentes = workshop.colaboradores ?? workshop.Colaboradores ?? [];
  const data = parseDataLocal(workshop.dataRealizacao ?? workshop.DataRealizacao);
  const dataValida = !Number.isNaN(data.getTime());

  // "disponiveis" filtra os colaboradores que AINDA NÃO estão presentes
  // neste workshop, para que o dropdown de "Registrar presença" não
  // permita marcar a mesma pessoa duas vezes.
  const idsPresentes = new Set(presentes.map((c) => c.id ?? c.Id));
  const disponiveis = todosColaboradores.filter((c) => !idsPresentes.has(c.id ?? c.Id));

  async function handleAdicionar() {
    if (!colaboradorSelecionado) return;
    setProcessandoId(colaboradorSelecionado);
    try {
      await registrarPresenca(id, colaboradorSelecionado);
      setColaboradorSelecionado('');
      await carregar();
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Não foi possível registrar a presença.');
    } finally {
      setProcessandoId(null);
    }
  }

  async function handleRemover(colaboradorId) {
    setProcessandoId(colaboradorId);
    try {
      await removerPresenca(id, colaboradorId);
      await carregar();
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Não foi possível remover a presença.');
    } finally {
      setProcessandoId(null);
    }
  }

  async function handleExcluirWorkshop() {
    if (!window.confirm(`Excluir o workshop "${nome}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await excluirWorkshop(id);
      navigate('/workshops');
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Não foi possível excluir este workshop.');
    }
  }

  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/workshops')} style={{ marginBottom: 24 }}>
        <ArrowLeft size={14} /> Voltar para workshops
      </button>

      <div className="detail-hero">
        <div className="detail-stub">
          <span className="stub-day">{dataValida ? data.getDate() : '--'}</span>
          <span className="stub-month">{dataValida ? MESES[data.getMonth()].slice(0, 3) : ''}</span>
          <span className="stub-time">16h – 17h</span>
        </div>
        <div style={{ flex: 1 }}>
          <div className="page-eyebrow">
            {dataValida ? `${data.getDate()} de ${MESES[data.getMonth()]} de ${data.getFullYear()}` : 'Data não informada'}
          </div>
          <h1 className="page-title">{nome}</h1>
          <p className="page-subtitle">{descricao}</p>
          <button className="btn btn-danger btn-sm" style={{ marginTop: 16 }} onClick={handleExcluirWorkshop}>
            <Trash2 size={14} /> Excluir workshop
          </button>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 24 }}>
        <div className="chart-card-head">
          <h3>Ata de presença</h3>
          <span className="badge-count" style={{ fontFamily: 'var(--font-mono)' }}>
            {presentes.length} presente{presentes.length === 1 ? '' : 's'}
          </span>
        </div>

        {presentes.length === 0 ? (
          <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--fs-sm)' }}>
            Nenhum colaborador registrado neste workshop ainda.
          </p>
        ) : (
          <div className="attendee-list">
            {presentes.map((c) => {
              const cid = c.id ?? c.Id;
              const cnome = c.nome ?? c.Nome;
              return (
                <div className="attendee-row" key={cid}>
                  <span className="colab-avatar">{cnome?.slice(0, 2).toUpperCase()}</span>
                  <div style={{ flex: 1 }}>
                    <div className="colab-name">{cnome}</div>
                    <div className="colab-id">ID #{cid}</div>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleRemover(cid)}
                    disabled={processandoId === cid}
                    aria-label="Remover presença"
                  >
                    <X size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="panel">
        <h3 style={{ marginBottom: 16 }}>Registrar presença</h3>
        {disponiveis.length === 0 ? (
          <p style={{ color: 'var(--color-ink-soft)', fontSize: 'var(--fs-sm)' }}>
            Todos os colaboradores cadastrados já estão presentes neste workshop.
          </p>
        ) : (
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <select
              value={colaboradorSelecionado}
              onChange={(e) => setColaboradorSelecionado(e.target.value)}
              style={{
                flex: 1,
                minWidth: 220,
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-line-strong)',
                background: 'var(--color-bg)',
              }}
            >
              <option value="">Selecione um colaborador…</option>
              {disponiveis.map((c) => (
                <option key={c.id ?? c.Id} value={c.id ?? c.Id}>
                  {c.nome ?? c.Nome}
                </option>
              ))}
            </select>
            <button
              className="btn btn-primary"
              onClick={handleAdicionar}
              disabled={!colaboradorSelecionado || processandoId === colaboradorSelecionado}
            >
              <UserPlus size={16} /> Adicionar
            </button>
          </div>
        )}
      </div>
    </>
  );
}