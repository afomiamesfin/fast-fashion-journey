import { useState, useEffect, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal, type SetStateAction } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ============= DATA =============
const content = {
  intro: {
    title: "Threads of Impact",
    subtitle: "A journey through the hidden costs of fast fashion",
    description: "Experience the lifecycle of clothing from three perspectives: the garment, the worker, and the consumer."
  },
  clothing: {
    intro: "It's 10AM. You're a sweater, just sorted into the 'Don't want' pile of your human's 5th closet cleanout this year.",
    game: {
      instruction: "Dodge the hands trying to throw you away! Use arrow keys or WASD to move.",
      duration: 15
    },
    choices: [
      {
        id: 'landfill',
        label: '🗑️ To the landfill',
        color: '#8B4513',
        image: '🏜️',
        facts: [
          '80 lbs of clothing thrown away per American yearly',
          'Synthetic fibers take 200+ years to decompose',
          'Releases methane gas while decomposing',
          'Atacama Desert: a dumping ground visible from space'
        ]
      },
      {
        id: 'donation',
        label: '👕 Donated to thrift store',
        color: '#4A90E2',
        image: '🏪',
        facts: [
          'Only 20% of donations are resold locally',
          'Rest shipped overseas or to landfills',
          'Resellers raid thrift stores, driving up prices',
          'Once affordable, now inaccessible'
        ]
      },
      {
        id: 'incineration',
        label: '🔥 Waste-to-energy plant',
        color: '#E74C3C',
        image: '🏭',
        facts: [
          'Burned to generate electricity',
          'Releases harmful toxins into communities',
          'Disproportionately affects low-income areas',
          'Energy produced barely offsets environmental cost'
        ]
      }
    ]
  },
  worker: {
    intro: "It's 6AM in Malaysia. You're a factory worker at the sweatshop nearby.",
    clicker: {
      target: 150,
      timeLimit: 30,
      wage: '$3/day',
      facts: [
        '50-200 products per hour required',
        '13-hour shifts are standard',
        'No insurance, PTO, or retirement',
        'Children as young as 5 work in some facilities',
        '2013 Rana Plaza: 1,100 workers killed',
        'COVID-19: millions left unpaid when orders cancelled'
      ]
    }
  },
  student: {
    intro: "It's 2AM. You're a college student with 2 jobs, burnt out, trying to pay off loans.",
    budget: 20,
    items: [
      {
        name: 'Fast Fashion Shirt',
        price: 5,
        durability: 'Low (10 wears)',
        impact: 'High waste, worker exploitation',
        color: '#FF6B6B',
        emoji: '👚'
      },
      {
        name: 'Sustainable Brand',
        price: 45,
        durability: 'High (200+ wears)',
        impact: 'Low waste, fair wages',
        color: '#51CF66',
        emoji: '🌿'
      },
      {
        name: 'Thrift Store Find',
        price: 8,
        durability: 'Medium (50 wears)',
        impact: 'Lowest waste',
        color: '#4DABF7',
        emoji: '♻️',
        note: 'But resellers are driving prices up...'
      }
    ]
  },
  conclusion: {
    title: "So, What Now?",
    body: "Fast fashion is both everywhere and invisible...",
    stats: {
      clothingDiscarded: 0.73, // tons per minute globally
      waterUsed: 2700, // liters per t-shirt
      workers: 75000000, // global garment workers
    } 
  }
};

// ============ SOUND HELPER FUNCTION =======
const playSound = (soundName: string) => {
  const audio = new Audio(`/sounds/${soundName}.mp3`);
  audio.volume = 0.3;
  audio.play().catch(() => {}); // Silently fail if sound doesn't exist
};

// ============= TYPES =============

interface IntroScreenProps {
  onStart: () => void;
}

interface ClothingJourneyProps {
  onComplete: () => void;
  onBack: () => void;
}

interface WorkerRealityProps {
  onComplete: () => void;
  onBack: () => void;
}

interface StudentDilemmaProps {
  onComplete: () => void;
  onBack: () => void;
}

