import React, { useState, useEffect } from 'react';
import VaultGate from './VaultGate';
import RecordPlayer from './RecordPlayer';

// Simple icon components to replace lucide-react
const Github = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const Mail = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const Phone = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const ExternalLink = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const ArrowUpRight = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [timelineProgress, setTimelineProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const timelineSection = document.getElementById('experience');
      if (timelineSection) {
        const rect = timelineSection.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const progress = Math.max(0, Math.min(100, ((window.innerHeight - sectionTop) / sectionHeight) * 100));
        setTimelineProgress(progress);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('[data-section]').forEach(el => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  const projects = [
    {
      title: "ClawTrap",
      shortDesc: "AI agent honeypot for threat intelligence",
      fullDesc: "Built an AI agent honeypot during an internship at Palo Alto Networks: a decoy assistant with a fabricated persona and fake internal tools served over MCP to a locally-hosted LLM (Ollama/Qwen3), designed to attract and contain attacker behavior against AI agents. Implemented a default-deny network kill switch enforced with iptables that hard-cuts the VM and automatically suspends and clones it for forensics on any disallowed egress attempt, a live AWS canary credential for independent exfiltration alerts, and a scripted attacker simulator driving five real attack playbooks (reconnaissance, business email compromise, indirect prompt injection, sandbox escape, unauthorized deployment). Captured sessions are scored with a rule-based risk engine tagged against MITRE ATLAS techniques, converted into STIX 2.1 objects, and served over a TAXII 2.1 server consumed by Cortex XSOAR's Threat Intel Management module as a live feed.",
      tech: ["Python", "OpenClaw", "Ollama", "MCP", "iptables", "STIX/TAXII", "JavaScript"],
      github: "https://github.com/evatate/ClawTrap",
      image: "/Images/clawtrap.png"
    },
    {
      title: "Dartbid",
      shortDesc: "Full-stack course enrollment marketplace",
      fullDesc: "Built a full-stack course enrollment marketplace with a React frontend, Flask REST API, and MySQL database hosted on Railway and deployed on Render. The core of the project is a 13-step atomic database transaction that transfers enrollment, settles both parties' account balances, invalidates competing bids, and appends an immutable price history record or rolls everything back on failure. Implemented JWT auth, bcrypt password hashing, parameterized queries, and buyer/seller anonymity enforced at the query layer.",
      tech: ["Python", "SQL", "Flask", "React", "REST API", "MySQL"],
      github: "https://github.com/evatate/DartBid",
      site: "https://dartbid-frontend.onrender.com",
      image: "/Images/dartbid.png"
    },
    {
      title: "ECG Digitization",
      shortDesc: "Deep learning pipeline for ECG digitization",
      fullDesc: "Developed an end-to-end deep learning pipeline for the PhysioNet 2025 ECG Image Digitization challenge, reconstructing calibrated 12-lead ECG time-series signals from scanned and photographed paper records. The system combines a ResNet-34 U-Net (PyTorch) for trace segmentation with sub-pixel signal extraction, FFT-based physical calibration, morphology-preserving filtering, and physiologically constrained post-processing (Einthoven’s law enforcement). The approach integrates computer vision and signal processing to convert legacy ECG images into clinically usable digital data.",
      tech: ["Python", "PyTorch", "Computer Vision", "Signal Processing"],
      github: "https://github.com/evatate/ECG-Digitization",
      image: "/Images/ECG_Digitization.jpg"
    },
    {
      title: "RealVision",
      shortDesc: "Alzheimer's detection app",
      fullDesc: "RealVision: Multimodal Machine Learning for ADRD Screening is a fully deployed cross-platform (iOS and Android) mobile application that applies digital phenotyping to screen for early indicators of Alzheimer’s Disease and Related Dementias. The system captures behavioral and neurological signals, including speech patterns, eye movements, facial expressiveness, and gait biomechanics, which have been independently validated in prior clinical trials and machine learning research. Using an interpretable, feature-based multimodal architecture, RealVision transforms these real-world behavioral markers into modality-specific risk scores and cognitive estimates. Built with Flutter and deployed on HIPAA-aligned AWS infrastructure, the platform enables scalable, low-burden cognitive screening outside traditional clinical environments and was used in formal clinical validation studies.",
      tech: ["Python", "PyTorch", "Flutter", "AWS", "NLP"],
      github: "https://github.com/evatate/RealVision",
      appStore: "http://apps.apple.com/us/app/realvision-research/id6757725921",
      image: "/Images/realvision.jpg.webp"
    },
    {
      title: "Brain-to-Text Decoding",
      shortDesc: "Neural speech decoding for ALS patients",
      fullDesc: "Developed algorithms for decoding speech from intracortical neural activity to restore communication for people with ALS. Built deep learning models to map variable-length neural time series to text, achieving improved word error rates through advanced phoneme decoding and language modeling techniques. Part of the Brain-to-Text '25 competition fostering clinical translation of speech BCIs.",
      tech: ["Python", "Deep Learning", "Neural Decoding", "NLP"],
      github: "https://github.com/rachaelhuang/brain-to-text-model/tree/evatate",
      image: "/Images/b2txt.png.avif"
    },
    {
      title: "SiFT Security",
      shortDesc: "Secure file transfer protocol",
      fullDesc: "Custom implementation of a secure file transfer protocol featuring end-to-end encryption, authentication mechanisms, and integrity verification. Built comprehensive security measures to ensure safe data transmission across networks.",
      tech: ["Python", "Cryptography", "Networking"],
      github: "https://github.com/evatate/SiFT-Security",
      image: "/Images/sift.jpg.webp"
    },
    /*
    {
      title: "Weather App",
      shortDesc: "Android weather application",
      fullDesc: "Native Android weather application built with Kotlin providing real-time weather data, 7-day forecasts, and location-based services. Features a clean Material Design interface with smooth animations.",
      tech: ["Kotlin", "Android", "REST API"],
      github: "https://github.com/evatate/Weather-Information-App",
      image: "/Images/weather.jpg"
    },
    */
    {
      title: "Tiny Search Engine",
      shortDesc: "Custom search engine in C",
      fullDesc: "Full-featured search engine built from scratch in C, including a web crawler, indexer, and query processor. Implements efficient data structures and algorithms for fast retrieval and relevance scoring.",
      tech: ["C", "Data Structures", "Algorithms"],
      github: "https://github.com/evatate/Tiny-Search-Engine",
      image: "/Images/tse.png.webp"
    },
    {
      title: "POS Tagger",
      shortDesc: "NLP part-of-speech tagger",
      fullDesc: "Natural language processing system using Hidden Markov Models to accurately identify grammatical categories and parse sentence structure for linguistic analysis.",
      tech: ["Java", "NLP", "Machine Learning"],
      github: "https://github.com/evatate/POS-Tagger",
      image: "/Images/pos.png"
    },
    {
      title: "Nuggets Game",
      shortDesc: "Multiplayer networked game",
      fullDesc: "Real-time multiplayer game featuring network programming, collaborative gameplay mechanics, and dynamic map generation. Implements client-server architecture with efficient message passing.",
      tech: ["C", "Networking", "Game Dev"],
      github: "https://github.com/evatate/Nuggets-Game",
      image: "/Images/nuggets.png"
    }
  ];

  const experience = [
    { role: "ML Engineer", company: "Empower Lab", period: "Sept 2025 - Feb 2026" },
    { role: "Data Science Consultant", company: "Dartmouth Tech Consulting", period: "Sept 2024 - June 2025" },
    { role: "Software Engineer", company: "Dartmouth Formula Racing", period: "Sept 2023 - June 2024" },
    { role: "Mentor", company: "Women in CS", period: "Sept 2023 - June 2025" }
  ];

  const skills = {
    "Languages": ["Python", "Java", "C/C++", "Kotlin", "SQL", "R", "Bash", "Dart"],
    "ML/AI": ["PyTorch", "TensorFlow", "Scikit-learn", "HuggingFace", "NLP", "LangChain", "MCP", "OpenClaw", "Claude Code"],
    "Network Engineering": ["AWS", "Terraform", "Next-Gen Firewalls", "VPN", "Active Directory", "Okta", "BGP", "NAT"],
    "Tools": ["Git", "Docker", "Pandas", "NumPy", "Jupyter"]
  };

  const certifications = [
    { name: "CompTIA Network+ ce Certification", image: "https://images.credly.com/images/c70ba73e-3c8a-46fa-9d60-4a9af94ad662/linkedin_thumb_blob", url: "https://www.credly.com/badges/6a02a899-5c57-44fc-b594-0933a932f5a3/public_url" },
    { name: "CompTIA Security+ ce Certification", image: "https://images.credly.com/images/80d8a06a-c384-42bf-ad36-db81bce5adce/linkedin_thumb_blob", url: "https://www.credly.com/badges/8fb534b5-e6e6-47c5-9f98-2df118068354/public_url" },
    { name: "Palo Alto Networks Certified Cybersecurity Apprentice", image: "https://images.credly.com/images/4c16446e-9b30-46b0-b739-6a58b7980b78/linkedin_thumb_blob", url: "https://www.credly.com/badges/0da44875-6fa5-43a2-9d31-4978ac1b316c/public_url" },
    { name: "Palo Alto Networks Certified Cybersecurity Practitioner", image: "https://images.credly.com/images/57590a7a-6383-4649-92ed-4a41659dcd23/linkedin_thumb_blob", url: "https://www.credly.com/badges/4a04664b-a01b-4f46-b276-e02b75486bde/public_url" },
    { name: "Palo Alto Networks Certified Security Operations Professional", image: "https://images.credly.com/images/5faac3ed-6bbd-43d8-8712-667e13c38740/linkedin_thumb_blob", url: "https://www.credly.com/badges/9f9244db-f0ae-4c08-beae-392c155be306/public_url" },
    { name: "Palo Alto Networks Certified Cloud Security Professional", image: "https://images.credly.com/images/914f9fa7-58f3-447e-9a53-d31805e7523e/linkedin_thumb_blob", url: "https://www.credly.com/badges/0e8b3fd8-aa4b-4fa3-895a-0735d29510fa/public_url" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="text-lg md:text-xl font-bold">Eva Tate</div>
        <div className="flex gap-3 md:gap-6 text-xs md:text-sm">
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-400 transition-colors">About</button>
          {/* <button onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-400 transition-colors">Experience</button> */}
          <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-400 transition-colors">Projects</button>
          <button onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-400 transition-colors">Skills</button>
          <button onClick={() => document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-400 transition-colors">Certifications</button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-400 transition-colors">Contact</button>
        </div>
      </div>

      <VaultGate />

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-12 lg:px-24" data-section="about">
        <div className="max-w-6xl mx-auto">
          <div className={`grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${visibleSections.has('about') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            {/* Left - Profile Image */}
            <div className="flex justify-center"
                 style={{
                   transitionDelay: visibleSections.has('about') ? '0.2s' : '0s',
                   opacity: visibleSections.has('about') ? 1 : 0,
                   transform: visibleSections.has('about') ? 'translateX(0)' : 'translateX(-40px)',
                   transition: 'all 0.8s ease-out'
                 }}>
              <div className="w-full h-96 rounded-2xl overflow-hidden border-2 border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-lg hover:shadow-white/10">
                <img 
                  src="/Images/me.jpeg"
                  alt="Eva Tate"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
            
            {/* Right - Text */}
            <div className="relative" style={{
              transitionDelay: visibleSections.has('about') ? '0.4s' : '0s',
              opacity: visibleSections.has('about') ? 1 : 0,
              transform: visibleSections.has('about') ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 0.8s ease-out'
            }}>
              <div className="relative mb-6 pr-16">
                <div className="absolute right-6 bottom-0">
                  <RecordPlayer />
                </div>
                <p className="text-xs font-light text-gray-400 tracking-widest uppercase mb-3">About Me</p>
                <h3 className="text-lg md:text-xl font-semibold text-white">Dartmouth College <span className="text-gray-500">|</span> Computer Science</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-light tracking-wide\">
                Hi! I'm Eva, a senior at Dartmouth College majoring in CS. I'm passionate about building and securing machine learning systems from multimodal clinical ML deployed in trials to the AI agents that are starting to run inside enterprise infrastructure. Last summer I interned as a Systems Engineer at Palo Alto Networks, configuring next-gen firewalls and cloud network infrastructure and demoing enterprise AI security products to executive leadership. My personal projects span early Alzheimer's detection, predicting customer behavior, brain-to-text decoding for ALS patients, and an AI-agent honeypot I built to study how autonomous systems fail under attack. Outside of coding, you can find me running with the Dartmouth Running Team, backpacking with the Outing Club, or making rings in the Jewelry Studio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      {/*
      <section id="experience" className="py-24 px-6 md:px-12 lg:px-24" data-section="experience">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${visibleSections.has('experience') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-16">Experience</h2>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-white/10"></div>
              <div 
                className="absolute left-0 top-0 w-0.5 bg-white transition-all duration-300"
                style={{ height: `${timelineProgress}%` }}
              ></div>

              <div className="space-y-16">
                {experience.map((exp, idx) => (
                  <div key={idx} 
                       className="relative pl-12 group"
                       style={{
                         transitionDelay: `${idx * 0.15}s`,
                         opacity: visibleSections.has('experience') ? 1 : 0,
                         transform: visibleSections.has('experience') ? 'translateX(0)' : 'translateX(-40px)',
                         transition: 'all 0.8s ease-out'
                       }}>
                    <div 
                      className="absolute left-0 top-2 w-3 h-3 bg-white rounded-full transform -translate-x-[5px] group-hover:scale-150 transition-transform duration-300"
                      style={{
                        boxShadow: '0 0 20px rgba(255,255,255,0.5)'
                      }}
                    ></div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105">
                      <h3 className="text-2xl font-bold mb-1">{exp.role}</h3>
                      <p className="text-gray-400 text-lg mb-2">{exp.company}</p>
                      <p className="text-sm text-gray-500 font-mono">{exp.period}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 md:px-12 lg:px-24" data-section="projects">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 ${visibleSections.has('projects') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-16">Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedProject(project)}
                  className="group cursor-pointer"
                  style={{
                    transitionDelay: `${(idx % 3) * 0.1}s`,
                    opacity: visibleSections.has('projects') ? 1 : 0,
                    transform: visibleSections.has('projects') ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'all 0.8s ease-out'
                  }}>
                  <div className="relative overflow-hidden rounded-xl mb-4 aspect-video bg-gray-900">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-semibold flex items-center gap-2">
                        View Details <ArrowUpRight size={20} />
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-gray-300 transition-colors">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{project.shortDesc}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-6 animate-fade-in"
             onClick={() => setSelectedProject(null)}>
          <div className="bg-black border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            <div className="relative h-48 md:h-80 overflow-hidden rounded-t-2xl">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            </div>
            <div className="p-6 md:p-8">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">{selectedProject.title}</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">{selectedProject.fullDesc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tech.map((tech, i) => (
                  <span key={i} className="px-3 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-mono">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all">
                  <Github size={20} />
                  View on GitHub
                  <ExternalLink size={16} />
                </a>
                {selectedProject.appStore && (
                  <a
                    href={selectedProject.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71,19.5c-.83,1.24-1.71,2.45-3.05,2.47-1.34,.03-1.77-.79-3.29-.79-1.53,0-2,.76-3.27,.82-1.31,.05-2.3-1.32-3.14-2.53C4.25,17.79,2.94,14.6,3.79,12.19c.43-1.19,1.4-1.95,2.44-1.97,1.21-.02,2.35,.81,3.09,.81,.74,0,2.13-1.01,3.6-.86,.61,.03,2.33,.25,3.44,1.86-.09,.06-2.05,1.19-2.04,3.55,.02,2.82,2.46,3.77,2.48,3.78-.02,.07-.39,1.3-.89,2.09h0Zm-5.52-13.91c.73-.87,1.22-2.07,1.08-3.28-1.05,.04-2.32,.7-3.08,1.57-.68,.78-1.27,2.04-1.11,3.23,1.17,.09,2.37-.6,3.11-1.52Z"/>
                    </svg>
                    App Store
                    <ExternalLink size={16} />
                  </a>
                )}
                {selectedProject.site && (
                  <a
                    href={selectedProject.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all">
                    Visit Site
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-3 border border-white/20 rounded-full font-semibold hover:bg-white/5 transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skills Section */}
      <section id="skills" className="py-24 px-6 md:px-12 lg:px-24" data-section="skills">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${visibleSections.has('skills') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12">Skills</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(skills).map(([category, items], idx) => (
                <div key={idx} 
                     className="p-6 border border-white/10 rounded-xl hover:border-white/30 hover:bg-white/5 transition-all duration-300"
                     style={{
                       transitionDelay: `${idx * 0.1}s`,
                       opacity: visibleSections.has('skills') ? 1 : 0,
                       transform: visibleSections.has('skills') ? 'translateY(0)' : 'translateY(30px)',
                       transition: 'all 0.8s ease-out'
                     }}>
                  <h3 className="text-xl font-bold mb-4">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-mono hover:bg-white/10 transition-colors">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-10 px-4 md:px-6 lg:px-8" data-section="certifications">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 ${visibleSections.has('certifications') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-12">Certifications</h2>
            <div className="grid grid-cols-6 gap-0.5">
              {certifications.map((cert, idx) => (
                <a
                  key={idx}
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={cert.name}
                  className="group"
                  style={{
                    transitionDelay: `${idx * 0.06}s`,
                    opacity: visibleSections.has('certifications') ? 1 : 0,
                    transform: visibleSections.has('certifications') ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s ease-out'
                  }}>
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-full h-auto object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-12 lg:px-24" data-section="contact">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${visibleSections.has('contact') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8">Get In Touch</h2>
            <p className="text-sm text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide font-light">
              I'd love to connect. Feel free to reach out by email, or find me on <span className="text-white">LinkedIn</span> and <span className="text-white">GitHub</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="mailto:etate20056@gmail.com"
                 className="group flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all">
                <Mail size={20} />
                etate20056@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/eva-tate-5b10292ab/" 
                 target="_blank"
                 rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 font-semibold rounded-full hover:border-white hover:bg-white/5 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <a href="https://github.com/evatate" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="flex items-center justify-center gap-2 px-6 py-3 border border-white/20 font-semibold rounded-full hover:border-white hover:bg-white/5 transition-all">
                <Github size={20} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center text-gray-500">
        <p>Built with React</p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}