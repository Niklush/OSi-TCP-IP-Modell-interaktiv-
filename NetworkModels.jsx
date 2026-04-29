import { useState } from “react”;

// ═══════════════════════════════════════════════════════════
//  LAYOUT CONSTANTS
// ═══════════════════════════════════════════════════════════
const LH = 52, LG = 4, LU = 56;
const TOTAL_H = 7 * LH + 6 * LG; // 388px

// OSI center-Y for a given layer id (7 = top, 1 = bottom)
const OSI_CY = id => (7 - id) * LU + LH / 2;

// TCP/IP absolute positions (aligned to OSI groupings)
const TCP_POS = {
4: { top: 0,       height: 3 * LH + 2 * LG }, // 164 — spans OSI 7,6,5
3: { top: 3 * LU,  height: LH },               // 168 — spans OSI 4
2: { top: 4 * LU,  height: LH },               // 224 — spans OSI 3
1: { top: 5 * LU,  height: 2 * LH + LG },      // 280 — spans OSI 2,1 → h=108
};
const TCP_CY = { 4: 82, 3: 194, 2: 250, 1: 334 };
const MAPPING = [[7,4],[6,4],[5,4],[4,3],[3,2],[2,1],[1,1]];

// ═══════════════════════════════════════════════════════════
//  OSI DATA
// ═══════════════════════════════════════════════════════════
const OSI = [
{
id:7, short:“Anwendung”, name:“Anwendungsschicht”, en:“Application”,
color:”#c084fc”, pdu:“Daten”,
protocols:[
{name:“HTTP”,  info:“Port 80 – Basis des WWW; textbasiertes Request/Response-Protokoll”},
{name:“HTTPS”, info:“Port 443 – HTTP über TLS; verschlüsselte Webkommunikation”},
{name:“FTP”,   info:“Port 21/20 – Dateiübertragung (Steuer- und Datenkanal getrennt)”},
{name:“SMTP”,  info:“Port 25/587 – E-Mail versenden (Simple Mail Transfer Protocol)”},
{name:“DNS”,   info:“Port 53 – Domainname → IP-Adresse (UDP für Abfragen, TCP für Zonetransfer)”},
{name:“DHCP”,  info:“Port 67/68 – automatische IP-Vergabe an Clients im Netz”},
{name:“SNMP”,  info:“Port 161 – Netzwerkgeräte überwachen und steuern”},
{name:“SSH”,   info:“Port 22 – verschlüsselter Fernzugriff auf Server”},
],
devices:[“Application Gateway”,“Proxy-Server”,“Web Application Firewall”],
function:“Stellt Netzwerkdienste direkt für Endanwendungen bereit. Browser, Mail-Clients und andere Apps kommunizieren hier. Anwendungsprotokolle wie HTTP oder FTP definieren Syntax und Semantik der Kommunikation.”,
analogy:“Der Inhalt und die Bedeutung eines Briefes – was genau gesagt wird, in einer Sprache, die beide Kommunikationspartner verstehen.”,
errors:[
{code:“HTTP 404 Not Found”,       desc:“Angeforderte Ressource existiert nicht auf dem Server.”},
{code:“HTTP 503 Service Unavail.”, desc:“Dienst überlastet oder temporär nicht erreichbar.”},
{code:“DNS NXDOMAIN”,             desc:“Domainname existiert nicht – DNS-Auflösung scheitert.”},
{code:“SMTP 550 Rejected”,        desc:“E-Mail vom Empfänger-Mailserver abgelehnt (oft Spam-Filter).”},
],
keywords:[“API”,“Port”,“Socket”,“URL”,“Request/Response”,“Anwendungsprotokoll”,“Dienst”],
},
{
id:6, short:“Darstellung”, name:“Darstellungsschicht”, en:“Presentation”,
color:”#a78bfa”, pdu:“Daten”,
protocols:[
{name:“TLS 1.3”,info:“Aktuelles Transport-Layer-Security-Protokoll; Grundlage von HTTPS”},
{name:“SSL”,    info:“Veralteter TLS-Vorgänger (alle Versionen unsicher, nicht mehr verwenden)”},
{name:“JPEG”,   info:“Verlustbehaftetes Bildkompressionsformat für Fotos”},
{name:“MPEG-4”, info:“Videokompression – Grundlage von MP4-Dateien”},
{name:“ASCII”,  info:“7-Bit-Zeichenkodierung für 128 Grundzeichen (US-Englisch)”},
{name:“UTF-8”,  info:“Unicode-Kodierung; unterstützt alle Schriften der Welt, ASCII-kompatibel”},
],
devices:[“SSL-Terminator”,“Transcoder”,“Encryption Appliance”],
function:“Kümmert sich um Übersetzung von Datenformaten, Kompression und Verschlüsselung. Sorgt dafür, dass Sender und Empfänger dieselbe Datendarstellung verwenden – unabhängig von der internen Repräsentation.”,
analogy:“Der Übersetzer – stellt sicher, dass beide Seiten dieselbe ‘Sprache’ sprechen: gleiche Zeichenkodierung, gleiches Format, gleiche Verschlüsselung.”,
errors:[
{code:“SSL Handshake Failure”,desc:“TLS-Aushandlung gescheitert – inkompatibles Zertifikat oder Protokollversion.”},
{code:“Encoding Mismatch”,   desc:“Falsche Zeichenkodierung (UTF-8 vs. Latin-1) → Umlaute erscheinen als Sonderzeichen.”},
{code:“Certificate Expired”, desc:“TLS-Zertifikat abgelaufen – Browser zeigt Sicherheitswarnung.”},
],
keywords:[“Codec”,“Encoding”,“Encryption”,“Compression”,“MIME-Type”,“Serialisierung”,“Zertifikat”],
},
{
id:5, short:“Sitzung”, name:“Sitzungsschicht”, en:“Session”,
color:”#818cf8”, pdu:“Daten”,
protocols:[
{name:“NetBIOS”,info:“Namensauflösung und Sitzungsverwaltung in Windows-Netzwerken”},
{name:“RPC”,    info:“Remote Procedure Call – Prozeduraufruf auf entfernten Systemen”},
{name:“PPTP”,   info:“Point-to-Point Tunneling Protocol – älteres VPN-Protokoll (unsicher)”},
{name:“L2TP”,   info:“Layer 2 Tunneling Protocol – VPN-Tunnel, meist mit IPsec kombiniert”},
{name:“SIP”,    info:“Session Initiation Protocol – Aufbau und Abbau von VoIP-Gesprächen”},
],
devices:[“Session Border Controller”,“VPN Gateway”],
function:“Verwaltet Auf- und Abbau sowie Synchronisation von Kommunikationssitzungen. Ermöglicht die Wiederaufnahme unterbrochener Verbindungen über Checkpoints – z.B. beim Fortführen eines unterbrochenen Downloads.”,
analogy:“Der Moderator einer Telefonkonferenz – eröffnet die Verbindung, stellt sicher, dass beide Parteien abwechselnd sprechen, und beendet das Gespräch geordnet.”,
errors:[
{code:“Session Timeout”,   desc:“Sitzung wegen Inaktivität automatisch beendet.”},
{code:“Connection Reset”,  desc:“Verbindung unerwartet zurückgesetzt (z.B. Serverabsturz).”},
{code:“Half-Open Session”, desc:“Sitzung nicht ordentlich beendet – eine Seite wartet noch auf Abschluss.”},
],
keywords:[“Session-ID”,“Dialog Control”,“Checkpoint”,“Synchronisation”,“Duplex”,“Token”],
},
{
id:4, short:“Transport”, name:“Transportschicht”, en:“Transport”,
color:”#22d3ee”, pdu:“Segment”,
protocols:[
{name:“TCP”, info:“Zuverlässig, verbindungsorientiert; 3-Way-Handshake, Sequenznummern, ACK, Retransmission”},
{name:“UDP”, info:“Verbindungslos, schnell, keine Garantien – ideal für Streaming, Gaming, DNS”},
{name:“QUIC”,info:“Basis von HTTP/3; verbindet UDP-Geschwindigkeit mit TCP-Zuverlässigkeit”},
{name:“SCTP”,info:“Stream Control Transmission Protocol – mehrere parallele Streams in einer Verbindung”},
],
devices:[“Stateful Firewall”,“Load Balancer”,“NAT-Gateway”],
function:“Zuverlässige End-zu-End-Kommunikation zwischen Prozessen. Segmentiert Daten, weist Portnummern zur Prozessidentifikation zu und steuert bei TCP den Datenfluss sowie die Fehlerkorrektur über ACK und Retransmission.”,
analogy:“Paketdienst mit Sendungsverfolgung – teilt große Sendungen auf, vergibt Tracking-Nummern (Sequenznummern) und stellt sicher, dass alle Segmente vollständig und in richtiger Reihenfolge ankommen.”,
errors:[
{code:“TCP Retransmission”,     desc:“Segment nicht bestätigt → wird nach Timeout automatisch erneut gesendet.”},
{code:“Port Unreachable (ICMP)”,desc:“Kein Prozess lauscht auf dem angegebenen Zielport.”},
{code:“Connection Refused”,     desc:“Server lehnt Verbindungsaufbau aktiv ab (sendet TCP RST-Paket).”},
{code:“SYN Flood (DoS)”,        desc:“Überschwemmung mit TCP-SYN ohne ACK → Serverressourcen erschöpft.”},
],
keywords:[“Port”,“Segment”,“3-Way-Handshake”,“SYN/ACK/FIN”,“Flow Control”,“Congestion Control”,“Multiplexing”],
},
{
id:3, short:“Netzwerk”, name:“Netzwerkschicht”, en:“Network”,
color:”#34d399”, pdu:“Paket”,
protocols:[
{name:“IPv4”, info:“32-Bit-Adressierung; ca. 4,3 Mrd. Adressen (durch NAT verlängert)”},
{name:“IPv6”, info:“128-Bit-Adressierung; 340 Sextillionen Adressen – praktisch unbegrenzt”},
{name:“ICMP”, info:“Internet Control Message Protocol – Fehlermeldungen und Diagnose (ping, traceroute)”},
{name:“ARP”,  info:“Address Resolution Protocol – löst IP-Adressen in MAC-Adressen auf (Schicht-2/3-Grenze)”},
{name:“OSPF”, info:“Open Shortest Path First – Link-State-Routing für Unternehmensnetze”},
{name:“BGP”,  info:“Border Gateway Protocol – Internet-Routing zwischen autonomen Systemen”},
],
devices:[“Router”,“Layer-3-Switch”,“VPN-Konzentrator”],
function:“Logische IP-Adressierung und Routing von Paketen durch mehrere heterogene Netzwerke. Router wählen anhand ihrer Routing-Tabellen den optimalen Pfad zum Ziel.”,
analogy:“Das Straßen- und Navigationssystem – bestimmt anhand von IP-Adressen (wie Postleitzahlen) den besten Weg durch viele verschiedene Netzwerke.”,
errors:[
{code:“TTL Exceeded (ICMP 11)”,desc:“Paket hat zu viele Hops – deutet auf Routing-Schleife hin. traceroute nutzt das gezielt.”},
{code:“Host Unreachable”,      desc:“Ziel-IP nicht erreichbar – kein Pfad gefunden.”},
{code:“No Route to Host”,      desc:“Kein passender Eintrag für das Zielnetz in der Routing-Tabelle.”},
{code:“IP Fragmentation”,      desc:“Paket größer als MTU – wird fragmentiert (kann Probleme verursachen).”},
],
keywords:[“IP-Adresse”,“Subnetz”,“CIDR”,“Default Gateway”,“TTL”,“Routing-Tabelle”,“MTU”,“NAT”],
},
{
id:2, short:“Sicherung”, name:“Sicherungsschicht”, en:“Data Link”,
color:”#fbbf24”, pdu:“Rahmen (Frame)”,
protocols:[
{name:“Ethernet”,info:“IEEE 802.3 – kabelgebundenes LAN (10 Mbit/s bis 400 Gbit/s)”},
{name:“WiFi”,    info:“IEEE 802.11 a/b/g/n/ac/ax (Wi-Fi 6) – WLAN in 2,4 / 5 / 6 GHz”},
{name:“PPP”,     info:“Point-to-Point Protocol – Direktverbindungen (z.B. DSL-Einwahl)”},
{name:“VLAN”,    info:“IEEE 802.1Q – virtuelle LANs durch Tagging im Ethernet-Frame”},
{name:“STP”,     info:“Spanning Tree Protocol – verhindert Schleifen in geswitchten Netzen”},
{name:“LACP”,    info:“Link Aggregation Control Protocol – bündelt mehrere Ports zu einem logischen Link”},
],
devices:[“Switch”,“Bridge”,“WLAN Access Point”,“Netzwerkkarte (NIC)”],
function:“Überträgt Frames zwischen direkt verbundenen Geräten im gleichen Netzwerksegment. Verwendet MAC-Adressen zur physischen Adressierung, erkennt Übertragungsfehler per CRC-Prüfsumme (FCS) und regelt den Medienzugriff (CSMA/CD).”,
analogy:“Das lokale Zustellnetz – wer bringt das Paket vom Verteilzentrum zur richtigen Haustür im gleichen Stadtteil? (MAC-Adresse = genaue Hausnummer)”,
errors:[
{code:“CRC / FCS Error”,      desc:“Frame-Prüfsumme falsch – Frame ist beschädigt (Kabeldefekt, schlechter Stecker).”},
{code:“Broadcast Storm”,      desc:“Netzwerkschleife: Frames werden endlos weitergeleitet. STP verhindert das.”},
{code:“MAC-Adress-Konflikt”,  desc:“Zwei Geräte teilen sich eine MAC-Adresse → inkonsistente Kommunikation.”},
{code:“VLAN Mismatch”,        desc:“Gerät im falschen VLAN – kein Zugang zum gewünschten Netz.”},
],
keywords:[“MAC-Adresse”,“Frame”,“FCS”,“ARP”,“Switch”,“CSMA/CD”,“VLAN”,“Broadcast-Domäne”,“Half-/Full-Duplex”],
},
{
id:1, short:“Bitübertragung”, name:“Bitübertragungsschicht”, en:“Physical”,
color:”#f87171”, pdu:“Bits”,
protocols:[
{name:“IEEE 802.3”,info:“Ethernet – Kabelspezifikation (Cat5e/6/7, Glasfaser, RJ45, SFP)”},
{name:“IEEE 802.11”,info:“WLAN – Funkübertragung in 2,4 GHz, 5 GHz und 6 GHz Frequenzbändern”},
{name:“DSL”,       info:“Digital Subscriber Line – Breitband über Telefonkabel”},
{name:“Glasfaser”, info:“Optische Übertragung mit Lichtpulsen – hohe Bandbreite, große Reichweite”},
{name:“Bluetooth”, info:“IEEE 802.15 – Kurzstrecken-Funk für persönliche Geräte (PAN, bis ca. 100m)”},
],
devices:[“Hub”,“Repeater”,“Netzwerkkabel”,“Netzwerkkarte (physisch)”,“Transceiver”,“Modem”],
function:“Überträgt rohe Bits über das physische Medium: Kupferkabel, Glasfaser oder Funk. Definiert Spannungspegel, Stecker-Typen, Kabelkategorien und Übertragungsraten. Kennt weder Adressen noch Fehlererkennung – nur 0 und 1.”,
analogy:“Das physische Transportmittel – der LKW, das Schiff oder das Flugzeug, das Pakete befördert, ohne zu wissen, was darin ist.”,
errors:[
{code:“Link Down”,         desc:“Kabel getrennt, NIC ausgefallen oder Transceiver defekt.”},
{code:“Signal Degradation”,desc:“Zu langes Kabel, Dämpfung oder elektromagnetische Störungen.”},
{code:“Duplex Mismatch”,   desc:“Eine Seite Full-Duplex, andere Half-Duplex → erhöhte Kollisionen.”},
{code:“Jabber”,            desc:“Gerät sendet dauerhaft fehlerhafte Frames und blockiert das Medium.”},
],
keywords:[“Bit”,“Baud”,“Kabel”,“Glasfaser”,“Funk”,“Modulation”,“RJ45”,“Bandbreite”,“dB”,“Dämpfung”],
},
];

