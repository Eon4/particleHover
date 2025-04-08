import { useEffect, useRef, useState } from 'react';
import './App.css';
import image from './assets/react.svg';

function App() {
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Defining trailing particles for the effect
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

      // Move positions of particles to follow the cursor with more distance
      positions.current = positions.current.map((pos, index) => {
        const target = index === 0 ? { x: mouseX, y: mouseY } : positions.current[index - 1];
        
        // Increase the amount by which particles "trail" behind the cursor (larger amt)
        const distanceFactor = 0.5 + (index / 100); 
        
        return {
          x: lerp(pos.x, target.x, distanceFactor),
          y: lerp(pos.y, target.y, distanceFactor),
        };
      });

      // Create radial gradients for particle mask effect
      const mask = positions.current
        .map((pos, index) => {
          const opacity = 1000 - index / positions.current.length; // Fade effect here

          // Make the first particle bigger and the others smaller
          const size = 800 + (10 - index * 100);

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
