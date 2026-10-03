import React, { useRef, useState, useMemo } from "react";
import { BookSlider, FlipPage } from "@/components/ui/book-slider";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  List,
  Printer,
  Shield,
  Search,
  X,
  BookOpen
} from "lucide-react";

/* ────────────────────────────────────────────────
   Reusable tiny helpers so every page fills the
   full A4-portrait height (header → body → footer)
   ──────────────────────────────────────────────── */
const PageHeader = ({ left, right }: { left: string; right: string }) => (
  <div className="text-[10px] text-slate-400 uppercase font-semibold border-b border-slate-200 pb-2 flex justify-between shrink-0">
    <span>{left}</span><span>{right}</span>
  </div>
);
const PageFooter = ({ left, right }: { left: string; right: string }) => (
  <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between shrink-0 mt-auto">
    <span>{left}</span><span>{right}</span>
  </div>
);

// 32-Page Search Directory Index
const SEARCH_INDEX = [
  { p: 0, title: "Cover Page", text: "Azad Zindagi Foundation A Step Towards Azadi Freedom 33969 lives 1603 rescues 988 reunited" },
  { p: 1, title: "Foreword & Executive Summary", text: "Foreword Executive Summary 24/7 Childline 1098 Section 8 UNCRC POCSO JJ Act Virar Palghar" },
  { p: 2, title: "Table of Contents", text: "Contents Directory Directory list 32 pages overview" },
  { p: 3, title: "Vision & Mission", text: "Vision Mission Guiding Light Human Trafficking Community Action sacred lives" },
  { p: 4, title: "5 Core Values", text: "Compassion Respect Empowerment Inclusivity Collaboration Advocacy Non-discrimination" },
  { p: 5, title: "Legal Standing & MCA Registration", text: "Section 8 CIN U88900MH2025NPL458914 NITI Aayog Darpan PAN TAN Registration" },
  { p: 6, title: "Governance & Fiduciary Standards", text: "80G 12A Audit Chartered Accountant Child Protection Policy Accountability MCA" },
  { p: 7, title: "Child Protection Crisis", text: "Emergency Vulnerability Missing children trafficking POCSO NCRB data Palghar Thane" },
  { p: 8, title: "5-Step Response Model", text: "Detection CWC Police Home Investigation HIR Reintegration Education ICP" },
  { p: 9, title: "Program 1: Tracing & Reintegration", text: "1603 missing cases 988 reunited 215 HIR home inquiries RPF GRP AHTU" },
  { p: 10, title: "Program 2: Education & Awareness", text: "29463 sensitized 129 drives Nukkad Natak Good touch bad touch Cyber safety" },
  { p: 11, title: "Program 3: Educational Sponsorships", text: "9 scholarships POCSO support school fees tuition 15000 25000 counseling" },
  { p: 12, title: "Program 4: Community Vigilance", text: "Neighborhood watch youth sports street theatre SHG women safety circles auto rickshaw" },
  { p: 13, title: "Program 5: Child-Friendly Communities", text: "Child safe zones CPC gram panchayat transport allies informal settlements" },
  { p: 14, title: "Program 6: Advocacy & Partnerships", text: "32 govt partners 16 NGO allies CWC JJB AHTU DCPU Mission Vatsalya" },
  { p: 15, title: "Impact Dashboard & Metrics", text: "Cumulative metrics 33969 lives 29463 educated 1603 missing 988 reunited 215 HIR" },
  { p: 16, title: "Geographic & Operational Reach", text: "Virar Palghar Dahanu Gujarat border Western Railway Central Railway interstate tracing" },
  { p: 17, title: "Case Study: Railway Rescue", text: "Case TR-842 400km rescue Madhya Pradesh Virar platform 11:30 PM porter alert GRP" },
  { p: 18, title: "Case Study: Education & Rehabilitation", text: "Case ED-109 Priya 84% class 10 Class 10 state board science pediatrician" },
  { p: 19, title: "Transit Rescue SOPs", text: "Standard operating procedures distress identification trauma informed CWC legal production" },
  { p: 20, title: "Neighborhood Vigilance Networks", text: "Auto rickshaw taxi vendors slum youth mothers SHG 200 cases prevented" },
  { p: 21, title: "Photo Archives: Field Operations", text: "Gallery photo evidence field rescues community awareness POCSO compliance" },
  { p: 22, title: "Photo Archives: Lives Transformed", text: "Gallery photo evidence smiling children school students community moments" },
  { p: 23, title: "Board of Directors", text: "Samuel Sonkamble Lucas Caldeira Dr Stella Bokare Directors founder" },
  { p: 24, title: "Promoters & Operations Team", text: "Nayan Mali Prashansa Dalvi 40 volunteers field investigators" },
  { p: 25, title: "Institutional Partners", text: "AHTU RPF GRP CWC DCPU JJB 16 NGO network allies" },
  { p: 26, title: "Testimonials & Ground Voices", text: "Reunited father headmaster senior RPF officer mother POCSO survivor" },
  { p: 27, title: "Financial Integrity & Fund Allocation", text: "45% rescue 25% education 15% awareness 10% admin 5% medical audit" },
  { p: 28, title: "2026–2030 Strategic Roadmap", text: "5 year goals kiosk scholarship mobile van trauma center FCRA 100000 children" },
  { p: 29, title: "CSR Opportunities & Grants", text: "Schedule VII station kiosk sponsorship 100 girl education van 80G tax receipt" },
  { p: 30, title: "UPI & Bank Donation Details", text: "Donate UPI QR code HDFC Bank Vyapar 50200121687149 HDFC0010006 80G tax receipt" },
  { p: 31, title: "Back Cover & Contacts", text: "Contact office Virar West 9892849479 email website toll free 1098" },
];

