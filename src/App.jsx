import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import "./App.css";

// --- ASSETS ---
import mirrorPic from "./assets/mirror.jpg";
import closeupPic from "./assets/closeup.jpg";

// --- DATA ---
const pages = [
  {
    id: 0,
    image: mirrorPic,
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
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80", 
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
    image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80", 
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
    image: closeupPic,
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const playAudio = () => {
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
  };

  return (
    <div className="scene">
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/02/07/audio_6593452b31.mp3" loop />
      
      <div className="ambient">
        <div className="aurora a1"></div>
        <div className="aurora a2"></div>
      </div>
      <div className="bg-particles">
        {[...Array(20)].map((_, i) => <div key={i} className="particle">❤️</div>)}
      </div>

      {isMobile ? (
        <MobileDeck playAudio={playAudio} />
      ) : (
        <DesktopBook playAudio={playAudio} />
      )}
    </div>
  );
}

// --- DESKTOP COMPONENT ---
const DesktopBook = ({ playAudio }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

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

  const toggleBook = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      playAudio();
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.7 }, colors: ["#ff4d6d", "#fff"] });
    } else {
      setPageIndex(0);
    }
  };

  return (
    <motion.div
      className="card-3d-wrap"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: isOpen ? 0 : rotateX, rotateY: isOpen ? 0 : rotateY }}
    >
      <motion.div
        className={`card-content ${isOpen ? "open" : ""}`}
        onClick={toggleBook}
      >
        <motion.div className="card-left-leaf" animate={{ rotateY: isOpen ? -180 : 0 }} transition={{ duration: 1 }}>
          <div className="face front-face">
            <div className="glass-panel">
              <div className="heart-seal">💌</div>
              <h1>My Valentine</h1>
              <p className="click-hint">Click to Open</p>
            </div>
          </div>
          <div className="face back-face">
            <div className="polaroid-inner">
              <img src={pages[pageIndex].image} alt="Memory" className="polaroid-img" />
              <p className="handwritten-caption">{pages[pageIndex].caption}</p>
            </div>
          </div>
        </motion.div>

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
              <div className="body-text">{pages[pageIndex].text}</div>
              {pages[pageIndex].signature && <p className="signature">{pages[pageIndex].signature}</p>}
            </motion.div>
          </AnimatePresence>
          {isOpen && (
            <div className="nav-controls" onClick={(e) => e.stopPropagation()}>
              <button 
                className="nav-btn" 
                onClick={() => {
                  if (pageIndex > 0) {
                    setPageIndex(pageIndex - 1);
                    confetti({ particleCount: 30, spread: 40, origin: { x: 0.2, y: 0.7 }, colors: ["#ff4d6d", "#fff"] });
                  }
                }} 
                disabled={pageIndex === 0}
              >
                ←
              </button>
              <div className="dots">{pages.map((_, i) => <div key={i} className={`dot ${i===pageIndex ? 'active':''}`}></div>)}</div>
              <button 
                className="nav-btn" 
                onClick={() => {
                  if (pageIndex < pages.length - 1) {
                    const newIndex = pageIndex + 1;
                    setPageIndex(newIndex);
                    if (newIndex === pages.length - 1) {
                      confetti({ particleCount: 100, spread: 80, origin: { x: 0.8, y: 0.7 }, colors: ["#ff4d6d", "#ffd700", "#fff"] });
                    } else {
                      confetti({ particleCount: 30, spread: 40, origin: { x: 0.8, y: 0.7 }, colors: ["#ff4d6d", "#fff"] });
                    }
                  }
                }} 
                disabled={pageIndex === pages.length - 1}
              >
                →
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- MOBILE COMPONENT (CLEANED UP) ---
const MobileDeck = ({ playAudio }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
    playAudio();
    confetti({ particleCount: 100, spread: 120, origin: { y: 0.5 }, colors: ["#ff4d6d", "#ffd166"] });
  };

  const handleNext = () => {
    if (pageIndex < pages.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setPageIndex(pageIndex + 1), 300);
    }
  };

  const handlePrev = () => {
    if (pageIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setPageIndex(pageIndex - 1), 300);
    }
  };

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(20); 
  };

  const handleFlip = () => {
    vibrate();
    setIsFlipped(!isFlipped);
    
    // Confetti on last page flip
    if (!isFlipped && pageIndex === pages.length - 1) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#ff4d6d", "#ffd700", "#ff69b4"]
      });
    }
  };

  if (!hasStarted) {
    return (
      <motion.div 
        className="mobile-cover" 
        onClick={handleStart}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <div className="glass-panel-mobile">
          <div className="heart-seal">💌</div>
          <h1>For My Love</h1>
          <p className="click-hint">Tap to Reveal</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mobile-deck-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={pageIndex}
          className="mobile-card-wrapper"
          initial={{ x: 100, opacity: 0, rotate: 5 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          exit={{ x: -100, opacity: 0, rotate: -5 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* THE FLIP CARD - NO DRAG, JUST CLICK */}
          <div 
            className={`mobile-flip-card ${isFlipped ? "flipped" : ""}`} 
            onClick={handleFlip} 
          >
            <div className="mobile-card-inner">
              
              {/* FRONT: PHOTO */}
              <div className="mobile-card-front">
                <div className="mobile-polaroid">
                  <img src={pages[pageIndex].image} alt="Memory" />
                  <p className="handwritten-caption">{pages[pageIndex].caption}</p>
                </div>
                {/* BUTTON (VISUAL ONLY, CLICK GOES TO CARD) */}
                <div className="tap-hint-btn">
                  <span>👆 Tap to Read Letter</span>
                </div>
              </div>

              {/* BACK: ROMANTIC TEXT */}
              <div className="mobile-card-back">
                <div className="mobile-letter-content">
                  <h2>{pages[pageIndex].title}</h2>
                  <div className="divider">✻</div>
                  <div className="body-text">{pages[pageIndex].text}</div>
                  <p className="signature">{pages[pageIndex].signature || "Love, Me"}</p>
                </div>
                <div className="back-hint">Tap to see photo</div>
              </div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mobile-nav">
        <button 
          className="nav-btn" 
          onClick={(e) => { e.stopPropagation(); vibrate(); handlePrev(); }} 
          disabled={pageIndex === 0}
        >
          ←
        </button>
        <span className="page-indicator">{pageIndex + 1} / {pages.length}</span>
        <button 
          className="nav-btn" 
          onClick={(e) => { e.stopPropagation(); vibrate(); handleNext(); }} 
          disabled={pageIndex === pages.length - 1}
        >
          →
        </button>
      </div>
    </div>
  );
};

export default App;