import React, { useEffect, useState } from 'react';

const FallingStars: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (isActive) {
      const newStars = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setStars(newStars);
      
      const timer = setTimeout(() => setStars([]), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive || stars.length === 0) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }}>
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: '-10px',
            width: '3px',
            height: '3px',
            background: '#fff',
            borderRadius: '50%',
            boxShadow: '0 0 6px #fff',
            animation: `fallingStar 2s linear ${star.delay}s forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes fallingStar {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FallingStars;