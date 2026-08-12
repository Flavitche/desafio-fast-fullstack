import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { parseDataLocal } from '../utils';

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

export default function WorkshopTicketCard({ workshop }) {
  const navigate = useNavigate();
  // "campo ?? Campo" tolera tanto camelCase quanto PascalCase na resposta
  // da API, dependendo de como o backend serializa o JSON.
  const data = parseDataLocal(workshop.dataRealizacao ?? workshop.DataRealizacao);
  const valida = !Number.isNaN(data.getTime());
  const qtdColaboradores = (workshop.colaboradores ?? workshop.Colaboradores ?? []).length;

  return (
    <button className="ticket" onClick={() => navigate(`/workshops/${workshop.id ?? workshop.Id}`)}>
      <div className="ticket-stub">
        <span className="stub-day">{valida ? data.getDate() : '--'}</span>
        <span className="stub-month">{valida ? MESES[data.getMonth()] : '—'}</span>
        <span className="stub-year">{valida ? data.getFullYear() : ''}</span>
      </div>
      <div className="ticket-perforation" />
      <div className="ticket-body">
        <span className="ticket-name">{workshop.nome ?? workshop.Nome}</span>
        <p className="ticket-desc">{workshop.descricao ?? workshop.Descricao}</p>
        <div className="ticket-meta">
          <span>16h – 17h</span>
          <span className="badge-count">
            <Users size={11} style={{ verticalAlign: '-2px', marginRight: 4 }} />
            {qtdColaboradores}
          </span>
        </div>
      </div>
    </button>
  );
}