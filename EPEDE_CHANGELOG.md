# EPEDE PLATFORM TRANSFORMATION CHANGELOG

All notable changes, engineering refactors, and technical enhancements across the platform are documented in this file.

---

## [Unreleased] - 2026-11-07

### Platform Transformation Initiative Initiated
- Created permanent autonomous execution protocol trackers: `EPEDE_IMPROVEMENT_TRACKER.md`, `EPEDE_QUALITY_AUDIT.md`, `EPEDE_CHANGELOG.md`, `EPEDE_CONTINUATION_STATE.md`.
- Completed Homepage Journey Section exact rebuild matching `design-reference/JOURNEY-SECTION-EXACT.md`:
  - 240px sticky rail with dynamic amber progress line at `top: 110px`.
  - Staggered word reveal, progressive read illumination, and clip animations.
  - Mobile sticky bar at `top: 68px` with 9 segmented indicator bars.
  - Preferences for reduced motion strictly respected.
- Sitewide footer cleanly removed across all routes per user request.

### Domain 1 (D01) - Energy Resources & Generation Transformation
- Expanded generation technology portfolio to cover all 5 canonical generation systems:
  1. **Hydroelectric Generation** (Run-of-river, reservoir, pumped-storage, Kaplan/Francis/Pelton, energy conversion chain).
  2. **Solar Power Generation** (Photovoltaic cells, strings, combiner boxes, central & string inverters, transformers, DC/AC conversion).
  3. **Wind Power Generation** (Kinetic conversion, rotor blades, pitch/yaw, direct-drive vs DFIG, converters, HV grid connection).
  4. **Thermal CCGT & Gas/Steam Turbines** (Rankine steam, Brayton gas, HRSG, cooling towers, auxiliaries, emissions control).
  5. **Nuclear Power Generation** (PWR/BWR fission cycles, primary/secondary coolant loops, steam generation, turbines, quadruple safety barriers).
- Integrated energy conversion step ribbons, operating sequences, and apparatus tables with IEC 60034, IEC 61400, IEC 62817, and IEC 61215 standards.

### Domain 2 (D02) - Power-System Architecture & Grid Planning Transformation
- Completely overhauled pedagogical framework in `domainPedagogicalContentRegistry.ts`:
  - **Section A**: Modeled nodal admittance $[Y_{bus}]$, Newton-Raphson Jacobian $[J]$, active/reactive convergence tolerances, and dynamic voltage boundaries ($0.90\text{--}1.05\text{ Un}$).
  - **Section B**: Documented 5 network topologies: Meshed ($225\text{ kV}/90\text{ kV}$), Open-Ring Loop ($30\text{ kV}$), Radial Tree ($15\text{ kV}/30\text{ kV}$), Transboundary Supergrid (RIS-RIN/PIECT $225\text{ kV}/400\text{ kV}$), and Substation Bus Topologies.
  - **Section C**: Added 6 core engineering apparatus: STATCOM/SVC, EMS/SCADA dispatch computer, Synchronous Condenser ($H = 5.0\text{ s}$), Shunt Reactor, $245\text{ kV}$ Double-Busbar Bay, and Phase-Shifting Transformer (PST).
  - **Section D**: Expanded methodology to 7 sequential phases from nodal demand modeling to 10-year master investment planning (SDI).
  - **Section E**: Formulated 5 LaTeX engineering equations: AC Newton-Raphson load flow, Surge Impedance Loading (SIL), static power transfer limits, IEC 60909 short-circuit capacity, and the rotor swing equation.
  - **Section F**: Sourced 5 international and national standards: IEC 60909-0, IEEE Std 399, IEC 61970/CIM, SONATREL Grid Code, IEC 60038/IEC 60071.
- Created `GridArchitectureComparisonMatrix.tsx`:
  - Interactive 8-axis comparison matrix (Radial vs Open-Ring vs Meshed vs Interconnected vs Microgrid) covering reliability, protection, CapEx, OpEx, voltage stability, and real Cameroon grid exemplars.
  - Comprehensive Substation Busbar Scheme matrix (Single Bus, Sectionalized, Double Bus, $1\frac{1}{2}$ CB, Ring Bus) with maintenance flexibility and interlocking rules.
  - Integrated into Stage 3 of `GridArchitectureVisualJourney.tsx`.

### Domain 3 (D03) - Transmission Networks Transformation
- Enriched pedagogical framework in `domainPedagogicalContentRegistry.ts`:
  - **Section A**: Formulated transmission electrotechnical boundaries ($v \approx 300\,000\text{ km/s}$, $Q_c = \omega C V^2$, $Z_c \approx 360\text{--}400\,\Omega$, $R_p \le 10\,\Omega$).
  - **Section B**: Documented 5 canonical transmission architectures: 225 kV Double-Circuit Lattice Tower Line, 90 kV Sub-Transmission Line, 225 kV XLPE Underground Cable with Cross-Bonding, 400 kV Multi-Bundle Regional Intertie (PIECT), and HVDC VSC/MMC Bipolar Intertie.
  - **Section C**: Added 6 high-voltage assets with authentic imagery: 225 kV lattice towers, AAAC Aster 570 mm² conductors, silicone composite insulator strings, 48-fiber OPGW shield wires, 225 kV XLPE underground cables, and spacer dampers / Stockbridge vibration dampers.
  - **Section D**: Expanded methodology to 7 sequential phases from LiDAR corridor surveys to Dynamic Line Rating (DLR).
  - **Section E**: Integrated 6 LaTeX mathematical formulations: Ferranti effect ($\Delta U \approx \frac{\omega^2 L C}{2} U$), IEEE Std 738 heat balance ampacity, Cigré TB 273 catenary sag equation, Peek corona inception field ($E_0$), IEC 60287 underground cable Kennelly network, and surge propagation velocity ($Z_c, v$).
  - **Section F**: Sourced 6 international standards: IEC 60826, NF EN 50341, IEEE Std 738, IEC 60287, IEC 60071, and Cigré TB 273.

### Domain 4 (D04) - Substations & Grid Nodes Transformation
- Synchronized canonical registry and `D04PedagogicalPilotView.tsx`:
  - **Section A**: Formulated $225\text{ kV} / 90\text{ kV} / 30\text{ kV}$ node parameters, $40\text{ kA} / 45\text{ ms}$ SF6 breaking performance, OLTC $\pm 16\%$ tap regulation, and $R_g < 0.5\,\Omega$ earthing mesh.
  - **Section B**: Documented 5 substation topologies: AIS $225\text{ kV}$ outdoor, GIS $225\text{ kV}$ SF6 metal-enclosed, primary step-down substations ($63\text{ MVA}$), powerhouse GSU switchyards, and digital substations (IEC 61850 Process Bus).
  - **Section C**: Added 6 authenticated apparatus with archive imagery: $63\text{ MVA}$ power transformers, $245\text{ kV}$ SF6 circuit breakers, 4-winding CTs (5P20/0.2S), CCVT voltage transformers, ZnO surge arresters, and motorized bus selector/earthing disconnectors.
  - **Section D**: Modeled 7-phase project lifecycle from short-circuit studies (IEC 60909) to online DGA transformer oil diagnostics.
  - **Section E**: Implemented 6 normative solvers: IEC 60909-0 short-circuit current ($I_k''$), IEC 60076 transformer impedance & secondary fault current, ANSI 87T dual-slope differential characteristic with 2nd harmonic restraint, IEEE Std 80 step and touch potentials, IEC 61936-1 air clearances with altitude factor $k_a$, and IEC 60865-1 busbar electrodynamic Laplace forces.
  - **Section F**: Sourced 6 standards: IEC 61936-1, IEC 62271-100/200/203, IEC 60076 (Series), IEEE Std 80-2013, IEC 61850 (Series), and Cameroon SONATREL Grid Code §5.

