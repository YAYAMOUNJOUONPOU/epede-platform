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
