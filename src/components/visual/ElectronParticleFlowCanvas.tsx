// src/components/visual/ElectronParticleFlowCanvas.tsx
// EPEDE - Interactive WebGL / Canvas Electrical Particle Flow & Electromagnetic Field Shader
// Simulates real-time current flow (Amperes), voltage glow, and electromagnetic flux deflection.

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  history: Array<{ x: number; y: number }>;
}

interface ElectronParticleFlowCanvasProps {
  isEnergized?: boolean;
  currentAmperes?: number;
  voltageLevel?: '225kV' | '90kV' | '30kV' | '400V' | 'MV' | 'HV' | 'LV';
  voltageKv?: number;
  intensity?: number;
  direction?: 'left-to-right' | 'right-to-left' | 'top-to-bottom' | 'bottom-to-top' | 'circulating';
  particleDensity?: number;
  className?: string;
  showElectromagneticField?: boolean;
  enableMagneticMouse?: boolean;
  color?: string;
}

export const ElectronParticleFlowCanvas: React.FC<ElectronParticleFlowCanvasProps> = ({
  isEnergized = true,
  currentAmperes = 630,
  voltageLevel = '30kV',
  voltageKv,
  intensity,
  direction = 'left-to-right',
  particleDensity = 45,
  className = 'w-full h-full absolute inset-0 pointer-events-none',
  showElectromagneticField = true,
  enableMagneticMouse = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const animFrameId = useRef<number | null>(null);

  const effectiveVoltageLevel = voltageKv !== undefined
    ? (voltageKv >= 200 ? '225kV' : voltageKv >= 60 ? '90kV' : voltageKv >= 1 ? '30kV' : '400V')
    : voltageLevel;

  const effectiveAmperes = intensity !== undefined
    ? intensity * 600
    : currentAmperes;

  const getColorPalette = (v: string) => {
    switch (v) {
      case '225kV':
      case 'HV':
        return {
          glow: 'rgba(244, 63, 94, 0.7)',
          core: 'rgba(255, 228, 230, 0.95)',
          trail: 'rgba(225, 29, 72, 0.35)',
          field: 'rgba(244, 63, 94, 0.08)'
        };
      case '90kV':
        return {
          glow: 'rgba(168, 85, 247, 0.7)',
          core: 'rgba(243, 232, 255, 0.95)',
          trail: 'rgba(147, 51, 234, 0.35)',
          field: 'rgba(168, 85, 247, 0.08)'
        };
      case '30kV':
      case 'MV':
        return {
          glow: 'rgba(245, 158, 11, 0.7)',
          core: 'rgba(254, 243, 199, 0.95)',
          trail: 'rgba(217, 119, 6, 0.35)',
          field: 'rgba(245, 158, 11, 0.08)'
        };
      case '400V':
      case 'LV':
      default:
        return {
          glow: 'rgba(56, 189, 248, 0.7)',
          core: 'rgba(224, 242, 254, 0.95)',
          trail: 'rgba(2, 132, 199, 0.35)',
          field: 'rgba(56, 189, 248, 0.08)'
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mousePos.current.active = false;
    };

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

    const colors = getColorPalette(effectiveVoltageLevel);
    const particles: Particle[] = [];
    const count = Math.min(120, Math.max(15, Math.floor((width * height) / 8000 * (particleDensity / 30))));

    // Particle speed scaled by current intensity
    const speedBase = Math.max(0.6, Math.min(3.5, effectiveAmperes / 300));

    const resetParticle = (p: Partial<Particle>): Particle => {
      let x = Math.random() * width;
      let y = Math.random() * height;
      let vx = 0;
      let vy = 0;

      if (direction === 'left-to-right') {
        x = p.x !== undefined ? p.x : Math.random() * -50;
        y = Math.random() * height;
        vx = (speedBase + Math.random() * 0.8);
        vy = (Math.random() - 0.5) * 0.3;
      } else if (direction === 'right-to-left') {
        x = p.x !== undefined ? p.x : width + Math.random() * 50;
        y = Math.random() * height;
        vx = -(speedBase + Math.random() * 0.8);
        vy = (Math.random() - 0.5) * 0.3;
      } else if (direction === 'top-to-bottom') {
        x = Math.random() * width;
        y = p.y !== undefined ? p.y : Math.random() * -50;
        vx = (Math.random() - 0.5) * 0.3;
        vy = (speedBase + Math.random() * 0.8);
      } else if (direction === 'bottom-to-top') {
        x = Math.random() * width;
        y = p.y !== undefined ? p.y : height + Math.random() * 50;
        vx = (Math.random() - 0.5) * 0.3;
        vy = -(speedBase + Math.random() * 0.8);
      } else {
        // Circulating / random orbit
        vx = (Math.random() - 0.5) * speedBase;
        vy = (Math.random() - 0.5) * speedBase;
      }

      return {
        x,
        y,
        vx,
        vy,
        size: Math.random() * 2 + 1.2,
        alpha: Math.random() * 0.6 + 0.4,
        life: 0,
        maxLife: Math.random() * 150 + 100,
        history: []
      };
    };

    for (let i = 0; i < count; i++) {
      particles.push(resetParticle({ x: Math.random() * width, y: Math.random() * height }));
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      if (!isEnergized) {
        // De-energized dormant state
        ctx.fillStyle = 'rgba(100, 116, 139, 0.15)';
        ctx.font = '10px monospace';
        ctx.fillText('⚡ LIGNE HORS TENSION / DE-ENERGIZED', 15, 20);
        animFrameId.current = requestAnimationFrame(render);
        return;
      }

      // Draw Electromagnetic Field Waves if enabled
      if (showElectromagneticField) {
        const fieldWave = Math.sin(frame * 0.05) * 0.5 + 0.5;
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.5, colors.field);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Update & Draw Particles
      particles.forEach((p, idx) => {
        p.life++;

        // Electromagnetic deflection toward/away from cursor
        if (mousePos.current.active) {
          const dx = mousePos.current.x - p.x;
          const dy = mousePos.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 5) {
            const force = (1 - dist / 120) * 0.6;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Apply velocity with soft damping
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Maintain forward speed momentum
        if (direction === 'left-to-right' && p.vx < speedBase) p.vx += 0.05;
        if (direction === 'right-to-left' && p.vx > -speedBase) p.vx -= 0.05;

        // Record history for glowing tail
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 6) {
          p.history.shift();
        }

        // Draw glowing motion trail
        if (p.history.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.history[0].x, p.history[0].y);
          for (let h = 1; h < p.history.length; h++) {
            ctx.lineTo(p.history[h].x, p.history[h].y);
          }
          ctx.strokeStyle = colors.trail;
          ctx.lineWidth = p.size * 0.8;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // Draw Electron Core & Radial Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = colors.glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = colors.core;
        ctx.fill();

        // Respawn if out of bounds or expired life
        if (
          p.life > p.maxLife ||
          p.x < -60 ||
          p.x > width + 60 ||
          p.y < -60 ||
          p.y > height + 60
        ) {
          particles[idx] = resetParticle({});
        }
      });

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEnergized, effectiveAmperes, effectiveVoltageLevel, direction, particleDensity, showElectromagneticField]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ opacity: isEnergized ? 1 : 0.3, transition: 'opacity 0.4s ease' }}
    />
  );
};
