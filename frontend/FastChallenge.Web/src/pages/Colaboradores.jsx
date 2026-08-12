import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import {
  listarColaboradores,
  criarColaborador,
  atualizarColaborador,
  excluirColaborador,
} from '../api';
import { Loading, ErrorState, EmptyState, Modal } from '../components/UI';

const vazio = { nome: '' };

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [erroMsg, setErroMsg] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(vazio);
  const [formErro, setFormErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState(null);

  async function carregar() {
    setStatus('loading');
    try {
      const dados = await listarColaboradores();
      setColaboradores(dados);
      setStatus('ready');
    } catch (err) {
      setErroMsg(err.response?.data?.mensagem || 'Falha ao buscar colaboradores na API.');
      setStatus('error');
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirCriar() {
    setEditando(null);
    setForm(vazio);
    setFormErro('');
    setModalAberto(true);
  }

  function abrirEditar(colaborador) {
    setEditando(colaborador);
    setForm({ nome: colaborador.nome ?? colaborador.Nome });
    setFormErro('');
    setModalAberto(true);
  }

  async function handleSalvar(e) {
    e.preventDefault();
    // Espelha a regra de validação do backend (nome entre 2 e 100
    // caracteres), só para dar feedback imediato ao usuário. A validação
    // que realmente importa continua sendo feita pela API.
    if (form.nome.trim().length < 2 || form.nome.trim().length > 100) {
      setFormErro('O nome deve ter entre 2 e 100 caracteres.');
      return;
    }
    setSalvando(true);
    setFormErro('');
    try {
      if (editando) {
        const id = editando.id ?? editando.Id;
        await atualizarColaborador(id, { id, nome: form.nome });
      } else {
        await criarColaborador({ nome: form.nome });
      }
      setModalAberto(false);
      await carregar();
    } catch (err) {
      setFormErro(err.response?.data?.mensagem || 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(colaborador) {
    const id = colaborador.id ?? colaborador.Id;
    if (!window.confirm(`Remover ${colaborador.nome ?? colaborador.Nome}?`)) return;
    setExcluindoId(id);
    try {
      await excluirColaborador(id);
      await carregar();
    } catch (err) {
      alert(err.response?.data?.mensagem || 'Não foi possível remover este colaborador.');
    } finally {
      setExcluindoId(null);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Tela 01</div>
          <h1 className="page-title">Colaboradores</h1>
          <p className="page-subtitle">Todos os colaboradores cadastrados na base da Fast Soluções.</p>
        </div>
        <button className="btn btn-primary" onClick={abrirCriar}>
          <Plus size={16} /> Novo colaborador
        </button>
      </div>

      {status === 'loading' && <Loading label="Carregando colaboradores…" />}
      {status === 'error' && <ErrorState message={erroMsg} onRetry={carregar} />}

      {status === 'ready' && colaboradores.length === 0 && (
        <EmptyState
          title="Nenhum colaborador cadastrado"
          message="Cadastre o primeiro colaborador para começar a rastrear presenças nos workshops."
          action={<button className="btn btn-primary" onClick={abrirCriar}><Plus size={16} /> Novo colaborador</button>}
        />
      )}

      {status === 'ready' && colaboradores.length > 0 && (
        <div className="colab-grid">
          {colaboradores.map((c) => {
            // "campo ?? Campo" tolera tanto camelCase quanto PascalCase na
            // resposta da API, dependendo de como o backend serializa o JSON.
            const id = c.id ?? c.Id;
            const nome = c.nome ?? c.Nome;
            return (
              <div className="card colab-card" key={id}>
                <div className="colab-card-info">
                  <span className="colab-avatar">{nome?.slice(0, 2).toUpperCase()}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="colab-name">{nome}</div>
                    <div className="colab-id">ID #{id}</div>
                  </div>
                </div>
                <div className="colab-card-actions">
                  <button className="btn btn-ghost btn-sm" onClick={() => abrirEditar(c)} aria-label="Editar">
                    <Pencil size={14} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleExcluir(c)}
                    disabled={excluindoId === id}
                    aria-label="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalAberto && (
        <Modal title={editando ? 'Editar colaborador' : 'Novo colaborador'} onClose={() => setModalAberto(false)}>
          <form onSubmit={handleSalvar}>
            <div className="field">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                autoFocus
                value={form.nome}
                onChange={(e) => setForm({ nome: e.target.value })}
                placeholder="Nome do colaborador"
              />
            </div>
            {formErro && <p className="field-error">{formErro}</p>}
            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setModalAberto(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={salvando}>
                {salvando ? 'Salvando…' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}