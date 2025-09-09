'use client';

import React, { useRef, useEffect } from 'react';

const starColors = [
  '#5c7dff',
  '#5b7cff',
  '#5b7bff',
  '#5a7bff',
  '#7895ff',
  '#7693ff',
  '#728fff',
  '#6c8aff',
  '#6988ff',
  '#6887ff',
  '#6484ff',
  '#5e7fff',
  '#b0bfff',
  '#abbcff',
  '#a2b5ff',
  '#9ab0ff',
  '#93aaff',
  '#8ba4ff',
  '#87a1ff',
  '#819dff',
  '#7d99ff',
  '#fff2f6',
  '#f3edff',
  '#ebe7ff',
  '#dddeff',
  '#d7d9ff',
  '#d1d6ff',
  '#ccd2ff',
  '#c2cbff',
  '#b8c5ff',
  '#ffe1c7',
  '#ffe5cf',
  '#ffe8d7',
  '#ffebdf',
  '#ffede6',
  '#ffefed',
  '#ffa35e',
  '#ffa563',
  '#ffb177',
  '#ffbc87',
  '#ffc797',
  '#ffdab8',
  '#ffdec0',
  '#ff7d24',
  '#ff8a33',
  '#ffa548',
  '#ffa24c',
  '#ffa250',
  '#ffa153',
  '#ffa25a',
];

const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawStar = (
      x: number,
      y: number,
      radius: number,
      color: string,
    ) => {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const draw = () => {
      const { width, height } = canvas;
      ctx.fillStyle = '#010b19';
      ctx.fillRect(0, 0, width, height);

      const numStars = Math.floor((width * height) / 1000);
      const numClusters = Math.floor((width * height) / 100000);
      const clusters: { x: number; y: number; radius: number }[] = [];

      for (let i = 0; i < numClusters; i++) {
        clusters.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * (Math.min(width, height) / 5) + 50,
        });
      }

      for (let i = 0; i < numStars; i++) {
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        let x, y, radius;

        if (Math.random() < 0.4 && clusters.length > 0) {
          const cluster = clusters[Math.floor(Math.random() * clusters.length)];
          const u1 = Math.random();
          const u2 = Math.random();
          const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

          x = cluster.x + z0 * (cluster.radius / 2);
          y = cluster.y + z1 * (cluster.radius / 2);
          radius = Math.random() * 1.5 + 0.5;
        } else {
          x = Math.random() * width;
          y = Math.random() * height;
          radius = Math.random() * 1.2;
        }

        drawStar(x, y, radius, color);
      }
    };

    const handleResize = () => {
      setCanvasSize();
      draw();
    };

    setCanvasSize();
    draw();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default StarryBackground;