export function App() {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTOC, setShowTOC] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const totalPages = 32;

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return SEARCH_INDEX.filter(
      item => item.title.toLowerCase().includes(q) || item.text.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const playPageTurnSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(320, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
      g.gain.setValueAtTime(0.15, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.12);
    } catch { /* silent */ }
  };

  const handleFlip = (e: { data: number }) => { setCurrentPage(e.data); playPageTurnSound(); };
  
  const goToPage = (i: number) => {
    if (bookRef.current) {
      const pageFlipObj = bookRef.current.pageFlip ? bookRef.current.pageFlip() : bookRef.current;
      if (pageFlipObj && typeof pageFlipObj.flip === "function") {
        pageFlipObj.flip(i);
      }
    }
    setShowTOC(false);
    setIsSearchOpen(false);
  };

  const nextPage = () => {
    if (bookRef.current) {
      const pageFlipObj = bookRef.current.pageFlip ? bookRef.current.pageFlip() : bookRef.current;
      if (pageFlipObj) {
        if (typeof pageFlipObj.flipNext === "function") {
          pageFlipObj.flipNext("bottom");
        } else if (typeof pageFlipObj.turnToNextPage === "function") {
          pageFlipObj.turnToNextPage();
        }
      }
    }
  };

  const prevPage = () => {
    if (bookRef.current) {
      const pageFlipObj = bookRef.current.pageFlip ? bookRef.current.pageFlip() : bookRef.current;
      if (pageFlipObj) {
        if (typeof pageFlipObj.flipPrev === "function") {
          pageFlipObj.flipPrev("bottom");
        } else if (typeof pageFlipObj.turnToPrevPage === "function") {
          pageFlipObj.turnToPrevPage();
        }
      }
    }
  };

  const toggleFS = () => { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => {}); };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* ─── ENHANCED NAVBAR ─── */}
      <header className="h-16 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-40 select-none shrink-0 gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3 shrink-0">
          <img src="/images/cover/logo-updated.png" alt="AZAD" className="w-9 h-9 object-contain rounded" onError={e=>(e.target as HTMLElement).style.display="none"} />
          <div>
            <div className="font-extrabold text-sm text-white tracking-wide flex items-center gap-2">
              AZAD ZINDAGI FOUNDATION
              <span className="text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full font-bold hidden sm:inline-block">32 PAGES</span>
            </div>
            <div className="text-[10px] text-orange-400 font-semibold tracking-wide uppercase">PROTECTING INNOCENCE, RESTORING FUTURES</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm hidden md:block">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none"/>
            <input
              type="text"
              placeholder="Search (e.g. POCSO, Rescues, Virar)..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setIsSearchOpen(true); }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-slate-800/90 border border-slate-700/80 rounded-full pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            />
            {searchQuery && (
              <button onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }} className="absolute right-3 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5"/>
              </button>
            )}
          </div>

          {/* Live Search Results Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto z-50 p-2 space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 flex justify-between">
                <span>Matching Results ({searchResults.length})</span>
                <button onClick={() => setIsSearchOpen(false)} className="hover:text-white">Close</button>
              </div>
              {searchResults.length > 0 ? (
                searchResults.map((res) => (
                  <button
                    key={res.p}
                    onClick={() => goToPage(res.p)}
                    className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-orange-500/20 hover:text-orange-400 transition-colors flex items-center justify-between text-xs group"
                  >
                    <span className="font-semibold text-slate-200 group-hover:text-orange-400">{res.title}</span>
                    <span className="text-[10px] font-mono bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-bold">Page {res.p + 1}</span>
                  </button>
                ))
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">No matching pages found for "{searchQuery}"</div>
              )}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={()=>setShowTOC(!showTOC)} className="text-xs h-9 gap-1.5 border-slate-700 bg-slate-800/80 hover:bg-slate-700"><List className="w-3.5 h-3.5 text-orange-400"/>Contents</Button>
          <Button variant="outline" size="sm" onClick={()=>window.print()} className="text-xs h-9 gap-1.5 hidden lg:inline-flex border-slate-700 bg-slate-800/80 hover:bg-slate-700"><Printer className="w-3.5 h-3.5 text-emerald-400"/>Print / PDF</Button>
          <Button variant="ghost" size="icon" onClick={()=>setSoundEnabled(!soundEnabled)} className="h-9 w-9 text-slate-300 hover:text-white hover:bg-slate-800" title={soundEnabled ? "Mute audio" : "Enable audio"}>
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400"/> : <VolumeX className="w-4 h-4 text-slate-500"/>}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFS} className="h-9 w-9 text-slate-300 hover:text-white hover:bg-slate-800" title="Fullscreen"><Maximize2 className="w-4 h-4"/></Button>
          {currentPage > 0 && (
            <Button variant="ghost" size="icon" onClick={() => bookRef.current?.close?.()} className="h-9 w-9 text-slate-300 hover:text-white hover:bg-slate-800" title="Close book">
              <BookOpen className="w-4 h-4"/>
            </Button>
          )}
        </div>
      </header>

      {/* ─── FLIPBOOK STAGE ─── */}
      <main className="flex-1 flex items-center justify-center p-2 relative overflow-hidden my-auto min-h-[calc(100vh-6.5rem)]">
        <button onClick={prevPage} className="absolute left-2 md:left-6 z-30 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-orange-500 text-white flex items-center justify-center backdrop-blur shadow-xl transition-all border border-slate-700/50" title="Previous"><ChevronLeft className="w-6 h-6"/></button>

        <BookSlider bookRef={bookRef} width={440} height={622} onFlip={handleFlip} flipDirection="bottom" startClosed={true}>

          {/* ══════════════════ PAGE 1 — FRONT COVER (3D Hardcover) ══════════════════ */}
          <FlipPage className="p-0 bg-slate-900 text-white border border-slate-800 hardcover-spine-left cover-bevel shadow-2xl">
            <div className="flex flex-col justify-between h-full p-7 select-none relative z-10 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950">
              
              {/* Top Header & Year Badge */}
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <img src="/images/cover/logo-updated.png" className="w-8 h-8 object-contain" alt="AZAD" onError={e=>(e.target as HTMLElement).style.display="none"}/>
                  <span className="text-xs tracking-[2px] font-bold text-slate-300 uppercase">Annual Publication</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-3 py-1 rounded-full">2025–2026</span>
              </div>

              {/* Upper Middle (Top 40%): Official Logo Emblem */}
              <div className="flex flex-col items-center justify-center pt-2 pb-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl mb-2 bg-white/10 p-0 flex items-center justify-center backdrop-blur-md">
                  <img
                    src="/images/cover/logo-updated.png"
                    alt="AZAD ZINDAGI FOUNDATION Official Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs uppercase tracking-[3px] font-bold text-orange-400">Child Protection &amp; Reintegration</div>
              </div>

              {/* Center (Middle 30%): Main Title in Elegant Serif */}
              <div className="text-center my-auto px-2">
                <h1 className="font-serif-title text-2xl sm:text-3xl font-black text-white tracking-wider leading-tight mb-2 uppercase drop-shadow-md">
                  AZAD ZINDAGI<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">FOUNDATION</span>
                </h1>
                <div className="w-16 h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 mx-auto mb-3 rounded-full"></div>
                <div className="text-xs sm:text-sm font-semibold text-slate-200 tracking-wide uppercase mb-1">
                  PROTECTING INNOCENCE, RESTORING FUTURES
                </div>
                <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                  Safeguarding vulnerable children, preventing trafficking, and reuniting families across India.
                </p>
              </div>

              {/* Bottom Margin: Key Metrics & Publisher Details */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/10 rounded-lg p-2.5 text-center backdrop-blur-sm">
                  <div><div className="text-base font-black text-orange-400">33,969+</div><div className="text-[9px] text-slate-300 uppercase font-semibold">Lives Impacted</div></div>
                  <div className="border-x border-white/10"><div className="text-base font-black text-emerald-400">1,603</div><div className="text-[9px] text-slate-300 uppercase font-semibold">Rescues</div></div>
                  <div><div className="text-base font-black text-amber-400">988</div><div className="text-[9px] text-slate-300 uppercase font-semibold">Reunited</div></div>
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1 font-medium">
                  <span>Section 8 Non-Profit (Govt of India)</span>
                  <span className="font-mono">CIN: U88900MH2025NPL458914</span>
                </div>
              </div>

            </div>
          </FlipPage>
          
          {/* ══════════════════ PAGE 2 — INSIDE FRONT COVER (Clean White Endpaper) ══════════════════ */}
          <FlipPage className="p-7 bg-slate-50 text-slate-900 page-left flex flex-col justify-between border-r border-slate-200 select-none">
            <div className="flex justify-between items-center border-b border-slate-300 pb-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AZAD ZINDAGI FOUNDATION</span>
              <span className="text-[10px] uppercase font-bold text-slate-500">INSIDE COVER</span>
            </div>

            <div className="text-center my-auto flex flex-col items-center justify-center py-4">
              <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center p-3 mb-4 shadow-sm">
                <img src="/images/cover/logo-updated.png" className="w-full h-full object-contain opacity-90" alt=""/>
              </div>
              <h3 className="font-serif-title text-base font-bold text-slate-900 tracking-wide mb-1 uppercase">
                AZAD ZINDAGI FOUNDATION
              </h3>
              <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-3">
                A Section 8 Non-Profit Organization
              </p>
              <div className="w-12 h-0.5 bg-slate-300 mx-auto mb-3"></div>
              <p className="text-xs text-slate-700 max-w-xs leading-relaxed italic font-medium">
                "Dedicated to the rescue, protection, legal rehabilitation, and social reintegration of trafficked, missing, and vulnerable children across Maharashtra and India."
              </p>
            </div>

            <div className="border-t border-slate-300 pt-2 text-[10px] text-slate-500 font-medium flex justify-between items-center">
              <span>CIN: U88900MH2025NPL458914</span>
              <span>Page 02</span>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 3 — FOREWORD ══════════════════ */}
          <FlipPage className="p-7 page-right text-slate-900">
            <div className="flex flex-col h-full">
              <PageHeader left="Azad Zindagi Foundation" right="Foreword"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <div className="inline-block bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">Executive Summary</div>
                  <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Protecting Innocence, Building Hope</h2>
                  <p className="text-xs italic font-medium text-slate-800 mb-3 border-l-3 border-orange-500 pl-3 leading-relaxed bg-orange-50/50 py-1" style={{borderLeftWidth:"3px"}}>
                    "Every child expects an Azad Zindagi (Free Life), and it is everyone's responsibility to make it happen."
                  </p>
                  <p className="text-[11px] text-slate-800 leading-relaxed font-normal mb-2">
                    The Right to Protection is guaranteed under the UN Convention on the Rights of the Child (UNCRC) and strongly upheld in India through laws like POCSO and the Juvenile Justice Act. Yet across railway stations, bus terminals, and trafficking corridors, thousands of children face daily exploitation.
                  </p>
                  <p className="text-[11px] text-slate-800 leading-relaxed font-normal mb-2">
                    Prior to formal incorporation under Section 8 of the Companies Act, 2013 on October 13, 2025, our core team operated on the ground since 2019, sustained by unwavering community support. This 32-page dossier chronicles the transformation of over 33,969 children and outlines our roadmap for 2026–2030.
                  </p>
                  <p className="text-[11px] text-slate-800 leading-relaxed font-normal mb-2">
                    From the railway platforms of Virar and Palghar to remote villages across Maharashtra, Bihar, Uttar Pradesh, and West Bengal, our field investigators have worked alongside Anti-Human Trafficking Units (AHTU), the Railway Protection Force (RPF), and Child Welfare Committees (CWC) to rescue, rehabilitate, and reintegrate vulnerable children.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="bg-orange-50 border-l-3 border-orange-500 p-2.5 rounded text-[11px] text-orange-950 font-medium" style={{borderLeftWidth:"3px"}}>
                    <strong>24/7 Childline Support:</strong> Toll-free <strong>1098</strong> for immediate distress response. Our trained field officers are available at all hours across Western Railway transit corridors.
                  </div>
                  <div className="bg-blue-50 border-l-3 border-blue-500 p-2.5 rounded text-[11px] text-blue-950 font-medium" style={{borderLeftWidth:"3px"}}>
                    <strong>Operational Since:</strong> 2019 (Pre-incorporation). Formally registered as Section 8 company on 13th October 2025 with the Ministry of Corporate Affairs, Government of India.
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 03"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 4 — TABLE OF CONTENTS ══════════════════ */}
          <FlipPage className="p-7 page-left text-slate-900">
            <div className="flex flex-col h-full">
              <PageHeader left="Contents" right="Complete 32-Page Directory"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 mb-1 border-b-2 border-orange-500 inline-block pb-0.5">Table of Contents</h2>
                  <p className="text-[11px] text-slate-600 mb-2 font-medium">Navigate through our 32-page comprehensive annual publication:</p>
                  <div className="space-y-1 text-[11px]">
                    {[
                      {l:"01",t:"Front Cover — Impact at a Glance",p:0},
                      {l:"02",t:"Inside Front Cover — Publication Info",p:1},
                      {l:"03",t:"Executive Foreword",p:2},
                      {l:"04",t:"Table of Contents Directory",p:3},
                      {l:"05",t:"Vision & Mission Statements",p:4},
                      {l:"06",t:"5 Core Values",p:5},
                      {l:"07",t:"Section 8 Governance & Legal Standing",p:6},
                      {l:"08",t:"Governance Standards & Auditing",p:7},
                      {l:"09",t:"Child Protection Crisis",p:8},
                      {l:"10",t:"Azad 5-Step Response Model",p:9},
                      {l:"11–12",t:"Program 1: Tracing & Reintegration",p:10},
                      {l:"13–14",t:"Program 2: Education & Awareness Drives",p:12},
                      {l:"15–16",t:"Program 3: Sponsorships & POCSO Support",p:14},
                      {l:"17–18",t:"Program 4: Community Vigilance",p:16},
                      {l:"19–20",t:"Program 5: Child-Friendly Communities",p:18},
                      {l:"21–22",t:"Program 6: Advocacy & Partnerships",p:20},
                      {l:"23–24",t:"Impact Dashboard & Geographic Reach",p:22},
                      {l:"25–26",t:"Field Case Studies",p:24},
                      {l:"27–28",t:"Photo Archives",p:26},
                      {l:"29–30",t:"Board of Directors & Leadership",p:28},
                      {l:"31–32",t:"CSR, Donation & Back Cover",p:30},
                    ].map((r,i) => (
                      <div key={i} className="flex justify-between bg-slate-50 hover:bg-orange-50 p-1 rounded cursor-pointer transition-colors border border-slate-100" onClick={()=>goToPage(r.p)}>
                        <span className="font-medium text-slate-800"><strong className="text-orange-600">{r.l}</strong> {r.t}</span>
                        <span className="text-slate-500 font-mono text-[9.5px] bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">P.{r.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-100 p-2 rounded text-[10.5px] text-slate-700 font-medium border border-slate-200 mt-2">
                  <strong>Reading Tip:</strong> Click any row above to jump directly to that section. Use navigation arrows or click corners to flip spreads cleanly.
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 04"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 5 — VISION & MISSION ══════════════════ */}
          <FlipPage className="p-7 page-right text-slate-900">
            <div className="flex flex-col h-full">
              <PageHeader left="Identity" right="Vision & Mission"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 mb-2">Our Guiding Light</h2>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-l-3 border-orange-500 p-3 rounded mb-3 shadow-sm" style={{borderLeftWidth:"3px"}}>
                    <div className="text-[11px] font-bold text-orange-950 mb-1">🔭 VISION</div>
                    <p className="text-[11px] text-orange-950 font-medium leading-relaxed">
                      "To see trafficked and missing children assisted, the vulnerable protected, captives set free, and the oppressed experiencing hope and healing as neighbours are transformed."
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-l-3 border-emerald-500 p-3 rounded mb-3 shadow-sm" style={{borderLeftWidth:"3px"}}>
                    <div className="text-[11px] font-bold text-emerald-950 mb-1">🎯 MISSION</div>
                    <p className="text-[11px] text-emerald-950 font-medium leading-relaxed">
                      "To mobilize communities, financial partners, and all segments of society towards ending human trafficking and creating new futures through community-based action."
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1.5">About Azad Zindagi</h3>
                  <p className="text-[11px] text-slate-800 leading-relaxed mb-2">
                    Azad Zindagi Foundation affirms that every child's life is sacred. A collective of social workers, legal advocates, educators, and trained field investigators united under a single imperative: safeguard rights, restore dignity, and ensure zero child abandonment across transit hubs and vulnerable communities.
                  </p>
                  <p className="text-[11px] text-slate-800 leading-relaxed mb-2">
                    Our name, "Azad Zindagi" (Free Life), captures our conviction that freedom from exploitation, trafficking, and abuse is not a privilege but a fundamental right of every child born in India and across the world.
                  </p>
                  <div className="bg-slate-100 border border-slate-200 rounded p-2.5 text-[10.5px] text-slate-700 font-medium">
                    <strong>Legal Entity:</strong> Incorporated as a Section 8 Company under the Companies Act, 2013 (Ministry of Corporate Affairs, Government of India). Active since 2019 as a grassroots initiative.
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 05"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 6 — CORE VALUES ══════════════════ */}
          <FlipPage className="p-7 page-left text-slate-900">
            <div className="flex flex-col h-full">
              <PageHeader left="Ethos" right="5 Core Values"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 mb-2">Our Non-Negotiable Principles</h2>
                  <p className="text-[11px] text-slate-600 mb-2.5">Every action and field intervention is anchored by five core values that define our organizational DNA:</p>
                  <div className="space-y-2">
                    {[
                      {icon:"❤️",c:"border-orange-500",t:"Compassion & Respect",d:"Everyone is treated with dignity, recognizing their inherent worth and lifelong potential. Every rescued child receives trauma-informed care from the first moment of contact."},
                      {icon:"💪",c:"border-emerald-500",t:"Empowerment",d:"We empower children, parents, and neighborhoods to build independent, fearless futures through education, vocational training, and self-help group formation."},
                      {icon:"🛡️",c:"border-blue-500",t:"Inclusivity & Non-Discrimination",d:"Equal protection and opportunities for all, regardless of caste, gender, religion, or economic background. Every child deserves safety regardless of identity."},
                      {icon:"🤝",c:"border-purple-500",t:"Collaboration & Partnership",d:"Seamless coordination with Police, CWC, JJB, Railway authorities, DCPU, and grassroots NGOs to maximize rescue coverage and legal compliance."},
                      {icon:"📢",c:"border-amber-500",t:"Advocacy & Policy Influence",d:"Championing systemic improvements and law enforcement compliance for child protection. We push for policy reforms at district and state levels."},
                    ].map((v,i)=>(
                      <div key={i} className={`p-2.5 bg-slate-50 border-l-3 ${v.c} rounded`} style={{borderLeftWidth:"3px"}}>
                        <div className="text-xs font-bold text-slate-900 mb-0.5">{v.icon} {v.t}</div>
                        <div className="text-[10.5px] text-slate-600 leading-relaxed">{v.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-orange-50 p-2.5 rounded text-[10.5px] text-orange-950 font-medium border border-orange-200 mt-2">
                  <strong>Commitment:</strong> 100% of staff and field workers have signed our zero-tolerance Child Protection Policy before engaging with any vulnerable minor.
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 06"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 7 — LEGAL STANDING ══════════════════ */}
          <FlipPage className="p-7 page-right text-slate-900">
            <div className="flex flex-col h-full">
              <PageHeader left="Corporate Governance" right="Legal Standing"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 mb-2">Statutory Credibility & Registrations</h2>
                  <p className="text-[11px] text-slate-700 mb-2.5">
                    Azad Zindagi Foundation is incorporated under <strong>Section 8 of the Companies Act, 2013</strong> as a non-profit company with limited liability, registered with the Ministry of Corporate Affairs, Government of India.
                  </p>
                  <table className="w-full text-[10.5px] border border-slate-200 mb-2.5">
                    <tbody>
                      {[
                        ["Legal Entity","Azad Zindagi Foundation","font-bold text-slate-900"],
                        ["CIN","U88900MH2025NPL458914","font-mono font-bold text-orange-600"],
                        ["Incorporation","13th October 2025","font-semibold"],
                        ["NITI Aayog Darpan","MH/2026/1031675","font-mono font-bold text-emerald-600"],
                        ["PAN","ABDCA9553B","font-mono font-bold"],
                        ["TAN","PNEA56777A","font-mono font-bold"],
                        ["Registered Office","F 102 & 103, Violet Bldg 16, Yashwant Nagar, Virar West, Palghar, Maharashtra 401303","text-[10px]"],
                      ].map(([k,v,cls],i)=>(
                        <tr key={i} className={`border-b border-slate-200 ${i%2===0?"bg-slate-50":""}`}>
                          <td className="p-2 font-semibold text-slate-600 w-[38%]">{k}</td>
                          <td className={`p-2 ${cls}`}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed mb-2">
                    The foundation operates under strict regulatory compliance including annual statutory auditing by certified independent Chartered Accountant firms, and maintains transparent financial reporting accessible to all donors and CSR partners.
                  </p>
                  <div className="bg-emerald-50 p-2.5 rounded text-[10.5px] text-emerald-950 font-medium border border-emerald-200">
                    <strong>Continuity Note:</strong> While formally registered in October 2025, our field team and grassroots rescue networks have operated seamlessly since 2019, building deep trust with police stations, railway authorities, and local communities.
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 07"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 8 — GOVERNANCE FRAMEWORK ══════════════════ */}
          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Compliance" right="Governance Framework"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Governance & Fiduciary Standards</h2>
                  <p className="text-[11px] text-slate-700 mb-3">
                    Like premier non-profits across India, Azad Zindagi adheres to high governance protocols, independent statutory auditing, and strict child protection policy compliance.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5 mb-4">
                    {[
                      {icon:"📋",t:"Section 80G",d:"All donations eligible for 100% tax deductions under the Income Tax Act, 1961.",bg:"bg-orange-50"},
                      {icon:"✅",t:"Section 12A",d:"Recognized non-profit trust exemption status with the Central Board of Direct Taxes (CBDT).",bg:"bg-emerald-50"},
                      {icon:"📊",t:"CA Auditing",d:"Year-end accounts independently audited and certified by registered Chartered Accountant firms.",bg:"bg-blue-50"},
                      {icon:"🔒",t:"Child Protection Policy",d:"Mandatory zero-tolerance policy signed by 100% of staff, volunteers, and field workers.",bg:"bg-purple-50"},
                    ].map((c,i)=>(
                      <div key={i} className={`p-3 ${c.bg} border border-slate-200 rounded text-center`}>
                        <div className="text-lg mb-1">{c.icon}</div>
                        <div className="text-[11px] font-bold text-slate-900 mb-1">{c.t}</div>
                        <div className="text-[9.5px] text-slate-600 leading-relaxed">{c.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Accountability Standards</h3>
                  <ul className="text-[10.5px] text-slate-700 space-y-1 list-disc pl-4 mb-3">
                    <li>Annual Board meetings with documented minutes and resolutions</li>
                    <li>Quarterly financial review by independent auditors</li>
                    <li>Real-time case tracking and documentation of every rescued child</li>
                    <li>Donor transparency: detailed fund utilization reports shared annually</li>
                    <li>MCA annual filings and compliance with all Companies Act provisions</li>
                  </ul>
                  <div className="bg-slate-100 p-3 rounded text-[10px] text-slate-600">
                    <strong>NITI Aayog Recognition:</strong> Registered on the NITI Aayog NGO Darpan portal (ID: MH/2026/1031675), enabling eligibility for government grants and institutional partnerships.
                  </div>
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 07"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 8 — CHILD PROTECTION CRISIS ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Field Reality" right="The Protection Crisis"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <div className="inline-block bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">⚠️ Emergency Context</div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">The Vulnerability Crisis in India</h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    In India, thousands of children go missing every month. Many are trafficked for commercial sexual exploitation, forced bonded labour, illegal adoption, or begging rings. Railway stations, bus terminals, border checkposts, and interstate transit nodes represent the most crucial interception points.
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    If a missing child is not identified and rescued within the first 24 to 72 hours, their risk of trafficking increases exponentially. The golden window for rescue is shrinking as traffickers adopt increasingly sophisticated methods.
                  </p>
                </div>
                <div>
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-3">
                    <div className="text-[10px] font-bold text-red-900 mb-1">9 MAJOR THREATS WE ACTIVELY COMBAT:</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[10px] text-red-800">
                      <div>• Child Trafficking & Smuggling</div>
                      <div>• Hazardous Child Labour</div>
                      <div>• Underage Child Marriage</div>
                      <div>• Physical & Domestic Abuse</div>
                      <div>• Sexual Exploitation (POCSO)</div>
                      <div>• Emotional & Psychological Abuse</div>
                      <div>• Abandonment at Transit Hubs</div>
                      <div>• Cyber Grooming & Digital Abuse</div>
                      <div>• Institutional Violence & Neglect</div>
                    </div>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded text-[10px] text-amber-900">
                    <strong>NCRB Data:</strong> India reported over 1.1 lakh missing children in a single year. Maharashtra ranks among the top 5 states for child trafficking cases. Palghar and Thane districts, where we operate, are critical transit corridors connecting Mumbai to Gujarat.
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 08"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 9 — AZAD RESPONSE MODEL ══════════════════ */}
          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Intervention" right="5-Step Response Pipeline"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">The Azad Response Model</h2>
                  <p className="text-[11px] text-slate-700 mb-3">Our standardized 5-step intervention pipeline from the first distress signal to final social reintegration:</p>
                  <div className="space-y-2.5">
                    {[
                      {n:1,c:"bg-orange-500",t:"Early Detection & Patrols",d:"Trained field officers patrol transit hubs 24/7, spotting runaway or distressed minors at railway platforms, bus stands, and border crossings. Red flags: unaccompanied minors, absence of tickets, travel during school hours."},
                      {n:2,c:"bg-emerald-500",t:"CWC & Police Production",d:"Immediate legal documentation before the Child Welfare Committee (CWC). FIR filing with local police and entry in the station general diary. Medical checkup at nearest civic hospital."},
                      {n:3,c:"bg-blue-500",t:"Home Investigation (215+ Conducted)",d:"Physical on-site visits to family homes across states to verify safety, stability, and care capacity. Each HIR (Home Investigation Report) follows CWC-mandated protocols."},
                      {n:4,c:"bg-purple-500",t:"Family Reintegration (988 Reunited)",d:"Safely restoring the child to verified parents with travel assistance, formal release orders, and legal documentation. Interstate coordination with NGO partners for distant states."},
                      {n:5,c:"bg-rose-500",t:"Post-Rescue Education & Monitoring",d:"School sponsorships, vocational guidance, and quarterly home check-ins to prevent secondary re-trafficking. Follow-up for a minimum of 12 months after reintegration."},
                    ].map((s,i)=>(
                      <div key={i} className="flex gap-3 items-start p-2.5 bg-slate-50 rounded">
                        <div className={`w-6 h-6 ${s.c} rounded-full text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>{s.n}</div>
                        <div><div className="text-[11px] font-bold text-slate-900">{s.t}</div><div className="text-[10px] text-slate-600 leading-relaxed">{s.d}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 09"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 10 — PROGRAM 1: TRACING ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Program 01" right="Tracing & Reintegration"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <div className="inline-block bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">🔍 Direct Rescue Operations</div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Tracing & Family Reintegration</h2>
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded"><div className="text-xl font-black text-orange-600">1,603</div><div className="text-[9px] text-slate-600 font-semibold">Missing Cases Assisted</div></div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded"><div className="text-xl font-black text-emerald-600">988</div><div className="text-[9px] text-slate-600 font-semibold">Successfully Reunited</div></div>
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded"><div className="text-xl font-black text-blue-600">215</div><div className="text-[9px] text-slate-600 font-semibold">Home Inquiries (HIR)</div></div>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    When a child runs away or is taken, every second counts. Our tracing teams coordinate between local police stations, Anti-Human Trafficking Units (AHTU), the Railway Protection Force (RPF), and Government Railway Police (GRP) to locate and recover missing minors.
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    We travel directly to remote villages across Maharashtra, Bihar, Uttar Pradesh, Madhya Pradesh, and West Bengal to conduct on-ground home inquiries, verifying whether a child can safely return or requires state foster care placement.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Key Operational Highlights:</h3>
                  <ul className="text-[10px] text-slate-600 list-disc pl-4 space-y-0.5 mb-2">
                    <li>24/7 field readiness with rapid-response transit teams at Virar & Palghar junctions</li>
                    <li>Cross-state coordination network spanning 6+ states for interstate tracing</li>
                    <li>Formal CWC documentation and Individual Care Plans (ICPs) for every rescued child</li>
                    <li>Emergency nutrition, medical checkups, and psychological first aid at point of rescue</li>
                  </ul>
                  <div className="bg-slate-100 p-2 rounded text-[10px] text-slate-600">
                    <strong>Success Rate:</strong> 61.7% of all assisted missing children have been successfully reunited with their families — well above the national average for NGO-assisted rescues.
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 10"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 11 — PROGRAM 2: EDUCATION ══════════════════ */}
          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Program 02" right="Education & Awareness"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <div className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">🏫 Prevention At Source</div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Education & Awareness Drives</h2>
                  <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded"><div className="text-xl font-black text-emerald-600">29,463</div><div className="text-[9px] text-slate-600 font-semibold">Children Sensitized</div></div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded"><div className="text-xl font-black text-orange-600">129</div><div className="text-[9px] text-slate-600 font-semibold">Awareness Campaigns</div></div>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    Prevention is our strongest weapon. We conduct intensive school workshops, community street-plays (Nukkad Natak), and adolescent group sessions covering critical safety topics across Maharashtra's most vulnerable districts.
                  </p>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Workshop Topics Include:</h3>
                  <ul className="text-[10.5px] text-slate-700 list-disc pl-4 space-y-1 mb-3">
                    <li><strong>POCSO Awareness:</strong> Teaching good touch / bad touch, safety boundaries, and reporting mechanisms to children as young as 6 years old</li>
                    <li><strong>Trafficking Warning Signs:</strong> How fake job offers, deceitful marriages, and runaway traps operate in rural areas</li>
                    <li><strong>Digital Safety:</strong> Safeguarding teens against cyberstalking, blackmail, sextortion, and online sexual abuse</li>
                    <li><strong>Career Mentorship:</strong> Guiding first-generation learners toward vocational skills, competitive exams, and higher education pathways</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[10.5px] text-slate-700 leading-relaxed mb-2">
                    Our awareness programs have reached schools, anganwadis, slum settlements, and tribal hamlets across Palghar, Thane, Mumbai, and Nashik districts. Each session is conducted in local languages (Marathi, Hindi, Warli) for maximum impact.
                  </p>
                  <div className="bg-emerald-50 p-3 rounded text-[10px] text-emerald-900 border border-emerald-200">
                    <strong>Impact Metric:</strong> Post-workshop surveys show 78% of children can identify at least 3 warning signs of trafficking and know how to call Childline 1098 for help.
                  </div>
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 11"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 12 — PROGRAM 3: SPONSORSHIPS ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Program 03" right="Educational Sponsorships"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <div className="inline-block bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">🎓 Direct Support</div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Educational Sponsorships & POCSO Support</h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    Trauma and extreme poverty often force survivor children to drop out of school, creating a dangerous cycle of vulnerability. Azad Zindagi covers tuition fees, school books, uniforms, and daily transport for high-risk children identified through our rescue operations.
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    Currently, <strong>9 children</strong> receive direct full scholarship support, enabling them to pursue high school and junior college certifications in secure institutional environments with regular counseling support.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded mb-3">
                    <div className="text-xs font-bold text-amber-900 mb-1">💰 Sponsorship Cost Breakdown:</div>
                    <div className="text-[10.5px] text-amber-800 leading-relaxed">
                      It costs approximately ₹15,000 to ₹25,000 annually to provide complete school fees, uniforms, stationery, nutritional support, and counseling for one vulnerable child. Your contribution can change a life.
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">POCSO Victim Support Services:</h3>
                  <ul className="text-[10.5px] text-slate-700 list-disc pl-4 space-y-0.5 mb-3">
                    <li>Legal aid and court accompaniment for POCSO case proceedings</li>
                    <li>Trauma-informed psychological counseling for survivors and families</li>
                    <li>Safe shelter coordination through government Children's Homes</li>
                    <li>Vocational training and livelihood support for adolescent survivors</li>
                    <li>Long-term follow-up and monitoring for 12–24 months post-rescue</li>
                  </ul>
                  <div className="bg-blue-50 p-3 rounded text-[10px] text-blue-900 border border-blue-200">
                    <strong>Goal for 2026–27:</strong> Expand direct educational sponsorships from 9 to 50 children, prioritizing girl survivors of POCSO offenses and children rescued from trafficking networks.
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 12"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 13 — PROGRAM 4: COMMUNITY ══════════════════ */}
          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Program 04" right="Community Engagement"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <div className="inline-block bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">👥 Grassroots Mobilization</div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Community Vigilance & Protection</h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    A community that watches out for its children cannot be penetrated by traffickers. We establish and train local Child Protection Committees (CPCs) across urban slums, railway catchment areas, and rural hamlets.
                  </p>
                  <div className="space-y-2 mb-3">
                    {[
                      {t:"🏃 Youth Sports & Marathons",d:"Building peer solidarity, resilience, and community identity among vulnerable youth through organized sports events and awareness marathons"},
                      {t:"🎭 Street Theatre (Nukkad Natak)",d:"Powerful street dramas communicating legal rights, abuse reporting, and trafficking dangers in local dialects (Marathi, Hindi, Warli) for maximum grassroots impact"},
                      {t:"👩 Women's Safety Circles",d:"Training mothers and self-help groups (SHGs) to spot unfamiliar brokers, detect child exploitation patterns, and report suspicious activity to Childline 1098"},
                      {t:"🏘️ Neighborhood Watch Networks",d:"Engaging auto-rickshaw drivers, shopkeepers, chai vendors, and railway porters as first responders trained to identify and report unaccompanied or distressed minors"},
                    ].map((c,i)=>(
                      <div key={i} className="p-2.5 bg-slate-50 rounded text-[10.5px]">
                        <strong className="text-slate-900">{c.t}:</strong> <span className="text-slate-600">{c.d}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded text-[10px] text-purple-900 border border-purple-200">
                  <strong>Preventive Impact:</strong> Over 75% of potential child trafficking cases in our operational area are halted at the early community vigilance stage — before formal crime syndicates can take hold of vulnerable children.
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 13"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 14 — CHILD-FRIENDLY COMMUNITIES ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Program 05" right="Child-Friendly Communities"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Building Child-Friendly Neighborhoods</h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    Creating urban and semi-rural spaces where children can play, learn, and commute without fear of violence or predators. Our Child-Friendly Community (CFC) model collaborates with municipal corporations, transport unions, and local businesses to transform ordinary citizens into first responders.
                  </p>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Key CFC Initiatives:</h3>
                  <ul className="text-[10.5px] text-slate-700 list-disc pl-4 space-y-1 mb-3">
                    <li>Lighting dark transit corridors and unsafe passages near railway platforms</li>
                    <li>Creating safe study nooks and reading corners in community spaces</li>
                    <li>Training auto-rickshaw and taxi drivers as "Safe Transport" allies</li>
                    <li>Installing Childline 1098 awareness boards at bus stops and markets</li>
                    <li>Partnering with local shopkeepers to maintain "Child Safe Zones"</li>
                    <li>Organizing monthly community safety audits with youth volunteers</li>
                  </ul>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    By eliminating child abuse hotspots and building preventive shields, we protect children before crime occurs. Our model has been particularly effective in informal settlements near Virar West and Nalasopara railway corridors.
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded text-[10px] text-slate-700 border border-slate-200">
                  <strong>Model Vision:</strong> Every gram panchayat and municipal ward in Palghar district will have an active Child Protection Committee (CPC) trained by Azad Zindagi by 2028, creating a district-wide safety net for all vulnerable children.
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 14"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 15 — ADVOCACY & PARTNERSHIPS ══════════════════ */}
          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Program 06" right="Advocacy & Partnerships"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Partnership & State Advocacy</h2>
                  <div className="grid grid-cols-2 gap-2 mb-4 text-center">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded"><div className="text-xl font-black text-blue-600">32+</div><div className="text-[9px] text-slate-600 font-semibold">Govt Collaborations</div></div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded"><div className="text-xl font-black text-purple-600">16+</div><div className="text-[9px] text-slate-600 font-semibold">NGO Partners</div></div>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    NGOs cannot solve child trafficking alone without the police, courts, and state departments. We actively collaborate with a network of 32+ government mechanisms and 16+ institutional NGO partners.
                  </p>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Government Partners:</h3>
                  <ul className="text-[10.5px] text-slate-700 list-disc pl-4 space-y-0.5 mb-3">
                    <li><strong>Child Welfare Committees (CWCs):</strong> Legal filings and Individual Care Plans</li>
                    <li><strong>Juvenile Justice Boards (JJBs):</strong> Restorative justice for juveniles in conflict</li>
                    <li><strong>Anti-Human Trafficking Units (AHTU):</strong> Coordinated raids and rescue warrants</li>
                    <li><strong>District Child Protection Units (DCPU):</strong> Mission Vatsalya scheme linkages</li>
                    <li><strong>Railway Protection Force (RPF) & GRP:</strong> Station-level interception partnerships</li>
                  </ul>
                </div>
                <div>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed mb-2">
                    We also engage with the Women & Child Development Department (Maharashtra), District Collector's Office (Palghar), and local panchayat bodies to ensure systemic reforms in child protection mechanisms.
                  </p>
                  <div className="bg-blue-50 p-3 rounded text-[10px] text-blue-900 border border-blue-200">
                    <strong>Policy Impact:</strong> Our field data and case documentation have contributed to district-level policy reviews on child safety protocols at railway stations across the Western Railway network.
                  </div>
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 15"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 16 — IMPACT DASHBOARD ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Evidence" right="Impact Dashboard"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Cumulative Impact Metrics</h2>
                  <p className="text-[11px] text-slate-600 mb-3">Verified performance data generated through continuous fieldwork across Maharashtra and interstate transit routes since 2019:</p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      {n:"33,969+",l:"Total Lives Touched",c:"border-t-orange-500",bg:"bg-orange-50"},
                      {n:"29,463",l:"Children Educated & Sensitized",c:"border-t-emerald-500",bg:"bg-emerald-50"},
                      {n:"1,603",l:"Missing Cases Assisted",c:"border-t-blue-500",bg:"bg-blue-50"},
                      {n:"988",l:"Children Reintegrated Home",c:"border-t-purple-500",bg:"bg-purple-50"},
                      {n:"215",l:"Home Investigation Reports",c:"border-t-pink-500",bg:"bg-pink-50"},
                      {n:"129",l:"Awareness Campaigns Run",c:"border-t-amber-500",bg:"bg-amber-50"},
                    ].map((s,i)=>(
                      <div key={i} className={`p-3 ${s.bg} border border-slate-200 ${s.c} border-t-[3px] rounded text-center`}>
                        <div className="text-lg font-black text-slate-900">{s.n}</div>
                        <div className="text-[9px] text-slate-600 font-semibold leading-tight">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Geographic Footprint:</h3>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed mb-2">
                    Headquartered in Virar West, Palghar District (part of the Mumbai Metropolitan Region). Our teams intercept children across Western Railway corridors, Central Railway hubs, and transit borders extending into Gujarat, Madhya Pradesh, and Uttar Pradesh. Interstate tracing operations have been conducted in Bihar, West Bengal, Rajasthan, and Jharkhand.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-slate-50 border rounded"><div className="text-lg font-black text-orange-500">32+</div><div className="text-[9px] text-slate-600">Govt Collaborations</div></div>
                    <div className="p-2 bg-slate-50 border rounded"><div className="text-lg font-black text-emerald-500">16+</div><div className="text-[9px] text-slate-600">NGO Network Partners</div></div>
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 16"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 17 — GEOGRAPHIC REACH ══════════════════ */}
          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Network" right="Geographic & Operational Reach"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Operational Map & Network Coverage</h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    Our operational reach extends far beyond Virar West. Through strategic partnerships with police departments, railway authorities, and sister NGOs, we maintain active interception and tracing capabilities across Western India's most critical transit corridors.
                  </p>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Key Operational Zones:</h3>
                  <div className="space-y-1.5 text-[10.5px] mb-3">
                    {[
                      {z:"Zone A: Virar–Palghar–Dahanu Corridor",d:"Primary interception zone. Daily patrols at Virar, Nalasopara, Vasai Road, and Palghar railway stations."},
                      {z:"Zone B: Mumbai Central & Suburban",d:"Coordination with AHTU Mumbai, GRP Borivali, and suburban railway police for child rescue referrals."},
                      {z:"Zone C: Gujarat Border Transit",d:"Monitoring Vapi, Surat, and Ahmedabad routes for interstate trafficking via Western Railway."},
                      {z:"Zone D: Interstate Tracing Network",d:"On-ground home visits conducted in Bihar, UP, MP, West Bengal, Rajasthan, and Jharkhand through partner organizations."},
                    ].map((z,i)=>(
                      <div key={i} className="p-2 bg-slate-50 rounded">
                        <strong className="text-slate-900">{z.z}</strong>
                        <div className="text-[10px] text-slate-600">{z.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Institutional Synergies:</h3>
                  <p className="text-[10.5px] text-slate-600 leading-relaxed mb-2">
                    Our partner network includes organizations specializing in legal aid (POCSO cases), trauma counseling, foster care placement, and vocational training. This ecosystem approach ensures no child falls through the cracks of the protection system.
                  </p>
                  <div className="bg-slate-100 p-3 rounded text-[10px] text-slate-600">
                    <strong>2026 Target:</strong> Establish formal MoUs with 5 additional district-level child protection bodies and expand railway interception presence to 10 new stations along the Western Railway corridor.
                  </div>
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 17"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGES 18–19 — CASE STUDIES ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Case Study 01" right="Interstate Tracing"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <div className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">📁 Case File #TR-842</div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">The 400-km Railway Rescue</h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                    <strong>The Alert:</strong> Late one evening, an alert railway porter noticed a distressed 13-year-old boy wandering near the luggage compartment of an interstate express train at Virar station at 11:30 PM. The boy appeared frightened, had no ticket, and could not provide coherent answers about his destination.
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                    <strong>Intervention:</strong> Azad Zindagi's rapid transit team arrived within 15 minutes of the alert. Our trained counselor provided emergency nutrition, water, and psychological comfort in Hindi (the child's native language). An immediate intimation was filed with the Government Railway Police (GRP) station diary.
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                    <strong>Investigation:</strong> Through careful, trauma-informed questioning and coordination with our cross-state NGO network, our investigators traced the boy's parents to a remote village in Madhya Pradesh, approximately 400 km away. The parents had filed a missing complaint 3 days earlier at their local police station.
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                    <strong>Resolution:</strong> Full CWC legal proceedings were completed within 48 hours. Our field team personally escorted the child home, conducted a thorough home environment assessment, and filed the mandatory Home Investigation Report. The child was safely restored to his parents.
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                    <strong>Follow-Up:</strong> Quarterly check-ins over 12 months confirmed the child was attending school regularly, performing well academically, and showing no signs of re-trafficking risk. The family was linked with local welfare schemes for additional support.
                  </p>
                  <div className="bg-emerald-50 p-2.5 rounded text-[10px] text-emerald-900 border border-emerald-200">
                    <strong>Key Learning:</strong> This case demonstrates the critical importance of trained railway staff and community awareness. The porter's vigilance saved a child from potential trafficking within hours.
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 18"/>
            </div>
          </FlipPage>

          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Case Study 02" right="Education & Rehabilitation"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <div className="inline-block bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">📁 Case File #ED-109</div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Restoring Dignity Through Education</h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                    <strong>Background:</strong> Following extreme domestic adversity and legal trauma, Priya (name changed for POCSO privacy compliance) was forced out of school at age 14 and faced imminent child marriage arranged by extended family members in an informal settlement near Nalasopara.
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                    <strong>The Intervention:</strong> Our community vigilance network identified Priya through a Women's Safety Circle meeting. Azad Zindagi's team immediately contacted the local CWC, filed protective legal documentation, and enrolled Priya into our Educational Assistance Program with 100% fee coverage.
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                    <strong>The Support:</strong> Over the next 18 months, Priya received school fees, coaching materials, school uniforms, daily transportation support, nutritional assistance, and specialized weekly trauma counseling sessions with a certified child psychologist.
                  </p>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-2">
                    <strong>The Outcome:</strong> Priya scored <strong>84% in her Class 10 state board examinations</strong> and is now pursuing higher secondary science with aspirations of becoming a pediatrician. She has become a peer mentor for other rescued girls in our program.
                  </p>
                </div>
                <div>
                  <div className="bg-orange-50 border-l-3 border-orange-500 p-3 rounded text-[10.5px] text-slate-700 italic mb-2" style={{borderLeftWidth:"3px"}}>
                    "When someone believes you have a future, fear disappears. Azad Zindagi didn't just give me books — they gave me the courage to dream." — Priya
                  </div>
                  <div className="bg-slate-100 p-2.5 rounded text-[10px] text-slate-600">
                    <strong>Impact:</strong> Priya's story illustrates how sustained educational investment combined with trauma counseling can completely transform the trajectory of a vulnerable child's life, breaking the cycle of exploitation permanently.
                  </div>
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 19"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGES 20–21 — SOPs ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Operations Manual" right="Transit Rescue Protocols"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Transit Hub Interception SOP</h2>
                  <p className="text-[11px] text-slate-700 mb-3">Standardized protocols ensuring zero delay and maximum child dignity during field intercepts:</p>
                  <div className="space-y-2.5">
                    {[
                      {s:"Stage A: Distress Identification",d:"Trained field officers patrol platforms looking for red flags: unaccompanied minors, absence of tickets, travel during school hours, signs of physical distress, or presence with unfamiliar adults displaying suspicious behavior patterns."},
                      {s:"Stage B: Trauma-Informed First Contact",d:"Non-intrusive greeting in local dialect (Marathi/Hindi/Warli). Offering water, nutritious snack, and safe shelter. Reassuring the child they are not in trouble. Building trust before any formal questioning begins."},
                      {s:"Stage C: RPF/GRP Documentation",d:"Immediate entry in the station general diary. Formal intimation to Government Railway Police. Arranging medical checkup at the nearest civic hospital. Photographing the child per CWC protocols for missing person databases."},
                      {s:"Stage D: CWC Legal Production",d:"Presenting the child before the Child Welfare Committee within 24 hours as mandated by the Juvenile Justice Act. Filing Individual Care Plan and obtaining formal case orders for investigation."},
                      {s:"Stage E: Family Tracing & Verification",d:"Cross-referencing with missing children databases (Track Child, Khoya-Paya). Interstate coordination with police and partner NGOs. Conducting home visits for environment assessment."},
                    ].map((st,i)=>(
                      <div key={i} className="p-2.5 bg-slate-50 rounded text-[10.5px]">
                        <strong className="text-slate-900">{st.s}</strong>
                        <div className="text-slate-600 leading-relaxed">{st.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 20"/>
            </div>
          </FlipPage>

          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Community Systems" right="Vigilance Networks"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Neighborhood Child Safety Committees</h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    Creating comprehensive local protection shields across transit clusters in Palghar and Thane districts. Each committee is trained by Azad Zindagi staff and meets monthly to review safety concerns.
                  </p>
                  <div className="space-y-2 mb-3">
                    {[
                      {t:"🚗 Auto-Rickshaw & Taxi Driver Alliances",d:"Drivers trained as community eyes and ears. They report minors traveling alone late at night, children in distress with unfamiliar adults, and suspicious vehicle movements near schools and playgrounds."},
                      {t:"☕ Shopkeeper & Chai Vendor Networks",d:"Stall owners near bus depots, railway stations, and markets educated to spot suspicious brokers offering fake jobs or marriage proposals to vulnerable families. Quick-dial Childline cards distributed."},
                      {t:"🏋️ Slum Youth Vigilance Taskforces",d:"Local young leaders from informal settlements conducting weekly community sanitation drives combined with child protection awareness patrols. Peer-to-peer education among adolescents."},
                      {t:"👩‍👧 Mother Safety Circles (SHGs)",d:"Self-Help Groups of mothers trained to identify early warning signs: children missing school, domestic violence, unfamiliar visitors, or sudden economic promises that may indicate trafficking recruitment."},
                    ].map((c,i)=>(
                      <div key={i} className="p-2.5 bg-slate-50 rounded text-[10.5px]">
                        <strong className="text-slate-900">{c.t}</strong>
                        <div className="text-slate-600 leading-relaxed">{c.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded text-[10px] text-orange-900 border border-orange-200">
                  <strong>Community Impact:</strong> Our vigilance network has prevented an estimated 200+ potential trafficking incidents at the early warning stage. Trained community members now independently identify and report suspicious activities, creating a self-sustaining protection ecosystem.
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 21"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGES 22–23 — PHOTO GALLERY ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Visual Evidence" right="Ground Realities"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Our Work in Action</h2>
                  <p className="text-[11px] text-slate-600 mb-3">A glimpse into field rescues, community meetings, child awareness drives, and home investigation visits:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[1,2,3,4,5,6].map(n=>(
                      <img key={n} src={`/images/gallery/gallery-photo-0${n}.jpeg`} className="rounded aspect-[4/3] object-cover border border-slate-200 shadow-sm w-full" alt={`Field operation ${n}`}/>
                    ))}
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 text-center italic mt-2">
                  All child photographs comply strictly with POCSO child privacy and protection standards. Faces are obscured where required by law.
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 22"/>
            </div>
          </FlipPage>

          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Community Moments" right="Voices & Smiles"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Lives Transformed</h2>
                  <p className="text-[11px] text-slate-600 mb-3">Every photograph reflects a rescued child safely home, an educated student, or an empowered community member:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[7,8,9,10,11,12].map(n=>(
                      <img key={n} src={`/images/gallery/gallery-photo-${n<10?"0"+n:n}.jpeg`} className="rounded aspect-[4/3] object-cover border border-slate-200 shadow-sm w-full" alt={`Community moment ${n}`}/>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded text-[10px] text-slate-600 border border-slate-200 mt-2">
                  <strong>Documentation Protocol:</strong> All field activities are documented with timestamped photographs, GPS coordinates, and case reference numbers. This photographic evidence forms part of our annual audit trail and is available for verification by institutional donors and government partners upon request.
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 23"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGES 24–25 — LEADERSHIP ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Governance" right="Board of Directors"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Key Functionaries</h2>
                  <p className="text-[11px] text-slate-700 mb-3">Experienced social development practitioners leading our strategic vision and operational discipline:</p>
                  <div className="space-y-3">
                    {[
                      {img:"samuel-sonkamble.jpeg",name:"Mr. Samuel Sonkamble",role:"Director & Founder",c:"border-orange-500",d:"Leading field operations, rescue coordination, and government stakeholder relations since 2019. Over 6 years of frontline child protection experience across Maharashtra's Western Railway corridor."},
                      {img:"lucas-caldeira.jpeg",name:"Mr. Lucas Caldeira",role:"Director",c:"border-emerald-500",d:"Strategizing organizational expansion, administrative compliance, and youth outreach programs. Expertise in Section 8 company governance and institutional partnership development."},
                      {img:"stella-bokare.jpeg",name:"Dr. Stella Bokare",role:"Director",c:"border-blue-500",d:"Guiding child psychological support, trauma-informed care protocols, and health interventions. Background in community medicine and child welfare policy advocacy."},
                    ].map((p,i)=>(
                      <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded">
                        <img src={`/images/team/${p.img}`} className={`w-12 h-12 rounded-full object-cover border-2 ${p.c} shrink-0`} alt=""/>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] font-semibold text-orange-600 mb-0.5">{p.role}</div>
                          <div className="text-[10px] text-slate-600 leading-relaxed">{p.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-100 p-3 rounded text-[10px] text-slate-600">
                  <strong>Board Meetings:</strong> The Board of Directors convenes quarterly to review operational metrics, financial compliance, and strategic planning. All meeting minutes are documented and available for regulatory inspection.
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 24"/>
            </div>
          </FlipPage>

          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Organization" right="Promoters & Operations Team"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Foundational Promoters</h2>
                  <p className="text-[11px] text-slate-700 mb-3">Dedicated drivers of community advocacy, digital outreach, and grassroots mobilization:</p>
                  <div className="space-y-3 mb-4">
                    {[
                      {img:"nayan.webp",name:"Mr. Nayan Mali",role:"Promoter & Digital Advocate",c:"border-purple-500",d:"Championing community mobilization, digital systems development, event coordination, and social media outreach. Building the foundation's technology infrastructure for case tracking and donor management."},
                      {img:"prashansa-sanjay-dalvi.jpeg",name:"Ms. Prashansa Dalvi",role:"Promoter & Child Advocate",c:"border-pink-500",d:"Driving women's awareness groups, survivor reintegration programs, and girl child educational campaigns. Specialized in gender-sensitive intervention and adolescent mentorship."},
                    ].map((p,i)=>(
                      <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 rounded">
                        <img src={`/images/team/${p.img}`} className={`w-12 h-12 rounded-full object-cover border-2 ${p.c} shrink-0`} alt=""/>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{p.name}</div>
                          <div className="text-[10px] font-semibold text-purple-600 mb-0.5">{p.role}</div>
                          <div className="text-[10px] text-slate-600 leading-relaxed">{p.d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center mb-3">
                    <div className="text-xs font-bold text-slate-900 mb-1">Grassroots Volunteers & Investigators</div>
                    <div className="text-[10.5px] text-slate-600">Backed by <strong>40+ dedicated field volunteers</strong>, legal advisors, social workers, counseling interns, and community health workers deployed across Palghar and Thane districts.</div>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Organizational Structure:</h3>
                  <ul className="text-[10px] text-slate-600 list-disc pl-4 space-y-0.5">
                    <li>Board of Directors (3 members) — Strategic governance</li>
                    <li>Foundational Promoters (2 members) — Operational leadership</li>
                    <li>Field Investigation Unit — Rescue & tracing operations</li>
                    <li>Community Engagement Unit — Awareness & CPC formation</li>
                    <li>Legal & Documentation Cell — CWC/court compliance</li>
                    <li>Volunteer Network — 40+ trained community first-responders</li>
                  </ul>
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 25"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGES 26–27 — PARTNERS & TESTIMONIALS ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Collaborations" right="Institutional Partners"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Our Institutional Partners</h2>
                  <p className="text-[11px] text-slate-700 mb-3">We thank the judicial, enforcement, and civil society partners who empower our daily field interventions:</p>
                  <div className="space-y-2 mb-3">
                    {[
                      {t:"Anti-Human Trafficking Units (AHTU)",d:"Palghar, Thane & Mumbai Police — Coordinated rescue raids and interstate trafficking investigations",c:"border-orange-500"},
                      {t:"Railway Protection Force (RPF) & GRP",d:"Western & Central Railways — Platform-level interception, documentation, and referral protocols",c:"border-emerald-500"},
                      {t:"Child Welfare Committees (CWC)",d:"Maharashtra State — Legal case production, Individual Care Plans, and foster care orders",c:"border-blue-500"},
                      {t:"District Child Protection Units (DCPU)",d:"Women & Child Development Dept — Mission Vatsalya scheme linkages and institutional care",c:"border-purple-500"},
                      {t:"Juvenile Justice Boards (JJB)",d:"Restorative justice proceedings for children in conflict with law, rehabilitation orders",c:"border-pink-500"},
                      {t:"16+ NGO Network Allies",d:"Interstate tracing, legal aid, trauma counseling, shelter homes, and vocational training partners",c:"border-amber-500"},
                    ].map((p,i)=>(
                      <div key={i} className={`p-2.5 bg-slate-50 rounded text-[10.5px] border-l-[3px] ${p.c}`}>
                        <strong className="text-slate-900">{p.t}</strong>
                        <div className="text-slate-600">{p.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded text-[10px] text-blue-900 border border-blue-200">
                  <strong>Network Growth:</strong> In 2025–26, we established 8 new institutional partnerships, expanding our rescue and tracing capability to cover 12 additional railway stations and 3 new districts.
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 26"/>
            </div>
          </FlipPage>

          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Testimonials" right="Impact Voices"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-3">Voices from the Ground</h2>
                  <p className="text-[11px] text-slate-600 mb-3">Real accounts from parents, community elders, education partners, and protection officers:</p>
                  <div className="space-y-3">
                    {[
                      {q:"When our 13-year-old son went missing from the station, we had lost all hope. Azad Zindagi's team traced him 400 km away in Madhya Pradesh, completed all police legalities, and brought him safely home to our arms within 48 hours. We will never forget their dedication.",a:"— Reunited Father, Palghar District",c:"border-orange-500"},
                      {q:"The POCSO and child safety workshops conducted by Azad Foundation opened our eyes. Every girl in our slum school now knows how to identify predatory behavior and immediately call Childline 1098. The awareness has been transformative for our entire community.",a:"— Headmaster, Community High School, Virar",c:"border-emerald-500"},
                      {q:"Working alongside Azad Zindagi Foundation has strengthened our interception capabilities at railway stations. Their trained volunteers are often the first to spot and report unaccompanied minors, giving us critical early intelligence for rescue operations.",a:"— Senior RPF Officer, Western Railway",c:"border-blue-500"},
                      {q:"After my daughter was rescued from a child marriage situation, Azad Zindagi didn't just save her — they enrolled her in school, provided counseling, and gave her a future. She is now in Class 10 and dreams of becoming a teacher. They gave us hope.",a:"— Mother of POCSO Survivor, Nalasopara",c:"border-purple-500"},
                    ].map((t,i)=>(
                      <div key={i} className={`bg-slate-50 p-3 rounded border-l-[3px] ${t.c}`}>
                        <p className="text-[10.5px] italic text-slate-700 leading-relaxed mb-1">"{t.q}"</p>
                        <div className="text-[10px] font-bold text-slate-800">{t.a}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 27"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGES 28–29 — FINANCIALS & ROADMAP ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="Financial Integrity" right="Fund Allocation"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Fund Allocation & Stewardship</h2>
                  <p className="text-[11px] text-slate-700 mb-3">We maximize every rupee donated to go directly to on-ground child rescues and welfare. Our administrative costs are kept under 10%:</p>
                  <div className="space-y-2 mb-4">
                    {[
                      {l:"Direct Child Rescues, Tracing & Travel",p:45,c:"bg-orange-500"},
                      {l:"School Sponsorships & Educational Aid",p:25,c:"bg-emerald-500"},
                      {l:"Awareness Drives & POCSO Workshops",p:15,c:"bg-blue-500"},
                      {l:"Admin, Auditing & Legal Compliance",p:10,c:"bg-purple-500"},
                      {l:"Emergency Medical & Crisis Fund",p:5,c:"bg-pink-500"},
                    ].map((f,i)=>(
                      <div key={i}>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-800 mb-1"><span>{f.l}</span><span>{f.p}%</span></div>
                        <div className="h-2 bg-slate-100 rounded overflow-hidden"><div className={`h-full ${f.c} rounded`} style={{width:`${f.p}%`}}/></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Financial Transparency Measures:</h3>
                  <ul className="text-[10px] text-slate-600 list-disc pl-4 space-y-0.5 mb-2">
                    <li>Annual statutory audit by independent Chartered Accountant firms</li>
                    <li>Quarterly financial reviews shared with the Board of Directors</li>
                    <li>Annual MCA filings and compliance with all Companies Act provisions</li>
                    <li>Donor-wise fund utilization reports available on request</li>
                    <li>Real-time case-level expenditure tracking for every rescue operation</li>
                  </ul>
                  <div className="bg-slate-100 p-3 rounded text-[10px] text-slate-600">
                    <strong>Audit Oversight:</strong> Full statutory audited balance sheets and MCA filings available annually upon request for CSR and individual donors. Contact our office for detailed financial documentation.
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 28"/>
            </div>
          </FlipPage>

          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Vision Ahead" right="2026–2030 Strategic Roadmap"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">5-Year Strategic Goals</h2>
                  <p className="text-[11px] text-slate-700 mb-3">Our ambitious roadmap to expand child protection infrastructure across Maharashtra and Western India:</p>
                  <div className="space-y-2.5 mb-3">
                    {[
                      {y:"2026",c:"text-orange-600",d:"Launch 24/7 dedicated transit rescue kiosk at Virar & Palghar railway junctions. Establish 5 new MoUs with district protection bodies. Expand volunteer network to 75+ trained first-responders."},
                      {y:"2027",c:"text-emerald-600",d:"Expand educational scholarships to 50 vulnerable girls and POCSO survivors. Launch mobile POCSO awareness van covering 100+ schools. Establish digital case management system for real-time tracking."},
                      {y:"2028",c:"text-blue-600",d:"Establish a dedicated child trauma recovery & mental health counseling center in Palghar. Train 500+ community members through CPC formation across 50 gram panchayats. Apply for FCRA clearance for international funding."},
                      {y:"2029",c:"text-purple-600",d:"Launch vocational training center for adolescent survivors (tailoring, computer skills, hospitality). Partner with 3 corporate CSR programs for sustained multi-year funding. Publish research paper on transit-point child protection models."},
                      {y:"2030",c:"text-rose-600",d:"Scale preventive child protection models across 100+ vulnerable gram panchayats in Maharashtra. Establish Azad Zindagi as a national model for community-driven child rescue and rehabilitation. Impact target: 100,000+ children protected."},
                    ].map((g,i)=>(
                      <div key={i} className="flex gap-3 items-start p-2.5 bg-slate-50 rounded">
                        <div className={`text-sm font-black ${g.c} shrink-0 w-10`}>{g.y}</div>
                        <div className="text-[10px] text-slate-700 leading-relaxed">{g.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-orange-50 p-3 rounded text-[10px] text-orange-900 border border-orange-200">
                  <strong>Join Our Journey:</strong> Every milestone on this roadmap requires partners — individual donors, corporate CSR programs, government grants, and passionate volunteers. Your support today shapes a safer tomorrow for India's children.
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 29"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGES 30–31 — CSR & DONATION ══════════════════ */}
          <FlipPage className="p-7 page-left">
            <div className="flex flex-col h-full">
              <PageHeader left="CSR & Grants" right="Corporate Partnerships"/>
              <div className="flex-1 flex flex-col justify-between py-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">Corporate Social Responsibility</h2>
                  <p className="text-[11px] text-slate-700 leading-relaxed mb-3">
                    Azad Zindagi Foundation is eligible for corporate CSR allocations under <strong>Schedule VII of the Companies Act, 2013</strong> (Item i: Promoting education & healthcare; Item ii: Child welfare & protection).
                  </p>
                  <div className="space-y-2 mb-3">
                    {[
                      {t:"🏗️ Station Rescue Kiosk Sponsorship",d:"Adopt an interception outpost at key railway transit hubs. Sponsor field staff salaries, equipment, and rescue vehicle for 24/7 operations. Annual CSR investment: ₹15–25 lakhs."},
                      {t:"📚 100 Girl Child Education Fund",d:"Multi-year CSR grant funding tuition, STEM workshops, digital tablets, and nutritional support for 100 vulnerable girls rescued from trafficking or POCSO situations. Annual investment: ₹25–50 lakhs."},
                      {t:"🚐 Community POCSO Awareness Vans",d:"Mobile awareness vehicles equipped with audio-visual learning tools traveling into rural hamlets, tribal areas, and urban slums. Annual investment: ₹10–15 lakhs per van."},
                    ].map((c,i)=>(
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded">
                        <div className="text-[11px] font-bold text-slate-900 mb-0.5">{c.t}</div>
                        <div className="text-[10px] text-slate-600 leading-relaxed">{c.d}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">Individual Giving Options:</h3>
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[9.5px] mb-2">
                    <div className="p-2 bg-orange-50 rounded border"><div className="font-bold">₹500/mo</div><div className="text-slate-500">Education Kit</div></div>
                    <div className="p-2 bg-emerald-50 rounded border"><div className="font-bold">₹2,000/mo</div><div className="text-slate-500">Full Sponsorship</div></div>
                    <div className="p-2 bg-blue-50 rounded border"><div className="font-bold">₹5,000+</div><div className="text-slate-500">Major Gift</div></div>
                  </div>
                  <div className="text-[10px] text-slate-600">
                    <strong>CSR Inquiries:</strong> samuel.sonkamble@azadzindagi.org | +91 9892849479
                  </div>
                </div>
              </div>
              <PageFooter left="Annual Dossier 2025–26" right="Page 30"/>
            </div>
          </FlipPage>

          <FlipPage className="p-7 page-right">
            <div className="flex flex-col h-full">
              <PageHeader left="Direct Giving" right="Scan to Donate"/>
              <div className="flex-1 flex flex-col items-center justify-between py-3">
                <div className="w-full">
                  <h2 className="text-lg font-bold text-slate-900 mb-2 text-center">Donate via UPI or Bank Transfer</h2>
                  <p className="text-[11px] text-slate-600 text-center mb-3">Instant transfer via Google Pay, PhonePe, Paytm, or any BHIM UPI App:</p>
                  <div className="flex justify-center mb-3">
                    <div className="p-2 bg-white border-2 border-orange-500 rounded-lg shadow-md">
                      <img src="/images/cover/qr-code.png" alt="UPI QR Code" className="w-36 h-36 object-contain"/>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded text-[10px] w-full space-y-1 mb-3">
                    <div className="flex justify-between"><span className="text-slate-500">UPI ID:</span><span className="font-mono font-bold text-orange-600">Vyapar.175694275498@hdfcbank</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Account Name:</span><span className="font-semibold">Azad Zindagi Foundation</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Current A/C:</span><span className="font-mono font-bold">50200121687149</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">Bank & Branch:</span><span className="font-semibold">HDFC Bank, Virar West</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">IFSC Code:</span><span className="font-mono font-bold">HDFC0010006</span></div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 p-3 rounded text-[10px] text-orange-900 text-center mb-2">
                    <strong>100% Tax Deductible</strong> under Section 80G of the Income Tax Act, 1961. WhatsApp payment screenshot & PAN to <strong>+91 9892849479</strong> for instant 80G tax receipt.
                  </div>
                  <div className="text-[9px] text-slate-400 text-center">
                    All donations are utilized exclusively for child protection, rescue operations, and educational programs.
                  </div>
                </div>
              </div>
              <PageFooter left="Azad Zindagi Foundation" right="Page 31"/>
            </div>
          </FlipPage>

          {/* ══════════════════ PAGE 32 — BACK COVER ══════════════════ */}
          <FlipPage data-density="hard" className="p-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white border border-slate-800">
            <div className="flex flex-col justify-between h-full p-8">
              <div className="text-center">
                <img src="/images/cover/logo-updated.png" className="w-16 h-16 mx-auto object-contain mb-3" alt=""/>
                <div className="font-extrabold text-xl text-white tracking-wide">AZAD ZINDAGI FOUNDATION</div>
                <div className="text-[10px] text-orange-400 font-semibold tracking-[3px] mt-1">CHILD PROTECTION & REINTEGRATION</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center max-w-sm mx-auto">
                <div className="font-bold text-orange-400 mb-3 uppercase text-[10px] tracking-wider">Contact & Office</div>
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <div>📍 F 102 & 103, Violet Building 16, Yashwant Nagar, Virar West, Palghar, Maharashtra 401303</div>
                  <div className="text-emerald-400 font-semibold text-sm">📞 +91 9892849479</div>
                  <div className="text-blue-400 font-mono text-[11px]">azadzindagifoundation@gmail.com</div>
                  <div className="text-amber-400 text-[11px]">www.azadzindagifoundation.org</div>
                </div>
              </div>

              <div className="text-center space-y-2">
                <div className="grid grid-cols-3 gap-2 bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <div><div className="text-lg font-black text-orange-400">33,969+</div><div className="text-[8px] text-slate-400 uppercase">Lives</div></div>
                  <div className="border-x border-white/10"><div className="text-lg font-black text-emerald-400">1,603</div><div className="text-[8px] text-slate-400 uppercase">Rescued</div></div>
                  <div><div className="text-lg font-black text-amber-400">988</div><div className="text-[8px] text-slate-400 uppercase">Reunited</div></div>
                </div>
                <div className="text-[10px] text-slate-400 border-t border-white/10 pt-3">
                  CIN: U88900MH2025NPL458914 | Darpan ID: MH/2026/1031675
                </div>
                <div className="text-[10px] text-red-400 font-bold">
                  🆘 CHILD IN DANGER? CALL TOLL-FREE 1098 IMMEDIATELY
                </div>
                <div className="text-[9px] text-slate-500">© 2026 Azad Zindagi Foundation. All Rights Reserved.</div>
              </div>
            </div>
          </FlipPage>

        </BookSlider>

        <button onClick={nextPage} className="absolute right-2 md:right-6 z-30 w-11 h-11 rounded-full bg-slate-900/80 hover:bg-orange-500 text-white flex items-center justify-center backdrop-blur shadow-xl transition-all border border-slate-700/50" title="Next"><ChevronRight className="w-6 h-6"/></button>
      </main>

      {/* ─── BOTTOM BAR ─── */}
      <footer className="h-12 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-4 flex items-center justify-between text-xs text-slate-400 z-40 select-none shrink-0">
        <span className="hidden sm:block text-[11px]">Standard A4 Portrait (Landscape Spread)</span>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={prevPage} className="h-7 text-xs gap-1"><ChevronLeft className="w-3.5 h-3.5"/> Prev</Button>
          <span className="font-mono bg-slate-800 px-3 py-1 rounded text-orange-400 font-bold">Page {currentPage + 1} / {totalPages}</span>
          <Button variant="ghost" size="sm" onClick={nextPage} className="h-7 text-xs gap-1">Next <ChevronRight className="w-3.5 h-3.5"/></Button>
        </div>
        <span className="hidden sm:block text-[11px] text-slate-500">React-PageFlip & shadcn UI</span>
      </footer>

      {/* ─── TOC DRAWER ─── */}
      {showTOC && (
        <div className="fixed inset-y-14 right-0 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 p-5 z-50 overflow-y-auto shadow-2xl">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm">32-Page Directory</h3>
            <button onClick={()=>setShowTOC(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>
          <div className="space-y-1.5 text-xs">
            {[
              {p:0,t:"Cover Page"},{p:1,t:"Foreword"},{p:2,t:"Table of Contents"},
              {p:3,t:"Vision & Mission"},{p:4,t:"Core Values"},{p:5,t:"Legal Standing"},
              {p:6,t:"Governance"},{p:7,t:"Protection Crisis"},{p:8,t:"Response Model"},
              {p:9,t:"Tracing & Reintegration"},{p:10,t:"Education & Awareness"},
              {p:11,t:"Sponsorships & POCSO"},{p:12,t:"Community Vigilance"},
              {p:13,t:"Child-Friendly Cities"},{p:14,t:"Advocacy & Partnerships"},
              {p:15,t:"Impact Dashboard"},{p:16,t:"Geographic Reach"},
              {p:17,t:"Case Study: Railway Rescue"},{p:18,t:"Case Study: Education"},
              {p:19,t:"Transit SOPs"},{p:20,t:"Vigilance Networks"},
              {p:21,t:"Photo Gallery I"},{p:22,t:"Photo Gallery II"},
              {p:23,t:"Board of Directors"},{p:24,t:"Promoters & Team"},
              {p:25,t:"Institutional Partners"},{p:26,t:"Testimonials"},
              {p:27,t:"Financial Allocation"},{p:28,t:"2030 Roadmap"},
              {p:29,t:"CSR Opportunities"},{p:30,t:"UPI & Bank Details"},
              {p:31,t:"Back Cover & Contacts"},
            ].map((item)=>(
              <button key={item.p} onClick={()=>goToPage(item.p)} className="w-full text-left p-2 rounded bg-slate-800/60 hover:bg-orange-500/20 hover:text-orange-400 transition-colors flex justify-between">
                <span>{item.t}</span>
                <span className="font-mono text-slate-500">P.{item.p+1}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
