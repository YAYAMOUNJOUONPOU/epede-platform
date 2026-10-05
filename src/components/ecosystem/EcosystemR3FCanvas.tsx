// src/components/ecosystem/EcosystemR3FCanvas.tsx
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Grid, Html } from '@react-three/drei';
import * as THREE from 'three';
import {
  EcosystemEquipmentDetail,
  EcosystemViewMode,
  EnergySourceType,
  ECOSYSTEM_EQUIPMENTS
} from './ecosystemData';

// EPEDE Theme Color Constants (Directive: Ecosystem Sky Canvas #BFE3F4)
export const EPEDE_COLORS = {
  GRAPHITE: '#0B0F12',
  DEEP_SLATE: '#151C1E',
  WARM_IVORY: '#F4F1E8',
  MUTED_GRAY: '#A9ADA5',
  COPPER_GOLD: '#D7A64A',
  SLATE_BLUE: '#567A87',
  ELECTRIC_CYAN: '#00E5FF',
  VIBRANT_AMBER: '#FFB300',
  BACKGROUND: '#BFE3F4',         // Primary calm sky-blue
  BACKGROUND_LIGHT: '#D9F0FA',   // Supporting light sky tone
  BACKGROUND_FOG: '#CFEAF7',     // Soft atmospheric fog
  BACKGROUND_DEEP: '#A9D8EF',    // Supporting depth tone
  GRID_DARK: '#A9D8EF',
  GRID_LINES: '#93C5DD',
};

interface EcosystemR3FCanvasProps {
  viewMode: EcosystemViewMode;
  activeEnergySource: EnergySourceType;
  selectedEquipment: EcosystemEquipmentDetail | null;
  onSelectEquipment: (eq: EcosystemEquipmentDetail) => void;
  isPlayingJourney: boolean;
  currentStageId: number;
  locale: 'fr' | 'en';
}

// Procedural Topography & Electrical Grid Ground
const EcosystemTerrain: React.FC<{ viewMode: EcosystemViewMode }> = ({ viewMode }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate continuous terrain geometry with river gorge and mountain elevation
  const { geometry, riverPoints } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(160, 110, 80, 60);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;

    const riverSpline: THREE.Vector3[] = [];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      let y = 0;
      // Mountains on the left (Hydraulic generation zone: x < -20)
      if (x < -20) {
        const dist = Math.abs(x + 20);
        y = Math.sin((x + 60) * 0.1) * Math.cos(z * 0.08) * 8 + (dist * 0.35);
        if (z > -10 && z < 10) {
          y = Math.max(1, y - 6); // River valley cut into mountain
        }
      } else if (x >= -20 && x <= 20) {
        // Central transition valley & river
        y = Math.sin(x * 0.08) * 2;
        if (Math.abs(z - Math.sin(x * 0.1) * 6) < 6) {
          y = -1.2; // River gorge
        }
      } else {
        // Plains for substation, distribution, and city (x > 20)
        y = Math.sin(x * 0.05) * 0.6;
      }

      pos.setY(i, y);
    }
    geo.computeVertexNormals();

    // River Spline path
    for (let rx = -55; rx <= 55; rx += 5) {
      const rz = Math.sin(rx * 0.1) * 6;
      riverSpline.push(new THREE.Vector3(rx, -0.7, rz));
    }

    return { geometry: geo, riverPoints: riverSpline };
  }, []);

  const riverCurve = useMemo(() => new THREE.CatmullRomCurve3(riverPoints), [riverPoints]);
  const riverGeo = useMemo(() => new THREE.TubeGeometry(riverCurve, 64, 3.2, 8, false), [riverCurve]);

  return (
    <group>
      {/* Ground Mesh (Dark graphite control surface for high contrast under sky canvas) */}
      <mesh ref={meshRef} geometry={geometry} receiveShadow>
        <meshStandardMaterial
          color={viewMode === 'electrical' ? '#151C1E' : '#1E293B'}
          roughness={0.88}
          metalness={0.12}
          wireframe={viewMode === 'functional'}
        />
      </mesh>

      {/* Water River Bed */}
      <mesh geometry={riverGeo}>
        <meshStandardMaterial
          color={viewMode === 'electrical' ? '#0284C7' : '#0369A1'}
          roughness={0.25}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Engineering Ground Grid Guide */}
      <Grid
        position={[0, 0.05, 0]}
        args={[160, 110]}
        cellSize={5}
        cellThickness={0.6}
        cellColor={EPEDE_COLORS.GRID_LINES}
        sectionSize={20}
        sectionThickness={1.2}
        sectionColor={viewMode === 'electrical' ? EPEDE_COLORS.ELECTRIC_CYAN : EPEDE_COLORS.SLATE_BLUE}
        fadeDistance={90}
        fadeStrength={1.5}
      />
    </group>
  );
};