// ═══════════════════════════════════════════════════════════
//  TCP/IP DATA
// ═══════════════════════════════════════════════════════════
const TCPIP = [
{
id:4, name:“Anwendungsschicht”, en:“Application”, color:”#c084fc”, osiIds:[5,6,7], pdu:“Daten”,
protocols:[
{name:“HTTP/HTTPS”,info:“Web-Kommunikation, direkt von Anwendungen genutzt”},
{name:“FTP/SFTP”,  info:“Dateiübertragung (SFTP = sicher über SSH)”},
{name:“SMTP/IMAP”, info:“E-Mail versenden (SMTP) und empfangen (IMAP/POP3)”},
{name:“DNS”,       info:“Namensauflösung – Domain zu IP”},
{name:“TLS/SSL”,   info:“Verschlüsselung auf Anwendungsebene”},
{name:“SSH”,       info:“Verschlüsselter Fernzugriff”},
],
function:“Fasst OSI-Schichten 5 (Sitzung), 6 (Darstellung) und 7 (Anwendung) zusammen. Kümmert sich um alles, was Anwendungen direkt betrifft: Darstellung, Sitzungsverwaltung und Anwendungsdienste.”,
analogy:“Alles, was Nutzer und Anwendungen direkt wahrnehmen – Inhalt, Format und Sitzungsverwaltung.”,
},
{
id:3, name:“Transportschicht”, en:“Transport”, color:”#22d3ee”, osiIds:[4], pdu:“Segment”,
protocols:[
{name:“TCP”, info:“Zuverlässig, verbindungsorientiert – 3-Way-Handshake, ACK”},
{name:“UDP”, info:“Verbindungslos, schnell – keine Garantien”},
{name:“QUIC”,info:“Modernes Protokoll – Basis von HTTP/3”},
],
function:“Entspricht direkt OSI-Schicht 4. End-zu-End-Kommunikation mit Portnummern, Segmentierung und optionaler Zuverlässigkeit (TCP).”,
analogy:“Segmentierung, Portnummern und Sendungsverfolgung zwischen zwei Endpunkten.”,
},
{
id:2, name:“Internetschicht”, en:“Internet”, color:”#34d399”, osiIds:[3], pdu:“Paket”,
protocols:[
{name:“IPv4/IPv6”,info:“Logische Adressierung und Routing durch verschiedene Netze”},
{name:“ICMP”,     info:“Fehlermeldungen und Diagnose (ping, traceroute)”},
{name:“BGP/OSPF”, info:“Routing-Protokolle für das Internet und Unternehmensnetz”},
],
function:“Entspricht OSI-Schicht 3. Logische IP-Adressierung und Routing von Paketen durch heterogene Netzwerke.”,
analogy:“Das Navigationssystem des Internets – von IP-Adresse zu IP-Adresse.”,
},
{
id:1, name:“Netzzugangsschicht”, en:“Network Access”, color:”#fb923c”, osiIds:[1,2], pdu:“Frame / Bits”,
protocols:[
{name:“Ethernet (802.3)”,info:“Kabelgebundenes LAN – dominanter Standard”},
{name:“WiFi (802.11)”,   info:“Drahtloses LAN in verschiedenen Frequenzbändern”},
{name:“ARP”,             info:“Auflösung von IP-Adressen in MAC-Adressen”},
],
function:“Fasst OSI-Schichten 1 (Bitübertragung) und 2 (Sicherung) zusammen. Physische Übertragung und lokale Adressierung über MAC-Adressen.”,
analogy:“Hardware und lokales Netz – von Netzwerkkarte zu Netzwerkkarte im gleichen Segment.”,
},
];

