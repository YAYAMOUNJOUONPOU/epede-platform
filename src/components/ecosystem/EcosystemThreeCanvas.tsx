// src/components/ecosystem/EcosystemThreeCanvas.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  EcosystemEquipmentDetail,
  EcosystemViewMode,
  EnergySourceType,
  ECOSYSTEM_EQUIPMENTS
} from './ecosystemData';

interface EcosystemThreeCanvasProps {
  viewMode: EcosystemViewMode;
  activeEnergySource: EnergySourceType;
  selectedEquipment: EcosystemEquipmentDetail | null;
  onSelectEquipment: (eq: EcosystemEquipmentDetail) => void;
  isPlayingJourney: boolean;
  currentStageId: number;
  locale: 'fr' | 'en';
}

export const EcosystemThreeCanvas: React.FC<EcosystemThreeCanvasProps> = ({
  viewMode,
  activeEnergySource,
  selectedEquipment,
  onSelectEquipment,
  isPlayingJourney,
  currentStageId,
  locale,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const reqIdRef = useRef<number>(0);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 32, 58));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(5, 2, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(5, 2, 0));

  // Equipment click boxes in 3D
  const interactiveMeshesRef = useRef<{ mesh: THREE.Object3D; eq: EcosystemEquipmentDetail }[]>([]);

  // Power flow particles
  const powerPathPointsRef = useRef<THREE.Vector3[]>([]);
  const powerLineTubeRef = useRef<THREE.Line | null>(null);
  const flowingParticlesRef = useRef<THREE.Points | null>(null);

  // User drag controls
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xBFE3F4);
    scene.fog = new THREE.FogExp2(0xCFEAF7, 0.003);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.5,
      1000
    );
    camera.position.set(0, 32, 58);
    camera.lookAt(5, 2, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xdde8f5, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7e6, 2.2);
    sunLight.position.set(-60, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const skyLight = new THREE.HemisphereLight(0x4a7a9e, 0x1a2e1d, 0.7);
    scene.add(skyLight);

    // 5. Build 3D Terrain: Mountains on left, river in middle, hills and urban plains on right
    buildTerrain(scene);

    // 6. Build Electrical Ecosystem Zones
    buildHydroDamAndReservoir(scene, interactiveMeshesRef);
    buildRenewablesAndThermal(scene, interactiveMeshesRef);
    buildTransmissionLineCorridor(scene, interactiveMeshesRef);
    buildMainSubstation(scene, interactiveMeshesRef);
    buildDistributionNetwork(scene, interactiveMeshesRef);
    buildDistributionTransformerStation(scene, interactiveMeshesRef);
    buildUrbanAndIndustrialZone(scene, interactiveMeshesRef);

    // 7. Build Continuous Power Flow Line & Animated Photons
    const { line, particles, points } = buildPowerFlowSystem(scene);
    powerLineTubeRef.current = line;
    flowingParticlesRef.current = particles;
    powerPathPointsRef.current = points;

    // 8. Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation towards target
      camera.position.lerp(targetCamPosRef.current, 0.04);
      currentLookAtRef.current.lerp(targetLookAtRef.current, 0.04);
      camera.lookAt(currentLookAtRef.current);

      // Animate flowing electricity along power path
      if (flowingParticlesRef.current) {
        const positions = flowingParticlesRef.current.geometry.attributes.position;
        const count = positions.count;
        const totalPoints = powerPathPointsRef.current.length;

        if (totalPoints > 1) {
          for (let i = 0; i < count; i++) {
            // Calculate progressive phase along the continuous journey
            const speed = 0.18;
            const t = (elapsedTime * speed + i / count) % 1.0;
            const pointIndex = Math.floor(t * (totalPoints - 1));
            const nextIndex = Math.min(pointIndex + 1, totalPoints - 1);
            const subT = (t * (totalPoints - 1)) - pointIndex;

            const p1 = powerPathPointsRef.current[pointIndex];
            const p2 = powerPathPointsRef.current[nextIndex];

            const x = p1.x + (p2.x - p1.x) * subT;
            const y = p1.y + (p2.y - p1.y) * subT + Math.sin(elapsedTime * 4 + i) * 0.15;
            const z = p1.z + (p2.z - p1.z) * subT;

            positions.setXYZ(i, x, y, z);
          }
          positions.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Mouse drag controls for interactive 3D rotation / pan
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

      // Orbit camera around current target
      const offset = camera.position.clone().sub(currentLookAtRef.current);
      const radius = offset.length();
      let theta = Math.atan2(offset.x, offset.z);
      let phi = Math.acos(Math.max(-1, Math.min(1, offset.y / radius)));

      theta -= deltaX * 0.006;
      phi = Math.max(0.1, Math.min(Math.PI / 2.1, phi - deltaY * 0.006));

      targetCamPosRef.current.set(
        currentLookAtRef.current.x + radius * Math.sin(phi) * Math.sin(theta),
        currentLookAtRef.current.y + radius * Math.cos(phi),
        currentLookAtRef.current.z + radius * Math.sin(phi) * Math.cos(theta)
      );
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.04;
      const dir = camera.position.clone().sub(currentLookAtRef.current).normalize();
      targetCamPosRef.current.addScaledVector(dir, zoomFactor);
    };

    // Equipment click raycasting
    const handleClick = (e: MouseEvent) => {
      if (!container || !camera) return;
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const hitObjects = interactiveMeshesRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(hitObjects, true);

      if (intersects.length > 0) {
        let currentObj: THREE.Object3D | null = intersects[0].object;
        while (currentObj) {
          const found = interactiveMeshesRef.current.find((item) => item.mesh === currentObj);
          if (found) {
            onSelectEquipment(found.eq);
            break;
          }
          currentObj = currentObj.parent;
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('click', handleClick);
      cancelAnimationFrame(reqIdRef.current);
      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, []);

  // Update camera position when stage changes or equipment is selected
  useEffect(() => {
    if (selectedEquipment) {
      targetCamPosRef.current.set(
        selectedEquipment.coords.x + 8,
        selectedEquipment.coords.y + 10,
        selectedEquipment.coords.z + 18
      );
      targetLookAtRef.current.set(
        selectedEquipment.coords.x,
        selectedEquipment.coords.y + 2,
        selectedEquipment.coords.z
      );
    } else if (currentStageId) {
      const stageTargets: Record<number, { pos: [number, number, number]; look: [number, number, number] }> = {
        1: { pos: [-36, 18, 22], look: [-32, 6, -2] },
        2: { pos: [-12, 22, 18], look: [-8, 10, -12] },
        3: { pos: [5, 18, 20], look: [4, 6, -8] },
        4: { pos: [18, 16, 20], look: [18, 5, -6] },
        5: { pos: [28, 14, 18], look: [28, 4, -4] },
        6: { pos: [36, 12, 18], look: [36, 2, 2] },
        7: { pos: [42, 10, 22], look: [42, -2, 10] },
      };
      const t = stageTargets[currentStageId] || { pos: [0, 32, 58], look: [5, 2, 0] };
      targetCamPosRef.current.set(...t.pos);
      targetLookAtRef.current.set(...t.look);
    }
  }, [currentStageId, selectedEquipment]);

  // Adjust material visibility depending on View Mode
  useEffect(() => {
    if (!sceneRef.current) return;
    // Highlight electrical power path in electrical mode
    if (powerLineTubeRef.current) {
      const mat = powerLineTubeRef.current.material as THREE.LineBasicMaterial;
      if (viewMode === 'electrical') {
        mat.color.setHex(0x00f0ff);
      } else if (viewMode === 'functional') {
        mat.color.setHex(0xd7a64a);
      } else {
        mat.color.setHex(0xf59e0b);
      }
    }
  }, [viewMode]);

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden select-none">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive 3D Badges Overlay aligned with physical and visual anchor points */}
      <div className="absolute inset-0 pointer-events-none">
        {ECOSYSTEM_EQUIPMENTS.map((eq) => {
          const isSelected = selectedEquipment?.id === eq.id;
          return (
            <div
              key={eq.id}
              style={{ left: eq.screenPos.left, top: eq.screenPos.top }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform hover:scale-105 duration-200"
            >
              <button
                type="button"
                onClick={() => onSelectEquipment(eq)}
                className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl border backdrop-blur-md transition-all shadow-xl cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-300 ring-4 ring-amber-500/30'
                    : 'bg-[#0B121D]/90 text-slate-200 border-cyan-500/40 hover:border-amber-400 hover:bg-[#111A29]'
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                    isSelected ? 'bg-slate-950 text-amber-400' : 'bg-cyan-500 text-slate-950'
                  }`}
                >
                  {eq.badgeNumber}
                </span>

                <div className="text-left font-mono leading-tight pr-1">
                  <div className="text-[11px] font-bold tracking-tight whitespace-nowrap">
                    {eq.name[locale]}
                  </div>
                  <div className={`text-[9px] truncate max-w-[170px] ${isSelected ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                    {eq.subtitle[locale]}
                  </div>
                </div>
              </button>

              {/* Vertical pin guide indicator */}
              <div className="w-[2px] h-4 bg-cyan-400/80 mx-auto shadow-sm" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* =========================================================================
   3D PROCEDURAL GENERATION HELPERS (Three.js Industrial Architecture)
========================================================================= */

function buildTerrain(scene: THREE.Scene) {
  // Main landscape terrain geometry
  const terrainGeo = new THREE.PlaneGeometry(160, 110, 48, 48);
  terrainGeo.rotateX(-Math.PI / 2);

  const pos = terrainGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);

    let y = 0;
    // Left mountain range with dam reservoir
    if (x < -20) {
      y = Math.sin((x + 20) * 0.1) * 14 + Math.cos(z * 0.1) * 8 + (Math.abs(z) > 20 ? 12 : 0);
      if (x < -32 && Math.abs(z) < 18) y = 4.5; // Flat reservoir plateau
    }
    // River valley carving through center
    else if (x >= -20 && x <= 15) {
      const riverCenter = Math.sin(x * 0.1) * 12;
      const distFromRiver = Math.abs(z - riverCenter);
      if (distFromRiver < 10) {
        y = -2.5 + (distFromRiver / 10) * 2; // Waterbed
      } else {
        y = 2 + Math.sin(x * 0.2) * 2 + Math.cos(z * 0.2) * 2;
      }
    }
    // Right hills and coastal / city plateau
    else {
      y = 1 + Math.sin(x * 0.1) * 2 + Math.cos(z * 0.15) * 2;
    }

    pos.setY(i, y);
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x1f3424,
    roughness: 0.85,
    metalness: 0.1,
    flatShading: true,
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  scene.add(terrainMesh);

  // Water body (river + lake)
  const waterGeo = new THREE.PlaneGeometry(150, 45);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x1a5878,
    roughness: 0.15,
    metalness: 0.85,
    transparent: true,
    opacity: 0.88,
  });
  const waterMesh = new THREE.Mesh(waterGeo, waterMat);
  waterMesh.position.set(-5, -0.8, -2);
  scene.add(waterMesh);
}

function buildHydroDamAndReservoir(
  scene: THREE.Scene,
  interactives: React.MutableRefObject<{ mesh: THREE.Object3D; eq: EcosystemEquipmentDetail }[]>
) {
  const damGroup = new THREE.Group();
  damGroup.position.set(-35, 3, -10);

  // Concrete dam wall structure
  const damWallGeo = new THREE.BoxGeometry(14, 12, 28);
  const damWallMat = new THREE.MeshStandardMaterial({ color: 0x6e7681, roughness: 0.7 });
  const damWall = new THREE.Mesh(damWallGeo, damWallMat);
  damWall.castShadow = true;
  damWall.receiveShadow = true;
  damGroup.add(damWall);

  // Spillway cascade chute
  const spillwayGeo = new THREE.BoxGeometry(6, 2, 16);
  spillwayGeo.rotateX(Math.PI / 6);
  const spillwayMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
  const spillway = new THREE.Mesh(spillwayGeo, spillwayMat);
  spillway.position.set(4, -3, 0);
  damGroup.add(spillway);

  // Penstocks (large high-pressure water pipes)
  for (let i = -3; i <= 3; i += 3) {
    const pipeGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 16);
    pipeGeo.rotateZ(-Math.PI / 3);
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
    const pipe = new THREE.Mesh(pipeGeo, pipeMat);
    pipe.position.set(5, -2, i);
    damGroup.add(pipe);
  }

  // Hydro Powerhouse (Usine de pied de barrage)
  const houseGeo = new THREE.BoxGeometry(10, 5, 14);
  const houseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  const powerhouse = new THREE.Mesh(houseGeo, houseMat);
  powerhouse.position.set(11, -3, 0);
  powerhouse.castShadow = true;
  damGroup.add(powerhouse);

  scene.add(damGroup);

  const hydroEq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-hydro-dam-01');
  if (hydroEq) interactives.current.push({ mesh: damGroup, eq: hydroEq });
}

function buildRenewablesAndThermal(
  scene: THREE.Scene,
  interactives: React.MutableRefObject<{ mesh: THREE.Object3D; eq: EcosystemEquipmentDetail }[]>
) {
  const multiGroup = new THREE.Group();
  multiGroup.position.set(-30, 0, 14);

  // 1. Wind Turbines
  for (let w = -6; w <= 6; w += 6) {
    const towerGeo = new THREE.CylinderGeometry(0.3, 0.5, 12, 12);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(w, 6, -6);
    multiGroup.add(tower);

    // Nacelle & Rotor hub
    const nacelleGeo = new THREE.BoxGeometry(1.2, 0.8, 2);
    const nacelle = new THREE.Mesh(nacelleGeo, towerMat);
    nacelle.position.set(w, 12, -6);
    multiGroup.add(nacelle);

    // 3 Blades
    for (let b = 0; b < 3; b++) {
      const bladeGeo = new THREE.BoxGeometry(0.2, 5, 0.4);
      const blade = new THREE.Mesh(bladeGeo, towerMat);
      blade.position.set(w, 12, -5);
      blade.rotation.z = (b * Math.PI * 2) / 3;
      multiGroup.add(blade);
    }
  }

  // 2. Solar PV Arrays
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.9, roughness: 0.2 });
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const panelGeo = new THREE.BoxGeometry(2.5, 0.1, 1.5);
      panelGeo.rotateX(Math.PI / 8);
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(c * 3 - 5, 0.6, r * 2.5 + 4);
      multiGroup.add(panel);
    }
  }

  // 3. Thermal / Biomass Peaking Plant with Smoke Stacks
  const plantGeo = new THREE.BoxGeometry(8, 4, 6);
  const plantMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
  const plant = new THREE.Mesh(plantGeo, plantMat);
  plant.position.set(8, 2, 2);
  multiGroup.add(plant);

  // Stacks
  for (let s = -2; s <= 2; s += 4) {
    const stackGeo = new THREE.CylinderGeometry(0.5, 0.6, 10, 16);
    const stackMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
    const stack = new THREE.Mesh(stackGeo, stackMat);
    stack.position.set(8 + s, 7, 2);
    multiGroup.add(stack);
  }

  scene.add(multiGroup);

  const multiEq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-multi-sources-02');
  if (multiEq) interactives.current.push({ mesh: multiGroup, eq: multiEq });
}

function buildTransmissionLineCorridor(
  scene: THREE.Scene,
  interactives: React.MutableRefObject<{ mesh: THREE.Object3D; eq: EcosystemEquipmentDetail }[]>
) {
  const tLineGroup = new THREE.Group();

  // Lattice Steel Towers spanning from generation to substation
  const towerPositions = [
    new THREE.Vector3(-24, 6, -8),
    new THREE.Vector3(-14, 8, -12),
    new THREE.Vector3(-4, 9, -15),
    new THREE.Vector3(4, 7, -15),
  ];

  towerPositions.forEach((pos, idx) => {
    const tower = createSteelLatticeTower();
    tower.position.copy(pos);
    tLineGroup.add(tower);
  });

  scene.add(tLineGroup);

  const lineEq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-transmission-line-03');
  if (lineEq) interactives.current.push({ mesh: tLineGroup, eq: lineEq });
}

function createSteelLatticeTower(): THREE.Group {
  const tower = new THREE.Group();
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.4 });

  // Main pyramid body
  const bodyGeo = new THREE.CylinderGeometry(0.6, 2.2, 14, 4);
  bodyGeo.rotateY(Math.PI / 4);
  const body = new THREE.Mesh(bodyGeo, steelMat);
  body.position.y = 7;
  tower.add(body);

  // Crossarms (Consoles)
  for (let c = 0; c < 2; c++) {
    const armGeo = new THREE.BoxGeometry(7 - c * 1.5, 0.4, 0.4);
    const arm = new THREE.Mesh(armGeo, steelMat);
    arm.position.y = 10 + c * 2.5;
    tower.add(arm);

    // Insulators hanging from crossarm ends
    const insMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1 });
    const ins1 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8), insMat);
    ins1.position.set(-2.8 + c * 0.6, 9.4 + c * 2.5, 0);
    const ins2 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.2, 8), insMat);
    ins2.position.set(2.8 - c * 0.6, 9.4 + c * 2.5, 0);
    tower.add(ins1);
    tower.add(ins2);
  }

  return tower;
}

