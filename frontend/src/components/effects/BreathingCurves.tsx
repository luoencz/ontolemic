import { useEffect, useRef, useState } from 'react';

interface CurvePoint {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  frequency: number;
  amplitude: number;
  phase: number;
}

interface Curve {
  points: CurvePoint[];
  opacity: number;
  strokeWidth: number;
  color: string;
}

export function BreathingCurves() {
  const [curves, setCurves] = useState<Curve[]>([]);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Initialize curves with random properties
    const numCurves = 12; // More curves for better coverage
    const initialCurves: Curve[] = [];

    for (let i = 0; i < numCurves; i++) {
      const numPoints = 5 + Math.floor(Math.random() * 3); // 5-7 control points
      const points: CurvePoint[] = [];
      
      for (let j = 0; j < numPoints; j++) {
        const baseX = (j / (numPoints - 1)) * window.innerWidth * 1.2 - window.innerWidth * 0.1; // Extend beyond viewport
        const baseY = Math.random() * window.innerHeight;
        
        points.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          frequency: 0.0001 + Math.random() * 0.0003, // Even slower for breathing effect
          amplitude: 100 + Math.random() * 200, // Larger movement
          phase: Math.random() * Math.PI * 2,
        });
      }

      initialCurves.push({
        points,
        opacity: 0.1 + Math.random() * 0.2, // More visible
        strokeWidth: 1 + Math.random() * 3,
        color: '#e5e7eb', // Consistent light gray
      });
    }

    setCurves(initialCurves);

    // Animation loop
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current;
      
      setCurves(prevCurves => 
        prevCurves.map(curve => ({
          ...curve,
          points: curve.points.map(point => {
            // Create breathing pattern with multiple harmonics
            const breathing = Math.sin(elapsed * point.frequency + point.phase) * 0.7 +
                            Math.sin(elapsed * point.frequency * 2.1 + point.phase * 1.5) * 0.3;
            
            const offsetX = breathing * point.amplitude * 0.4;
            const offsetY = Math.cos(elapsed * point.frequency * 0.8 + point.phase) * point.amplitude;
            
            return {
              ...point,
              x: point.baseX + offsetX,
              y: point.baseY + offsetY,
            };
          }),
        }))
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      setCurves(prevCurves => 
        prevCurves.map(curve => ({
          ...curve,
          points: curve.points.map((point, j) => {
            const numPoints = curve.points.length;
            return {
              ...point,
              baseX: (j / (numPoints - 1)) * window.innerWidth * 1.2 - window.innerWidth * 0.1,
              baseY: (point.baseY / window.innerHeight) * window.innerHeight,
            };
          }),
        }))
      );
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Generate path data for a curve using smooth Bezier curves
  const generatePath = (points: CurvePoint[]): string => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    // Create smooth curve through all points
    for (let i = 0; i < points.length - 1; i++) {
      const cp1x = points[i].x + (points[i + 1].x - points[i].x) * 0.25;
      const cp1y = points[i].y + (points[i + 1].y - points[i].y) * 0.25;
      const cp2x = points[i + 1].x - (points[i + 1].x - points[i].x) * 0.25;
      const cp2y = points[i + 1].y - (points[i + 1].y - points[i].y) * 0.25;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i + 1].x} ${points[i + 1].y}`;
    }
    
    return path;
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: -1 }}>
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
          </filter>
        </defs>
        {curves.map((curve, index) => (
          <path
            key={index}
            d={generatePath(curve.points)}
            fill="none"
            stroke={curve.color}
            strokeWidth={curve.strokeWidth}
            opacity={curve.opacity}
            filter="url(#blur)"
            style={{
              mixBlendMode: 'multiply',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default BreathingCurves; 