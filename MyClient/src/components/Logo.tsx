import React from 'react';

const Logo: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <svg width={size} height={size} viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="none" stroke="#fff" strokeWidth="2"/>
          <path d="M20 8 L24 16 L32 16 L26 22 L28 30 L20 26 L12 30 L14 22 L8 16 L16 16 Z" fill="#fff"/>
        </svg>
        <div style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          width: '12px',
          height: '12px',
          background: '#ff4444',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />
      </div>
      <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>מצוינות</span>
    </div>
  );
};

export default Logo;