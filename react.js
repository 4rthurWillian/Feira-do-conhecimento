import React, { useState, useEffect } from 'react';
import { Camera, AlertCircle, CheckCircle, HelpCircle, RefreshCw, SkipForward } from 'lucide-react';

const CELEBRITIES = [
  {
    id: 1,
    name: "Anitta",
    acceptedNames: ["anitta", "anita", "larissa machado"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Anitta_no_L%C3%ADderes_Podcast.jpg/800px-Anitta_no_L%C3%ADderes_Podcast.jpg",
    hint: "Cantora brasileira internacional, famosa pelo hit 'Envolver' e por nascer em Honório Gurgel."
  },
  {
    id: 2,
    name: "Neymar Jr",
    acceptedNames: ["neymar", "neymar jr", "neymar junior", "menino ney"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Neymar_Jr._with_Al_Hilal%2C_3_October_2023_-_03_%28cropped%29.jpg/800px-Neymar_Jr._with_Al_Hilal%2C_3_October_2023_-_03_%28cropped%29.jpg",
    hint: "Futebolista brasileiro, camisa 10 da seleção e ex-jogador do Santos e Barcelona."
  },
  {
    id: 3,
    name: "Taylor Swift",
    acceptedNames: ["taylor swift", "taylor", "swift"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/800px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png",
    hint: "Cantora pop americana conhecida por regravar seus álbuns e pela 'The Eras Tour'."
  },
  {
    id: 4,
    name: "Robert Downey Jr",
    acceptedNames: ["robert downey jr", "rdj", "homem de ferro", "tony stark"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg/800px-Robert_Downey_Jr_2014_Comic_Con_%28cropped%29.jpg",
    hint: "Ator famoso por interpretar o Homem de Ferro no Universo Marvel."
  },
  {
    id: 5,
    name: "Billie Eilish",
    acceptedNames: ["billie eilish", "billie"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Billie_Eilish_at_Global_Citizen_Live_in_Paris_in_September_2021_02_%28cropped%29.jpg/640px-Billie_Eilish_at_Global_Citizen_Live_in_Paris_in_September_2021_02_%28cropped%29.jpg",
    hint: "Cantora jovem conhecida por 'Bad Guy' e seu estilo único e cabelos coloridos."
  },
  {
    id: 6,
    name: "Lionel Messi",
    acceptedNames: ["messi", "lionel messi"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Lionel_Messi_20180626.jpg/640px-Lionel_Messi_20180626.jpg",
    hint: "Jogador argentino, lenda do Barcelona e campeão do mundo em 2022."
  }
];

const MAX_ATTEMPTS = 5;
const INITIAL_REVEAL_PERCENT = 4; // Começa minúsculo (4%)
const REVEAL_INCREMENT = 4; // Cresce quase nada a cada erro (4%)

export default function App() {
  const [currentCeleb, setCurrentCeleb] = useState(null);
  const [guess, setGuess] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [gameState, setGameState] = useState('playing'); // playing, won, lost
  const [message, setMessage] = useState("");
  const [showHint, setShowHint] = useState(false);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Garante que não repete o mesmo imediatamente se possível
    let randomCeleb;
    do {
      randomCeleb = CELEBRITIES[Math.floor(Math.random() * CELEBRITIES.length)];
    } while (currentCeleb && CELEBRITIES.length > 1 && randomCeleb.id === currentCeleb.id);

    setCurrentCeleb(randomCeleb);
    setGuess("");
    setAttemptsLeft(MAX_ATTEMPTS);
    setGameState('playing');
    setMessage("");
    setShowHint(false);
  };

  // Cálculo do raio do círculo nítido
  // Se ganhou ou perdeu, raio é 150% (tudo revelado).
  // Se não, começa em 8% e aumenta 8% a cada erro.
  const getRevealRadius = () => {
    if (gameState === 'won' || gameState === 'lost') return 150;
    const errorsMade = MAX_ATTEMPTS - attemptsLeft;
    return INITIAL_REVEAL_PERCENT + (errorsMade * REVEAL_INCREMENT);
  };

  const currentRadius = getRevealRadius();

  const handleGuess = (e) => {
    e.preventDefault();
    if (gameState !== 'playing' || !guess.trim()) return;

    const normalizedGuess = guess.toLowerCase().trim();
    
    // Check if guess is correct
    if (currentCeleb.acceptedNames.includes(normalizedGuess)) {
      setGameState('won');
      setMessage(`Parabéns! É ${currentCeleb.name}!`);
    } else {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setGuess("");
      
      if (newAttempts === 0) {
        setGameState('lost');
        setMessage(`Game Over! Era ${currentCeleb.name}.`);
      } else {
        setMessage("Errou! O foco aumentou só um pouquinho...");
        
        // Clear message after 2 seconds
        setTimeout(() => {
            if (gameState === 'playing') setMessage(""); 
        }, 2000);
      }
    }
  };

  const handleSkip = () => {
    setMessage("Pulando para o próximo...");
    setTimeout(() => {
      startNewGame();
    }, 500);
  };

  if (!currentCeleb) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-10 px-4 font-sans text-slate-100">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
          Quem é a Celebridade?
        </h1>
        <p className="text-slate-400">Modo Extremo: Quase Impossível</p>
      </header>

      {/* Main Game Card */}
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 h-2">
          <div 
            className={`h-full transition-all duration-500 ${attemptsLeft <= 2 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${(attemptsLeft / MAX_ATTEMPTS) * 100}%` }}
          ></div>
        </div>

        <div className="p-6 flex flex-col items-center">
          
          {/* Status Badge */}
          <div className="flex justify-between w-full mb-4 text-sm font-semibold">
            <span className={`px-3 py-1 rounded-full ${attemptsLeft <= 2 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
              Tentativas: {attemptsLeft}
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Camera size={16} /> Foco: {currentRadius}%
            </span>
          </div>

          {/* Image Container with "Magic Eye" Effect */}
          <div className="relative w-64 h-64 mb-6 rounded-lg overflow-hidden border-4 border-slate-600 shadow-inner bg-black group">
            
            {/* Camada 1: Imagem totalmente borrada (Fundo) */}
            <img 
              src={currentCeleb.image} 
              alt="Celebridade Borrada"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }} 
            />

            {/* Camada 2: Imagem Nítida com Recorte Circular (Frente) */}
            <img 
              src={currentCeleb.image} 
              alt="Celebridade Nítida"
              className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out"
              style={{ 
                clipPath: `circle(${currentRadius}% at 50% 50%)`,
                zIndex: 10
              }}
            />
            
            {/* Overlay for Game Over/Win */}
            {gameState !== 'playing' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in z-20">
                {gameState === 'won' ? (
                  <CheckCircle size={64} className="text-green-400 drop-shadow-lg" />
                ) : (
                  <AlertCircle size={64} className="text-red-400 drop-shadow-lg" />
                )}
              </div>
            )}
          </div>

          {/* Feedback Message */}
          <div className={`h-8 mb-4 text-center font-medium ${gameState === 'won' ? 'text-green-400' : gameState === 'lost' ? 'text-red-400' : 'text-yellow-400'}`}>
            {message}
          </div>

          {/* Input Area */}
          {gameState === 'playing' ? (
            <div className="w-full space-y-4">
              <form onSubmit={handleGuess} className="relative">
                <input
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Digite o nome..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 transition-all"
                  autoFocus
                />
              </form>
              
              <div className="flex gap-2">
                <button 
                  onClick={handleGuess}
                  disabled={!guess.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-bold shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adivinhar
                </button>
                <button 
                  onClick={handleSkip}
                  className="px-4 py-3 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-xl font-bold shadow-lg transform active:scale-95 transition-all flex items-center justify-center"
                  title="Pular celebridade"
                >
                  <SkipForward size={20} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={startNewGame}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw size={20} /> Jogar Novamente
            </button>
          )}

          {/* Hint Area */}
          <div className="mt-6 w-full pt-4 border-t border-slate-700">
            {gameState === 'playing' && (
              <div className="text-center">
                {!showHint ? (
                  <button 
                    onClick={() => setShowHint(true)}
                    className="text-sm text-slate-400 hover:text-purple-400 flex items-center justify-center gap-1 mx-auto transition-colors"
                  >
                    <HelpCircle size={16} /> Precisa de uma dica?
                  </button>
                ) : (
                  <div className="bg-slate-700/50 p-3 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-sm text-purple-300 italic">
                      💡 Dica: {currentCeleb.hint}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {gameState !== 'playing' && (
              <div className="text-center text-slate-400 text-sm">
                A resposta era: <span className="text-white font-bold">{currentCeleb.name}</span>
              </div>
            )}
          </div>

        </div>
      </div>
      
      <footer className="mt-8 text-slate-500 text-xs text-center">
        Imagens fornecidas pela Wikimedia Commons.<br/>
        Celebridades da Atualidade.
      </footer>
    </div>
  );
}