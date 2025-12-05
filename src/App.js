import React, { useState, useEffect, useRef } from 'react';

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
  const [cubeRotation, setCubeRotation] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
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

  // Cube physics with requestAnimationFrame for smooth performance
  useEffect(() => {
    let animationFrameId;
    
    const animate = () => {
      if (!isDragging && (Math.abs(velocityRef.current.x) > 0.01 || Math.abs(velocityRef.current.y) > 0.01)) {
        setCubeRotation(prev => ({
          x: prev.x + velocityRef.current.x,
          y: prev.y + velocityRef.current.y
        }));
        
        velocityRef.current = {
          x: velocityRef.current.x * 0.96,
          y: velocityRef.current.y * 0.96
        };
        
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    if (!isDragging) {
      animationFrameId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDragging]);

  const handleCubeMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCubeMouseMove = (e) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setCubeRotation(prev => ({
        x: prev.x - deltaY * 0.5,
        y: prev.y - deltaX * 0.5
      }));
      velocityRef.current = {
        x: -deltaY * 0.3,
        y: -deltaX * 0.3
      };
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleCubeMouseUp = () => {
    setIsDragging(false);
  };

  
  const projects = [
    {
      title: "RealVision",
      shortDesc: "Alzheimer's detection app",
      fullDesc: "Flutter mobile application hosted on AWS that detects early signs of Alzheimer's disease for 100+ study participants. Designed and deployed multimodal ML models in PyTorch analyzing gait patterns, verbal fluency, eye-tracking data, and facial expressions. Built comprehensive data pipelines using Apple HealthKit and Android Health Connect, achieving 83% model accuracy.",
      tech: ["Python", "PyTorch", "Flutter", "AWS", "NLP"],
      github: "https://github.com/evatate/RealVision",
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
    {
      title: "Weather App",
      shortDesc: "Android weather application",
      fullDesc: "Native Android weather application built with Kotlin providing real-time weather data, 7-day forecasts, and location-based services. Features a clean Material Design interface with smooth animations.",
      tech: ["Kotlin", "Android", "REST API"],
      github: "https://github.com/evatate/Weather-Information-App",
      image: "/Images/weather.jpg"
    },
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
    "Languages": ["Python", "Java", "C/C++", "Kotlin", "SQL", "R", "Bash"],
    "ML/AI": ["PyTorch", "TensorFlow", "Scikit-learn", "HuggingFace", "NLP"],
    "Tools": ["AWS", "Git", "Flutter", "Pandas", "NumPy", "Jupyter"],
    "Mobile": ["Android", "iOS", "React Native", "Flutter"]
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden"
         onMouseMove={handleCubeMouseMove}
         onMouseUp={handleCubeMouseUp}>
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="text-xl font-bold">Eva Tate</div>
        <div className="flex gap-6 text-sm">
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-400 transition-colors">About</button>
          <button onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-400 transition-colors">Experience</button>
          <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-400 transition-colors">Projects</button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-gray-400 transition-colors">Contact</button>
        </div>
      </div>

      {/* Hero with 3D Cube */}
      <section className="min-h-screen flex items-center justify-center px-6 relative pt-20">
        <div className="absolute inset-0 overflow-hidden opacity-5">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                animationDelay: Math.random() * 5 + 's'
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl w-full mx-auto flex items-center justify-center gap-16">
          {/* Left side - Text */}
          <div className="text-left animate-fade-in">
            <p className="text-sm font-light text-gray-300 tracking-widest">A COLLECTION OF</p>
            <p className="text-3xl font-bold text-white mt-2">Projects</p>
          </div>

          {/* Center - Cube */}
          <div className="flex flex-col items-center">
            <div className="mb-6 text-center animate-fade-in">
              <p className="text-gray-400 text-sm tracking-widest mb-2">DRAG TO ROTATE</p>
            </div>

            {/* Interactive 3D Cube */}
            <div className="perspective-1000 cursor-grab active:cursor-grabbing select-none"
                 onMouseDown={handleCubeMouseDown}
                 style={{ touchAction: 'none' }}>
              <div 
                className="w-64 h-64 relative preserve-3d will-change-transform"
                style={{
                  transform: `rotateX(${cubeRotation.x}deg) rotateY(${cubeRotation.y}deg)`,
                  transformStyle: 'preserve-3d'
                }}>
                {/* Front */}
                <div className="absolute w-64 h-64 bg-black border-2 border-white flex items-center justify-center"
                     style={{ transform: 'translateZ(132px)' }}>
                  <p className="text-6xl font-light text-white">Hi!</p>
                </div>
                {/* Back */}
                <div className="absolute w-64 h-64 bg-black border-2 border-white flex items-center justify-center"
                     style={{ transform: 'translateZ(-132px) rotateY(180deg)' }}>
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-white">I'm</p>
                    <p className="text-2xl font-light text-white">Eva</p>
                  </div>
                </div>
                {/* Right */}
                <div className="absolute w-64 h-64 bg-black border-2 border-white flex items-center justify-center"
                     style={{ transform: 'rotateY(90deg) translateZ(132px)' }}>
                  <div className="text-center px-4">
                    <p className="text-xl font-semibold text-white">Computer</p>
                    <p className="text-xl font-semibold text-white">Science</p>
                  </div>
                </div>
                {/* Left */}
                <div className="absolute w-64 h-64 bg-black border-2 border-white flex items-center justify-center"
                     style={{ transform: 'rotateY(-90deg) translateZ(132px)' }}>
                  <div className="text-center">
                    <p className="text-xl font-semibold text-white">Dartmouth</p>
                    <p className="text-lg font-light text-gray-200 mt-1">'27</p>
                  </div>
                </div>
                {/* Top */}
                <div className="absolute w-64 h-64 bg-black border-2 border-white flex items-center justify-center"
                     style={{ transform: 'rotateX(90deg) translateZ(132px)' }}>
                  <p className="text-lg font-semibold text-white tracking-wide">Machine Learning</p>
                </div>
                {/* Bottom */}
                <div className="absolute w-64 h-64 bg-black border-2 border-white flex items-center justify-center"
                     style={{ transform: 'rotateX(-90deg) translateZ(132px)' }}>
                  <p className="text-lg font-semibold text-white tracking-wide">Data Analytics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side text */}
          <div className="text-right animate-fade-in-delay">
            <p className="text-sm font-light text-white tracking-widest">Eva Tate<br/>Dartmouth College '27</p>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-xs font-light text-gray-400 tracking-widest uppercase">Scroll to explore</p>
          <div className="animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60 hover:text-white/90 transition-colors">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </section>

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
            <div style={{
              transitionDelay: visibleSections.has('about') ? '0.4s' : '0s',
              opacity: visibleSections.has('about') ? 1 : 0,
              transform: visibleSections.has('about') ? 'translateX(0)' : 'translateX(40px)',
              transition: 'all 0.8s ease-out'
            }}>
              <div className="mb-6">
                <p className="text-xs font-light text-gray-400 tracking-widest uppercase mb-3">About Me</p>
                <h3 className="text-lg md:text-xl font-semibold text-white">Dartmouth College <span className="text-gray-500">|</span> Computer Science</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed font-light tracking-wide\">
                Hi! I'm Eva, a junior at Dartmouth College. I'm passionate about applying machine learning and data science to real-world problems, from building predictive models to deploying multimodal ML systems. My projects range from early Alzheimer's detection to predicting customer behavior to brain-to-text decoding for ALS patients. Outside of coding, you can find me running with the Dartmouth Running Team, climbing with the Mountaineering Club, or making clothes and teddy bears in the Makerspace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-24 px-6 md:px-12 lg:px-24" data-section="experience">
        <div className="max-w-4xl mx-auto">
          <div className={`transition-all duration-1000 ${visibleSections.has('experience') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-16">Experience</h2>
            <div className="relative">
              {/* Animated Progress Line */}
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
                    {/* Animated Dot */}
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

      {/* Projects Section */}
      <section id="projects" className="py-24 px-6 md:px-12 lg:px-24" data-section="projects">
        <div className="max-w-7xl mx-auto">
          <div className={`transition-all duration-1000 ${visibleSections.has('projects') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-16">Projects</h2>
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
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-fade-in"
             onClick={() => setSelectedProject(null)}>
          <div className="bg-black border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            </div>
            <div className="p-8">
              <h2 className="text-4xl font-bold mb-4">{selectedProject.title}</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">{selectedProject.fullDesc}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedProject.tech.map((tech, i) => (
                  <span key={i} className="px-3 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-mono">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <a
                  href={selectedProject.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all">
                  <Github size={20} />
                  View on GitHub
                  <ExternalLink size={16} />
                </a>
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
      <section className="py-24 px-6 md:px-12 lg:px-24" data-section="skills">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 ${visibleSections.has('skills') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-12">Skills</h2>
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

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 md:px-12 lg:px-24" data-section="contact">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${visibleSections.has('contact') ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <h2 className="text-5xl md:text-6xl font-bold mb-8">Get In Touch</h2>
            <p className="text-sm text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed tracking-wide font-light">
              I'd love to connect. Feel free to reach out by email, or find me on <span className="text-white">LinkedIn</span> and <span className="text-white">GitHub</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="mailto:eva.n.tate.27@dartmouth.edu" 
                 className="group flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all">
                <Mail size={20} />
                eva.n.tate.27@dartmouth.edu
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(-10px, 10px); }
          75% { transform: translate(10px, 10px); }
        }
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(16px); opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  );
}