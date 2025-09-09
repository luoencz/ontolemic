'use client';

import * as React from 'react';
import './celestial-pass.css';

interface CelestialPassProps {
  children: React.ReactNode;
  angle?: number;
  duration?: number;
  delay?: number;
}

const CelestialPass: React.FC<CelestialPassProps> = ({
  children,
  angle = 45,
  duration = 2.5,
  delay = 1,
}) => {
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useLayoutEffect(() => {
    if (wrapperRef.current) {
      const wrapper = wrapperRef.current;
      const rect = wrapper.getBoundingClientRect();

      if (rect.width > 0 && rect.height > 0) {
        const bodySize = Math.hypot(rect.width, rect.height) * 1.2;
        const radius = bodySize / 2;
        const travelDistance = rect.width / 2 + radius;

        const rad = (angle * Math.PI) / 180;
        const cosRad = Math.cos(rad);
        const sinRad = Math.sin(rad);

        const startX = rect.width / 2 - travelDistance * cosRad - radius;
        const startY = rect.height / 2 - travelDistance * sinRad - radius;
        const endX = rect.width / 2 + travelDistance * cosRad - radius;
        const endY = rect.height / 2 + travelDistance * sinRad - radius;

        wrapper.style.setProperty('--body-size', `${bodySize}px`);
        wrapper.style.setProperty('--start-x', `${startX}px`);
        wrapper.style.setProperty('--start-y', `${startY}px`);
        wrapper.style.setProperty('--end-x', `${endX}px`);
        wrapper.style.setProperty('--end-y', `${endY}px`);
        wrapper.style.setProperty('--duration', `${duration}s`);
        wrapper.style.setProperty('--delay', `${delay}s`);
        setIsReady(true);
      }
    }
  }, [angle, duration, delay]);

  return (
    <span ref={wrapperRef} className="celestial-pass-wrapper">
      {children}
      {isReady && <span className="celestial-body" />}
    </span>
  );
};

export default CelestialPass;
