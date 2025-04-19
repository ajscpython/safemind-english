import { useState } from "react";

export function Tabs({ defaultValue, children }) {
  return <div>{children}</div>;
}

export function TabsList({ children }) {
  return <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>{children}</div>;
}

export function TabsTrigger({ value, children, setActiveTab, activeTab }) {
  return (
    <button
      style={{
        background: activeTab === value ? '#2563eb' : '#e0e0e0',
        color: activeTab === value ? '#fff' : '#000',
        padding: '8px 14px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold'
      }}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, activeTab, children }) {
  return activeTab === value ? <div>{children}</div> : null;
}
