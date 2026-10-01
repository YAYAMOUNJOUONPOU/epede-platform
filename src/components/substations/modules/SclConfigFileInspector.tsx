// src/components/substations/modules/SclConfigFileInspector.tsx
import React, { useState } from 'react';
import {
  SUBSTATION_SCL_IEDS,
  SUBSTATION_GOOSE_CONTROL_BLOCKS,
  SUBSTATION_SAV_CONTROL_BLOCKS,
  SclIed,
  SclLogicalNode
} from '../data/sclData';
import {
  FileCode2,
  Server,
  Layers,
  Cpu,
  Download,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  Network,
  Share2,
  ShieldAlert,
  Search,
  Zap,
  Info
} from 'lucide-react';

interface SclConfigFileInspectorProps {
  locale: 'fr' | 'en';
}

export const SclConfigFileInspector: React.FC<SclConfigFileInspectorProps> = ({ locale }) => {
  const [selectedIed, setSelectedIed] = useState<SclIed>(SUBSTATION_SCL_IEDS[0]);
  const [selectedLn, setSelectedLn] = useState<SclLogicalNode>(
    SUBSTATION_SCL_IEDS[0].logicalDevices[0].logicalNodes[0]
  );
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'IED_TREE' | 'XML_PREVIEW' | 'COMMUNICATION_MAP'>('IED_TREE');

  // Filter IEDs based on search
  const filteredIeds = SUBSTATION_SCL_IEDS.filter((ied) => {
    const q = searchQuery.toLowerCase();
    return (
      ied.name.toLowerCase().includes(q) ||
      ied.model.toLowerCase().includes(q) ||
      ied.manufacturer.toLowerCase().includes(q) ||
      ied.logicalDevices.some((ld) =>
        ld.logicalNodes.some(
          (ln) =>
            ln.lnClass.toLowerCase().includes(q) ||
            ln.descFr.toLowerCase().includes(q) ||
            ln.descEn.toLowerCase().includes(q)
        )
      )
    );
  });

  // Generate canonical IEC 61850-6 XML / SCD code snippet
  const generateSclXml = () => {
    return `<?xml version="1.0" encoding="UTF-8"?>
<SCL xmlns="http://www.iec.ch/61850/2003/SCL" version="2007" revision="B">
  <Header id="EPEDE_BATSCHENGA_225KV" version="1.0" revision="4" toolID="EPEDE_SCL_ENGINE">
    <History>
      <Hitem version="1.0" revision="4" when="2026-09-16T10:00:00Z" who="EPEDE_AUTOMATION_ENGINEER" what="Substation SCD Configuration per IEC 61850 Ed.2"/>
    </History>
  </Header>

  <Substation name="BATSCHENGA_225KV" desc="Substation Interconnexion Nachtigal 225/400 kV">
    <VoltageLevel name="D02_225KV" nomFreq="50" numPhases="3">
      <Voltage unit="V" multiplier="k">225</Voltage>
      <Bay name="BAY_L1_LINE" desc="Line Bay Nachtigal-Batschenga">
        <ConductingEquipment name="Q0" type="CBR" desc="SF6 Circuit Breaker 245kV 40kA"/>
        <ConductingEquipment name="Q9" type="DIS" desc="Line Disconnector with Earthing Switch Q8"/>
        <ConductingEquipment name="Q1" type="DIS" desc="Busbar 1 Selector Disconnector"/>
        <ConductingEquipment name="Q2" type="DIS" desc="Busbar 2 Selector Disconnector"/>
      </Bay>
    </VoltageLevel>
  </Substation>

  <Communication>
    <SubNetwork name="StationBus_VLAN10" type="802-3">
      <ConnectedAP iedName="${selectedIed.name}" apName="AP1">
        <Address>
          <P type="IP">${selectedIed.ipAddress}</P>
          <P type="IP-SUBNET">255.255.255.0</P>
          <P type="MAC-Address">${selectedIed.macAddressGoose}</P>
          <P type="VLAN-ID">10</P>
          <P type="VLAN-PRIORITY">7</P>
        </Address>
        <GSE ldInst="PROT" cbName="gcbTrip">
          <Address>
            <P type="MAC-Address">${selectedIed.macAddressGoose}</P>
            <P type="APPID">0x0001</P>
            <P type="VLAN-ID">10</P>
            <P type="VLAN-PRIORITY">7</P>
          </Address>
        </GSE>
      </ConnectedAP>
    </SubNetwork>
  </Communication>

  <IED name="${selectedIed.name}" type="${selectedIed.type}" manufacturer="${selectedIed.manufacturer}">
    <Services>
      <DynAssociation max="16"/>
      <SettingGroups/>
      <GetDirectory/>
      <GetDataObjectDefinition/>
      <GOOSE max="16"/>
      <FileHandling/>
    </Services>
    <AccessPoint name="AP1">
      <Server>
        <Authentication none="true"/>
        <LDevice inst="${selectedIed.logicalDevices[0]?.inst || 'PROT'}">
          <LN0 lnClass="LLN0" inst="" lnType="LLN0_GEN">
            <DataSet name="dsTripOutput">
              <FCDA ldInst="PROT" lnClass="PTRC" lnInst="1" doName="Tr" daName="general" fc="ST"/>
              <FCDA ldInst="PROT" lnClass="PDIF" lnInst="1" doName="Op" daName="general" fc="ST"/>
            </DataSet>
            <GSEControl name="gcbTrip" type="GOOSE" appID="0x0001" confRev="1" datSet="dsTripOutput"/>
          </LN0>
${selectedIed.logicalDevices[0]?.logicalNodes
  .map(
    (ln) => `          <LN prefix="${ln.prefix || ''}" lnClass="${ln.lnClass}" inst="${ln.inst}" lnType="${ln.lnClass}_TYPE">
            <!-- ${ln.descEn} -->
          </LN>`
  )
  .join('\n')}
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>
</SCL>`;
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(generateSclXml());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadXml = () => {
    const xml = generateSclXml();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedIed.name}_IEC61850_SCL.scd`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* 1. Sub-tab Bar & Search Header */}
      <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('IED_TREE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'IED_TREE'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Arborescence IED & LN' : 'IED & LN Model Tree'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('XML_PREVIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'XML_PREVIEW'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Fichier SCL / SCD (.xml)' : 'SCL / SCD File (.xml)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('COMMUNICATION_MAP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSubTab === 'COMMUNICATION_MAP'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>{locale === 'fr' ? 'Cartographie GOOSE/SV' : 'GOOSE & SV Publisher/Subscriber'}</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={locale === 'fr' ? 'Rechercher IED, LN (XCBR, PTOC)...' : 'Search IED, LN (XCBR, PTOC)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0D121B] border border-[#222B38] rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* 2. Sub-tab Content Viewports */}
      {activeSubTab === 'IED_TREE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left 4 cols: IED List */}
          <div className="lg:col-span-4 bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>{locale === 'fr' ? 'Équipements IED Référencés' : 'Configured Substation IEDs'}</span>
              <span className="text-cyan-400 font-bold">{filteredIeds.length} IEDs</span>
            </h4>

            <div className="space-y-2">
              {filteredIeds.map((ied) => {
                const isSelected = selectedIed.name === ied.name;
                return (
                  <div
                    key={ied.name}
                    onClick={() => {
                      setSelectedIed(ied);
                      setSelectedLn(ied.logicalDevices[0]?.logicalNodes[0]);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                        : 'bg-[#0D121B] border-[#1E2634] hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                        <Cpu className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        {ied.name}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {ied.redundancyProtocol}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                      {locale === 'fr' ? ied.roleFr : ied.roleEn}
                    </p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2 pt-1.5 border-t border-slate-800/80">
                      <span>{ied.model}</span>
                      <span className="text-cyan-400">{ied.ipAddress}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 8 cols: Selected IED Logical Nodes & Data Objects Inspector */}
          <div className="lg:col-span-8 space-y-4">
            {/* IED Specification Header */}
            <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-4 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E2634] pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    IEC 61850-7-4 / SCL ED.2
                  </span>
                  <h3 className="text-base font-bold text-white font-mono mt-1">
                    {selectedIed.name} · {selectedIed.model}
                  </h3>
                  <p className="text-xs text-slate-400 font-sans">
                    {locale === 'fr' ? selectedIed.roleFr : selectedIed.roleEn}
                  </p>
                </div>
                <div className="text-right text-xs font-mono">
                  <span className="text-slate-400 block text-[10px]">Protocole de Redondance</span>
                  <span className="font-bold text-emerald-400">{selectedIed.redundancyProtocol} (Bumpless Failover)</span>
                </div>
              </div>

              {/* Logical Devices and Logical Nodes Tabs */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {selectedIed.logicalDevices.flatMap((ld) =>
                    ld.logicalNodes.map((ln) => {
                      const isLnSelected = selectedLn.lnClass === ln.lnClass && selectedLn.inst === ln.inst;
                      return (
                        <button
                          key={`${ld.inst}-${ln.lnClass}-${ln.inst}`}
                          type="button"
                          onClick={() => setSelectedLn(ln)}
                          className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                            isLnSelected
                              ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-md'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span className="text-white">{ln.prefix ? `${ln.prefix}.` : ''}{ln.lnClass}{ln.inst}</span>
                          <span className="ml-1.5 text-[10px] text-slate-500 font-normal">
                            ({ln.group})
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Selected Logical Node Details */}
                <div className="bg-[#0D121B] border border-[#1E2634] rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-cyan-400 font-mono">
                          LN : {selectedLn.prefix ? `${selectedLn.prefix}.` : ''}{selectedLn.lnClass}{selectedLn.inst}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          Groupe : {selectedLn.group}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans mt-0.5">
                        {locale === 'fr' ? selectedLn.descFr : selectedLn.descEn}
                      </p>
                    </div>
                  </div>

                  {/* Data Objects Table */}
                  <div className="overflow-x-auto rounded-lg border border-[#1E2634] mt-2">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-[#090D14] text-slate-400 text-[10px] uppercase border-b border-[#1E2634]">
                        <tr>
                          <th className="p-2.5">Objet de Donnée (DO)</th>
                          <th className="p-2.5">Contrainte FC</th>
                          <th className="p-2.5">Type CDC</th>
                          <th className="p-2.5">Valeur Actuelle</th>
                          <th className="p-2.5">Description CEI 61850</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1E2634]">
                        {selectedLn.dataObjects.map((dObj) => (
                          <tr key={dObj.name} className="hover:bg-slate-800/30">
                            <td className="p-2.5 font-bold text-cyan-300">{dObj.name}</td>
                            <td className="p-2.5">
                              <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px]">
                                {dObj.fc}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-400">{dObj.type}</td>
                            <td className="p-2.5 text-white font-bold">
                              {String(dObj.value)} {dObj.unit || ''}
                            </td>
                            <td className="p-2.5 text-slate-400 text-[11px] font-sans">{dObj.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Sub-tab: XML SCL/SCD Code Preview */}
      {activeSubTab === 'XML_PREVIEW' && (
        <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2634] pb-3">
            <div>
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-cyan-400" />
                <span>Extrait XML Conforme IEC 61850-6 (Substation Configuration Description)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Fichier SCD d'échange inter-constructeurs pour ingénierie de poste numérique.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyXml}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? (locale === 'fr' ? 'Copié !' : 'Copied!') : (locale === 'fr' ? 'Copier XML' : 'Copy XML')}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadXml}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{locale === 'fr' ? 'Télécharger .scd' : 'Download .scd'}</span>
              </button>
            </div>
          </div>

          <pre className="p-4 rounded-xl bg-[#0D121B] border border-[#1E2634] text-xs font-mono text-cyan-300/90 overflow-x-auto max-h-[500px] leading-relaxed select-all">
            {generateSclXml()}
          </pre>
        </div>
      )}

      {/* 3. Sub-tab: GOOSE / SV Control Blocks & Publisher/Subscriber Map */}
      {activeSubTab === 'COMMUNICATION_MAP' && (
        <div className="space-y-4">
          {/* GOOSE Publishers */}
          <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="border-b border-[#1E2634] pb-3">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Network className="w-4 h-4 text-amber-400" />
                <span>Blocs de Contrôle GOOSE (IEC 61850-8-1 GSE Control Blocks)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Diffusion multicast Ethernet sans couche IP (EtherType 0x88B8) avec priorité 802.1Q (VLAN Priority 7).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUBSTATION_GOOSE_CONTROL_BLOCKS.map((gocb) => (
                <div key={gocb.appID} className="bg-[#0D121B] border border-[#1E2634] rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">{gocb.gocbRef}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      APPID: {gocb.appID}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">
                    {locale === 'fr' ? gocb.descriptionFr : gocb.descriptionEn}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-slate-800">
                    <div className="text-slate-400">
                      MAC : <span className="text-slate-200">{gocb.macAddress}</span>
                    </div>
                    <div className="text-slate-400">
                      VLAN Priority : <span className="text-emerald-400 font-bold">{gocb.vlanPriority} (Urgent)</span>
                    </div>
                    <div className="text-slate-400">
                      T_min : <span className="text-cyan-400">{gocb.minTimeMs} ms</span>
                    </div>
                    <div className="text-slate-400">
                      T_max : <span className="text-slate-200">{gocb.maxTimeMs} ms</span>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 pt-1">
                    Abonnés (Subscribers) :{' '}
                    <span className="text-white font-bold">{gocb.subscribers.join(', ')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sampled Values Streams */}
          <div className="bg-[#090D14] border border-[#222B38] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="border-b border-[#1E2634] pb-3">
              <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Flux de Valeurs Échantillonnées (Sampled Values - IEC 61850-9-2LE / 61869-9)</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Diffusion temps réel continue (EtherType 0x88BA) cadencée à 4800 Hz / 4000 Hz pour protection et mesure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SUBSTATION_SAV_CONTROL_BLOCKS.map((svcb) => (
                <div key={svcb.svID} className="bg-[#0D121B] border border-[#1E2634] rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-400">{svcb.svID}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                      {svcb.sampleRateHz} Hz (96 éch/pér à 50Hz)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-sans">
                    {locale === 'fr' ? svcb.descriptionFr : svcb.descriptionEn}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-slate-800">
                    <div className="text-slate-400">
                      MAC Multicast : <span className="text-slate-200">{svcb.macAddress}</span>
                    </div>
                    <div className="text-slate-400">
                      VLAN ID : <span className="text-cyan-400">{svcb.vlanId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
