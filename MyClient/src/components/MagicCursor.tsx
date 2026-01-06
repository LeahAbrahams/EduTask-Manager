import React, { useEffect, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

const MagicCursor: React.FC = () => {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [trail, setTrail] = useState<CursorPosition[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setPosition(newPosition);
      
      setTrail(prev => {
        const newTrail = [newPosition, ...prev.slice(0, 8)];
        return newTrail;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div
        className="cursor"
        style={{
          left: position.x - 10,
          top: position.y - 10,
        }}
      />
      {trail.map((pos, index) => (
        <div
          key={index}
          className="cursor-trail"
          style={{
            left: pos.x - 4,
            top: pos.y - 4,
            opacity: 1 - (index * 0.15),
            transform: `scale(${1 - (index * 0.1)})`,
          }}
        />
      ))}
    </>
  );
};

export default MagicCursor;