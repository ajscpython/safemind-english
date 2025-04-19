export function Button({ children, onClick }) {
  return (
    <button
      style={{
        padding: '10px 16px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