### Domain 5 (D05) - Distribution Networks Transformation
- Completely overhauled pedagogical framework in `domainPedagogicalContentRegistry.ts`:
  - **Section A**: Cleanly established boundary conditions for Medium-Voltage distribution ($15\text{ kV} / 30\text{ kV}$), separating it from low-voltage utilization. Formulated primary substation inputs, open-ring feeder routing, resistor-grounded neutral ($40\text{ A}$ to $150\text{ A}$ / $10\text{ s}$), voltage regulation ($\pm 5\%$), and secondary transformer step-down ($400\text{ V} / 230\text{ V}$ Dyn11).
  - **Section B**: Documented 5 canonical distribution topologies:
    1. **Boucle Ouverte HTA Urbaine (Coupure d'Artère RMU)** (SF6/Dry-Air switchgear, normally open tie point, SAIDI reduced by 75%).
    2. **Départ Radial Aérien Longue Distance avec Réenclencheur (ACR 30 kV)** (Vacuum reclosers, multishot sequence O-0.3s-CO-2s-CO, clears 80-85% of transient faults).
    3. **Double Dérivation HTA avec Inverseur Automatique de Source (ATS)** (Dual feeders with auto-transfer in $< 1.5\text{ s}$ for hospitals, industry, data centers).
    4. **Poste de Transformation Aérien sur Poteau H61 (50 kVA à 160 kVA)** (Hermetic ONAN transformer, expulsion cut-outs, ZnO 30 kV arresters, pole-top breaker).
    5. **Poste Préfabriqué Compact en Kiosque Béton (250 kVA à 1 000 kVA)** (Monobloc reinforced concrete, internal arc classification IAC-AB 20 kA 1s, noise $< 48\text{ dB}$).
  - **Section C**: Added 6 authenticated distribution field apparatus:
    1. `eq-exp-cell-mv-30k`: Cellule Modulaire HTA 30 kV (RMU Ringmaster / SM6 - 30 kV, 630 A, 16 kA 1s).
    2. `eq-exp-kiosk-30kv-400v`: Transformateur HTA/BT Kiosque Béton (630 kVA Dyn11, EcoDesign Tier 2).
    3. `eq-recloser-30k`: Disjoncteur Réenclencheur Aérien de Poteau (ACR 30 kV, 630 A, 12.5 kA, ANSI 79).
    4. `eq-pole-trafo-h61`: Poste de Transformation Aérien sur Poteau H61 (100 kVA, 30 kV / 400 V, Dyn11).
    5. `eq-fpi-indicator`: Détecteur de Passage de Défaut Communicant (DPD / FPI, 4G/DNP3, directional I> and Io>).
    6. `eq-ngr-neutral`: Résistance de Neutre HTA au Poste Source (RPN / NGR 30 kV, 40 A / 150 A, 10 s, IEEE Std 32).
  - **Section D**: Modeled 7-phase project lifecycle from spatial coincidence & load forecasting to phase balancing and IEEE Std 1366 reliability tracking.
  - **Section E**: Formulated 6 normative LaTeX mathematical solvers:
    1. Three-Phase MV Feeder Voltage Drop ($\Delta U = \frac{\sqrt{3} I_b L (R' \cos\varphi + X' \sin\varphi)}{1000}$).
    2. Earth Fault Current Limitation via Neutral Grounding Resistor ($I_F \approx \frac{U_n}{\sqrt{3} R_N}$).
    3. Adiabatic Short-Circuit Thermal Stress in MV Cables ($S \ge \frac{I_{cc} \sqrt{t_c}}{k}$).
    4. IEEE Std 1366 Distribution Reliability Indices ($\text{SAIDI} = \frac{\sum r_i N_i}{N_T}$, $\text{SAIFI} = \frac{\sum N_i}{N_T}$).
    5. Transformer Magnetizing Inrush Current & Fuse Grading ($I_{inrush}(100\text{ ms}) \approx 10\text{--}14 I_n$).
    6. ACR Reclosing Cycle & FLISR Loop Reconfiguration Time ($t_{reprise} \le 30\text{ s}$ vs $t_{manuel} \ge 90\text{ min}$).
  - **Section F**: Sourced 6 normative standards: IEC 62271-200, IEC 62271-111 / IEEE C37.60, NF C 13-100 / NF C 13-200, IEEE Std 1366, IEC 60076-1 / IEC 62271-202, and Cameroon ENEO / ARSEL MV Distribution Grid Code.

### Domain 7 (D07) - Industrial Automation, DCS & Variable Speed Drives (VFD) Transformation
- Completely overhauled pedagogical framework in `domainPedagogicalContentRegistry.ts`:
  - **Section A**: Formulated industrial automation principles across Purdue Model Levels 0 to 4 (Sensors/Actuators, PLCs/DCS, SCADA/MES, Plant Historian/ERP) and deterministic control timing.
  - **Section B**: Documented 5 industrial automation architectures:
    1. Plantwide Redundant DCS with Dual Optical PRP/HSR Ring (Nachtigal 420 MW Hydroelectric Plant).
    2. Four-Quadrant Active Front End (AFE) Heavy Drive Architecture (CIMENCAM Figuil Cement Kiln).
    3. Triple Modular Redundant (TMR 2oo3) SIS with Ex-i galvanic barriers (SCDP Bessengue Hydrocarbon Terminal).
    4. High-Speed Deterministic PLC Islands with CIP Sync Motion & SERCOS III (SABC Douala Packaging Line).
    5. Purdue Model Layered OT Cybersecurity Architecture with Demilitarized Zone (DMZ) per IEC 62443.
  - **Section C**: Added 6 core industrial automation apparatus with authentic equipment registry citations:
    - Safety PLC / DCS Dual-Redundant Controller (`eq-plc-dcs-controller`).
    - Variable Frequency Drive 690 V / 400 kW AFE Inverter (`eq-vfd-inverter-drive`).
    - Industrial Capacitive Multi-Touch HMI Display (`eq-exp-hmi-scada`).
    - Safety Instrumented System (SIS) 2oo3 TMR Logic Solver (`eq-exp-safety-relay`).
    - Distributed Fieldbus I/O Block IP67 with PROFINET IRT (`eq-exp-fieldbus-io`).
    - Sine-Wave Output & dv/dt Motor Protection Filter (`eq-exp-dvdt-sine-filter`).
  - **Section D**: Expanded methodology to 7 sequential engineering lifecycle phases:
    1. Process Functional Specifications (PFS) & HAZOP/LOPA SIL Allocation.
    2. Automation Hardware Architecture & Fieldbus Network Design.
    3. IEC 61131-3 Software Development & Deterministic Cyclic Task Execution.
    4. Factory Acceptance Testing (FAT) with Real-Time Hardware-in-the-Loop (HIL).
    5. On-Site Loop Checking, Instrumentation Calibration & Cold Commissioning.
    6. Hot Commissioning, Motor Tuning, Dynamic Optimization & Baseline Archival.
    7. OT Asset Management, Firmware Lifecycle & IEC 62443 Cyber Patching.
  - **Section E**: Integrated 6 LaTeX mathematical formulations:
    - Discrete Euler ODE PID controller with back-calculation anti-windup clamping.
    - Field-Oriented Control (FOC) Clarke/Park $d$-$q$ vector transformation and torque generation.
    - IEC 61508 / IEC 61511 2oo3 TMR Average Probability of Failure on Demand ($PFD_{avg}$).
    - Centrifugal pump/fan affinity laws and cubic energy savings ($P \propto \omega^3$).
    - Induction motor stator thermal heating ODE ($I^2t$) and trip curve.
    - IEC 61850-9-2LE / IEC 61869-9 Process Bus Sampled Values (SV) network bandwidth calculation.
  - **Section F**: Sourced 6 international and industrial automation standards:
    - IEC 61131-3 (Programmable controllers - Programming languages).
    - IEC 61508 / IEC 61511 (Functional safety of electrical/electronic/programmable safety-related systems).
    - IEC 61800-3 / IEC 61800-5-1 (Adjustable speed electrical power drive systems).
    - IEC 62443 (Security for industrial automation and control systems).
    - IEC 61850-9-2LE / IEC 61869-9 (Process bus sampled values and digital instrument transformers).
    - NAMUR NE 43 (Standardization of the signal level for the failure information of digital transmitters).

### Domain 6 (D06) - Electrical Installations & Utilization Transformation
- Completely overhauled pedagogical framework in `domainPedagogicalContentRegistry.ts`:
  - **Section A**: Modeled low-voltage terminal distribution boundaries ($400\text{ V} / 230\text{ V}$), dual-supply ATS backup from diesel genset, TGBT Form 4b internal segregation (IEC 61439-2), statutory touch voltage safety thresholds ($U_L \le 50\text{ V}$ dry / $25\text{ V}$ wet), and foundation equipotential earthing loop ($R \le 10\,\Omega$).
  - **Section B**: Documented 5 canonical low-voltage architectures:
    1. **Schéma de Neutre TT (Distribution Publique Basse Tension & Tertiaire)** (Mandatory RCD tripping, safety rule $R_A \cdot I_{\Delta n} \le 50\text{ V}$).
    2. **Schéma de Neutre TN-S (Grand Tertiaire, Data Centers & Industrie)** (Dedicated PE conductor, phase-to-PE short-circuit, magnetic clearance in $t \le 0.4\text{ s}$, zero stray PE currents).
    3. **Schéma de Neutre TN-C / TN-C-S (Distribution Industrielle Économique & Colonnes)** (Combined PEN conductor $\ge 10\text{ mm}^2$ Cu, saving 20-25% copper on heavy risers).
    4. **Schéma de Neutre IT (Hôpitaux, Salles d'Opération, Mines & Process Continus)** (Isolated/impedance-grounded neutral, 100% service continuity on 1st fault, continuous digital IMD/CPI monitoring).
    5. **Distribution Critique Double Voie TGBT 2N avec Commutateur Statique (STS)** (Dual-bus 2N architecture, Static Transfer Switch $< 4\text{ ms}$, 99.999% availability).
  - **Section C**: Added 6 authenticated low-voltage field apparatus:
    1. `eq-exp-masterpact-mtz`: Disjoncteur Général TGBT Ouvert Débrochable (1 600 A, 65 kA, digital trip unit, Class 1 metering).
    2. `eq-exp-tgbt-cubicle`: Tableau Général Basse Tension Modulaire (TGBT Forme 4b - 2 500 A, Icw 65 kA 1s).
    3. `eq-exp-rcd-diff`: Dispositif Différentiel Résiduel Haute Sensibilité (DDR 30 mA life-safety, 300 mA fire protection).
    4. `eq-exp-cpi-monitor`: Contrôleur Permanent d'Isolement Numérique (CPI / IMD, 2.5 Hz coded injection for IT systems).
    5. `eq-exp-mcc-starter`: Tiroir Débrochable Centre Contrôle Moteur (MCC Forme 4b - 160 kW, soft-starter/VFD).
    6. `eq-exp-pfc-capacitor`: Batterie Automatique de Condensateurs Anti-Harmoniques (300 kvar, 7% detuning reactor at 189 Hz).
  - **Section D**: Modeled 7-phase project lifecycle from power schedule & diversity factors ($k_u, k_s$) to Consuel certification and infrared thermographic audit.
  - **Section E**: Formulated 6 normative LaTeX mathematical solvers:
    1. Personnel Shock Protection Condition in TT Systems ($R_A \cdot I_{\Delta n} \le U_L$).
    2. Fault Loop Impedance & Automatic Disconnection in TN Systems ($I_d = \frac{U_0}{Z_s} \ge I_a$, $t \le 0.4\text{ s}$).
    3. Three-Phase & Single-Phase LV Drop Calculation per NF C 15-105 ($\Delta U = b [(\rho \frac{L}{S}) \cos\varphi + \lambda L \sin\varphi] I_b$).
    4. Conductor Current Carrying Capacity & Derating Factors ($I_z = I_{z0} \cdot k_1 \cdot k_2 \cdot k_3 \ge I_n \ge I_b$).
    5. Transient Busbar Voltage Dip During Induction Motor Starting ($\Delta U_{\text{start}}\% = \frac{S_{\text{start}}}{S_{cc} + S_{\text{start}}} \cdot 100 \le 10\%$).
    6. Capacitor Bank Sizing & Detuned Harmonic Filter Tuning ($Q_c = P (\tan\varphi_1 - \tan\varphi_2)$, $f_r = f_1 \sqrt{1/p} = 189\text{ Hz}$).
  - **Section F**: Sourced 6 normative standards: NF C 15-100, CEI 60364-4-41, CEI 61439-1 / CEI 61439-2, NF C 15-105, CEI 60947-2 / CEI 60947-4-1, and CEI 60364-6.

### Domain 8 (D08) - Extra-Low Voltage (ELV) & Special Electrical Systems Transformation
- Completely overhauled pedagogical framework in `domainPedagogicalContentRegistry.ts`:
  - **Section A**: Formulated ELV electrotechnical boundaries (SELV/TBTS $\le 50\text{ V AC} / \le 120\text{ V DC}$), dual-supply emergency backed UPS/rectifier sources, 300 mm physical segregation from power trays, and telecom equipotential earthing mesh ($R < 1\,\Omega$).
  - **Section B**: Documented 5 canonical ELV architectures:
    1. **Système de Sécurité Incendie SSI Catégorie A avec Évacuation Sonore EN 54-16 (Centrale Hydroélectrique de Nachtigal & Tour Tertiaire)** (Class A fault-tolerant return loops, CMSI, Novec 1230 total flooding).
    2. **Infrastructure de Câblage Structuré VDI & Réseau Haute Densité PoE++ 802.3bt (Data Center & Siège Social)** (OS2/OM4 40/100 GbE backbones, Cat 6A S/FTP, 90 W Type 4 PoE++ switches).
    3. **Système de Contrôle d'Accès Sécurisé & Détection d'Intrusion Périphérique (Poste HTB 225 kV de Mangombé & SCDP)** (Mifare DESFire EV3 AES-128, Grade 4 controllers, microwave fence barriers).
    4. **Vidéoprotection IP Intelligente HD & Supervision VMS Centralisée (Complexe Portuaire de Kribi & Réseau Urbain)** (4K Ultra-HD fixed and thermal PTZ, H.265/AV1 edge AI, 30-day RAID 6 SAN storage).
    5. **Gestion Technique du Bâtiment (GTB/GTC) Multi-Protocoles & Efficacité Énergétique (Hôpital Général & Siège ENEO)** (3-tier BACnet/IP, Modbus TCP, KNX, DALI-2, ISO 52120 Class A).
  - **Section C**: Added 6 core ELV and building safety apparatus with authentic equipment registry citations:
    - Addressable Fire Alarm Control Panel & Safety System ECS/CMSI (`eq-exp-ssi-cat-a`).
    - 42U High-Density VDI Structured Cabling & Optical Distribution Rack (`eq-exp-vdi-rack-42u`).
    - 4K Ultra-HD Intelligent PTZ IP Surveillance Camera with Edge AI & IR (`eq-exp-camera-ip-ptz`).
    - Secure Multi-Door IP Access Controller with OSDP v2 / DESFire EV3 (`eq-exp-access-controller`).
    - BACnet/IP & Modbus Direct Digital Controller DDC for Smart BMS (`eq-exp-bms-ddc-controller`).
    - Novec 1230 / FK-5-1-12 Clean Agent Total Flooding Fire Suppression System (`eq-exp-novec-extinguishing`).
  - **Section D**: Expanded methodology to 7 sequential engineering lifecycle phases:
    1. Risk Analysis, Building Typology & Fire Safety Design Basis.
    2. Detection & Safety Zoning (ZD/ZS) & PoE / Standby Power Budgets.
    3. Detailed Execution Engineering, Wiring Synoptics & ELV Layouts.
    4. Physical Installation, Power/ELV Separation & Telecom Equipotential Bonding.
    5. Copper/Fiber Network Certification (OTDR) & Battery Autonomy Testing.
    6. Integrated Functional Testing, Fire Scenarios & SSI Commissioning.
    7. Periodic Regulatory Maintenance, Cybersecurity Audits & Safety Logbook.
  - **Section E**: Integrated 6 LaTeX mathematical formulations:
    - Battery Bank Sizing for Fire Alarm Power Supplies ($C_{min} = 1.25 \cdot (I_{veille} \cdot t_{veille} + I_{alarme} \cdot t_{alarme})$ per EN 54-4 / NF S 61-936).
    - Conductor Voltage Drop on Class A SELV 24 V DC Addressable Loop ($\Delta U = 2 \rho \frac{L}{S} I_{boucle} \le 0.10 U_n$ per NF S 61-970).
    - Evacuation Acoustic Sound Pressure Level & Spatial Attenuation ($L_p(d) = L_{w0} - 20 \log_{10}(d) - A_{env}$ per EN 54-3 / NF S 32-001).
    - Clean Agent Extinguishing Mass Calculation for Novec 1230 ($W = \frac{V}{S_v} \cdot \frac{C}{100 - C}$ per NF EN 15004 / NFPA 2001).
    - Video Stream Network Bandwidth & NVR Storage Array Sizing ($Storage_{TB}$ per EN 62676-4).
    - Power over Ethernet PoE++ Switch Power Supply Sizing ($P_{PSE\_total}$ per IEEE 802.3bt).
  - **Section F**: Sourced 6 international and European standards:
    - EN 54 / NF S 61-931 (Fire detection and fire alarm systems / SSI).
    - ISO/IEC 11801 / TIA-568.2-D (Generic cabling for customer premises).
    - EN 62676 / IEC 62676 (Video surveillance systems for use in security applications).
    - IEC 60839-11-1 (Electronic access control systems).
    - ISO 16484-5 / BACnet (Building automation and control systems).
    - NF EN 15004-1 / NFPA 2001 (Fixed firefighting systems - Gas extinguishing systems).

### Domain 9 (D09) - Artificial Intelligence & Advanced Power Technologies Transformation
- Completely overhauled pedagogical framework in `domainPedagogicalContentRegistry.ts`:
  - **Section A**: Formulated hybrid physics-AI boundaries, high-resolution synchrophasor telemetry (PMU 50 frames/s GPS/PTP per IEEE C37.118), transformer DGA chromatography, and physics-regularized loss functions.
  - **Section B**: Documented 5 canonical AI & advanced power technologies architectures:
    1. **Jumeau Numérique Thermique & Diagnostic DGA par Réseaux Neuronaux (Centrale de Songloulou 384 MW & Postes HTB)** (Photoacoustic multi-gas, GaAs optical sensors, neural Duval 1/4/5, IEC 60076-7 thermal differential ODE).
    2. **Système de Surveillance Grand Réseau WAMS par Synchrophaseurs PMU (Interconnexion RIS-RIN Cameroun 225 kV)** (GPS PMUs, PDC data concentrators, real-time angular stability margin, RoCoF swing equation).
    3. **Prévision Neuronale Hybride Solaire & Pilotage Prédictif de Rampe BESS (Centrale Solaire de Maroua/Guider 15 MWc)** (Deep LSTM networks, all-sky cameras, 4-quadrant BESS closed-loop ramp control).
    4. **Sonde de Détection d'Intrusions Cyber-Physiques & IA Comportementale OT (Poste Numérique d'Oyomabang 225 kV)** (Deep Packet Inspection on IEC 61850 GOOSE/MMS, unsupervised anomaly detection, MITRE ATT&CK for ICS).
    5. **Détection d'Anomalies de Comptage & Pertes Non-Techniques par Forêts d'Isolement (Réseau AMI ENEO Douala & Yaoundé)** (Multivariate Isolation Forest processing 500,000 smart STS/AMI meters, automated tamper dispatching).
  - **Section C**: Added 6 core AI and advanced power system apparatus with authentic equipment registry citations:
    - Online Multi-gas DGA Monitor & AI Duval Triangle Health Index (`eq-exp-dga-online-monitor`).
    - Synchrophasor Measurement Unit PMU & Wide-Area Stability Terminal (`eq-exp-pmu-synchrophasor`).
    - Hardened Industrial OT Network Switch & Cyber-Physical IDS Probe (`eq-exp-switch-iec62443`).
    - Autonomous Grid Inspection Drone with Radiometric Thermal Camera (`eq-exp-drone-radiometric`).
    - Ruggedized Industrial Edge AI Compute Gateway for Smart Substations (`eq-exp-edge-ai-gateway`).
    - Smart Metering Data Concentrator Unit DCU & Anti-Tamper Analyzer (`eq-exp-ami-concentrator`).
  - **Section D**: Expanded methodology to 7 sequential engineering lifecycle phases:
    1. Business Use-Case Framing, Data Discovery & AI Readiness Assessment per NIST AI RMF.
    2. High-Frequency Sensor Deployment, Precision PTP Timing & OT Field Network.
    3. Data Cleaning, Expert Failure Tagging & Data Lake Ingestion via Apache Kafka.
    4. Physics-Informed Model Architecture, Training & Loss Function Formulation (PINN).
    5. Backtesting & Validation on Historical Grid Incidents (Song Loulou Trips, RIN Islanding).
    6. Containerized Edge/Cloud Deployment & SCADA/EMS Real-Time Integration.
    7. Continuous Model Drift Monitoring, Retraining Pipelines & MLOps Governance.
  - **Section E**: Integrated 6 LaTeX mathematical formulations:
    - Physics-Informed Neural Network (PINN) AC Power Flow Loss Function ($\mathcal{L}_{\text{PINN}} = \mathcal{L}_{\text{data}} + \lambda_P \sum |P_i - V_i \sum V_j (G_{ij}\cos\theta_{ij} + B_{ij}\sin\theta_{ij})|^2$).
    - WAMS Wide-Area Angular Stability & Initial Rate of Change of Frequency ($\text{RoCoF} = \frac{f_0}{2H} \frac{\Delta P}{S_n}$).
    - Duval Triangle 1 Relative Gas Concentration Coordinates for DGA Diagnostics ($\%CH_4, \%C_2H_4, \%C_2H_2$ per IEC 60599).
    - Differential Hot-Spot Temperature Model & Relative Aging Rate ($V_{\text{rel}} = 2^{(\theta_h - 110)/6}$ per IEC 60076-7).
    - Solar & Wind Generation Forecast Error Metric & RMSE Normalization ($\text{RMSE}, \text{nRMSE}\%$ per IEC 61724-1).
    - Multivariate Isolation Forest Anomaly Score for AMI Non-Technical Losses ($s(x, n) = 2^{-\mathbb{E}(h(x))/c(n)}$).
  - **Section F**: Sourced 6 international normative standards:
    - IEEE Std C37.118.1 / C37.118.2 (Synchrophasor measurements and data transfer for power systems).
    - IEC 60076-7 / IEEE C57.91 (Loading guide for mineral-oil-immersed power transformers).
    - IEC 60599 / IEEE C57.104 (Guide for the interpretation of dissolved gases analysis DGA).
    - IEC 62443 / MITRE ATT&CK for ICS (Security for industrial automation and control systems).
    - ISO 10816-3 / ISO 20816-2 (Mechanical vibration evaluation on non-rotating parts).
    - IEC 61724-1 / IEEE Std 2800-2022 (PV system performance monitoring and grid interconnection).

### Domain 10 (D10) - Energy Storage & Charging Systems Transformation
- Completely overhauled pedagogical framework in `domainPedagogicalContentRegistry.ts`:
  - **Section A**: Formulated energy storage electrotechnical boundaries (1 500 V DC bus, 30 kV MV / 400 V LV grid coupling), 4-quadrant bidirectional PCS conversion, cell-level BMS telemetry, and IT / TN-S earthing isolation.
  - **Section B**: Documented 5 canonical storage and charging architectures:
    1. **Système de Stockage BESS Conteneurisé Haute Tension 1 500 V DC avec Convertisseur Grid-Forming (Centrale de Maroua/Guider 15 MWc / 20 MWh)** (Prismatic LFP, liquid cooling, VSM synthetic inertia, Novec 1230 fire suppression).
    2. **Station de Transfert d'Énergie par Pompage STEP Hydraulique Réversible (Complexe de Retenue Sanaga / Nachtigal)** (Reversible Francis pump-turbines, DFIG motor-generators, 100–300 MW peaking capacity).
    3. **Micro-Réseau Hybride Solaire PV + Stockage BESS + Groupes Diesel (Site Isolé du Grand Nord Cameroun)** (30 kV AC bus, microgrid EMS, master Grid-Forming inverters, 95% solar penetration).
    4. **Hub de Recharge Ultra-Rapide Haute Puissance IRVE 350 kW HPC avec Stockage Tampon BESS (Corridor Autoroutier Douala–Yaoundé)** (Liquid-cooled 500 A dispensers, 500 kWh stationary buffer shaving peak grid demand).
    5. **Système de Stockage Distribué Commercial & Industriel (C&I) en Autoconsommation Optimisée (Usine Brassico / Agroalimentaire Douala)** (400 V TGBT coupling, automated peak shaving, sub-16 ms UPS transfer).
  - **Section C**: Added 6 core storage and charging apparatus with authentic equipment registry citations:
    - Utility-Scale Containerized BESS 5 MW / 10 MWh 1,500 V DC LiFePO4 (`eq-exp-bess-container-5mw`).
    - Bidirectional Grid-Forming Power Conversion System PCS 2,500 kVA (`eq-exp-grid-forming-inv`).
    - High-Power EV Charging Dispenser 350 kW Liquid-Cooled CCS Combo 2 (`eq-exp-ev-hpc-350kw`).
    - Reversible Francis Pump-Turbine & Motor-Generator 150 MW / 225 kV (`eq-exp-psh-pump-turbine`).
    - Master Battery Management System & Cluster Energy Management System (`eq-exp-bms-master-controller`).
    - Containerized Liquid Cooling Chiller & Battery Thermal Management Unit (`eq-exp-bess-liquid-chiller`).
  - **Section D**: Expanded methodology to 7 sequential engineering lifecycle phases:
    1. Feasibility Study, Hourly Load Profiling & Storage Technology Selection (LCOS).
    2. Energy/Power Sizing (MWh/MW), C-Rate Optimization & Dynamic Simulation.
    3. Detailed Electrical Engineering, Single-Line Diagrams & Thermal Runaway Mitigation (NFPA 855).
    4. Factory Container Assembly, 1,500 V DC Rack Wiring & BMS/PCS Factory Acceptance Testing.
    5. Civil Works, Container Foundation Slabs, MV Substation Connection & Earthing Grid.
    6. Site Commissioning, Grid-Forming Droop Validation, Fault Ride-Through & Black Start.
    7. Commercial Operation, Predictive EMS Dispatch, SOH Degradation Tracking & Second-Life.
  - **Section E**: Integrated 6 LaTeX mathematical formulations:
    - Utility BESS Nominal Energy Capacity Sizing Formulation ($E_{\text{nom}} = \frac{P_{\text{charge}} \cdot t_{\text{autonomie}}}{\text{DoD} \cdot \eta_{\text{PCS}} \cdot \eta_{\text{bat}} \cdot (1 - \text{Deg}_{\text{EOL}})}$ per IEC 62933-2-1).
    - Pumped-Storage Hydropower (PSH) Generating Power & Stored Energy Capacity ($P_{\text{turb}} = \rho g Q H_{\text{net}} \eta_{\text{turb}}$, $E_{\text{hyd}}$).
    - Active Power-Frequency Droop & Virtual Synchronous Machine Inertia ($f - f_0 = -k_p (P - P_0) - \frac{2 H_{\text{synth}}}{f_0} \frac{df}{dt}$ per IEEE Std 2800 / VSM).
    - Comprehensive BESS Round-Trip Efficiency Model ($\text{RTE} = \frac{E_{\text{décharge}}}{E_{\text{charge}}}$ per IEC 62933-2-1).
    - Semi-Empirical Capacity Fade & Cyclic Aging Model for LFP Cells ($Q_{\text{perte}}\% = A \cdot \exp(-\frac{E_a}{R T}) \cdot (\text{C-rate})^\alpha \cdot (\text{DoD})^\beta \cdot N_{\text{cycles}}^\gamma$).
    - Power Demand Sizing & Simultaneity Factor for Multi-Bay HPC EV Hub ($P_{\text{réseau}} = (\sum P_{\text{nom}}) \cdot k_s \cdot \frac{1}{\eta} - P_{\text{BESS}}$ per IEC 61851-23).
  - **Section F**: Sourced 6 international and normative standards:
    - IEC 62933-2-1 / IEC 62933-5-2 (Electrical energy storage systems).
    - IEEE Std 2800-2022 / IEEE 1547 (Grid interconnection of inverter-based resources & grid-forming).
    - IEC 61851-1 / IEC 61851-23 (Electric vehicle conductive charging system - DC HPC).
    - NFPA 855 / UL 9540A (Standard for the installation of stationary energy storage systems & fire safety).
    - IEC 62898-1 / IEC 62898-2 (Microgrids planning, specification and stability control).
    - NF C 15-100 Part 7-722 / ISO 15118 (EV charging installations & Vehicle-to-Grid V2G).

### Domain 11 (D11) - Protection, Measurements & System Studies Transformation
- Completely elevated pedagogical framework in `domainPedagogicalContentRegistry.ts` from 78% baseline to 97% master standard:
  - **Section A**: Formulated protection boundaries (CT/VT secondaries 1 A/5 A and 100 V/110 V, IEC 61850-9-2 LE / IEC 61869-9 Sampled Values at 4,000 / 4,800 Hz, sub-80 ms total fault clearance, high-speed solid-state trip contacts, COMTRADE oscillographic recording, and earthing-coordinated residual protection).
  - **Section B**: Documented 5 canonical protection architectures:
    1. **Protection Différentielle de Ligne 225 kV & Distance Numérique (ANSI 87L / 21/21N)** (Optical dual-channel differential on OPGW, 4-zone quadrilateral distance reach, POTT/PUTT teleprotection, Nachtigal-Yaoundé and Mangombé-Oyomabang backbones).
    2. **Protection Différentielle de Bloc Générateur-Transformateur (ANSI 87G / 87T / 87U)** (Dual-slope percentage restraint, 2nd harmonic inrush blocking at 15%, 5th harmonic overexcitation restraint, automatic YNd11 vector group compensation for Nachtigal 7x60 MW units).
    3. **Protection Différentielle Haute Vitesse de Jeu de Barres Numérique (ANSI 87B)** (Distributed bay-unit / central-unit architecture, cycle-by-cycle CT saturation detection algorithm, sub-15 ms selective trip of faulted bus sections up to 32 bays).
    4. **Coordination Sélective Ampèremétrique & Chronométrique HTA (ANSI 50/51 - 50N/51N)** (Standard IEC IDMT curves, chronometric time grading with Δt = 300 ms between incomers, feeders, and downstream reclosers for ENEO 30 kV / 15 kV networks).
    5. **Protection Terre Directive Réseau à Neutre Compensé / Impédant (ANSI 67N / Wattmétrique)** (Zero-sequence active power computation P0 = 3·V0·I0·cos(φ0), open-delta VT and CBCT toroid measurement, sensitive earth-fault clearance in impedance/Petersen grounded grids).
  - **Section C**: Added 6 core protection and measurement apparatus with authentic equipment registry citations:
    - Multifunctional Protection Numerical IED SIPROTEC 5 / MiCOM P643 (`eq-exp-relay-ied-61850`).
    - HV 225 kV Protection Instrument Current Transformer 5P20 / TPX (`eq-exp-ct-225k`).
    - 225 kV Capacitor Voltage Transformer with PLC Coupling CVT (`eq-exp-vt-225k`).
    - Universal Secondary Injection Protection Test Set Omicron CMC 356 (`eq-test-set-omicron`).
    - Continuous Trip Circuit Supervision & Lockout Relay ANSI 74TC / 86 (`eq-exp-trip-circuit-relay`).
    - Substation Process Bus Stand-Alone Merging Unit SAMU IEC 61850-9-2 LE (`eq-exp-merging-unit-61850`).
  - **Section D**: Expanded protection engineering methodology to 7 sequential phases:
    1. Protection Philosophy & Functional Specification (Main 1 / Main 2 dual-redundancy, unit vs backup roles, preliminary trip matrix).
    2. Max & Min Short-Circuit Fault Calculations (IEC 60909 subtransient Ik"max and Ik"min modeling under DIgSILENT / ETAP).
    3. Current Transformer Sizing & Knee-Point Saturation Check (Vk calculation per IEC 61869-2, Ktd transient factor, burden check).
    4. Relay Setting Schedule & TCC Coordination Curves (Analytical Is, TMS, distance Z1/Z2/Z3/Zrev, differential slopes K1/K2, selectivity grading).
    5. IED Configuration (CID/IID) & CFC Automation Logic Programming (DIGSI/Easergy Studio, CFC interlocks, GOOSE teleprotection mapping).
    6. Secondary Injection Testing & GPS-Synchronized End-to-End Trials (Omicron CMC 356 metrology, GPS-synchronized 87L testing).
    7. Commissioning, Primary Injection Tests & COMTRADE Post-Mortem Analysis (Energization, primary directional check, breaker trip, transient post-mortem).
  - **Section E**: Integrated 6 LaTeX mathematical formulations:
    - Universal Inverse Definite Minimum Time Equation ($t = \text{TMS} \cdot \left[ \frac{k}{(I / I_s)^\alpha - 1} \right]$ per IEC 60255-151).
    - Protection Current Transformer Saturation Knee-Point Sizing ($V_k \ge K_{td} \cdot \left( \frac{I_{k,\max}}{I_{1n}} \right) \cdot (R_{ct} + 2 R_L + R_b)$ per IEC 61869-2).
    - Percentage-Biased Dual-Slope Differential Operating Characteristic ($I_{diff} = |\vec{I}_1 + \vec{I}_2|$, $I_{rest} = \frac{|\vec{I}_1| + |\vec{I}_2|}{2}$, $K_1/K_2$ slopes).
    - Distance Protection Zone Reach Settings for HV Transmission Lines ($Z_1 = 0.85 Z_L$, $Z_2 = Z_L + 0.50 Z_{L,\text{next}}$, $Z_3 = 1.20 (Z_L + Z_{L,\text{next}})$ per IEEE C37.113).
    - Physical Breakdown of Chronometric Discrimination Time Margin ($\Delta t = t_{cb} + t_{overshoot} + t_{safety} + \epsilon_{meas} \approx 300\text{ ms}$).
    - Directional Earth Fault Active Power Detection in Compensated Grids ($P_0 = 3 \cdot V_0 \cdot I_0 \cdot \cos(\varphi_0 - \varphi_{\max}) \ge P_{0,\text{pickup}}$).
  - **Section F**: Sourced 6 international and normative standards:
    - IEC 60255-151 (Measuring relays and protection equipment - Over/under current protection).
    - IEC 60255-187-1 (Differential protection for motors, generators, and transformers).
    - IEC 61869-2 & IEC 61869-3 (Instrument transformers - Current and inductive voltage transformers).
    - IEEE C37.113 (IEEE Guide for protective relay applications to transmission lines).
    - IEC 60909-0 (Short-circuit currents in three-phase A.C. systems).
    - SONATREL Protection Grid Code (Cameroon transmission system protection and measurement specifications).

### Domain 12 (D12) - Substation Automation Systems (SAS) Transformation
- Completely elevated pedagogical framework in `domainPedagogicalContentRegistry.ts` to 97% master standard:
  - **Section A**: Formulated SAS boundaries (binary inputs 48/110 Vdc, 100Base-FX optical fibers, SV sampling 4,800 Hz, sub-3ms GOOSE latency, PRP zero-failover, SBO two-step control, and 1 ms SOE chronological resolution).
  - **Section B**: Documented 5 canonical automation architectures:
    1. **Bus de Station Numérique CEI 61850-8-1 (MMS Client/Serveur & GOOSE Tranche)** (1 Gbps dual-redundant ring/star, event-driven and cyclic MMS, sub-3ms GOOSE interlocking, Nachtigal/Oyomabang substations).
    2. **Poste Numérique Intégral avec Bus de Processus Optique (Process Bus - Sampled Values)** (Outdoor switchyard copper-free SAMU merging units, optical SV 4,800 Hz per IEC 61869-9 / IEC 61850-9-2 LE, CT open-circuit hazard elimination).
    3. **Passerelle de Téléconduite RTU Redondante & Interfaçage Dispatching National (CEI 60870-5-104)** (Dual hot-standby industrial controllers, protocol normalization, encrypted IPsec telecontrol to SONATREL Mangombé National Control Center).
    4. **Système d'Inter-verrouillage Topologique de Sécurité de Manœuvre (Bay & Station Interlocking)** (Decentralized Boolean logic, zero-current breaker verification I < 0.02 In, ground switch live-bus lock, on-load busbar transfer sequence).
    5. **Infrastructure Réseau Haute Disponibilité PRP / HSR & Synchronisation PTP IEEE 1588** (Parallel Redundancy Protocol PRP zero-drop dual-LAN A/B, IEEE 1588 PTP Power Profile sub-microsecond Grandmaster clock).
  - **Section C**: Added 6 core substation automation apparatus with authentic equipment registry citations:
    - Numerical Bay Control Unit BCU SIPROTEC 6MD85 / MiCOM C264 (`eq-exp-bcu-bay-controller`).
    - Hardened Substation Managed Ethernet Switch IEC 61850-3 Ruggedcom RS900 / Cisco IE 4000 (`eq-exp-rugged-switch-61850`).
    - Modular Dual-Redundant Substation RTU & SCADA Gateway ABB RTU560 / MicroSCADA (`eq-exp-rtu-gateway-scada`).
    - Dual-GNSS PTP Grandmaster Substation Clock Meinberg LANTIME M1000 (`eq-exp-ptp-grandmaster`).
    - Substation SCADA Server & Hardened Touch Operator HMI Zenon / MicroSCADA (`eq-exp-station-hmi-server`).
    - Substation Auxiliary 110 Vdc Charger & Battery Bank 400 Ah (`eq-exp-substation-ups-battery`).
  - **Section D**: Expanded SAS engineering methodology to 7 sequential phases:
    1. Signal & Information Exchange Matrix (IO List & Addressing, TS/TM/TC/OLTC).
    2. Standardized SCL System Engineering (SSD, ICD, SCD, CID per IEC 61850-6).
    3. Network Topology Design, VLAN Segregation & PRP/HSR Architecture (Dual-star LAN A/B, IEEE 802.1Q/p, burst storm simulation).
    4. Interlocking Logic Implementation & Bay Automation Programming (IEC 61131-3 CFC, safety interlocks, load shedding).
    5. Factory Acceptance Testing (FAT) & Network Packet Stress Analysis (1,000 events/second burst test, zero frame drop).
    6. Site Acceptance Testing (SAT) & End-to-End Switchgear Verification (Live physical breaker/disconnector operations, 1 ms SOE audit).
    7. National EMS/SCADA Uplink Commissioning & Industrial Handover (IEC 60870-5-104 to SONATREL Mangombé, SBO handshake, commercial handover).
  - **Section E**: Integrated 6 LaTeX mathematical formulations:
    - GOOSE Transmission Latency Budget ($T_{\text{transit}} = t_{\text{encaps}} + \sum t_{\text{sw},i} + \frac{L}{v_{\text{prop}}} + t_{\text{decaps}} \le 3\text{ ms}$ per IEC 61850-5).
    - GOOSE Retransmission Timing Sequence with Exponential Backoff ($T_i = \min(T_0 \cdot 2^i, T_{\max})$).
    - Substation Ethernet LAN Bandwidth Sizing under Worst-Case Event Burst ($BW_{\text{total}} \le 0.40 \cdot BW_{\text{link}}$).
    - Substation Auxiliary Battery Bank Capacity Sizing per IEEE Std 485 ($C_{\text{req}} = \frac{1}{K_t \cdot K_c} \cdot \left[ \sum \frac{I_p - I_{p-1}}{R_p} \right] \cdot K_{\text{age}} \cdot K_{\text{temp}}$).
    - Non-Volatile Buffered Report Control Block (BRCB) Memory Sizing ($N_{\text{buffer}} = \lambda_{\text{events}} \cdot t_{\text{outage}} \cdot S_{\text{entry}}$).
    - Algorithmic Formulation of Topological Safety Interlocking Rules ($E_{\text{permis}}(\text{DS}_k) = \overline{I_{\text{flow}}(\text{CB})} \land \overline{U_{\text{bus}}(\text{ES})} \land \prod C_{j,k}$).
  - **Section F**: Sourced 6 international and normative standards:
    - IEC 61850-8-1 (MMS client/server and GOOSE mapping).
    - IEC 61850-9-2 & IEC 61869-9 (Sampled Values optical process bus).
    - IEC 62439-3 (Industrial communication networks - PRP & HSR high-availability redundancy).
    - IEC 60870-5-104 (Telecontrol equipment and systems - Network access for IEC 60870-5-101 using TCP/IP).
    - IEEE Std 485 (Recommended practice for sizing lead-acid batteries for stationary applications).
    - IEC 62351 Parts 3/5/6/7 (Data and communications security for power systems management and SCADA).

### Domain 13 (D13) - Communications & Operational Technology (OT) Transformation
- Populated previously missing pedagogical framework in `domainPedagogicalContentRegistry.ts` directly at 97% master standard:
  - **Section A**: Formulated OT communication boundaries (single-mode G.652D OPGW fibers at 1,310/1,550 nm, high-voltage PLC carrier at 40–500 kHz, IEEE C37.94 interfaces, sub-50ms APS protection switching, and symmetrical teleprotection channels with jitter < 0.2 ms).
  - **Section B**: Documented 5 canonical communication and OT architectures:
    1. **Dorsale Optique Nationale OPGW & Multiplexage Déterministe SDH / MPLS-TP** (48-fiber OPGW on 225 kV towers, deterministic MPLS-TP/SDH transport, sub-50ms APS failover, Nachtigal-Yaoundé and Songloulou-Douala corridors).
    2. **Système de Téléprotection Dédié pour Protection Différentielle de Ligne 87L (C37.94 & E1)** (Direct optical IEEE C37.94 2 Mbps channel, strict delay asymmetry < 0.2 ms, Mangombé-Oyomabang 225 kV link).
    3. **Liaison de Secours par Courants Porteurs en Ligne Haute Tension (CPL / PLC)** (40–500 kHz HF carrier over 225 kV phases, line traps, capacitive coupling CVT, autonomous backup surviving severed OPGW).
    4. **Architecture de Cybersécurité OT en Zones & Conduits selon CEI 62443 / Modèle de Purdue** (4-tier industrial segmentation, hardened DPI firewalls decoding IEC 60870-5-104/MMS/GOOSE, SL-3 target security level).
    5. **Réseau Sans-Fil Privé LTE / Faisceaux Hertziens pour Automatisation MT (FLISR)** (Sub-gigahertz private radio network, pole-mounted automated switches IACM, ENEO 30 kV / 15 kV automated fault restoration in < 60 s).
  - **Section C**: Added 6 core OT communication and cybersecurity apparatus with authentic equipment registry citations:
    - Hardened Multi-Service Utility Transport Node SDH/MPLS-TP ABB FOX615 / Cisco NCS (`eq-exp-sdh-mpls-node`).
    - Dedicated High-Speed Digital Teleprotection Terminal RFL 9745 / Siemens 7XP24 (`eq-exp-teleprotection-interface`).
    - 225 kV High-Voltage Wave Trap (Line Trap) & Line Matching Unit LMU Trench / Arteche (`eq-exp-line-trap-plc`).
    - Hardened Substation Security Gateway & DPI Industrial Firewall Fortinet FortiGate Rugged (`eq-exp-ot-firewall-dpi`).
    - Tower-Mounted Stainless Steel OPGW Fiber Splice Closure AFL / CommScope (`eq-exp-opgw-splice-box`).
    - Passive OT Substation Intrusion Detection System Sensor Claroty / Nozomi Guardian (`eq-exp-ot-ids-sensor`).
  - **Section D**: Expanded OT engineering methodology to 7 sequential phases:
    1. Telecom Master Plan & Critical OT Traffic Mapping (Latency budgets, bandwidth sizing, OPGW/PLC/microwave allocation).
    2. OPGW Optical Link Budget Calculation & Dispersion Modeling (Linear attenuation, 3 dB maintenance headroom, long-reach optics).
    3. Cybersecurity Zoning & Conduit Architecture Design (Purdue model, threat attack surfaces, SL-3 rulesets).
    4. Deterministic MPLS-TP Configuration & Quality of Service (QoS) Tuning (Pseudowires, strict priority queueing, ITU-T G.8131 APS).
    5. Factory Acceptance Testing (FAT) & Fiber Cutover Simulation (80 km optical spools, asymmetry auditing, sub-50ms APS recovery).
    6. Tower Installation, OTDR Reflectometry & OPGW Fusion Splicing (Controlled tension pulling, core-alignment fusion < 0.05 dB, bidirectional OTDR).
    7. Site Acceptance Cybersecurity Audit, Penetration Testing & Handover (IEC 62443-3-3 compliance, DMZ pen-testing, commercial handover).
  - **Section E**: Integrated 6 LaTeX mathematical formulations:
    - Cumulative Optical Attenuation Link Budget Calculation along OPGW Spans ($A_{\text{total}} = \alpha L + N_{\text{splice}} A_{\text{splice}} + N_{\text{conn}} A_{\text{conn}} + M_{\text{safety}} \le P_{\text{tx}} - S_{\text{rx}}$ per ITU-T G.652).
    - Maximum Allowable Round-Trip Propagation Delay Asymmetry for 87L Relays ($\Delta t_{\text{asym}} \le \frac{\epsilon_{\text{phase}}}{2 \pi f_n} \approx 0.20\text{ ms}$).
    - Protocol Framing Overhead and Bandwidth Impact of PRP Redundancy Control Trailer RCT ($S_{\text{PRP\_frame}} = S_{\text{payload}} + 28$, $\text{Overhead}\% \approx 2.6\%$).
    - Clock Offset and Network Propagation Delay Compensation in IEEE 1588 PTP ($\text{Offset} = \frac{(t_2 - t_1) - (t_4 - t_3)}{2}$, $\text{Delay}_{\text{prop}}$).
    - Net Available Throughput and Cryptographic Overhead for Substation IPsec Tunnels ($BW_{\text{utile}} = BW_{\text{brut}} \cdot \frac{\text{MTU} - S_{\text{overhead}}}{\text{MTU}}$).
    - Quantitative Cyber-Physical Risk Assessment for High-Voltage Substations ($R_{\text{cyber}} = \text{Menace} \times \text{Vulnérabilité} \times \text{Impact}_{\text{grid}}$, $\text{SL}_{\text{target}}$ per IEC 62443).
  - **Section F**: Sourced 6 international and normative standards:
    - IEC 62443-3-2 & IEC 62443-3-3 (Security for industrial automation and control systems - Zones & conduits and system security).
    - IEC 62351 Parts 3/5/6/7 (Data and communications security for power utility protocols).
    - IEEE C37.94 (Optical fiber interface between teleprotection and multiplexer equipment).
    - IEC 60834-1 (Teleprotection equipment of power systems - Performance and testing).
    - ITU-T G.652 & G.8131 (Single-mode optical fiber characteristics & linear protection switching for MPLS-TP).
    - IEEE Std 1138 (Testing and performance for optical ground wire OPGW for utility lines).

### Domain 14 (D14) - Power Quality & Electromagnetic Compatibility (EMC) Transformation
- Populated previously missing pedagogical framework in `domainPedagogicalContentRegistry.ts` directly at 97% master standard:
  - **Section A**: Formulated power quality boundaries (harmonic orders 2 to 50, THDu ≤ 5% per IEC 61000-2-4 Class 2, dynamic reactive target cos φ ≥ 0.96, Akagi instantaneous p-q active filtering, and high-frequency meshed EMC grounding).
  - **Section B**: Documented 5 canonical power quality and harmonic mitigation architectures:
    1. **Batterie de Condensateurs Shunt HTA / BT avec Selfs d'Anti-Résonance (Gradins Détunés)** (Automatically staged steps 1:2:2:4, three-phase detuning reactors p = 7% 189 Hz or p = 14% 134 Hz, parallel LC resonance prevention for Douala-Bassa / Bonabéri industries).
    2. **Filtre Actif de Puissance Shunt (SAPF / APF) à Technologie IGBT/SiC & Algorithme p-q d'Akagi** (4-quadrant 20 kHz PWM inverter, wideband Rogowski measurement, sub-5ms anti-phase harmonic cancellation from 45% to < 3% THDi).
    3. **Compensateur Statique Réversible de Réseau HTB 225 kV (STATCOM MMC & SVC TCR/TSC)** (Modular Multilevel Converter MMC with floating capacitors delivering ±50 to ±200 MVAr in < 10 ms, transmission voltage stabilization at Nomayos/Mangombé).
    4. **Conditionneur Numérique Unifié de Qualité de Réseau Série-Shunt (UPQC & DVR Creux de Tension)** (Series inverter injecting restoring vector voltage in < 2 ms for sags up to 70% depth, combined with shunt harmonic/PF filter).
    5. **Infrastructure CEM Intégrée, Filtres de Ligne RFI & Topologie de Masse Maillée (CEI 61000-5-2)** (Physical cable segregation into 4 disturbance classes, continuous grounded metallic trays, 360° shield bonding, and HF mesh ground grid).
  - **Section C**: Added 6 core power quality and EMC apparatus with authentic equipment registry citations:
    - Class A Power Quality & Energy Analyzer Chauvin Arnoux CA 8336 / Fluke 435-II (`eq-exp-pqa-class-a`).
    - MV 24 kV Detuned Anti-Harmonic Reactor Trench / Schneider Electric (`eq-exp-detuned-reactor-mv`).
    - Shunt Active Harmonic Filter (AHF) 400 V 300 A Schneider AccuSine / Danfoss (`eq-exp-active-harmonic-filter`).
    - High-Voltage STATCOM MMC Power Converter Siemens SVC PLUS / Hitachi Energy (`eq-exp-statcom-inverter-chain`).
    - Industrial 3-Phase RFI/EMI Line Noise Filter Schaffner FN 3280 / TDK Epcos (`eq-exp-emc-line-filter`).
    - Dynamic Voltage Restorer (DVR) Series Sag Mitigator ABB PCS100 / Schneider (`eq-exp-voltage-sag-mitigator`).
  - **Section D**: Expanded power quality engineering methodology to 7 sequential phases:
    1. Site Power Quality Measurement Campaign & Metrological Audit (IEC 61000-4-30 Class A, 7-day logging, THD/sags/flicker).
    2. Spectral Analysis, THD Calculation & LC Anti-Resonance Simulation (ETAP/DIgSILENT harmonic scan, detuning factor p determination).
    3. Reactive Power Sizing & Capacitor Step Specification (ΔQ sizing for target cos φ 0.96, staged progression, dielectric overvoltage).
    4. Harmonic Filter Engineering (Detuned passive reactors p=7%/14%, Class H thermal rating, active filter RMS/peak current sizing).
    5. EMC Site Layout, Cable Segregation & Meshed Ground Grid Design (IEC 61000-5-2 layout, 4-class segregation, 360° shield bonding).
    6. Commissioning Tests, Inrush Transient Verification & Harmonic Audit (Oscillographic inrush supervision, THD attenuation validation).
    7. Permanent Online Monitoring, Thermal Auditing & Grid Code Compliance (SCADA/EMS PQA telemetry, automated utility limit alarms).
  - **Section E**: Integrated 6 LaTeX mathematical formulations:
    - Total Harmonic Voltage and Current Distortion Formulation ($THD_u = \frac{\sqrt{\sum U_h^2}}{U_1} \times 100\%$, $THD_i$ per IEC 61000-2-4 / IEEE 519).
    - Parallel LC Anti-Resonance Frequency & Detuning Factor per IEC 61642 ($f_r = f_1 \sqrt{\frac{S_{sc}}{Q_c}}$, $p = (f_1/f_r)^2$).
    - Residual Voltage and Depth Calculation during System Voltage Sags ($U_{\text{sag}}\% = (1 - \frac{Z_{\text{source}}}{Z_{\text{source}} + Z_{\text{défaut}}}) \times 100\%$ per IEC 61000-4-11).
    - True Power Factor Decomposition under Distorted Harmonic Conditions ($PF_{\text{true}} = \frac{\cos \varphi_1}{\sqrt{1 + THD_i^2}}$).
    - Transformer Harmonic Heating K-Factor Calculation per IEEE C57.110 ($K = \sum I_h^2 h^2$).
    - Reactive Power Compensation Sizing for Power Factor Correction ($\Delta Q = P \cdot (\tan \varphi_1 - \tan \varphi_2)$).
  - **Section F**: Sourced 6 international and normative standards:
    - IEC 61000-4-30 Class A (Power quality measurement methods).
    - IEEE Std 519-2022 (Harmonic control in electric power systems).
    - IEC 61000-2-4 (Compatibility levels in industrial plants for low-frequency conducted disturbances).
    - IEC 61642 (Industrial a.c. networks affected by harmonics - Application of filters and shunt capacitors).
    - IEEE Std 1159 (Monitoring electric power quality).
    - IEEE C57.110 (Establishing transformer capability supplying non-sinusoidal load currents).
