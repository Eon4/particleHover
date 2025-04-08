import { useEffect, useRef, useState } from 'react';
import './App.css';
import image from './assets/react.svg';

function App() {
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Define trailing particles for the effect
  const positions = useRef(
    Array.from({ length: 100 }, () => ({ x: 0, y: 0 }))
  );

  useEffect(() => {
    const container = containerRef.current;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const lerp = (start, end, amt) => start + (end - start) * amt;

      // Move positions of particles to follow the cursor
      positions.current = positions.current.map((pos, index) => {
        const target = index === 0 ? { x: mouseX, y: mouseY } : positions.current[index - 1];
        return {
          x: lerp(pos.x, target.x, 0.3), // Smooth following of cursor
          y: lerp(pos.y, target.y, 0.3),
        };
      });

      // Create radial gradients for particle mask effect
      const mask = positions.current
        .map((pos, index) => {
          const opacity = 1 - index / positions.current.length; 

          // Make the first particle bigger and the others smaller
          const size = 80 + (10 - index * 0.5);

          return `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px, rgba(0, 0, 0, ${opacity}) 0%, rgba(0, 0, 0, 0) 50%)`;
        })
        .join(', ');

      // Apply the generated mask to the container
      container.style.setProperty('--mask', mask);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="app">
      <div
        className="mask-container"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={image}
          alt="Smooth Reveal"
          className={isHovering ? "visible" : "hidden"}
        />
      </div>
    </div>
  );
}

export default App;
