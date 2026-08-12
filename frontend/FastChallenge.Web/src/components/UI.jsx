export function Loading({ label = 'Carregando…' }) {
  return (
    <div className="state-block">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ title = 'Não foi possível carregar os dados', message, onRetry }) {
  return (
    <div className="state-block error">
      <h3>{title}</h3>
      <p>{message || 'Verifique se a API está rodando e tente novamente.'}</p>
      {onRetry && (
        <button className="btn btn-ghost" style={{ marginTop: 16 }} onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="state-block">
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3 style={{ marginBottom: 20 }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}