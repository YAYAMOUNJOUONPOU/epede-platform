// src/components/common/EngineeringBackground.tsx
import React, { useEffect, useRef, useState } from 'react';

interface EngineeringBackgroundProps {
  interactive?: boolean;
}

interface ElectricNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulsePhase: number;
  pulseSpeed: number;
  isMajor: boolean;
  color: string;
}

interface ElectricPulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
  size: number;
}

/**
 * EngineeringBackground / "Luminous Electric Pulse" Canvas
 * 
 * An interactive, lightweight HTML5 Canvas smart-grid particle network
 * designed for Luxury Minimalist Light Mode:
 * - Clean, luminous off-white/pearl tone (#F8FAFC / #FFFFFF)
 * - Subtle, flowing silver-gray (#94A3B8, #CBD5E1) and soft electric blue (#38BDF8, #60A5FA, #818CF8) nodes
 * - Faint electrical grid lines with distance-weighted conductivity
 * - Magnetic field attraction and gentle spark arcs reacting to cursor movement
 * - Traveling electrical energy packets along active paths
 * - Smooth 60fps performance with zero DOM overhead
 */
export const EngineeringBackground: React.FC<EngineeringBackgroundProps> = ({
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Respect user's prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsEnabled(false);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isEnabled) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse tracking with smooth magnetic coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
      radius: 200, // Magnetic attraction radius
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('resize', handleResize);

    // Grid nodes collection
    let nodes: ElectricNode[] = [];
    let pulses: ElectricPulse[] = [];
    const maxDistance = 155; // Connection threshold between nodes
    const maxDistanceSq = maxDistance * maxDistance;

    // Synchronized Dark Engineering Palette: Electric Amber, Warm Copper, SCADA Cyan, Slate Silver
    const nodeColors = [
      '#F59E0B', // Technical Electric Amber
      '#06B6D4', // SCADA Grid Cyan
      '#38BDF8', // Digital Sky Blue
      '#D97706', // Warm Copper High-Voltage
      '#94A3B8', // Luminous Slate Silver
      '#10B981', // Nominal Emerald Node
    ];

    const initNodes = () => {
      const area = width * height;
      const count = Math.min(Math.max(Math.floor(area / 25000), 28), 60);

      nodes = [];
      pulses = [];

      for (let i = 0; i < count; i++) {
        const isMajor = Math.random() > 0.75;
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          radius: isMajor ? 2.8 : 1.6,
          baseRadius: isMajor ? 2.8 : 1.6,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.025,
          isMajor,
          color: nodeColors[Math.floor(Math.random() * nodeColors.length)],
        });
      }
    };

    initNodes();

    // Spawn traveling power packet
    const spawnPulse = (fromIdx: number, toIdx: number) => {
      if (pulses.length > 20) return;
      pulses.push({
        fromNode: fromIdx,
        toNode: toIdx,
        progress: 0,
        speed: 0.01 + Math.random() * 0.015,
        color: nodes[fromIdx].color,
        size: Math.random() * 1.5 + 1.8,
      });
    };

    let tick = 0;

    const render = () => {
      tick++;

      // Smooth mouse coordinate lerping
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.16;
        mouse.y += (mouse.targetY - mouse.y) * 0.16;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle CAD Crosshair / Substation Grid Underlay in delicate gray
      const gridSize = 72;
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Subtle CAD nodal dots at major intersections
      ctx.fillStyle = 'rgba(2, 132, 199, 0.12)';
      for (let x = 0; x < width; x += gridSize * 2) {
        for (let y = 0; y < height; y += gridSize * 2) {
          ctx.fillRect(x - 1, y - 1, 2, 2);
        }
      }

      // 2. Update & Draw Nodes with Magnetic Field & Boundaries
      const numNodes = nodes.length;
      for (let i = 0; i < numNodes; i++) {
        const n = nodes[i];

        // Kinetic motion
        n.x += n.vx;
        n.y += n.vy;

        // Soft boundary bounce
        if (n.x < 12) { n.x = 12; n.vx *= -1; }
        else if (n.x > width - 12) { n.x = width - 12; n.vx *= -1; }
        if (n.y < 12) { n.y = 12; n.vy *= -1; }
        else if (n.y > height - 12) { n.y = height - 12; n.vy *= -1; }

        // Magnetic Attraction toward cursor
        if (interactive && mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < mouse.radius * mouse.radius) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / mouse.radius) * 0.04;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;

            // Damping near cursor
            n.vx *= 0.96;
            n.vy *= 0.96;

            // Draw faint electric magnetic tether line to mouse
            const alpha = (1 - dist / mouse.radius) * 0.35;
            ctx.strokeStyle = `rgba(2, 132, 199, ${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);

            // Subtle curved arc
            const midX = (n.x + mouse.x) * 0.5 + (Math.sin(tick * 0.15 + i) * 2.5);
            const midY = (n.y + mouse.y) * 0.5 + (Math.cos(tick * 0.15 + i) * 2.5);
            ctx.quadraticCurveTo(midX, midY, mouse.x, mouse.y);
            ctx.stroke();

            // Occasional delicate spark
            if (tick % 50 === 0 && Math.random() > 0.7) {
              ctx.fillStyle = '#0284C7';
              ctx.beginPath();
              ctx.arc(midX, midY, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        // Pulse phase update
        n.pulsePhase += n.pulseSpeed;
        const pulse = Math.sin(n.pulsePhase) * 0.5 + 0.5;
        n.radius = n.baseRadius + pulse * (n.isMajor ? 1.4 : 0.6);

        // Draw node core
        ctx.fillStyle = n.color;
        ctx.globalAlpha = n.isMajor ? 0.85 : 0.65;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Draw subtle halo on major nodes
        if (n.isMajor) {
          ctx.strokeStyle = `${n.color}28`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 3.5 + pulse * 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 3. Draw Interconnecting Electric Transmission Lines
      for (let i = 0; i < numNodes; i++) {
        const na = nodes[i];
        for (let j = i + 1; j < numNodes; j++) {
          const nb = nodes[j];
          const dx = nb.x - na.x;
          const dy = nb.y - na.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq);
            const intensity = 1 - dist / maxDistance;
            const alpha = intensity * 0.24;

            ctx.strokeStyle = `rgba(100, 116, 139, ${alpha})`;
            ctx.lineWidth = intensity * 1.2;
            ctx.beginPath();
            ctx.moveTo(na.x, na.y);
            ctx.lineTo(nb.x, nb.y);
            ctx.stroke();

            // Randomly spawn traveling power packet
            if (tick % 90 === 0 && Math.random() < 0.07 && intensity > 0.5) {
              spawnPulse(i, j);
            }
          }
        }
      }

      // 4. Update & Render Traveling Power Packets
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        const na = nodes[pulse.fromNode];
        const nb = nodes[pulse.toNode];

        if (!na || !nb) {
          pulses.splice(p, 1);
          continue;
        }

        pulse.progress += pulse.speed;
        if (pulse.progress >= 1.0) {
          pulses.splice(p, 1);
          continue;
        }

        const px = na.x + (nb.x - na.x) * pulse.progress;
        const py = na.y + (nb.y - na.y) * pulse.progress;

        // Draw glowing power packet
        ctx.fillStyle = '#0284C7';
        ctx.beginPath();
        ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = pulse.color;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.arc(px, py, pulse.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 5. Cursor magnetic indicator ring in soft blue
      if (interactive && mouse.active && mouse.x > 0 && mouse.y > 0) {
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(2, 132, 199, 0.6)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [isEnabled, interactive]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-950"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full opacity-70 transition-opacity duration-1000"
      />
      {/* High-end ambient electrical glow and atmospheric gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.035),transparent_80%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_90%,rgba(6,182,212,0.025),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/90 pointer-events-none" />
    </div>
  );
};