interface ConclusionProps {
  onBack: () => void;
}

// ============= COMPONENTS =============

function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="screen intro-screen">
      <div className="content-box">
        <div className="icon-large">👕</div>
        <h1>{content.intro.title}</h1>
        <h2>{content.intro.subtitle}</h2>
        <p className="intro-text">{content.intro.description}</p>
        <Button onClick={onStart} className="main-btn" size="lg">
          Begin Journey →
        </Button>
      </div>
    </div>
  );
}

function ClothingJourney({ onComplete, onBack }: ClothingJourneyProps) {
  const [gameActive, setGameActive] = useState<boolean>(true);
  const [playerPos, setPlayerPos] = useState<any>({ x: 50, y: 50 });
  const [hands, setHands] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [caught, setCaught] = useState<boolean>(false);
  const [selectedPath, setSelectedPath] = useState<any>(null);
  const [showChoices, setShowChoices] = useState<boolean>(false);

  useEffect(() => {
    if (!gameActive) return;

    const handleKeyPress = (e: { key: string; }) => {
      playSound('woosh');
      const speed = 5;
      setPlayerPos((prev: { x: number; y: number; }) => {
        let newX = prev.x;
        let newY = prev.y;

        if (e.key === 'ArrowLeft' || e.key === 'a') newX = Math.max(0, prev.x - speed);
        if (e.key === 'ArrowRight' || e.key === 'd') newX = Math.min(90, prev.x + speed);
        if (e.key === 'ArrowUp' || e.key === 'w') newY = Math.max(0, prev.y - speed);
        if (e.key === 'ArrowDown' || e.key === 's') newY = Math.min(90, prev.y + speed);

        return { x: newX, y: newY };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const spawnHand = setInterval(() => {
      const side = Math.floor(Math.random() * 4);
      let x, y, dx, dy;
      
      if (side === 0) { x = Math.random() * 100; y = -10; dx = 0; dy = 2; }
      else if (side === 1) { x = 110; y = Math.random() * 100; dx = -2; dy = 0; }
      else if (side === 2) { x = Math.random() * 100; y = 110; dx = 0; dy = -2; }
      else { x = -10; y = Math.random() * 100; dx = 2; dy = 0; }

      setHands(prev => [...prev, { id: Date.now(), x, y, dx, dy }]);
    }, 1000);

    return () => clearInterval(spawnHand);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const moveHands = setInterval(() => {
      setHands(prev => prev
        .map(hand => ({ ...hand, x: hand.x + hand.dx, y: hand.y + hand.dy }))
        .filter(hand => hand.x >= -20 && hand.x <= 120 && hand.y >= -20 && hand.y <= 120)
      );
    }, 50);

    return () => clearInterval(moveHands);
  }, [gameActive]);

  useEffect(() => {
    if (!gameActive) return;

    const checkCollision = () => {
      hands.forEach(hand => {
        const distance = Math.sqrt(
          Math.pow(hand.x - playerPos.x, 2) + Math.pow(hand.y - playerPos.y, 2)
        );
        if (distance < 10) {
          setCaught(true);
          setGameActive(false);
          setShowChoices(true);
        }
      });
    };

    checkCollision();
  }, [hands, playerPos, gameActive]);

  useEffect(() => {
    if (!gameActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCaught(true);
          setGameActive(false);
          setShowChoices(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  if (selectedPath) {
    return (
      <div className="screen">
        <div className="content-box">
          <div className="section-header" style={{ borderColor: selectedPath.color }}>
            <div className="icon-large">{selectedPath.image}</div>
            <h2>{selectedPath.label}</h2>
          </div>

          <div className="notepad-container">
            {selectedPath.facts.map((fact: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
              <div key={i} className="notepad-item">
                • {fact}
              </div>
            ))}
          </div>

          <div className="nav-buttons">
            <Button onClick={() => { setSelectedPath(null); }} variant="outline" className="retro-btn-outline">
              ← Choose Another Fate
            </Button>
            <Button onClick={onComplete} className="main-btn">
              Let's rewind... →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showChoices) {
    return (
      <div className="screen">
        <div className="content-box">
          <div className="caught-banner">
            <h2>You've been discarded!</h2>
            <p className="narrative">{content.clothing.intro}</p>
          </div>
          
          <h3 className="choices-title">Where do you go?</h3>
          <div className="choices-grid">
            {content.clothing.choices.map((choice) => (
              <Card 
                key={choice.id}
                className="choice-card retro-card"
                style={{ borderTopColor: choice.color }}
                onClick={() => setSelectedPath(choice)}
              >
                <div className="choice-icon">{choice.image}</div>
                <h4>{choice.label}</h4>
              </Card>
            ))}
          </div>

          <Button onClick={onBack} variant="outline" className="back-btn retro-btn-outline">← Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="content-box">
        <div className="game-header">
          <div className="timer-badge">⏱️ {timeLeft}s</div>
          <p className="game-instructions">{content.clothing.game.instruction}</p>
        </div>

        <div className="game-arena">
          <div 
            className="player" 
            style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
          >
            👕
          </div>
          {hands.map(hand => (
            <div 
              key={hand.id}
              className="hand"
              style={{ left: `${hand.x}%`, top: `${hand.y}%` }}
            >
              ✋
            </div>
          ))}
        </div>

        <Button onClick={onBack} variant="outline" className="back-btn retro-btn-outline">← Back</Button>
      </div>
    </div>
  );
}

function WorkerReality({ onComplete, onBack }: WorkerRealityProps) {
  const [clicks, setClicks] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [currentFact, setCurrentFact] = useState<number>(0);
  const { target, facts, wage } = content.worker.clicker;

  useEffect(() => {
    if (timeLeft <= 0 || gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  useEffect(() => {
    if (clicks >= target) {
      setGameOver(true);
    }
  }, [clicks, target]);

  const handleClick = () => {
    playSound('click');
    if (!gameOver) {
      setClicks(prev => prev + 1);
      if (clicks % 15 === 0) {
        setCurrentFact(prev => (prev + 1) % facts.length);
      }
    }
  };

  if (gameOver) {
    const success = clicks >= target;
    return (
      <div className="screen">
        <div className="content-box">
          <div className={`result-banner ${success ? 'success' : 'failure'}`}>
            <h2>{success ? '✓ Quota Met' : '✗ Quota Failed'}</h2>
            <p>{success 
              ? `You made ${clicks} items. You'll receive your full ${wage} today.`
              : `You only made ${clicks}/${target} items. Your wage will be docked.`
            }</p>
          </div>

          <div className="ticker-container">
            <div className="ticker-label">REALITY CHECK:</div>
            <div className="ticker-facts">
              {facts.map((fact, i) => (
                <div key={i} className="ticker-item">
                  <span className="ticker-bullet">▸</span> {fact}
                </div>
              ))}
            </div>
          </div>

          <div className="nav-buttons">
            <Button onClick={onBack} variant="outline" className="retro-btn-outline">← Back</Button>
            <Button onClick={onComplete} className="main-btn">
              The real price tag... →
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="content-box">
        <p className="narrative">{content.worker.intro}</p>
        
        <div className="clicker-game">
          <div className="clicker-stats">
            <div className="stat-box">
              <div className="stat-label">ITEMS PRODUCED</div>
              <div className="stat-number">{clicks}<span className="stat-target">/{target}</span></div>
            </div>
            <div className="stat-box">
              <div className="stat-label">TIME LEFT</div>
              <div className="stat-number">{timeLeft}<span className="stat-unit">s</span></div>
            </div>
            <div className="stat-box">
              <div className="stat-label">TODAY'S WAGE</div>
              <div className="stat-number">{wage}</div>
            </div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(clicks / target) * 100}%` }}
              />
            </div>
            <div className="progress-label">{Math.floor((clicks / target) * 100)}%</div>
          </div>

          <button className="clicker-button" onClick={handleClick}>
            <span className="clicker-icon">🧵</span>
            <span className="clicker-text">SEW GARMENT</span>
          </button>

          <div className="fact-ticker">
            <div className="fact-ticker-content">
              {facts[currentFact]}
            </div>
          </div>
        </div>

        <Button onClick={onBack} variant="outline" className="back-btn retro-btn-outline">← Back</Button>
      </div>
    </div>
  );
}

function StudentDilemma({ onComplete, onBack }: StudentDilemmaProps) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { budget, items } = content.student;

  return (
    <div className="screen">
      <div className="content-box">
        <p className="narrative">{content.student.intro}</p>
        
        <div className="shop-header">
          <h3>💰 Your Budget: ${budget}</h3>
        </div>

        <div className="shop-grid">
          {items.map((item, i) => (
            <Card 
              key={i}
              className={`shop-card retro-card ${item.price > budget ? 'unaffordable' : ''} ${selectedItem === i ? 'selected' : ''}`}
              onClick={() => item.price <= budget && setSelectedItem(i)}
              style={{ borderTopColor: item.color, borderTopWidth: '5px' }}
            >
              <div className="shop-icon">{item.emoji}</div>
              <h4>{item.name}</h4>
              <div className="shop-price">${item.price}</div>
              <div className="shop-details">
                <p><strong>Durability:</strong> {item.durability}</p>
                <p><strong>Impact:</strong> {item.impact}</p>
                {item.note && <p className="note">{item.note}</p>}
              </div>
              {item.price > budget && (
                <div className="unaffordable-overlay">
                  OUT OF BUDGET
                </div>
              )}
            </Card>
          ))}
        </div>

        {selectedItem !== null && (
          <Card className="insight-card retro-card">
            <p>💭 This is the reality for millions: ethical choices require financial privilege.</p>
          </Card>
        )}

        <div className="nav-buttons">
          <Button onClick={onBack} variant="outline" className="retro-btn-outline">← Back</Button>
          <Button onClick={onComplete} className="main-btn">
            So what now? →
          </Button>
        </div>
      </div>
    </div>
  );
}

function Conclusion({ onBack }: { onBack: () => void }) {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const clothingWasted = (timeSpent / 60 * content.conclusion.stats.clothingDiscarded).toFixed(2);

  return (
    <div className="screen">
      <div className="content-box conclusion-box">
        <h2 className="conclusion-title">{content.conclusion.title}</h2>
        
        <div className="stats-display">
          <h3>While You Were Here...</h3>
          <div className="stat-item">
            <div className="stat-value">{clothingWasted}</div>
            <div className="stat-label">tons of clothing were discarded globally</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{timeSpent}</div>
            <div className="stat-label">seconds you spent learning</div>
          </div>
        </div>

        <p className="final-text">{content.conclusion.body}</p>
        
        <div className="credits">
          <p><strong>An interactive exploration by Afomia Mesfin</strong></p>
          <p>Based on "Fast vs Sustainable Fashion: Ethics and Elitism"</p>
          <p className="small">WRIT 1301 - Mode Change Project</p>
        </div>

        <Button onClick={onBack} variant="outline" className="back-btn retro-btn-outline">
          ← Back to Start
        </Button>
      </div>
    </div>
  );
}

// ============= MAIN APP =============

export default function App() {
  const [stage, setStage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToStage = (n: number) => {
    playSound('transition');
    setIsTransitioning(true);
    setTimeout(() => {
      setStage(n);
      setIsTransitioning(false);
    }, 400);
  };

  return (
    <div className="app">

      <div className="progress-tracker">
        <div className="progress-tracker-fill" style={{ width: `${(stage / 4) * 100}%` }} />
      </div>
      <div className="progress-steps">
        {[0, 1, 2, 3, 4].map((s) => (
          <div 
            key={s} 
            className={`progress-step ${s < stage ? 'completed' : ''} ${s === stage ? 'active' : ''}`}
          />
        ))}
      </div>

      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap');
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: #f4f1ea;
          color: #1a1a1a;
          font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
        }

        .app {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background-image: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(139, 69, 19, 0.03) 2px,
              rgba(139, 69, 19, 0.03) 4px
            );
        }

        .screen {
          width: 100%;
          max-width: 1000px;
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        // code to make fading work
        .screen {
          width: 100%;
          max-width: 1000px;
          animation: slideInRight 0.6s ease-out;
        }

        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(100px);
          }
          to { 
            opacity: 1; 
            transform: translateX(0);
          }
        }

        @keyframes slideOutLeft {
          from { 
            opacity: 1; 
            transform: translateX(0);
          }
          to { 
            opacity: 0; 
            transform: translateX(-100px);
          }
        }

        .screen.exiting {
          animation: slideOutLeft 0.4s ease-in forwards;
        }
        // end of fade code

        .progress-tracker {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 6px;
          background: #e0e0e0;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .progress-tracker-fill {
          height: 100%;
          background: #2d6a4f;
          transition: width 0.5s ease;
        }

        .progress-steps {
          position: fixed;
          top: 10px;
          right: 20px;
          display: flex;
          gap: 10px;
          z-index: 1000;
        }

        .progress-step {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e0e0e0;
          border: 2px solid #2d2d2d;
          transition: all 0.3s;
        }

        .progress-step.completed {
          background: #2d6a4f;
        }

        .progress-step.active {
          background: #52b788;
          transform: scale(1.3);
        }

        .content-box {
          background: white;
          border: 3px solid #2d2d2d;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .conclusion-box {
          background: #f8f8f8;
          border: 3px dashed #2d6a4f;
        }

        .retro-card {
          border: 2px solid #2d2d2d;
          box-shadow: 4px 4px 0 rgba(45, 45, 45, 0.1);
        }

        .icon-large {
          font-size: 5rem;
          margin-bottom: 20px;
          text-align: center;
        }

        h1 {
          font-size: 3rem;
          margin-bottom: 10px;
          font-weight: 700;
          color: #2d6a4f;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        h2 {
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: #333;
        }

        h3 {
          font-size: 1.5rem;
          margin: 20px 0;
          color: #333;
        }

        h4 {
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .intro-text {
          font-size: 1.1rem;
          color: #555;
          margin-bottom: 30px;
          text-align: center;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .narrative {
          font-size: 1.15rem;
          font-style: italic;
          color: #555;
          margin-bottom: 30px;
          padding: 20px;
          background: #fafafa;
          border-left: 4px solid #52b788;
        }

        .main-btn {
          background: #2d6a4f;
          color: white;
          border: 3px solid #2d6a4f;
          padding: 16px 32px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
          box-shadow: 4px 4px 0 rgba(45, 106, 79, 0.3);
        }

        .main-btn:hover {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 rgba(45, 106, 79, 0.3);
        }

        .retro-btn-outline {
          border: 2px solid #2d2d2d;
          background: transparent;
          color: #2d2d2d;
          border-radius: 8px;
        } 

        .retro-btn-outline:hover {
          background: #f0f0f0;
        }

        .back-btn {
          margin-top: 20px;
        }

        .nav-buttons {
          display: flex;
          gap: 15px;
          justify-content: space-between;
          margin-top: 30px;
        }

        .game-header {
          text-align: center;
          margin-bottom: 20px;
          padding: 20px;
          background: #fafafa;
          border: 2px dashed #52b788;
          border-radius: 12px;
        }

        .timer-badge {
          display: inline-block;
          background: #2d6a4f;
          color: white;
          padding: 10px 20px;
          font-size: 1.3rem;
          font-weight: bold;
          border: 2px solid #2d2d2d;
          margin-bottom: 10px;
        }

        .game-instructions {
          font-size: 1rem;
          color: #666;
        }

        .game-arena {
          position: relative;
          width: 100%;
          height: 450px;
          background: #d8f3dc;
          overflow: hidden;
          margin: 20px 0;
          border: 3px solid #2d6a4f;
        }

        .player {
          position: absolute;
          font-size: 4rem;
          transform: translate(-50%, -50%);
          transition: all 0.1s;
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
          z-index: 10;
        }

        .hand {
          position: absolute;
          font-size: 2.5rem;
          transform: translate(-50%, -50%);
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
        }

        .caught-banner {
          text-align: center;
          padding: 30px;
          background: #fff3cd;
          border: 3px solid #ffc107;
          margin-bottom: 30px;
        }

        .choices-title {
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #2d6a4f;
        }

        .choices-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }

        .choice-card {
          padding: 30px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          border-top-width: 5px !important;
          border-top-style: solid !important;
        }

        .choice-card:hover {
          transform: translateY(-3px);
          box-shadow: 6px 6px 0 rgba(45, 45, 45, 0.15);
        }

        .choice-icon {
          font-size: 3.5rem;
          margin-bottom: 15px;
        }

        .section-header {
          text-align: center;
          padding: 30px;
          margin-bottom: 30px;
          border: 3px solid;
          background: #fafafa;
        }

        .facts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }

        .fact-card {
        padding: 20px;
        position: relative;
        transition: transform 0.2s;
        background: white;
        border: 2px dashed #d0d0d0 !important;
        border-radius: 12px;
      }

        .fact-card:hover {
          transform: translateX(3px);
        }

        // notepad styles
        .notepad-container {
          background: #fff9e6;
          border: 1px solid #d4af37;
          border-radius: 4px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          background-image: repeating-linear-gradient(
            transparent,
            transparent 31px,
            #d4af37 31px,
            #d4af37 32px
          );
          line-height: 32px;
          font-family: 'Courier New', monospace;
        }

        .notepad-item {
          padding-left: 20px;
          margin-bottom: 10px;
          font-size: 1.05rem;
        }

        .clicker-game {
          text-align: center;
        }

        .clicker-stats {
          display: flex;
          justify-content: space-around;
          margin: 30px 0;
          flex-wrap: wrap;
          gap: 20px;
        }

        .stat-box {
          background: #2d6a4f;
          color: white;
          padding: 25px 35px;
          border: 3px solid #2d2d2d;
          min-width: 180px;
          box-shadow: 4px 4px 0 rgba(45, 45, 45, 0.2);
        }

        .stat-label {
          font-size: 0.75rem;
          opacity: 0.9;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
        }

        .stat-target, .stat-unit {
          font-size: 1.5rem;
          opacity: 0.8;
        }

        .progress-container {
          position: relative;
          margin: 20px 0;
        }

        .progress-bar {
          background: #e0e0e0;
          height: 35px;
          border: 2px solid #2d2d2d;
          overflow: hidden;
        }

        .progress-fill {
          background: #52b788;
          height: 100%;
          transition: width 0.3s;
        }

        .progress-label {
          text-align: center;
          margin-top: 5px;
          font-weight: bold;
          color: #2d6a4f;
        }

        .clicker-button {
          background: #2d6a4f;
          color: white;
          border: 3px solid #2d2d2d;
          padding: 25px 50px;
          font-size: 1.3rem;
          cursor: pointer;
          margin: 30px 0;
          font-weight: bold;
          transition: all 0.1s;
          box-shadow: 6px 6px 0 rgba(45, 45, 45, 0.2);
          display: inline-flex;
          align-items: center;
          gap: 15px;
        }

        .clicker-button:hover {
          transform: translate(2px, 2px);
          box-shadow: 4px 4px 0 rgba(45, 45, 45, 0.2);
        }

        .clicker-button:active {
          transform: translate(4px, 4px);
          box-shadow: 2px 2px 0 rgba(45, 45, 45, 0.2);
        }

        .clicker-icon {
          font-size: 1.8rem;
        }

        .fact-ticker {
          margin: 25px auto;
          max-width: 700px;
          padding: 20px;
          background: #fff3cd;
          border: 2px dashed #ffc107;
          min-height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fact-ticker-content {
          font-size: 1.05rem;
          color: #856404;
          font-style: italic;
        }

        .result-banner {
          padding: 30px;
          border: 3px solid #2d2d2d;
          margin-bottom: 30px;
          text-align: center;
        }

        .result-banner.success {
          background: #d8f3dc;
          border-color: #52b788;
        }

        .result-banner.failure {
          background: #ffe5e5;
          border-color: #e74c3c;
        }

        .ticker-container {
          margin: 30px 0;
          border: 2px solid #2d2d2d;
          overflow: hidden;
        }

        .ticker-label {
          background: #2d2d2d;
          color: white;
          padding: 10px 20px;
          font-weight: bold;
          letter-spacing: 2px;
          font-size: 0.9rem;
        }

        .ticker-facts {
          background: #fafafa;
          padding: 15px;
        }

        .ticker-item {
          padding: 12px 15px;
          border-bottom: 1px dashed #ddd;
          font-size: 1rem;
          text-align: left;
        }

        .ticker-item:last-child {
          border-bottom: none;
        }

        .ticker-bullet {
          color: #52b788;
          font-weight: bold;
          margin-right: 10px;
        }

        .shop-header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: #2d6a4f;
          color: white;
          border: 3px solid #2d2d2d;
          box-shadow: 4px 4px 0 rgba(45, 45, 45, 0.2);
        }

        .shop-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }

        .shop-card {
          padding: 25px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          background: white;
        }

        .shop-card:hover:not(.unaffordable) {
          transform: translateY(-3px);
          box-shadow: 6px 6px 0 rgba(45, 45, 45, 0.15);
        }

        .shop-card.selected {
          border: 3px solid #2d6a4f !important;
          background: #f0fdf4;
        }

        .shop-card.unaffordable {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .shop-icon {
          font-size: 3.5rem;
          margin-bottom: 15px;
        }

        .shop-price {
          font-size: 2rem;
          font-weight: bold;
          margin: 15px 0;
          color: #2d6a4f;
        }

        .shop-details {
          font-size: 0.95rem;
          text-align: left;
        }

        .shop-details p {
          margin: 8px 0;
        }

        .unaffordable-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
          letter-spacing: 1px;
        }

        .note {
          font-style: italic;
          color: #666;
          margin-top: 10px;
          font-size: 0.9rem;
        }

        .insight-card {
          padding: 25px;
          margin-top: 20px;
          background: #d8f3dc;
          border: 2px dashed #2d6a4f;
          font-size: 1.1rem;
        }

        .conclusion-title {
          text-align: center;
          color: #2d6a4f;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 25px;
        }

        .final-text {
          font-size: 1.15rem;
          line-height: 1.9;
          white-space: pre-line;
          margin: 30px 0;
          color: #333;
        }

        .credits {
          margin-top: 50px;
          padding-top: 30px;
          border-top: 2px dashed #2d6a4f;
          text-align: center;
        }

        .credits p {
          margin: 8px 0;
          color: #555;
        }

        .small {
          font-size: 0.85rem;
          color: #888;
        }

        @media (max-width: 768px) {
          .content-box { padding: 20px; }
          h1 { font-size: 2rem; }
          .game-arena { height: 350px; }
          .clicker-button { padding: 20px 40px; font-size: 1.2rem; }
          .player { font-size: 3rem; }
        }

        .stats-display {
          background: #2d6a4f;
          color: white;
          padding: 30px;
          border-radius: 12px;
          margin: 30px 0;
          text-align: center;
        }

        .stats-display h3 {
          color: white;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .stat-item {
          margin: 20px 0;
        }

        .stat-value {
          font-size: 3rem;
          font-weight: bold;
          color: #95d5b2;
        }

        .stat-label {
          font-size: 1rem;
          opacity: 0.9;
        }
      `}</style>

      {stage === 0 && <IntroScreen onStart={() => goToStage(1)} />}
      {stage === 1 && <ClothingJourney onComplete={() => goToStage(2)} onBack={() => goToStage(0)} />}
      {stage === 2 && <WorkerReality onComplete={() => goToStage(3)} onBack={() => goToStage(1)} />}
      {stage === 3 && <StudentDilemma onComplete={() => goToStage(4)} onBack={() => goToStage(2)} />}
      {stage === 4 && <Conclusion onBack={() => goToStage(0)} />}
    </div>
  );
}