// src/components/epede/CopperEnergyParticles.tsx
import React, { useEffect, useRef } from 'react';

export interface CopperEnergyParticlesProps {
  paused?: boolean;
  particleCount?: number;
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
  trail: number;
}

export const CopperEnergyParticles: React.FC<CopperEnergyParticlesProps> = ({
  paused = false,
  particleCount = 28,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let particles: Particle[] = [];

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (width === 0 || height === 0) return;

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: height * (0.25 + Math.random() * 0.5),
        radius: 1 + Math.random() * 2,
        speed: 0.4 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        trail: 12 + Math.random() * 26,
      }));
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);

      const shouldMove = !reduceMotion && !paused;
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        const wave = Math.sin(time * 0.0008 + particle.phase) * 8;
        const y = particle.y + wave;

        // Copper energy trace gradient
        const gradient = context.createLinearGradient(
          particle.x - particle.trail,
          y,
          particle.x,
          y
        );
        gradient.addColorStop(0, 'rgba(215, 166, 74, 0)');
        gradient.addColorStop(0.65, 'rgba(215, 166, 74, 0.35)');
        gradient.addColorStop(1, 'rgba(245, 210, 125, 0.95)');

        context.beginPath();
        context.strokeStyle = gradient;
        context.lineWidth = particle.radius;
        context.moveTo(particle.x - particle.trail, y);
        context.lineTo(particle.x, y);
        context.stroke();

        // High-luminance copper electron head
        context.beginPath();
        context.fillStyle = 'rgba(245, 210, 125, 0.95)';
        context.shadowBlur = 12;
        context.shadowColor = 'rgba(215, 166, 74, 0.85)';
        context.arc(particle.x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
        context.shadowBlur = 0;

        if (shouldMove) {
          particle.x += particle.speed;
          if (particle.x > width + 30) {
            particle.x = -30;
            particle.y = height * (0.25 + Math.random() * 0.5);
          }
        }
      }

      if (!reduceMotion && !paused) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, [particleCount, paused]);

  return (
    <canvas
      ref={canvasRef}
      className={`copper-particles pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
};