// Hydroelectric Gravity Dam & Powerhouse 3D Component
const HydroelectricDam: React.FC<{
  onSelect: () => void;
  isSelected: boolean;
  viewMode: EcosystemViewMode;
}> = ({ onSelect, isSelected, viewMode }) => {
  return (
    <group position={[-42, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Main Concrete Gravity Dam Wall */}
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 13, 26]} />
        <meshStandardMaterial
          color={isSelected ? EPEDE_COLORS.VIBRANT_AMBER : '#1B2430'}
          roughness={0.7}
          metalness={0.25}
        />
      </mesh>

      {/* Reservoir Water Sheet */}
      <mesh position={[-9, 9.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 24]} />
        <meshStandardMaterial
          color={viewMode === 'electrical' ? '#005588' : '#144669'}
          roughness={0.15}
          metalness={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 2 Penstock Tubes */}
      <mesh position={[7.5, 5, -4]} rotation={[0, 0, -Math.PI / 5]} castShadow>
        <cylinderGeometry args={[1.2, 1.2, 13, 16]} />
        <meshStandardMaterial color="#2A3848" roughness={0.4} metalness={0.8} />
      </mesh>
      <mesh position={[7.5, 5, 4]} rotation={[0, 0, -Math.PI / 5]} castShadow>
        <cylinderGeometry args={[1.2, 1.2, 13, 16]} />
        <meshStandardMaterial color="#2A3848" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Powerhouse Building at dam foot */}
      <mesh position={[13, 3, 0]} castShadow receiveShadow>
        <boxGeometry args={[9, 6.5, 18]} />
        <meshStandardMaterial
          color={isSelected ? '#2C3A4E' : '#16202D'}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* Hydro Generator Step-Up Transformer (11 kV -> 225 kV) */}
      <group position={[19, 2.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[4.5, 4.5, 5.5]} />
          <meshStandardMaterial color="#1C2D3E" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* HV Bushings */}
        <mesh position={[-1.2, 3, 0]}>
          <cylinderGeometry args={[0.2, 0.45, 1.6, 8]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[0.2, 0.45, 1.6, 8]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
        <mesh position={[1.2, 3, 0]}>
          <cylinderGeometry args={[0.2, 0.45, 1.6, 8]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
      </group>
    </group>
  );
};

// Renewable Generation Hub (Wind Turbines & Solar PV Panels)
const RenewableGenerationHub: React.FC<{
  onSelect: () => void;
  isSelected: boolean;
  activeSource: EnergySourceType;
}> = ({ onSelect, isSelected, activeSource }) => {
  const rotorRef1 = useRef<THREE.Group>(null);
  const rotorRef2 = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (rotorRef1.current) rotorRef1.current.rotation.z += delta * 2.2;
    if (rotorRef2.current) rotorRef2.current.rotation.z += delta * 1.8;
  });

  return (
    <group position={[-38, 0, -22]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Wind Turbine 1 */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 8, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.7, 16, 12]} />
          <meshStandardMaterial color="#DDE2E8" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Nacelle */}
        <mesh position={[0, 16.2, 0.6]} castShadow>
          <boxGeometry args={[1.2, 1.1, 2.8]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
        {/* Rotating Blades */}
        <group ref={rotorRef1} position={[0, 16.2, 2.1]}>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
            <mesh key={idx} rotation={[0, 0, angle]} position={[0, 3.8, 0]}>
              <boxGeometry args={[0.3, 7.6, 0.12]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Wind Turbine 2 */}
      <group position={[10, 0, 5]}>
        <mesh position={[0, 7, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.65, 14, 12]} />
          <meshStandardMaterial color="#DDE2E8" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 14.2, 0.6]} castShadow>
          <boxGeometry args={[1.1, 1, 2.5]} />
          <meshStandardMaterial color="#E2E8F0" />
        </mesh>
        <group ref={rotorRef2} position={[0, 14.2, 1.9]}>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
            <mesh key={idx} rotation={[0, 0, angle]} position={[0, 3.4, 0]}>
              <boxGeometry args={[0.28, 6.8, 0.1]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Solar PV Array Panels */}
      {[-4, 0, 4].map((px) =>
        [8, 12].map((pz) => (
          <mesh
            key={`${px}-${pz}`}
            position={[px + 4, 1.2, pz]}
            rotation={[-Math.PI / 4, 0, 0]}
            castShadow
          >
            <boxGeometry args={[3.2, 2, 0.12]} />
            <meshStandardMaterial
              color={activeSource === 'solar' ? '#1D4ED8' : '#1E293B'}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
        ))
      )}
    </group>
  );
};

