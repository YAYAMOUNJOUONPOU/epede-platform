// src/components/context/ContextStackForceGraph.tsx
// EPEDE — Interactive Force-Directed Knowledge Graph
// Visualizes equipment/node relationships with typed edges (UPSTREAM_OF, PROTECTS, MEASURES, etc.)
// Features: zoom/pan, path tracer, node spotlight, relationship filter, impact analysis

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import {
  ZoomIn, ZoomOut, RotateCcw, Filter, ArrowUpRight, ArrowDownRight,
  Shield, Activity, Cpu, BookOpen, Search, GitBranch, AlertTriangle,
  ChevronRight, ExternalLink, MapPin, Layers, Info, X
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type RelationType = 'UPSTREAM_OF' | 'DOWNSTREAM_OF' | 'PROTECTS' | 'MEASURES' | 'CONTROLS' | 'SUPPLIES' | 'EARTHED_TO' | 'MONITORS';

interface GraphNode {
  id: string;
  label: string;
  type: 'generation' | 'transmission' | 'substation' | 'distribution' | 'load' | 'protection' | 'metering' | 'control';
  domainCode: string;
  voltage?: string;
  power?: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fixed?: boolean;
}

interface GraphEdge {
  source: string;
  target: string;
  type: RelationType;
  label?: string;
}

// ─── Graph Data ───────────────────────────────────────────────────────────────

const GRAPH_NODES: GraphNode[] = [
  { id: 'gen-songloulou', label: 'Songloulou\n48 MW', type: 'generation', domainCode: 'D01', voltage: '10.5 kV', power: '48 MW', x: 100, y: 300, vx: 0, vy: 0 },
  { id: 'gen-edea', label: 'Edéa\n180 MW', type: 'generation', domainCode: 'D01', voltage: '10.5 kV', power: '180 MW', x: 100, y: 180, vx: 0, vy: 0 },
  { id: 'gen-lom-pangar', label: 'Lom Pangar\n30 MW', type: 'generation', domainCode: 'D01', voltage: '10.5 kV', power: '30 MW', x: 100, y: 420, vx: 0, vy: 0 },
  { id: 'gsu-t1', label: 'GSU T1\n10.5/225 kV', type: 'substation', domainCode: 'D04', voltage: '225 kV', power: '80 MVA', x: 250, y: 240, vx: 0, vy: 0 },
  { id: 'line-225-bekoko', label: 'Ligne 225 kV\nSongloulou→Bekoko', type: 'transmission', domainCode: 'D03', voltage: '225 kV', x: 380, y: 200, vx: 0, vy: 0 },
  { id: 'sub-bekoko-225', label: 'Poste Bekoko\n225/90 kV', type: 'substation', domainCode: 'D04', voltage: '225/90 kV', power: '100 MVA', x: 500, y: 240, vx: 0, vy: 0 },
  { id: 'sub-yaounde-90', label: 'Poste Yaoundé\n90/30 kV', type: 'substation', domainCode: 'D04', voltage: '90/30 kV', x: 620, y: 300, vx: 0, vy: 0 },
  { id: 'feeder-mv-30', label: 'Départ HTA\n30 kV', type: 'distribution', domainCode: 'D05', voltage: '30 kV', x: 720, y: 380, vx: 0, vy: 0 },
  { id: 'dist-kiosk', label: 'Poste HTA/BT\n630 kVA', type: 'distribution', domainCode: 'D05', voltage: '0.4 kV', x: 800, y: 450, vx: 0, vy: 0 },
  { id: 'load-industry', label: 'Charge\nIndustrielle', type: 'load', domainCode: 'D05', power: '400 kW', x: 880, y: 380, vx: 0, vy: 0 },
  { id: 'relay-87t', label: 'Relais 87T\nDifférentiel', type: 'protection', domainCode: 'D07', x: 380, y: 340, vx: 0, vy: 0 },
  { id: 'relay-21-distance', label: 'Relais 21\nDistance', type: 'protection', domainCode: 'D07', x: 460, y: 130, vx: 0, vy: 0 },
  { id: 'ct-225k', label: 'TC 225 kV\n1200/5A', type: 'metering', domainCode: 'D07', x: 300, y: 150, vx: 0, vy: 0 },
  { id: 'scada-energy', label: 'SCADA / EMS\nSonatrel', type: 'control', domainCode: 'D06', x: 550, y: 140, vx: 0, vy: 0 },
  { id: 'ied-bay', label: 'IED Bay\nIEC 61850', type: 'control', domainCode: 'D06', x: 600, y: 180, vx: 0, vy: 0 },
  { id: 'earth-grid', label: 'Grille de\nTerre Poste', type: 'protection', domainCode: 'D11', x: 550, y: 400, vx: 0, vy: 0 },
];

const GRAPH_EDGES: GraphEdge[] = [
  { source: 'gen-songloulou', target: 'gsu-t1', type: 'UPSTREAM_OF' },
  { source: 'gen-edea', target: 'gsu-t1', type: 'UPSTREAM_OF' },
  { source: 'gen-lom-pangar', target: 'gsu-t1', type: 'UPSTREAM_OF' },
  { source: 'gsu-t1', target: 'line-225-bekoko', type: 'UPSTREAM_OF' },
  { source: 'line-225-bekoko', target: 'sub-bekoko-225', type: 'UPSTREAM_OF' },
  { source: 'sub-bekoko-225', target: 'sub-yaounde-90', type: 'UPSTREAM_OF' },
  { source: 'sub-yaounde-90', target: 'feeder-mv-30', type: 'UPSTREAM_OF' },
  { source: 'feeder-mv-30', target: 'dist-kiosk', type: 'UPSTREAM_OF' },
  { source: 'dist-kiosk', target: 'load-industry', type: 'SUPPLIES' },
  { source: 'relay-87t', target: 'gsu-t1', type: 'PROTECTS' },
  { source: 'relay-21-distance', target: 'line-225-bekoko', type: 'PROTECTS' },
  { source: 'ct-225k', target: 'relay-87t', type: 'MEASURES' },
  { source: 'ct-225k', target: 'relay-21-distance', type: 'MEASURES' },
  { source: 'scada-energy', target: 'sub-bekoko-225', type: 'CONTROLS' },
  { source: 'ied-bay', target: 'sub-yaounde-90', type: 'CONTROLS' },
  { source: 'ied-bay', target: 'relay-87t', type: 'MONITORS' },
  { source: 'scada-energy', target: 'ied-bay', type: 'CONTROLS' },
  { source: 'earth-grid', target: 'sub-bekoko-225', type: 'EARTHED_TO' },
  { source: 'earth-grid', target: 'sub-yaounde-90', type: 'EARTHED_TO' },
];

// ─── Visual Config ────────────────────────────────────────────────────────────

const NODE_COLORS: Record<GraphNode['type'], { bg: string; border: string; text: string; glow: string }> = {
  generation:   { bg: '#1a2f1a', border: '#22c55e', text: '#86efac', glow: 'rgba(34,197,94,0.3)' },
  transmission: { bg: '#1e1a2f', border: '#8b5cf6', text: '#c4b5fd', glow: 'rgba(139,92,246,0.3)' },
  substation:   { bg: '#1e2a3a', border: '#38bdf8', text: '#7dd3fc', glow: 'rgba(56,189,248,0.3)' },
  distribution: { bg: '#1a2130', border: '#60a5fa', text: '#93c5fd', glow: 'rgba(96,165,250,0.25)' },
  load:         { bg: '#2a1a1a', border: '#f97316', text: '#fdba74', glow: 'rgba(249,115,22,0.3)' },
  protection:   { bg: '#2a1a2a', border: '#e879f9', text: '#f0abfc', glow: 'rgba(232,121,249,0.3)' },
  metering:     { bg: '#1a2a2a', border: '#14b8a6', text: '#5eead4', glow: 'rgba(20,184,166,0.3)' },
  control:      { bg: '#2a2a1a', border: '#eab308', text: '#fde047', glow: 'rgba(234,179,8,0.3)' },
};

const EDGE_COLORS: Record<RelationType, string> = {
  UPSTREAM_OF:    '#38bdf8',
  DOWNSTREAM_OF:  '#60a5fa',
  PROTECTS:       '#e879f9',
  MEASURES:       '#14b8a6',
  CONTROLS:       '#eab308',
  SUPPLIES:       '#22c55e',
  EARTHED_TO:     '#f97316',
  MONITORS:       '#a3e635',
};

const RELATION_LABELS: Record<RelationType, { fr: string; en: string }> = {
  UPSTREAM_OF:   { fr: 'Alimente', en: 'Feeds' },
  DOWNSTREAM_OF: { fr: 'Reçoit', en: 'Receives from' },
  PROTECTS:      { fr: 'Protège', en: 'Protects' },
  MEASURES:      { fr: 'Mesure', en: 'Measures' },
  CONTROLS:      { fr: 'Commande', en: 'Controls' },
  SUPPLIES:      { fr: 'Dessert', en: 'Supplies' },
  EARTHED_TO:    { fr: 'Mis à la Terre', en: 'Earthed to' },
  MONITORS:      { fr: 'Surveille', en: 'Monitors' },
};

// ─── Component ───────────────────────────────────────────────────────────────

interface ContextStackForceGraphProps {
  locale: 'fr' | 'en';
  initialNodeId?: string;
  onNavigateEquipment?: (id: string) => void;
  onNavigateDomain?: (code: string) => void;
  onNavigateCalculator?: (tab: string) => void;
  onNavigateSimulation?: (tab: string) => void;
}

export const ContextStackForceGraph: React.FC<ContextStackForceGraphProps> = ({
  locale,
  initialNodeId,
  onNavigateEquipment,
  onNavigateDomain,
}) => {
  const isFr = locale === 'fr';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<GraphNode[]>(GRAPH_NODES.map(n => ({ ...n })));
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<RelationType | 'ALL'>('ALL');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pathFrom, setPathFrom] = useState<string | null>(null);
  const [tracedPath, setTracedPath] = useState<string[]>([]);
  const [impactNodes, setImpactNodes] = useState<string[]>([]);
  const panRef = useRef(pan);
  const zoomRef = useRef(zoom);

  useEffect(() => { panRef.current = pan; }, [pan]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);

  // BFS path tracer
  const tracePath = useCallback((fromId: string, toId: string) => {
    const adjList: Record<string, string[]> = {};
    GRAPH_EDGES.forEach(e => {
      if (!adjList[e.source]) adjList[e.source] = [];
      if (!adjList[e.target]) adjList[e.target] = [];
      adjList[e.source].push(e.target);
      adjList[e.target].push(e.source);
    });
    const queue: string[][] = [[fromId]];
    const visited = new Set<string>();
    while (queue.length) {
      const path = queue.shift()!;
      const node = path[path.length - 1];
      if (node === toId) return path;
      if (visited.has(node)) continue;
      visited.add(node);
      (adjList[node] || []).forEach(n => queue.push([...path, n]));
    }
    return [];
  }, []);

  // Compute impact (downstream from a node)
  const computeImpact = useCallback((nodeId: string) => {
    const downstream: string[] = [];
    const visited = new Set<string>();
    const queue = [nodeId];
    while (queue.length) {
      const n = queue.shift()!;
      if (visited.has(n)) continue;
      visited.add(n);
      downstream.push(n);
      GRAPH_EDGES.filter(e => e.source === n && (e.type === 'UPSTREAM_OF' || e.type === 'SUPPLIES')).forEach(e => queue.push(e.target));
    }
    return downstream;
  }, []);

  // Simple force simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    const filteredEdges = filterType === 'ALL'
      ? GRAPH_EDGES
      : GRAPH_EDGES.filter(e => e.type === filterType);

    let tick = 0;
    const simulate = () => {
      tick++;
      const nodes = nodesRef.current;

      // Force simulation (only for first ~120 ticks)
      if (tick < 120) {
        nodes.forEach(node => {
          if (node.fixed) return;
          // Repulsion between nodes
          nodes.forEach(other => {
            if (other.id === node.id) return;
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = 1800 / (dist * dist);
            node.vx += (dx / dist) * force * 0.1;
            node.vy += (dy / dist) * force * 0.1;
          });
          // Attraction along edges
          filteredEdges.forEach(edge => {
            let other: GraphNode | undefined;
            if (edge.source === node.id) other = nodes.find(n => n.id === edge.target);
            if (edge.target === node.id) other = nodes.find(n => n.id === edge.source);
            if (!other) return;
            const dx = other.x - node.x;
            const dy = other.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const targetDist = 160;
            const force = (dist - targetDist) * 0.008;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          });
          // Center gravity
          node.vx += (W / 2 / zoomRef.current - node.x) * 0.002;
          node.vy += (H / 2 / zoomRef.current - node.y) * 0.002;
          // Damping
          node.vx *= 0.88;
          node.vy *= 0.88;
          node.x += node.vx;
          node.y += node.vy;
        });
      }

      // Draw
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.translate(panRef.current.x, panRef.current.y);
      ctx.scale(zoomRef.current, zoomRef.current);

      // Draw edges
      filteredEdges.forEach(edge => {
        const src = nodes.find(n => n.id === edge.source);
        const tgt = nodes.find(n => n.id === edge.target);
        if (!src || !tgt) return;

        const isOnPath = tracedPath.includes(edge.source) && tracedPath.includes(edge.target) &&
          Math.abs(tracedPath.indexOf(edge.source) - tracedPath.indexOf(edge.target)) === 1;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = isOnPath ? '#fbbf24' : EDGE_COLORS[edge.type] + '70';
        ctx.lineWidth = isOnPath ? 3 : 1.5;
        if (!isOnPath) ctx.setLineDash([5, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrowhead
        const angle = Math.atan2(tgt.y - src.y, tgt.x - src.x);
        const mx = (src.x + tgt.x) / 2;
        const my = (src.y + tgt.y) / 2;
        ctx.translate(mx, my);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, -5);
        ctx.lineTo(-10, 5);
        ctx.closePath();
        ctx.fillStyle = isOnPath ? '#fbbf24' : EDGE_COLORS[edge.type] + 'aa';
        ctx.fill();
        ctx.restore();
      });

      // Draw nodes
      nodes.forEach(node => {
        const colors = NODE_COLORS[node.type];
        const isSelected = selectedNode?.id === node.id;
        const isHovered = hoveredNode === node.id;
        const isImpacted = impactNodes.includes(node.id);
        const isOnPath = tracedPath.includes(node.id);
        const r = isSelected ? 28 : 22;

        // Glow
        if (isSelected || isOnPath) {
          ctx.save();
          ctx.shadowBlur = 20;
          ctx.shadowColor = isOnPath ? '#fbbf24' : colors.glow;
          ctx.restore();
        }

        // Outer ring for selected/path
        if (isSelected || isOnPath) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 6, 0, Math.PI * 2);
          ctx.strokeStyle = isOnPath ? '#fbbf24' : colors.border;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Impact highlight
        if (isImpacted && !isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, r + 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(249,115,22,0.15)';
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fillStyle = colors.bg;
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#ffffff' : colors.border;
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.stroke();

        // Label
        const lines = node.label.split('\n');
        ctx.fillStyle = colors.text;
        ctx.font = `bold ${isSelected ? 11 : 9}px monospace`;
        ctx.textAlign = 'center';
        lines.forEach((line, i) => {
          ctx.fillText(line, node.x, node.y + r + 14 + i * 11);
        });
      });

      ctx.restore();
      animRef.current = requestAnimationFrame(simulate);
    };

    animRef.current = requestAnimationFrame(simulate);
    return () => cancelAnimationFrame(animRef.current);
  }, [filterType, selectedNode, hoveredNode, tracedPath, impactNodes]);

  // Mouse interaction
  const getNodeAt = useCallback((cx: number, cy: number) => {
    const p = panRef.current;
    const z = zoomRef.current;
    const worldX = (cx - p.x) / z;
    const worldY = (cy - p.y) / z;
    return nodesRef.current.find(n => {
      const dx = n.x - worldX;
      const dy = n.y - worldY;
      return Math.sqrt(dx * dx + dy * dy) < 28;
    }) || null;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const node = getNodeAt(x, y);
    setHoveredNode(node?.id || null);
    if (isDragging && !node) {
      setPan(prev => ({
        x: prev.x + (e.clientX - dragStart.x),
        y: prev.y + (e.clientY - dragStart.y),
      }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, dragStart, getNodeAt]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const node = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
    if (!node) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [getNodeAt]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const node = getNodeAt(e.clientX - rect.left, e.clientY - rect.top);
    if (node) {
      if (pathFrom && pathFrom !== node.id) {
        const path = tracePath(pathFrom, node.id);
        setTracedPath(path);
        setPathFrom(null);
      } else {
        setSelectedNode(prev => prev?.id === node.id ? null : node);
        setTracedPath([]);
        setImpactNodes([]);
      }
    } else {
      setSelectedNode(null);
      setTracedPath([]);
      setImpactNodes([]);
    }
  }, [getNodeAt, pathFrom, tracePath]);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    setZoom(z => Math.min(3, Math.max(0.3, z * factor)));
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
    setTracedPath([]);
    setPathFrom(null);
    setImpactNodes([]);
    nodesRef.current = GRAPH_NODES.map(n => ({ ...n }));
  };

  const filteredEdgesForSelected = useMemo(() => {
    if (!selectedNode) return [];
    return GRAPH_EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id);
  }, [selectedNode]);

  const relTypes: Array<RelationType | 'ALL'> = ['ALL', 'UPSTREAM_OF', 'PROTECTS', 'MEASURES', 'CONTROLS', 'SUPPLIES', 'MONITORS'];

  return (
    <div className="flex flex-col h-full bg-[#060A10] rounded-2xl border border-[#1a2235] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#1a2235] bg-[#080C14] flex-wrap">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-wider">
            {isFr ? 'Graphe de Relations Ingénierie' : 'Engineering Relationship Graph'}
          </span>
          <span className="text-[10px] font-mono text-neutral-500 bg-[#0D1520] px-2 py-0.5 rounded border border-[#1a2235]">
            {GRAPH_NODES.length} {isFr ? 'nœuds' : 'nodes'} · {GRAPH_EDGES.length} {isFr ? 'liaisons' : 'edges'}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Relation filter chips */}
          <div className="flex items-center gap-1 flex-wrap">
            <Filter className="h-3 w-3 text-neutral-500" />
            {relTypes.map(rt => (
              <button
                key={rt}
                onClick={() => setFilterType(rt)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider transition-all border ${
                  filterType === rt
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'border-[#1a2235] text-neutral-500 hover:text-white'
                }`}
              >
                {rt === 'ALL' ? (isFr ? 'TOUT' : 'ALL') : rt.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setZoom(z => Math.min(3, z * 1.2))} className="p-1.5 rounded bg-[#0D1520] border border-[#1a2235] text-neutral-400 hover:text-white"><ZoomIn className="h-3.5 w-3.5" /></button>
            <button onClick={() => setZoom(z => Math.max(0.3, z * 0.8))} className="p-1.5 rounded bg-[#0D1520] border border-[#1a2235] text-neutral-400 hover:text-white"><ZoomOut className="h-3.5 w-3.5" /></button>
            <button onClick={resetView} className="p-1.5 rounded bg-[#0D1520] border border-[#1a2235] text-neutral-400 hover:text-white"><RotateCcw className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 480 }}>
        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={860}
            height={520}
            className="w-full h-full cursor-crosshair"
            style={{ touchAction: 'none', background: 'radial-gradient(ellipse at 40% 50%, #0a1420 0%, #060A10 70%)' }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
            onWheel={handleWheel}
          />
          {/* Legend */}
          <div className="absolute bottom-3 left-3 flex flex-col gap-1 bg-[#080C14]/90 p-2.5 rounded-lg border border-[#1a2235] text-[9px] font-mono">
            {Object.entries(NODE_COLORS).slice(0, 4).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: colors.border }} />
                <span className="text-neutral-400 uppercase">{type.replace(/_/g, ' ')}</span>
              </div>
            ))}
            <div className="mt-1 pt-1 border-t border-[#1a2235] text-neutral-600">
              {isFr ? 'Clic → sélectionner · Glisser → déplacer' : 'Click → select · Drag → pan'}
            </div>
          </div>
          {/* Scroll hint */}
          <div className="absolute top-3 right-3 text-[10px] font-mono text-neutral-600 bg-[#080C14]/80 px-2 py-1 rounded border border-[#1a2235]">
            {isFr ? '🖱 Molette → zoom' : '🖱 Scroll → zoom'}
          </div>
        </div>

        {/* Side Panel */}
        {selectedNode && (
          <div className="w-72 border-l border-[#1a2235] bg-[#080C14] p-4 overflow-y-auto flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                {isFr ? 'Nœud Sélectionné' : 'Selected Node'}
              </span>
              <button onClick={() => setSelectedNode(null)} className="text-neutral-500 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Node info */}
            <div
              className="rounded-lg p-3 mb-3 border"
              style={{ background: NODE_COLORS[selectedNode.type].bg, borderColor: NODE_COLORS[selectedNode.type].border }}
            >
              <div className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: NODE_COLORS[selectedNode.type].text }}>
                {selectedNode.type.toUpperCase()} · D{selectedNode.domainCode.slice(1)}
              </div>
              <div className="font-bold text-sm text-white whitespace-pre-line">{selectedNode.label}</div>
              {selectedNode.voltage && (
                <div className="mt-1 text-[10px] font-mono text-neutral-400">{isFr ? 'Tension:' : 'Voltage:'} {selectedNode.voltage}</div>
              )}
              {selectedNode.power && (
                <div className="text-[10px] font-mono text-neutral-400">{isFr ? 'Puissance:' : 'Power:'} {selectedNode.power}</div>
              )}
            </div>

            {/* Connections */}
            <div className="mb-3">
              <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                {isFr ? 'Liaisons' : 'Connections'} ({filteredEdgesForSelected.length})
              </div>
              <div className="space-y-1">
                {filteredEdgesForSelected.map((edge, i) => {
                  const isFrom = edge.source === selectedNode.id;
                  const otherId = isFrom ? edge.target : edge.source;
                  const other = GRAPH_NODES.find(n => n.id === otherId);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-1.5 rounded border border-[#1a2235] bg-[#0D1520] cursor-pointer hover:border-cyan-500/40 transition-all"
                      onClick={() => {
                        const node = nodesRef.current.find(n => n.id === otherId);
                        if (node) setSelectedNode(node);
                      }}
                    >
                      {isFrom ? <ArrowUpRight className="h-3 w-3 text-cyan-400 shrink-0" /> : <ArrowDownRight className="h-3 w-3 text-purple-400 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-white font-mono truncate">{other?.label.split('\n')[0]}</div>
                        <div className="text-[9px] font-mono" style={{ color: EDGE_COLORS[edge.type] }}>
                          {RELATION_LABELS[edge.type][locale]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-1">{isFr ? 'Actions' : 'Actions'}</div>
              <button
                onClick={() => {
                  setPathFrom(selectedNode.id);
                  setTracedPath([]);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-mono font-bold border transition-all ${pathFrom === selectedNode.id ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-[#0D1520] border-[#1a2235] text-neutral-300 hover:border-cyan-400'}`}
              >
                <Search className="h-3.5 w-3.5" />
                {pathFrom === selectedNode.id
                  ? (isFr ? 'Cliquez destination...' : 'Click destination...')
                  : (isFr ? 'Tracer un chemin' : 'Trace a path')}
              </button>
              <button
                onClick={() => {
                  const impacted = computeImpact(selectedNode.id);
                  setImpactNodes(impacted);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-mono font-bold bg-[#0D1520] border border-[#1a2235] text-neutral-300 hover:border-orange-400 transition-all"
              >
                <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />
                {isFr ? 'Analyse d\'impact aval' : 'Downstream impact analysis'}
              </button>
              {onNavigateDomain && (
                <button
                  onClick={() => onNavigateDomain(selectedNode.domainCode)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-mono font-bold bg-[#0D1520] border border-[#1a2235] text-neutral-300 hover:border-cyan-400 transition-all"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
                  {isFr ? 'Ouvrir domaine' : 'Open domain'} {selectedNode.domainCode}
                </button>
              )}
              {tracedPath.length > 0 && (
                <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-400/30">
                  <div className="text-[9px] font-mono text-amber-300 font-bold uppercase mb-1">{isFr ? 'Chemin tracé' : 'Traced path'}</div>
                  <div className="flex flex-wrap gap-1">
                    {tracedPath.map((id, i) => {
                      const n = GRAPH_NODES.find(nd => nd.id === id);
                      return (
                        <React.Fragment key={id}>
                          <span className="text-[9px] font-mono text-white bg-[#0D1520] px-1.5 py-0.5 rounded">{n?.label.split('\n')[0]}</span>
                          {i < tracedPath.length - 1 && <ChevronRight className="h-3 w-3 text-amber-400" />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  <div className="text-[9px] font-mono text-amber-400 mt-1">{tracedPath.length - 1} {isFr ? 'saut(s)' : 'hop(s)'}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edge Color Legend Bar */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-[#1a2235] bg-[#080C14] flex-wrap">
        <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-wider">{isFr ? 'Types de liaisons:' : 'Relation types:'}</span>
        {Object.entries(EDGE_COLORS).slice(0, 6).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1">
            <span className="w-3 h-0.5 inline-block rounded" style={{ background: color }} />
            <span className="text-[9px] font-mono text-neutral-500">{RELATION_LABELS[type as RelationType][locale]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