// ═══════════════════════════════════════════════════════════
//  ENCAPSULATION DATA
// ═══════════════════════════════════════════════════════════
const ENCAP = [
{
layerId:7,
title:“Schritt 1 — Anwendungsschicht erzeugt Nutzdaten”,
desc:“Der Browser erstellt eine HTTP GET-Anfrage. Das ist die eigentliche Nutzlast – alle folgenden Schichten fügen nur Steuerungsinformationen (Header) hinzu, ohne den Inhalt zu kennen.”,
blocks:[{label:‘HTTP GET /index.html HTTP/1.1\nHost: example.com\nAccept: text/html’, color:”#c084fc”, payload:true}],
},
{
layerId:6,
title:“Schritt 2 — Darstellungsschicht verschlüsselt”,
desc:“TLS kapselt die HTTP-Daten ein und verschlüsselt den Inhalt (AES-256-GCM). Ab jetzt kann nur der Empfänger mit dem passenden Schlüssel den Inhalt lesen.”,
blocks:[
{label:“TLS Record Header | Content-Type: 23 | Version: TLS 1.3 | Length: 1234 Byte”, color:”#a78bfa”},
{label:“🔒 HTTP-Payload (AES-256-GCM verschlüsselt – für Dritte nicht lesbar)”, color:”#c084fc”, payload:true},
],
},
{
layerId:5,
title:“Schritt 3 — Sitzungsschicht verwaltet Verbindung”,
desc:“Eine Session-ID wird vergeben. Die Sitzungsschicht stellt sicher, dass die Verbindung geordnet aufgebaut, gehalten und abgebaut wird. Im TCP/IP-Stack übernehmen TLS und TCP viele dieser Aufgaben.”,
blocks:[
{label:“Session Header | Session-ID: 0xA3F9B2C1 | Flags: 0x01 (Connect)”, color:”#818cf8”},
{label:“TLS Record Header”, color:”#a78bfa”},
{label:“🔒 Nutzdaten (verschlüsselt)”, color:”#c084fc”, payload:true},
],
},
{
layerId:4,
title:“Schritt 4 — Transportschicht erstellt TCP-Segment”,
desc:“TCP fügt Quell- und Zielport hinzu und vergibt Sequenznummern für die Reihenfolgerekonstruktion beim Empfänger. Bei großen Datenmengen werden mehrere Segmente erstellt.”,
blocks:[
{label:“TCP Header | Src-Port: 54321 | Dst-Port: 443 | Seq: 1000 | ACK: 0 | Flags: SYN | Window: 65535”, color:”#22d3ee”},
{label:“Session + TLS Header”, color:”#818cf8”},
{label:“🔒 Nutzdaten”, color:”#c084fc”, payload:true},
],
},
{
layerId:3,
title:“Schritt 5 — Netzwerkschicht erstellt IP-Paket”,
desc:“Der IP-Header mit Quell- und Ziel-IP-Adresse sowie TTL wird vorangestellt. Router im Internet lesen nur diesen Header zur Weiterleitung – den Rest ignorieren sie.”,
blocks:[
{label:“IP Header | Src: 192.168.1.5 | Dst: 93.184.216.34 | TTL: 64 | Protocol: TCP (6) | Checksum”, color:”#34d399”},
{label:“TCP Header”, color:”#22d3ee”},
{label:“Session + TLS + HTTP 🔒”, color:”#c084fc”, payload:true},
],
},
{
layerId:2,
title:“Schritt 6 — Sicherungsschicht erstellt Ethernet-Frame”,
desc:“MAC-Adressen werden hinzugefügt. Das Ziel ist zunächst das nächste Gerät (Router/Default-Gateway), nicht der finale Empfänger. Abschluss: CRC-32-Prüfsumme (FCS) zum Schutz vor Übertragungsfehlern.”,
blocks:[
{label:“ETH Header | Dst-MAC: AA:BB:CC:11:22:33 (Router) | Src-MAC: 11:22:33:44:55:66 | EtherType: IPv4”, color:”#fbbf24”},
{label:“IP Header | TCP Header”, color:”#34d399”},
{label:“Session + TLS + HTTP 🔒”, color:”#c084fc”, payload:true},
{label:“FCS (CRC-32: 0xA1B2C3D4) – Prüfsumme über den gesamten Frame”, color:”#fbbf24”},
],
},
{
layerId:1,
title:“Schritt 7 — Bitübertragungsschicht sendet Signale”,
desc:“Der gesamte Frame wird in elektrische Signale (Kupfer), Lichtpulse (Glasfaser) oder Funkwellen (WLAN) umgewandelt. Auf der Empfängerseite erfolgt die Dekapsulation in umgekehrter Reihenfolge (Schicht 1 → 7).”,
blocks:[
{label:“01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100 …\n(Elektrische Spannungspegel / Lichtpulse / Funkwellen auf dem physischen Medium)”, color:”#f87171”},
],
},
];

// ═══════════════════════════════════════════════════════════
//  CSS
// ═══════════════════════════════════════════════════════════
const CSS = `@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Syne:wght@600;700;800&display=swap'); *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } .lc { transition: all 0.17s ease; cursor: pointer; } .lc:hover { filter: brightness(1.14); transform: translateX(2px); } .lc.sel { transform: translateX(5px); } .lc.hit { animation: glow 1.8s ease-in-out infinite; } .lc.dim { opacity: 0.22; pointer-events: none; } @keyframes glow { 0%,100% { box-shadow: 0 0 6px var(--gc,#fff); } 50%      { box-shadow: 0 0 24px var(--gc,#fff), 0 0 8px var(--gc,#fff); } } @keyframes slide-up { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } } @keyframes fade-in  { from { opacity:0; } to { opacity:1; } } .panel { animation: slide-up 0.25s ease; } .encap-block { animation: fade-in 0.3s ease; } .ptag { cursor:pointer; transition: all 0.14s ease; user-select:none; } .ptag:hover { filter:brightness(1.5); transform:translateY(-1px); } .mbtn { cursor:pointer; transition: all 0.14s ease; font-family:inherit; border:none; } .mbtn:hover:not(:disabled) { filter:brightness(1.15); } .mbtn:disabled { cursor:default; } ::-webkit-scrollbar { width: 5px; height: 5px; } ::-webkit-scrollbar-track { background: #0b0f19; } ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; } input:focus { outline: 1px solid #3b82f680 !important; }`;

// ═══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function NetworkModels() {
const [selected, setSelected] = useState(null); // { layer, model }
const [mode,     setMode]     = useState(“normal”);
const [search,   setSearch]   = useState(””);
const [encapStep,setEncapStep]= useState(0);
const [tab,      setTab]      = useState(“Überblick”);
const [tooltip,  setTooltip]  = useState(null); // { name, info, x, y }

// Search matching
const searchHits = search.length >= 2
? OSI.filter(l =>
l.protocols.some(p => p.name.toLowerCase().includes(search.toLowerCase())) ||
l.keywords.some(k   => k.toLowerCase().includes(search.toLowerCase())) ||
l.name.toLowerCase().includes(search.toLowerCase()) ||
l.en.toLowerCase().includes(search.toLowerCase())
).map(l => l.id)
: [];
const tcpHits = TCPIP.filter(t => t.osiIds.some(id => searchHits.includes(id))).map(t => t.id);

const selectLayer = (layer, model) => {
if (selected?.layer.id === layer.id && selected?.model === model) {
setSelected(null);
} else {
setSelected({ layer, model });
setTab(“Überblick”);
}
};

const switchMode = m => {
setMode(m);
setSelected(null);
if (m === “encapsulation”) setEncapStep(0);
};

const isOsiSel = id => selected?.model === “osi”   && selected?.layer.id === id;
const isTcpSel = id => selected?.model === “tcpip” && selected?.layer.id === id;

const showTooltip = (e, p) => {
e.stopPropagation();
const rect = e.target.getBoundingClientRect();
setTooltip({ name: p.name, info: p.info, x: rect.left, y: rect.bottom + 6 });
};

// ─── helpers ──────────────────────────────────────────
const layerCard = (layer, model, style = {}) => {
const isSel = model === “osi” ? isOsiSel(layer.id) : isTcpSel(layer.id);
const hits  = model === “osi” ? searchHits : tcpHits;
const isHit = hits.includes(layer.id);
const isDim = (model === “osi” ? searchHits : tcpHits).length === 0
? searchHits.length > 0 && !isHit
: searchHits.length > 0 && !isHit;
const actualDim = searchHits.length > 0 && !isHit;

```
return (
  <div
    key={layer.id}
    className={`lc${isSel ? " sel" : ""}${isHit ? " hit" : ""}${actualDim ? " dim" : ""}`}
    onClick={() => selectLayer(layer, model)}
    style={{
      background: isSel ? `${layer.color}1c` : `${layer.color}0c`,
      border: `1px solid ${isSel ? layer.color : layer.color + "2a"}`,
      borderRadius: 9,
      display: "flex", alignItems: "center", padding: "0 11px", gap: 9,
      "--gc": layer.color,
      ...style,
    }}
  >
    <span style={{
      background: layer.color, color: "#0a0e1a",
      fontWeight: 800, fontSize: 11, borderRadius: 5, padding: "2px 6px",
      flexShrink: 0, minWidth: 22, textAlign: "center",
      fontFamily: "'Syne', sans-serif",
    }}>{layer.id}</span>

    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 700, fontSize: 12, color: layer.color, fontFamily: "'Syne', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        {layer.short || layer.name}
      </div>
      <div style={{ fontSize: 9, color: "#475569", marginTop: 1 }}>
        {layer.en}
        {layer.pdu && <> · <span style={{ color: layer.color + "88" }}>{layer.pdu}</span></>}
      </div>
      {layer.osiIds && (
        <div style={{ fontSize: 9, color: layer.color + "66", marginTop: 1 }}>
          ≅ OSI {layer.osiIds.join(", ")}
        </div>
      )}
    </div>

    <div style={{ display: "flex", gap: 3, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 130 }}>
      {layer.protocols.slice(0, 3).map(p => (
        <span
          key={p.name} className="ptag"
          style={{ fontSize: 9, padding: "2px 5px", background: `${layer.color}18`, border: `1px solid ${layer.color}30`, borderRadius: 3, color: layer.color }}
          onMouseEnter={e => showTooltip(e, p)}
          onMouseLeave={() => setTooltip(null)}
          onClick={e => e.stopPropagation()}
        >{p.name}</span>
      ))}
      {layer.protocols.length > 3 && (
        <span style={{ fontSize: 9, color: "#334155", alignSelf: "center" }}>+{layer.protocols.length - 3}</span>
      )}
    </div>
  </div>
);
```

};

// ─── render ───────────────────────────────────────────
return (
<div style={{ background: “#0a0e1a”, minHeight: “100vh”, color: “#e2e8f0”, fontSize: 14, fontFamily: “‘JetBrains Mono’, monospace”, position: “relative” }}>
<style>{CSS}</style>

```
  {/* ═══ HEADER ═════════════════════════════════════ */}
  <div style={{ padding: "16px 20px 13px", borderBottom: "1px solid #111e30", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
    <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1 }}>
      <span style={{ color: "#60a5fa" }}>OSI</span>
      <span style={{ color: "#1e3a5f", margin: "0 7px", fontWeight: 300 }}>×</span>
      <span style={{ color: "#34d399" }}>TCP/IP</span>
      <span style={{ color: "#334155", fontWeight: 600, fontSize: 12, marginLeft: 10 }}>Netzwerkmodelle</span>
    </h1>

    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      {/* Search */}
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#334155", fontSize: 15, pointerEvents: "none" }}>⌕</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Protokoll oder Schicht suchen…"
          style={{ background: "#0d1928", border: "1px solid #1a2d45", borderRadius: 8, padding: "7px 30px 7px 28px", color: "#e2e8f0", fontSize: 12, width: 220, fontFamily: "inherit" }}
        />
        {search && (
          <span onClick={() => setSearch("")} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", color: "#334155", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</span>
        )}
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 5 }}>
        {[
          { id: "normal",        label: "⊞ Modelle" },
          { id: "mapping",       label: "⇄ Mapping" },
          { id: "encapsulation", label: "↓ Enkapsulation" },
        ].map(m => (
          <button key={m.id} className="mbtn"
            onClick={() => switchMode(m.id)}
            style={{
              padding: "7px 12px", borderRadius: 8, fontSize: 11,
              background: mode === m.id ? "#1a3a6a" : "#0d1928",
              border: `1px solid ${mode === m.id ? "#3b82f6" : "#1a2d45"}`,
              color: mode === m.id ? "#93c5fd" : "#4a6080",
            }}
          >{m.label}</button>
        ))}
      </div>
    </div>
  </div>

  {/* Search info bar */}
  {searchHits.length > 0 && (
    <div style={{ padding: "5px 20px", background: "#0d1520", fontSize: 11, color: "#4a6080", borderBottom: "1px solid #111e30" }}>
      ✦ {searchHits.length} Schicht{searchHits.length > 1 ? "en" : ""} für „{search}" gefunden — klicke zum Öffnen
    </div>
  )}

  {/* ═══ MODELS VIEW (normal + mapping) ════════════ */}
  {(mode === "normal" || mode === "mapping") && (
    <div style={{ display: "flex", padding: "16px 18px", gap: 0, alignItems: "flex-start" }}>

      {/* OSI COLUMN */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 9, display: "flex", alignItems: "baseline", gap: 7 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 800, color: "#60a5fa", letterSpacing: 1.2, textTransform: "uppercase" }}>OSI-Modell</span>
          <span style={{ fontSize: 9, color: "#1e3a5f" }}>ISO/IEC 7498 · 7 Schichten</span>
        </div>
        <div style={{ position: "relative", height: TOTAL_H }}>
          {OSI.map(layer =>
            layerCard(layer, "osi", {
              position: "absolute",
              top: (7 - layer.id) * LU,
              height: LH,
              width: "100%",
            })
          )}
        </div>
      </div>

      {/* CONNECTOR */}
      <div style={{ width: mode === "mapping" ? 66 : 14, flexShrink: 0, marginTop: 33 }}>
        {mode === "mapping" && (
          <svg width="66" height={TOTAL_H} style={{ display: "block", overflow: "visible" }}>
            <defs>
              {TCPIP.map(t => (
                <marker key={t.id} id={`dot${t.id}`} markerWidth="5" markerHeight="5" refX="2.5" refY="2.5">
                  <circle cx="2.5" cy="2.5" r="2" fill={t.color} opacity="0.9" />
                </marker>
              ))}
            </defs>
            {MAPPING.map(([osiId, tcpId]) => {
              const tc  = TCPIP.find(t => t.id === tcpId);
              const y1  = OSI_CY(osiId);
              const y2  = TCP_CY[tcpId];
              const active = isOsiSel(osiId) || isTcpSel(tcpId) || searchHits.includes(osiId);
              return (
                <path
                  key={osiId}
                  d={`M 0 ${y1} C 33 ${y1}, 33 ${y2}, 66 ${y2}`}
                  fill="none"
                  stroke={tc.color}
                  strokeWidth={active ? 2.2 : 1.1}
                  strokeOpacity={active ? 0.95 : 0.28}
                  markerEnd={`url(#dot${tcpId})`}
                />
              );
            })}
          </svg>
        )}
      </div>

      {/* TCP/IP COLUMN */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ marginBottom: 9, display: "flex", alignItems: "baseline", gap: 7 }}>
          <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 800, color: "#34d399", letterSpacing: 1.2, textTransform: "uppercase" }}>TCP/IP-Modell</span>
          <span style={{ fontSize: 9, color: "#1e3a5f" }}>DoD-Modell · 4 Schichten</span>
        </div>
        <div style={{ position: "relative", height: TOTAL_H }}>
          {TCPIP.map(layer => {
            const pos = TCP_POS[layer.id];
            return layerCard(layer, "tcpip", {
              position: "absolute",
              top: pos.top,
              height: pos.height,
              width: "100%",
            });
          })}
        </div>
      </div>
    </div>
  )}

  {/* ═══ DETAIL PANEL ════════════════════════════════ */}
  {selected && (mode === "normal" || mode === "mapping") && (
    <DetailPanel
      layer={selected.layer}
      model={selected.model}
      tab={tab}
      setTab={setTab}
      onClose={() => setSelected(null)}
      tooltip={tooltip}
      setTooltip={setTooltip}
      showTooltip={showTooltip}
    />
  )}

  {/* ═══ ENCAPSULATION ══════════════════════════════ */}
  {mode === "encapsulation" && (
    <EncapView step={encapStep} setStep={setEncapStep} />
  )}

  {/* ═══ TOOLTIP ════════════════════════════════════ */}
  {tooltip && (
    <div style={{
      position: "fixed",
      top: Math.min(tooltip.y, window.innerHeight - 90),
      left: Math.max(6, Math.min(tooltip.x - 10, window.innerWidth - 290)),
      background: "#0d1928", border: "1px solid #1a3050", borderRadius: 10,
      padding: "10px 14px", maxWidth: 280, zIndex: 9999, pointerEvents: "none",
      boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
    }}>
      <div style={{ fontWeight: 700, fontSize: 12, color: "#93c5fd", marginBottom: 4, fontFamily: "'Syne', sans-serif" }}>{tooltip.name}</div>
      <div style={{ fontSize: 12, color: "#7a95b0", lineHeight: 1.55 }}>{tooltip.info}</div>
    </div>
  )}
</div>
```

);
}

// ═══════════════════════════════════════════════════════════
//  DETAIL PANEL
// ═══════════════════════════════════════════════════════════
function DetailPanel({ layer, model, tab, setTab, onClose, showTooltip, setTooltip }) {
const c = layer.color;
const TABS = [“Überblick”, “Protokolle”, “Analogie”, “Fehler & Diagnose”];

return (
<div className=“panel” style={{ margin: “0 18px 18px”, background: “#0d1520”, border: `1px solid ${c}30`, borderRadius: 12, overflow: “hidden” }}>
{/* Panel header */}
<div style={{ background: `${c}12`, borderBottom: `1px solid ${c}20`, padding: “11px 16px”, display: “flex”, alignItems: “center”, justifyContent: “space-between” }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 10 }}>
<span style={{ background: c, color: “#0a0e1a”, fontWeight: 800, borderRadius: 6, padding: “3px 10px”, fontFamily: “‘Syne’, sans-serif”, fontSize: 13 }}>
{model === “osi” ? `OSI ${layer.id}` : `TCP/IP ${layer.id}`}
</span>
<div>
<span style={{ fontWeight: 800, fontSize: 15, color: c, fontFamily: “‘Syne’, sans-serif” }}>{layer.name || layer.short}</span>
{layer.en && <span style={{ fontSize: 11, color: “#334155”, marginLeft: 8 }}>({layer.en})</span>}
{layer.pdu && <span style={{ fontSize: 10, color: c + “66”, marginLeft: 8 }}>PDU: {layer.pdu}</span>}
</div>
</div>
<button className=“mbtn” onClick={onClose} style={{ background: “none”, color: “#334155”, fontSize: 22, lineHeight: 1, padding: “0 4px” }}>×</button>
</div>

```
  {/* Tabs */}
  <div style={{ display: "flex", borderBottom: "1px solid #111e30", padding: "0 16px" }}>
    {TABS.map(t => (
      <button key={t} className="mbtn"
        onClick={() => setTab(t)}
        style={{
          padding: "9px 13px", fontSize: 11, background: "none",
          borderBottom: `2px solid ${tab === t ? c : "transparent"}`,
          color: tab === t ? c : "#33485e",
          marginRight: 2,
        }}
      >{t}</button>
    ))}
  </div>

  {/* Content */}
  <div style={{ padding: 16 }}>
    {/* ── Überblick ── */}
    {tab === "Überblick" && (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div>
          <div style={{ fontSize: 10, color: "#334155", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Funktion</div>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.7 }}>{layer.function}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {layer.devices && (
            <div>
              <div style={{ fontSize: 10, color: "#334155", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 }}>Geräte dieser Schicht</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {layer.devices.map(d => (
                  <span key={d} style={{ fontSize: 11, padding: "3px 8px", background: "#111e2e", border: "1px solid #1a2d45", borderRadius: 5, color: "#4a6080" }}>{d}</span>
                ))}
              </div>
            </div>
          )}
          {layer.keywords && (
            <div>
              <div style={{ fontSize: 10, color: "#334155", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 }}>Schlüsselbegriffe</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {layer.keywords.map(k => (
                  <span key={k} style={{ fontSize: 11, padding: "3px 8px", background: `${c}10`, border: `1px solid ${c}25`, borderRadius: 5, color: c + "bb" }}>{k}</span>
                ))}
              </div>
            </div>
          )}
          {layer.osiIds && (
            <div>
              <div style={{ fontSize: 10, color: "#334155", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 7 }}>Entspricht OSI-Schichten</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {layer.osiIds.map(id => {
                  const ol = OSI.find(l => l.id === id);
                  return (
                    <span key={id} style={{ fontSize: 11, padding: "3px 9px", background: `${ol.color}15`, border: `1px solid ${ol.color}30`, borderRadius: 5, color: ol.color }}>
                      {id} – {ol.short}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    {/* ── Protokolle ── */}
    {tab === "Protokolle" && (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
        {layer.protocols.map(p => (
          <div key={p.name} style={{ background: "#0d1928", border: `1px solid ${c}22`, borderRadius: 8, padding: "10px 12px" }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: c, marginBottom: 5, fontFamily: "'Syne', sans-serif" }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "#5a7590", lineHeight: 1.55 }}>{p.info}</div>
          </div>
        ))}
      </div>
    )}

    {/* ── Analogie ── */}
    {tab === "Analogie" && (
      <div style={{ background: `${c}0e`, border: `1px solid ${c}28`, borderRadius: 10, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
        <span style={{ fontSize: 34, flexShrink: 0, lineHeight: 1 }}>💡</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: 13, color: c, marginBottom: 9, fontFamily: "'Syne', sans-serif" }}>Alltagsanalogie</div>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75 }}>{layer.analogy}</p>
        </div>
      </div>
    )}

    {/* ── Fehler & Diagnose ── */}
    {tab === "Fehler & Diagnose" && (
      <div>
        {layer.errors ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {layer.errors.map(e => (
              <div key={e.code} style={{ background: "#0d1928", borderLeft: "3px solid #ef4444", borderRadius: 8, padding: "10px 14px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ fontWeight: 700, fontSize: 11, color: "#ef4444", flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>{e.code}</span>
                <span style={{ fontSize: 12, color: "#7a95b0", lineHeight: 1.55 }}>{e.desc}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#334155", fontSize: 12 }}>Keine spezifischen Fehler für diese Schicht dokumentiert.</p>
        )}
      </div>
    )}
  </div>
</div>
```

);
}

// ═══════════════════════════════════════════════════════════
//  ENCAPSULATION VIEW
// ═══════════════════════════════════════════════════════════
function EncapView({ step, setStep }) {
const current  = ENCAP[step];
const osiLayer = OSI.find(l => l.id === current.layerId);

return (
<div style={{ padding: “16px 18px” }}>
{/* Header row */}
<div style={{ display: “flex”, alignItems: “flex-start”, justifyContent: “space-between”, flexWrap: “wrap”, gap: 12, marginBottom: 16 }}>
<div>
<h2 style={{ fontFamily: “‘Syne’, sans-serif”, fontSize: 15, fontWeight: 800, color: “#e2e8f0” }}>Enkapsulation — Datenkapselung beim Senden</h2>
<p style={{ fontSize: 11, color: “#334155”, marginTop: 3 }}>Wie Nutzdaten Schicht für Schicht mit Header-Informationen verpackt werden</p>
</div>
<div style={{ display: “flex”, gap: 7, alignItems: “center” }}>
<button className=“mbtn”
onClick={() => setStep(s => Math.max(0, s - 1))}
disabled={step === 0}
style={{ padding: “7px 14px”, borderRadius: 8, fontSize: 12, background: step === 0 ? “#0a0e1a” : “#0d1928”, border: `1px solid ${step === 0 ? "#111e30" : "#1a3050"}`, color: step === 0 ? “#1e3a5f” : “#7a95b0” }}
>← Zurück</button>
<span style={{ fontSize: 11, color: “#334155”, minWidth: 65, textAlign: “center” }}>
{step + 1} / {ENCAP.length}
</span>
<button className=“mbtn”
onClick={() => setStep(s => Math.min(ENCAP.length - 1, s + 1))}
disabled={step === ENCAP.length - 1}
style={{ padding: “7px 14px”, borderRadius: 8, fontSize: 12, background: step === ENCAP.length - 1 ? “#0a0e1a” : “#0d1928”, border: `1px solid ${step === ENCAP.length - 1 ? "#111e30" : "#1a3050"}`, color: step === ENCAP.length - 1 ? “#1e3a5f” : “#7a95b0” }}
>Weiter →</button>
</div>
</div>

```
  <div style={{ display: "grid", gridTemplateColumns: "170px 1fr", gap: 14 }}>
    {/* OSI sidebar */}
    <div>
      <div style={{ fontSize: 9, color: "#1e3a5f", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>OSI-Schichten</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {OSI.map(layer => {
          const isCurrent = layer.id === current.layerId;
          const isDone    = layer.id > current.layerId;
          const isPending = layer.id < current.layerId;
          return (
            <div
              key={layer.id}
              onClick={() => setStep(ENCAP.findIndex(e => e.layerId === layer.id))}
              style={{
                padding: "5px 9px", borderRadius: 6, cursor: "pointer",
                background: isCurrent ? `${layer.color}1c` : isDone ? `${layer.color}08` : "#0a0e1a",
                border: `1px solid ${isCurrent ? layer.color : layer.color + "18"}`,
                display: "flex", alignItems: "center", gap: 6,
                opacity: isPending ? 0.28 : 1,
                transition: "all 0.2s ease",
              }}
            >
              <span style={{
                background: (isCurrent || isDone) ? layer.color : "#111e30",
                color: (isCurrent || isDone) ? "#0a0e1a" : "#1e3a5f",
                fontSize: 9, fontWeight: 800, borderRadius: 4, padding: "1px 5px", flexShrink: 0,
                fontFamily: "'Syne', sans-serif",
              }}>{layer.id}</span>
              <span style={{ fontSize: 10, color: isCurrent ? layer.color : isDone ? layer.color + "88" : "#1e3a5f", fontWeight: isCurrent ? 700 : 400 }}>
                {layer.short}
              </span>
              {isCurrent && <span style={{ marginLeft: "auto", color: layer.color, fontSize: 10 }}>▶</span>}
              {isDone    && <span style={{ marginLeft: "auto", color: layer.color + "66", fontSize: 10 }}>✓</span>}
            </div>
          );
        })}
      </div>
    </div>

    {/* Main panel */}
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Step info */}
      <div style={{ background: `${osiLayer.color}12`, border: `1px solid ${osiLayer.color}28`, borderRadius: 10, padding: "13px 16px" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 14, color: osiLayer.color, marginBottom: 6 }}>{current.title}</div>
        <p style={{ fontSize: 12, color: "#7a95b0", lineHeight: 1.7 }}>{current.desc}</p>
      </div>

      {/* Packet visualization */}
      <div>
        <div style={{ fontSize: 9, color: "#1e3a5f", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>
          Paketstruktur
        </div>
        <div style={{ background: "#0d1520", border: "1px solid #111e30", borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 5 }}>
          {current.blocks.map((block, i) => (
            <div key={i} className="encap-block" style={{
              background: `${block.color}15`,
              border: `1px solid ${block.color}${block.payload ? "40" : "22"}`,
              borderLeft: `3px solid ${block.color}`,
              borderRadius: 6, padding: "8px 12px",
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ fontSize: 8, fontWeight: 700, color: `${block.color}70`, textTransform: "uppercase", letterSpacing: 0.8, flexShrink: 0, marginTop: 1, minWidth: 46, textAlign: "right" }}>
                {block.payload ? "PAYLOAD" : "HEADER"}
              </span>
              <span style={{ fontSize: 11, color: block.payload ? block.color + "cc" : block.color + "88", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5, whiteSpace: "pre-line", wordBreak: "break-all" }}>
                {block.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar (clickable) */}
      <div style={{ display: "flex", gap: 3 }}>
        {ENCAP.map((e, i) => {
          const l = OSI.find(o => o.id === e.layerId);
          return (
            <div key={i} onClick={() => setStep(i)}
              title={`Schritt ${i + 1}`}
              style={{
                flex: 1, height: 5, borderRadius: 3, cursor: "pointer",
                background: i <= step ? l.color : "#111e30",
                opacity: i === step ? 1 : i < step ? 0.6 : 0.25,
                transition: "all 0.2s ease",
              }}
            />
          );
        })}
      </div>

      {step === ENCAP.length - 1 && (
        <div style={{ background: "#081a10", border: "1px solid #14532d", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#34d399", lineHeight: 1.6 }}>
          ✓ Vollständig enkapsuliert! Der Frame wird jetzt physisch übertragen. Beim Empfänger findet die <strong style={{ color: "#6ee7b7" }}>Dekapsulation</strong> statt — in umgekehrter Reihenfolge von Schicht 1 → 7, wobei jede Schicht ihren eigenen Header entfernt und auswertet.
        </div>
      )}
    </div>
  </div>
</div>
```

);
}