// High-Voltage 225 kV Transmission Lattice Towers
const TransmissionCorridor: React.FC<{
  onSelect: () => void;
  isSelected: boolean;
  viewMode: EcosystemViewMode;
}> = ({ onSelect, isSelected, viewMode }) => {
  const towerPositions: [number, number, number][] = [
    [-18, 0, -4],
    [-2, 0, -3],
    [14, 0, -2],
  ];

  return (
    <group onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {towerPositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Main Lattice Tower Stem */}
          <mesh position={[0, 9, 0]} castShadow>
            <cylinderGeometry args={[0.4, 1.5, 18, 4]} />
            <meshStandardMaterial
              color={isSelected ? EPEDE_COLORS.VIBRANT_AMBER : '#475569'}
              wireframe
            />
          </mesh>
          {/* Crossarms */}
          <mesh position={[0, 14, 0]}>
            <boxGeometry args={[9, 0.4, 0.8]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
          <mesh position={[0, 16.5, 0]}>
            <boxGeometry args={[6.5, 0.35, 0.7]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
          {/* Glass Disc Insulators */}
          {[-4.2, 0, 4.2].map((ox) => (
            <mesh key={ox} position={[ox, 12.8, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 1.8, 6]} />
              <meshStandardMaterial
                color={viewMode === 'electrical' ? EPEDE_COLORS.ELECTRIC_CYAN : '#CBD5E1'}
                metalness={0.8}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* 225 kV Bundled Conductors (High-voltage span catenary cables) */}
      {[-4.2, 0, 4.2].map((phaseOffset, pIdx) => {
        const spanCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(-42 + 19, 4, 0),
          new THREE.Vector3(-18 + phaseOffset, 12, -4),
          new THREE.Vector3(-2 + phaseOffset, 11, -3),
          new THREE.Vector3(14 + phaseOffset, 11.5, -2),
          new THREE.Vector3(30 + phaseOffset * 0.4, 5, 0),
        ]);
        const tubeGeo = new THREE.TubeGeometry(spanCurve, 50, 0.12, 6, false);
        return (
          <mesh key={pIdx} geometry={tubeGeo}>
            <meshStandardMaterial
              color={viewMode === 'electrical' ? EPEDE_COLORS.ELECTRIC_CYAN : '#94A3B8'}
              emissive={viewMode === 'electrical' ? EPEDE_COLORS.ELECTRIC_CYAN : '#000000'}
              emissiveIntensity={viewMode === 'electrical' ? 0.6 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// 225/30 kV Transmission Substation & Main Power Transformer
const TransmissionSubstation: React.FC<{
  onSelect: () => void;
  isSelected: boolean;
  viewMode: EcosystemViewMode;
}> = ({ onSelect, isSelected, viewMode }) => {
  return (
    <group position={[32, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Substation Gravel Yard & Perimeter Fencing */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[18, 0.2, 22]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} />
      </mesh>

      {/* Power Transformer 225 kV / 30 kV (70 MVA ONAF) */}
      <group position={[-2, 2.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5, 4.8, 6.2]} />
          <meshStandardMaterial
            color={isSelected ? EPEDE_COLORS.VIBRANT_AMBER : '#1E3A5F'}
            metalness={0.6}
            roughness={0.35}
          />
        </mesh>
        {/* Conservator Oil Tank */}
        <mesh position={[0, 3.4, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.7, 0.7, 4.5, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.7} />
        </mesh>
        {/* Radiator Cooling Fins */}
        <mesh position={[2.9, 0, 0]}>
          <boxGeometry args={[0.8, 3.8, 5.2]} />
          <meshStandardMaterial color="#0F172A" wireframe />
        </mesh>
        {/* HV Bushings */}
        {[-1.5, 0, 1.5].map((bx) => (
          <mesh key={bx} position={[bx, 3.4, -1]}>
            <cylinderGeometry args={[0.2, 0.45, 1.8, 8]} />
            <meshStandardMaterial color="#E2E8F0" />
          </mesh>
        ))}
      </group>

      {/* SF6 Circuit Breakers & Disconnectors */}
      {[-6, 6].map((bz) => (
        <group key={bz} position={[4, 1.8, bz]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.3, 3.2, 8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 1.8, 0]}>
            <boxGeometry args={[1.2, 0.6, 1.2]} />
            <meshStandardMaterial color={EPEDE_COLORS.COPPER_GOLD} />
          </mesh>
        </group>
      ))}

      {/* Control & SCADA Building */}
      <mesh position={[6, 2, 7]} castShadow>
        <boxGeometry args={[4.5, 3.8, 6]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
    </group>
  );
};

// Medium-Voltage (30 kV) Distribution Pole Line & Kiosk Transformer
const DistributionNetwork: React.FC<{
  onSelect: () => void;
  isSelected: boolean;
  viewMode: EcosystemViewMode;
}> = ({ onSelect, isSelected, viewMode }) => {
  const poleX = [44, 52, 60];

  return (
    <group onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {poleX.map((px, idx) => (
        <group key={idx} position={[px, 0, -2]}>
          {/* Concrete Pole */}
          <mesh position={[0, 4.5, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.28, 9, 8]} />
            <meshStandardMaterial color="#64748B" />
          </mesh>
          {/* Horizontal Crossarm */}
          <mesh position={[0, 8.2, 0]}>
            <boxGeometry args={[0.15, 0.2, 2.8]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
          {/* 30 kV Pin Insulators */}
          {[-1.1, 0, 1.1].map((pz) => (
            <mesh key={pz} position={[0, 8.7, pz]}>
              <cylinderGeometry args={[0.1, 0.15, 0.7, 6]} />
              <meshStandardMaterial
                color={viewMode === 'electrical' ? EPEDE_COLORS.ELECTRIC_CYAN : '#CBD5E1'}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Ground-Mounted Compact Substation Kiosk (30 kV / 400 V - 630 kVA) */}
      <group position={[62, 1.4, 4]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 2.6, 4]} />
          <meshStandardMaterial
            color={isSelected ? EPEDE_COLORS.VIBRANT_AMBER : '#1E293B'}
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
        {/* Ventilation Louvers & IEC Warning Plate */}
        <mesh position={[1.61, 0, 0]}>
          <planeGeometry args={[2.5, 1.2]} />
          <meshStandardMaterial color={EPEDE_COLORS.VIBRANT_AMBER} />
        </mesh>
      </group>
    </group>
  );
};

// Low-Voltage Consumer Zone: Industrial Plant, Commercial Tower, and Motors (Useful Work)
const InstallationAndFinalLoad: React.FC<{
  onSelect: () => void;
  isSelected: boolean;
  viewMode: EcosystemViewMode;
}> = ({ onSelect, isSelected, viewMode }) => {
  const motorRotorRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (motorRotorRef.current) {
      motorRotorRef.current.rotation.x += delta * 7;
    }
  });

  return (
    <group position={[70, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {/* Industrial Plant Workshop Building */}
      <mesh position={[0, 4, -8]} castShadow receiveShadow>
        <boxGeometry args={[11, 7.5, 13]} />
        <meshStandardMaterial
          color={isSelected ? '#2A3C52' : '#141D2B'}
          roughness={0.6}
          metalness={0.3}
        />
      </mesh>

      {/* Commercial Office Tower */}
      <mesh position={[3, 9, 8]} castShadow receiveShadow>
        <boxGeometry args={[7, 18, 9]} />
        <meshStandardMaterial
          color="#0B131E"
          roughness={0.2}
          metalness={0.8}
          wireframe={viewMode === 'functional'}
        />
      </mesh>

      {/* Final Industrial Motor (The End of the Chain: Useful Work) */}
      <group position={[-2, 1.2, 2]}>
        {/* Motor Cast Iron Stator Casing */}
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[1.1, 1.1, 2.8, 16]} />
          <meshStandardMaterial
            color={isSelected ? EPEDE_COLORS.VIBRANT_AMBER : '#0284C7'}
            metalness={0.65}
            roughness={0.35}
          />
        </mesh>
        {/* Terminal Box */}
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[1, 0.5, 0.9]} />
          <meshStandardMaterial color="#1E293B" />
        </mesh>
        {/* Rotating Output Mechanical Shaft & Pulley (Delivering Useful Mechanical Work) */}
        <mesh ref={motorRotorRef} position={[1.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 1, 12]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

// Continuous Animated Energy Pulse Flow Path (From Hydro Generator to Useful Work)
const ContinuousEnergyFlowStream: React.FC<{ viewMode: EcosystemViewMode }> = ({ viewMode }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const spline = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-42 + 13, 3, 0), // Dam powerhouse generator
      new THREE.Vector3(-42 + 19, 4, 0), // Step-up transformer
      new THREE.Vector3(-18, 12, -4),     // Tower 1
      new THREE.Vector3(-2, 11, -3),      // Tower 2
      new THREE.Vector3(14, 11.5, -2),    // Tower 3
      new THREE.Vector3(30, 4.5, 0),      // Substation incoming gantry
      new THREE.Vector3(30, 2.5, 0),      // Substation transformer
      new THREE.Vector3(36, 1.8, 0),      // Substation MV switchgear
      new THREE.Vector3(44, 8.2, -2),     // MV Distribution pole 1
      new THREE.Vector3(52, 8.2, -2),     // MV Distribution pole 2
      new THREE.Vector3(62, 1.4, 4),      // MV/LV Distribution transformer
      new THREE.Vector3(68, 1.2, 2),      // Industrial Motor Final Load
    ]);
  }, []);

  const particleCount = 200;
  const { offsets, particleGeometry } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const offs = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      offs[i] = i / particleCount;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return { offsets: offs, particleGeometry: geo };
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry?.attributes?.position as THREE.BufferAttribute | undefined;
    if (!posAttr) return;

    for (let i = 0; i < particleCount; i++) {
      offsets[i] = (offsets[i] + delta * 0.18) % 1.0;
      const point = spline.getPointAt(offsets[i]);
      posAttr.setXYZ(i, point.x, point.y + 0.1, point.z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <group>
      {/* Power Path Spline Glow Line */}
      <mesh>
        <tubeGeometry args={[spline, 120, 0.08, 6, false]} />
        <meshBasicMaterial
          color={viewMode === 'electrical' ? EPEDE_COLORS.ELECTRIC_CYAN : EPEDE_COLORS.COPPER_GOLD}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Moving Energy Photons */}
      <points ref={pointsRef} geometry={particleGeometry}>
        <pointsMaterial
          size={0.65}
          color={viewMode === 'electrical' ? EPEDE_COLORS.ELECTRIC_CYAN : '#FFE57F'}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
};

// 3D Equipment Floating Interactive Pin Badges (Screen-projected HTML Overlay avoids nested React roots)
export const InteractiveEquipmentBadgesOverlay: React.FC<{
  onSelect: (eq: EcosystemEquipmentDetail) => void;
  selectedId?: string;
  stageBadges: { id: string; stageBadge: string | number; tag: string; screenX: number; screenY: number; visible: boolean }[];
}> = ({ onSelect, selectedId, stageBadges }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {stageBadges.map((badge) => {
        if (!badge.visible) return null;
        const isSelected = selectedId === badge.id;
        const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === badge.id);
        if (!eq) return null;

        return (
          <div
            key={badge.id}
            style={{
              position: 'absolute',
              left: `${badge.screenX}px`,
              top: `${badge.screenY}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="pointer-events-auto"
          >
            <button
              type="button"
              onClick={() => onSelect(eq)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full border transition-all cursor-pointer shadow-xl ${
                isSelected
                  ? 'bg-amber-500 border-white text-slate-950 scale-125 ring-4 ring-amber-400/40 font-black'
                  : 'bg-[#151C1E] border-[rgba(11,15,18,0.25)] text-[#F4F1E8] hover:border-amber-400 hover:scale-110 shadow-lg'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-900/90 text-amber-400 flex items-center justify-center text-[10px] font-mono font-bold">
                {badge.stageBadge}
              </span>
              <span className="text-[10px] font-mono whitespace-nowrap pr-1 hidden sm:inline text-[#F4F1E8]">
                {badge.tag}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

// Camera Controller Smooth Flight Transition
const SceneCameraController: React.FC<{
  currentStageId: number;
  isPlayingJourney: boolean;
}> = ({ currentStageId, isPlayingJourney }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Focus targets per stage
  const stageTargets: Record<number, { cam: [number, number, number]; lookAt: [number, number, number] }> = {
    1: { cam: [-35, 24, 38], lookAt: [-38, 4, 0] },  // Generation
    2: { cam: [-5, 22, 34], lookAt: [-2, 8, -3] },   // Transmission
    3: { cam: [26, 18, 28], lookAt: [32, 3, 0] },    // Substation
    4: { cam: [48, 16, 26], lookAt: [52, 4, -2] },   // Distribution
    5: { cam: [58, 14, 22], lookAt: [62, 2, 4] },    // Transformer
    6: { cam: [64, 18, 30], lookAt: [68, 5, 0] },    // Installation
    7: { cam: [66, 12, 18], lookAt: [68, 1.5, 2] },  // Final Load
  };

  useEffect(() => {
    const target = stageTargets[currentStageId] || stageTargets[1];
    if (controlsRef.current) {
      controlsRef.current.target.set(...target.lookAt);
    }
  }, [currentStageId]);

  useFrame(() => {
    const target = stageTargets[currentStageId] || stageTargets[1];
    camera.position.lerp(new THREE.Vector3(...target.cam), isPlayingJourney ? 0.04 : 0.06);
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2 - 0.05}
      minDistance={10}
      maxDistance={140}
    />
  );
};

// 3D Screen Projection Tracker inside the Canvas
const ScreenProjectionTracker: React.FC<{
  onUpdateCoords: (badges: { id: string; stageBadge: string | number; tag: string; screenX: number; screenY: number; visible: boolean }[]) => void;
}> = ({ onUpdateCoords }) => {
  const { camera, size } = useThree();
  const tempVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const list = ECOSYSTEM_EQUIPMENTS.map((eq) => {
      tempVec.set(eq.coords.x, eq.coords.y + 4.5, eq.coords.z);
      tempVec.project(camera);

      // Check if in front of camera
      const visible = tempVec.z < 1;
      const screenX = (tempVec.x * 0.5 + 0.5) * size.width;
      const screenY = (-(tempVec.y * 0.5) + 0.5) * size.height;

      return {
        id: eq.id,
        stageBadge: eq.badgeNumber,
        tag: eq.tagIec,
        screenX,
        screenY,
        visible,
      };
    });

    onUpdateCoords(list);
  });

  return null;
};

export const EcosystemR3FCanvas: React.FC<EcosystemR3FCanvasProps> = ({
  viewMode,
  activeEnergySource,
  selectedEquipment,
  onSelectEquipment,
  isPlayingJourney,
  currentStageId,
  locale,
}) => {
  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: EPEDE_COLORS.BACKGROUND }}
      >
        {/* Responsive Perspective Camera */}
        <PerspectiveCamera makeDefault position={[0, 32, 58]} fov={45} />
        
        {/* Camera Fly Controller */}
        <SceneCameraController
          currentStageId={currentStageId}
          isPlayingJourney={isPlayingJourney}
        />

        {/* Ambient & Technical Directional Lighting for Open Sky Environment */}
        <ambientLight intensity={0.75} />
        <directionalLight
          position={[-30, 45, 30]}
          intensity={1.35}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={160}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={60}
          shadow-camera-bottom={-60}
        />
        <directionalLight position={[40, 25, -20]} intensity={0.55} color={EPEDE_COLORS.BACKGROUND_LIGHT} />

        {/* Clear Sky-Blue Environment Canvas & Subtle Atmospheric Fog */}
        <color attach="background" args={[EPEDE_COLORS.BACKGROUND]} />
        <fogExp2 attach="fog" args={[EPEDE_COLORS.BACKGROUND_FOG, 0.003]} />

        {/* Connected Ecosystem Topography */}
        <EcosystemTerrain viewMode={viewMode} />

        {/* 1. Generation: Hydroelectric Dam & Powerhouse */}
        <HydroelectricDam
          onSelect={() => {
            const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-hydro-dam-01');
            if (eq) onSelectEquipment(eq);
          }}
          isSelected={selectedEquipment?.id === 'eq-hydro-dam-01'}
          viewMode={viewMode}
        />

        {/* 1. Renewable Generation Hub: Wind & Solar */}
        <RenewableGenerationHub
          onSelect={() => {
            const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-multi-sources-02');
            if (eq) onSelectEquipment(eq);
          }}
          isSelected={selectedEquipment?.id === 'eq-multi-sources-02'}
          activeSource={activeEnergySource}
        />

        {/* 2. High-Voltage Transmission Corridor (225 kV Towers & Spans) */}
        <TransmissionCorridor
          onSelect={() => {
            const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-transmission-line-03');
            if (eq) onSelectEquipment(eq);
          }}
          isSelected={selectedEquipment?.id === 'eq-transmission-line-03'}
          viewMode={viewMode}
        />

        {/* 3. Transmission Substation & 225/30 kV Power Transformer */}
        <TransmissionSubstation
          onSelect={() => {
            const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-power-transformer-05');
            if (eq) onSelectEquipment(eq);
          }}
          isSelected={selectedEquipment?.id === 'eq-power-transformer-05'}
          viewMode={viewMode}
        />

        {/* 4. Medium-Voltage Distribution Network & Kiosk Substation */}
        <DistributionNetwork
          onSelect={() => {
            const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-distribution-transformer-07');
            if (eq) onSelectEquipment(eq);
          }}
          isSelected={selectedEquipment?.id === 'eq-distribution-transformer-07'}
          viewMode={viewMode}
        />

        {/* 5. Industrial Facility, Building & Final Load (Electric Motor Useful Work) */}
        <InstallationAndFinalLoad
          onSelect={() => {
            const eq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-final-load-09');
            if (eq) onSelectEquipment(eq);
          }}
          isSelected={selectedEquipment?.id === 'eq-final-load-09'}
          viewMode={viewMode}
        />

        {/* Continuous Animated Energy Pulse Flow Stream */}
        <ContinuousEnergyFlowStream viewMode={viewMode} />

        {/* Native 3D HTML Badges directly projected via Drei (Zero React parent re-renders) */}
        {ECOSYSTEM_EQUIPMENTS.map((eq) => {
          const isSelected = selectedEquipment?.id === eq.id;
          return (
            <group key={eq.id} position={[eq.coords.x, eq.coords.y + 4.5, eq.coords.z]}>
              <Html center distanceFactor={45} zIndexRange={[50, 0]}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEquipment(eq);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all cursor-pointer shadow-xl ${
                    isSelected
                      ? 'bg-amber-500 border-white text-slate-950 scale-125 ring-4 ring-amber-400/40 font-black'
                      : 'bg-[#151C1E]/95 border-[rgba(11,15,18,0.4)] text-[#F4F1E8] hover:border-amber-400 hover:scale-110 shadow-lg'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-900/90 text-amber-400 flex items-center justify-center text-[10px] font-mono font-bold">
                    {eq.badgeNumber}
                  </span>
                  <span className="text-[10px] font-mono whitespace-nowrap pr-1 hidden sm:inline text-[#F4F1E8]">
                    {eq.tagIec}
                  </span>
                </button>
              </Html>
            </group>
          );
        })}
      </Canvas>
    </div>
  );
};