function buildMainSubstation(
  scene: THREE.Scene,
  interactives: React.MutableRefObject<{ mesh: THREE.Object3D; eq: EcosystemEquipmentDetail }[]>
) {
  const ssGroup = new THREE.Group();
  ssGroup.position.set(5, 1, -8);

  // Concrete foundation platform
  const baseGeo = new THREE.BoxGeometry(22, 0.6, 24);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.receiveShadow = true;
  ssGroup.add(base);

  // High Voltage Busbar Gantries (Portiques jeux de barres)
  const gantryMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.6 });
  for (let g = -6; g <= 6; g += 6) {
    const post1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 7, 8), gantryMat);
    post1.position.set(-8, 3.5, g);
    const post2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 7, 8), gantryMat);
    post2.position.set(8, 3.5, g);
    const beam = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 0.3), gantryMat);
    beam.position.set(0, 7, g);
    ssGroup.add(post1);
    ssGroup.add(post2);
    ssGroup.add(beam);
  }

  // Circuit Breakers & Disconnectors (SF6 Tanks)
  for (let b = -4; b <= 4; b += 4) {
    const cb = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2.5, 12), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
    cb.position.set(-2, 1.5, b);
    ssGroup.add(cb);
  }

  // Power Transformer Tank (Autotransformateur 63 MVA)
  const trafoGroup = new THREE.Group();
  trafoGroup.position.set(4, 0, 4);

  const tankGeo = new THREE.BoxGeometry(4.5, 3.5, 5);
  const tankMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.4 });
  const tank = new THREE.Mesh(tankGeo, tankMat);
  tank.position.y = 2;
  trafoGroup.add(tank);

  // Radiators on sides
  for (let r = -2; r <= 2; r += 1) {
    const rad = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 4), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    rad.position.set(2.5, 1.8, r * 0.4);
    trafoGroup.add(rad);
  }

  // High Voltage Bushings (Traversées 225 kV)
  for (let bu = -1.2; bu <= 1.2; bu += 1.2) {
    const bush = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.25, 2.2, 10), new THREE.MeshStandardMaterial({ color: 0xd97706 }));
    bush.position.set(bu, 4.5, -1);
    trafoGroup.add(bush);
  }

  ssGroup.add(trafoGroup);
  scene.add(ssGroup);

  const subEq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-transmission-substation-04');
  if (subEq) interactives.current.push({ mesh: ssGroup, eq: subEq });

  const trafoEq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-power-transformer-05');
  if (trafoEq) interactives.current.push({ mesh: trafoGroup, eq: trafoEq });
}

