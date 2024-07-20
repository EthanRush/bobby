import React, { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef(null);

  const asciiArt1 = `
  _______ _            _______         _   _                _                 _     _____  ______ _  __  _____ _____ 
 |__   __| |          |__   __|       | | | |         /\\   | |               | |   |  __ \\|  ____| |/ / |_   _|_   _|
    | |  | |__   ___     | |_ __ _   _| |_| |__      /  \\  | |__   ___  _   _| |_  | |__) | |__  | ' /    | |   | |  
    | |  | '_ \\ / _ \\    | | '__| | | | __| '_ \\    / /\\ \\ | '_ \\ / _ \\| | | | __| |  _  /|  __| |  <     | |   | |  
    | |  | | | |  __/    | | |  | |_| | |_| | | |  / ____ \\| |_) | (_) | |_| | |_  | | \\ \\| |    | . \\   _| |_ _| |_ 
    |_|  |_| |_|\\___|    |_|_|   \\__,_|\\__|_| |_| /_/    \\_\\_.__/ \\___/ \\__,_|\\__| |_|  \\_\\_|    |_|\\_\\ |_____|_____|
  `;

  const asciiArt2 = `
   _____ _            _____           _   _     
  |_   _| |__   ___  |_   _| __ _   _| |_| |__  
    | | | '_ \\ / _ \\   | || '__| | | | __| '_ \\ 
    | | | | | |  __/   | || |  | |_| | |_| | | |
    |_| |_| |_|\\___|   |_||_|   \\__,_|\\__|_| |_|
            _    _                 _            
          / \\  | |__   ___  _   _| |_          
         / _ \\ | '_ \\ / _ \\| | | | __|         
        / ___ \\| |_) | (_) | |_| | |_          
       /_/   \\_\\_.__/ \\___/ \\__,_|\\__|         
           ____  _____ _  __  ___ ___           
          |  _ \\|  ___| |/ / |_ _|_ _|          
          | |_) | |_  | ' /   | | | |           
          |  _ <|  _| | . \\   | | | |           
          |_| \\_\\_|   |_|\\_\\ |___|___|         
  `;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array.from({ length: columns }).fill(canvas.height);
    const asciiArt = "the truth";
    let textIndex = 0;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#FFF';  // White color for the rain
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = asciiArt[textIndex];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Slow down the speed of the drops
        if (Math.random() > 0.98) { // Change this value to slow down the rain
          drops[i]++;
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          textIndex = (textIndex + 1) % asciiArt.length;
        }
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div className="matrix-rain">
      <div id="asciiContainer">
        <pre id="asciiArt" className="ascii-art">
          {asciiArt1}
        </pre>
        <pre id="asciiArtMobile" className="ascii-art mobile">
          {asciiArt2}
        </pre>
      </div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default MatrixRain;
