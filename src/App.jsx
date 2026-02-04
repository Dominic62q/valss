import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import "./App.css";

// IMPORT YOUR PHOTOS HERE
// Make sure these files are in your src/assets folder
import mirrorPic from "./assets/mirror.jpg";
import closeupPic from "./assets/closeup.jpg";

// --- CONTENT CONFIGURATION ---
const pages = [
  {
    id: 0,
    image: mirrorPic, // Your Mirror Selfie
    caption: "Us, just being us...",
    title: "To My Love,",
    text: (
      <>
        Every bird that chirps sings your name.<br/>
        In this crazy world, you are my calm,<br/>
        my home, and my favorite adventure.
      </>
    ),
    signature: "Forever Yours, Me",
  },
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80", // Placeholder (You can replace this too!)
    caption: "Every heartbeat...",
    title: "Stolen Moments",
    text: (
      <>
        You turn my ordinary days<br/>
        into extraordinary memories,<br/>
        and my dreams into beautiful reality.<br/>
        In every breath, it's always been you.
      </>
    ),
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80", // Placeholder
    caption: "Forever & Always",
    title: "Forever Yours",
    text: (
      <>
        In your eyes, I found my home.<br/>
        In your heart, I found my love.<br/>
        In your soul, I found forever.<br/>
        You are my always.
      </>
    ),
  },
  {
    id: 3,
    image: closeupPic, // Your Close-up Photo (The Finale)
    caption: "Feb 14, 2026",
    title: "Happy Valentine's",
    text: (
      <>
        Thank you for choosing me.<br/>
        Today, tomorrow, forever—<br/>
        you are my greatest gift,<br/>
        my sweetest blessing,<br/>
        my one true love.
      </>
    ),
  }
];

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const audioRef = useRef(null);

  // --- 3D Parallax Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    if (isOpen) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const toggleCard = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      audioRef.current.play().catch(e => console.log("Audio needed interaction"));
      fireConfetti(0.7);
    } else {
      audioRef.current.pause();
      setPageIndex(0); 
    }
  };

  const nextPage = (e) => {
    e.stopPropagation();
    if (pageIndex < pages.length - 1) {
      setPageIndex(pageIndex + 1);
      fireConfetti(0.5);
    }
  };

  const prevPage = (e) => {
    e.stopPropagation();
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const fireConfetti = (yOrigin) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: yOrigin },
      colors: ["#ff4d6d", "#ffb3c1", "#fff0f3"],
      zIndex: 9999,
    });
  };

  return (
    <div className="scene">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/02/07/audio_6593452b31.mp3" loop />
      
      {/* Ambient Layers */}
      <div className="ambient">
        <div className="aurora a1"></div>
        <div className="aurora a2"></div>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      {/* Chirping Birds */}
      <div className="birds">
        <span className="bird b1">🐦</span>
        <span className="bird b2">🐦</span>
        <span className="bird b3">🕊️</span>
        <span className="bird b4">🐦</span>
      </div>

      {/* Background Particles */}
      <div className="bg-particles">
        {[...Array(20)].map((_, i) => <div key={i} className="particle">❤️</div>)}
      </div>

      <motion.div
        className="card-3d-wrap"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: isOpen ? 0 : rotateX, rotateY: isOpen ? 0 : rotateY }}
      >
        <motion.div
          className={`card-content ${isOpen ? "open" : ""}`}
          onClick={toggleCard}
          initial={false}
          transition={{ duration: 1, ease: "easeInOut" }} 
        >
          {/* --- LEFT SIDE (Cover Front & Inside Left) --- */}
          <motion.div
            className="card-left-leaf"
            animate={{ rotateY: isOpen ? -180 : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            {/* FRONT COVER */}
            <div className="face front-face">
              <div className="glass-panel">
                <div className="heart-seal">💌</div>
                <h1>My Valentine</h1>
                <p className="click-hint">Tap to Open</p>
              </div>
            </div>

            {/* INSIDE LEFT (Dynamic Image) */}
            <div className="face back-face">
              <div className="polaroid-wrapper">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pageIndex}
                    initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
                    transition={{ duration: 0.4 }}
                    className="polaroid-inner"
                  >
                    <div className="back-name">Marian, My Valentine</div>
                    <img src={pages[pageIndex].image} alt="Memory" className="polaroid-img"/>
                    <p className="handwritten-caption">{pages[pageIndex].caption}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* --- RIGHT SIDE (Static Base) --- */}
          <div className="card-right-leaf">
            <AnimatePresence mode="wait">
              <motion.div
                key={pageIndex}
                className="text-content-wrapper"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2>{pages[pageIndex].title}</h2>
                <div className="divider">✻</div>
                <p className="body-text">{pages[pageIndex].text}</p>
                {pages[pageIndex].signature && (
                  <p className="signature">{pages[pageIndex].signature}</p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            {isOpen && (
              <div className="nav-controls" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="nav-btn" 
                  onClick={prevPage} 
                  disabled={pageIndex === 0}
                >←</button>
                
                <div className="dots">
                  {pages.map((_, i) => (
                    <span key={i} className={`dot ${i === pageIndex ? 'active' : ''}`} />
                  ))}
                </div>

                <button 
                  className="nav-btn" 
                  onClick={nextPage} 
                  disabled={pageIndex === pages.length - 1}
                >→</button>
              </div>
            )}
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;