function buildDistributionNetwork(
  scene: THREE.Scene,
  interactives: React.MutableRefObject<{ mesh: THREE.Object3D; eq: EcosystemEquipmentDetail }[]>
) {
  const distGroup = new THREE.Group();

  // Spun concrete poles carrying MV 30 kV lines
  const polePositions = [
    new THREE.Vector3(14, 4, -4),
    new THREE.Vector3(19, 4, -5),
    new THREE.Vector3(24, 4, -5),
  ];

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
  const crossarmMat = new THREE.MeshStandardMaterial({ color: 0x475569 });

  polePositions.forEach((pos) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 7, 10), poleMat);
    pole.position.copy(pos);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.2), crossarmMat);
    arm.position.set(pos.x, pos.y + 3.2, pos.z);
    distGroup.add(pole);
    distGroup.add(arm);
  });

  scene.add(distGroup);

  const distEq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-distribution-network-06');
  if (distEq) interactives.current.push({ mesh: distGroup, eq: distEq });
}

function buildDistributionTransformerStation(
  scene: THREE.Scene,
  interactives: React.MutableRefObject<{ mesh: THREE.Object3D; eq: EcosystemEquipmentDetail }[]>
) {
  const dtGroup = new THREE.Group();
  dtGroup.position.set(28, 2.5, -4);

  // Compact Kiosk substation housing (Poste préfabriqué béton)
  const kioskGeo = new THREE.BoxGeometry(3.5, 3, 4);
  const kioskMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.9 });
  const kiosk = new THREE.Mesh(kioskGeo, kioskMat);
  kiosk.position.y = 1.5;
  dtGroup.add(kiosk);

  // Ventilation louvers & steel access doors
  const doorGeo = new THREE.BoxGeometry(0.1, 2.2, 1.8);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(1.8, 1.2, 0);
  dtGroup.add(door);

  scene.add(dtGroup);

  const dtEq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-distribution-transformer-07');
  if (dtEq) interactives.current.push({ mesh: dtGroup, eq: dtEq });
}

