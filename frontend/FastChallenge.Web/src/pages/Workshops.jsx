import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { listarWorkshops, criarWorkshop } from '../api';
import { Loading, ErrorState, EmptyState, Modal } from '../components/UI';
import WorkshopTicketCard from '../components/WorkshopTicketCard';
import { parseDataLocal } from '../utils';

const vazio = { nome: '', dataRealizacao: '', descricao: '' };

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [status, setStatus] = useState('loading');
  const [erroMsg, setErroMsg] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState(vazio);
  const [formErro, setFormErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  async function carregar() {
    setStatus('loading');
    try {
      const dados = await listarWorkshops();
      const ordenado = [...dados].sort(
        (a, b) =>
          parseDataLocal(b.dataRealizacao ?? b.DataRealizacao) - parseDataLocal(a.dataRealizacao ?? a.DataRealizacao)
      );
      setWorkshops(ordenado);
      setStatus('ready');
    } catch (err) {
      setErroMsg(err.response?.data?.mensagem || 'Falha ao buscar workshops na API.');
      setStatus('error');
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function abrirCriar() {
    setForm(vazio);
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
    if (!form.dataRealizacao) {
      setFormErro('A data de realização é obrigatória.');
      return;
    }
    setSalvando(true);
    setFormErro('');
    try {
      await criarWorkshop({
        nome: form.nome,
        dataRealizacao: form.dataRealizacao,
        descricao: form.descricao,
      });
      setModalAberto(false);
      await carregar();
    } catch (err) {
      setFormErro(err.response?.data?.mensagem || 'Não foi possível salvar. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <div className="page-eyebrow">Tela 02</div>
          <h1 className="page-title">Workshops</h1>
          <p className="page-subtitle">
            Toda quinta-feira, das 16h às 17h, trimestralmente. Clique em um workshop para ver a ata de presença.
          </p>
        </div>
        <button className="btn btn-primary" onClick={abrirCriar}>
          <Plus size={16} /> Novo workshop
        </button>
      </div>

      {status === 'loading' && <Loading label="Carregando workshops…" />}
      {status === 'error' && <ErrorState message={erroMsg} onRetry={carregar} />}

      {status === 'ready' && workshops.length === 0 && (
        <EmptyState
          title="Nenhum workshop cadastrado"
          message="Cadastre o próximo workshop trimestral para começar a registrar presenças."
          action={<button className="btn btn-primary" onClick={abrirCriar}><Plus size={16} /> Novo workshop</button>}
        />
      )}

      {status === 'ready' && workshops.length > 0 && (
        <div className="ticket-grid">
          {workshops.map((w) => (
            // "campo ?? Campo" tolera tanto camelCase quanto PascalCase na
            // resposta da API, dependendo de como o backend serializa o JSON.
            <WorkshopTicketCard workshop={w} key={w.id ?? w.Id} />
          ))}
        </div>
      )}

      {modalAberto && (
        <Modal title="Novo workshop" onClose={() => setModalAberto(false)}>
          <form onSubmit={handleSalvar}>
            <div className="field">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                autoFocus
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Ex: Introdução a Testes Automatizados"
              />
            </div>
            <div className="field">
              <label htmlFor="data">Data de realização</label>
              <input
                id="data"
                type="date"
                value={form.dataRealizacao}
                onChange={(e) => setForm({ ...form, dataRealizacao: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                placeholder="Sobre o que é o workshop"
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