function buildUrbanAndIndustrialZone(
  scene: THREE.Scene,
  interactives: React.MutableRefObject<{ mesh: THREE.Object3D; eq: EcosystemEquipmentDetail }[]>
) {
  const cityGroup = new THREE.Group();
  cityGroup.position.set(38, 0, 2);

  // Factory workshop building (Usine / TGBT)
  const factoryGeo = new THREE.BoxGeometry(12, 6, 14);
  const factoryMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
  const factory = new THREE.Mesh(factoryGeo, factoryMat);
  factory.position.set(0, 3, 0);
  cityGroup.add(factory);

  // Modern Office / Residential Buildings in background
  for (let b = 0; b < 4; b++) {
    const height = 10 + b * 4;
    const bGeo = new THREE.BoxGeometry(5, height, 5);
    const bMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
    const bldg = new THREE.Mesh(bGeo, bMat);
    bldg.position.set(8 + (b % 2) * 6, height / 2, -6 - Math.floor(b / 2) * 7);
    cityGroup.add(bldg);
  }

  // Industrial motor and pumping station (Final useful work)
  const motorGroup = new THREE.Group();
  motorGroup.position.set(2, 1.5, 8);

  const motorCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 2.8, 16),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 })
  );
  motorCylinder.rotateZ(Math.PI / 2);
  motorGroup.add(motorCylinder);

  const pumpHousing = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2, 2),
    new THREE.MeshStandardMaterial({ color: 0x1e293b })
  );
  pumpHousing.position.set(2.2, 0, 0);
  motorGroup.add(pumpHousing);

  cityGroup.add(motorGroup);
  scene.add(cityGroup);

  const tgbtEq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-building-installation-08');
  if (tgbtEq) interactives.current.push({ mesh: cityGroup, eq: tgbtEq });

  const motorEq = ECOSYSTEM_EQUIPMENTS.find((e) => e.id === 'eq-final-load-09');
  if (motorEq) interactives.current.push({ mesh: motorGroup, eq: motorEq });
}

function buildPowerFlowSystem(scene: THREE.Scene) {
  // Ordered sequence of waypoints from generation to final load
  const waypoints = [
    new THREE.Vector3(-35, 3, -10), // Hydro generator
    new THREE.Vector3(-26, 4, -8),  // Switchyard
    new THREE.Vector3(-24, 12, -8), // Tower 1
    new THREE.Vector3(-14, 14, -12),// Tower 2
    new THREE.Vector3(-4, 15, -15), // Tower 3
    new THREE.Vector3(4, 13, -15),  // Substation entry gantry
    new THREE.Vector3(5, 7, -8),    // Busbar & CB
    new THREE.Vector3(9, 4, -4),    // Power Transformer 63 MVA
    new THREE.Vector3(14, 7, -4),   // MV feeder pole 1
    new THREE.Vector3(19, 7, -5),   // MV feeder pole 2
    new THREE.Vector3(28, 4, -4),   // Distribution Transformer
    new THREE.Vector3(38, 3, 2),    // Building TGBT
    new THREE.Vector3(40, 2, 10),   // Industrial Motor & useful work
  ];

  // Catmull-Rom spline curve for natural cable sag and flow
  const curve = new THREE.CatmullRomCurve3(waypoints);
  const points = curve.getPoints(120);

  const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
  const lineMat = new THREE.LineBasicMaterial({
    color: 0xf59e0b,
    linewidth: 3,
  });
  const line = new THREE.Line(lineGeo, lineMat);
  scene.add(line);

  // Moving energy photons along the line
  const particleCount = 70;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0xffd166,
    size: 1.6,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  return { line, particles, points };
}
