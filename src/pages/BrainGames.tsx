import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Award, Trophy, Target, Lightbulb, Puzzle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { showSuccess, showError, showInfo, showWarning } from "@/lib/toast-helpers";

interface GameScore {
  game: string;
  score: number;
  timestamp: Date;
}

const BrainGames = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [memoryCards, setMemoryCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [mathQuestion, setMathQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [mathScore, setMathScore] = useState(0);
  const [wordSequence, setWordSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<{ word: string; index: number }[]>([]);
  const [wordPhase, setWordPhase] = useState<"memorize" | "recall">("memorize");
  const [timeLeft, setTimeLeft] = useState(10);
  const { toast } = useToast();

  const healthWords = [
    "Heart", "Brain", "Vitamin", "Exercise", "Nutrition", "Sleep",
    "Wellness", "Fitness", "Immune", "Cardio", "Protein", "Hydration"
  ];

  const startMemoryGame = () => {
    const cards = [...Array(8)].map((_, i) => i % 4);
    setMemoryCards(cards.sort(() => Math.random() - 0.5));
    setFlippedCards([]);
    setMatchedCards([]);
    setActiveGame("memory");
    showSuccess("Memory Game Started!", "Match all the pairs to win");
  };

  const startMathGame = () => {
    generateMathQuestion();
    setMathScore(0);
    setActiveGame("math");
    showSuccess("Math Challenge Started!", "Solve as many problems as you can");
  };

  const startWordGame = () => {
    const sequence = [];
    for (let i = 0; i < 5; i++) {
      sequence.push(healthWords[Math.floor(Math.random() * healthWords.length)]);
    }

    setWordSequence(sequence);
    setUserSequence([]);
    setWordPhase("memorize");
    setTimeLeft(10);
    setActiveGame("word");

    showInfo("Memorize these words!", "You have 10 seconds...");

    setTimeout(() => {
      setWordPhase("recall");
      showWarning("Time's up!", "Now recall the words in order");
    }, 10000);
  };
  
  useEffect(() => {
    if (wordPhase !== "memorize" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [wordPhase, timeLeft]);

  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 50) + 10;
    const num2 = Math.floor(Math.random() * 50) + 10;
    setMathQuestion({ num1, num2, answer: 0 });
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedCards.includes(index)) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (memoryCards[first] === memoryCards[second]) {
        setMatchedCards([...matchedCards, first, second]);
        setFlippedCards([]);
        
        // Show success when a pair is matched
        showSuccess("Match Found!", `You matched a pair! (${matchedCards.length / 2 + 1}/${memoryCards.length / 2})`);

        if (matchedCards.length + 2 === memoryCards.length) {
          showSuccess("🎉 Congratulations! 🎉", "You've matched all pairs! Great memory!");
          toast({
            title: "🎉 Congratulations!",
            description: "You've matched all pairs!",
          });
        }
      } else {
        // Show info when no match
        setTimeout(() => {
          showWarning("No match", "Try again!");
        }, 500);
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const checkMathAnswer = () => {
    const correct = mathQuestion.num1 + mathQuestion.num2;
    if (mathQuestion.answer === correct) {
      const newScore = mathScore + 1;
      setMathScore(newScore);
      showSuccess("✓ Correct! ✓", `Score: ${newScore}`);
      toast({
        title: "✓ Correct!",
        description: `Score: ${newScore}`,
      });
      generateMathQuestion();
    } else {
      showError("✗ Incorrect", `The answer was ${correct}. Keep practicing!`);
      toast({
        title: "✗ Incorrect",
        description: `The answer was ${correct}`,
        variant: "destructive",
      });
    }
  };

  const games = [
    {
      id: "memory",
      name: "Memory Match",
      icon: Brain,
      description: "Match pairs of health-themed cards to boost your memory",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "math",
      name: "Quick Math",
      icon: Target,
      description: "Solve mental math problems to sharpen your calculation skills",
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "word",
      name: "Word Recall",
      icon: Lightbulb,
      description: "Memorize and recall health-related word sequences",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "pattern",
      name: "Pattern Recognition",
      icon: Puzzle,
      description: "Identify patterns in health data visualizations (Coming Soon)",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Brain className="w-8 h-8 text-primary" />
          Brain Fitness Center
        </h1>
        <p className="text-muted-foreground mt-2">
          Exercise your mind with fun, health-themed cognitive games
        </p>
      </div>

      {!activeGame ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <Card
                key={game.id}
                className="group hover:shadow-glow transition-all duration-300 cursor-pointer border-2"
                onClick={() => {
                  if (game.id === "memory") startMemoryGame();
                  else if (game.id === "math") startMathGame();
                  else if (game.id === "word") startWordGame();
                  else if (game.id === "pattern") {
                    showInfo("Coming Soon!", "This game is under development");
                  }
                }}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{game.name}</CardTitle>
                  <CardDescription>{game.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    disabled={game.id === "pattern"}
                  >
                    {game.id === "pattern" ? "Coming Soon" : "Play Now"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : activeGame === "memory" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Memory Match Game</span>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-bold">{matchedCards.length / 2} / {memoryCards.length / 2} pairs</span>
                </div>
                <Button variant="outline" onClick={() => {
                  setActiveGame(null);
                  showInfo("Game Exited", "Come back anytime to play again!");
                }}>
                  Exit Game
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Matched: {matchedCards.length / 2} / {memoryCards.length / 2} pairs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {memoryCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(index)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-4xl font-bold cursor-pointer transition-all ${flippedCards.includes(index) || matchedCards.includes(index)
                    ? "bg-gradient-to-br from-primary to-primary-glow text-white rotate-0"
                    : "bg-muted hover:bg-accent rotate-180"
                    }`}
                >
                  {(flippedCards.includes(index) || matchedCards.includes(index)) && (
                    <span>{["🫀", "🧠", "💊", "🏃"][card]}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : activeGame === "math" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Quick Math Challenge</span>
              <div className="flex gap-2 items-center">
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="font-bold">{mathScore}</span>
                </div>
                <Button variant="outline" onClick={() => {
                  setActiveGame(null);
                  showInfo("Math Challenge Exited", `Your final score: ${mathScore}`);
                }}>
                  Exit Game
                </Button>
              </div>
            </CardTitle>
            <CardDescription>Solve as many problems as you can!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold text-foreground">
                {mathQuestion.num1} + {mathQuestion.num2} = ?
              </div>
              <div className="flex gap-4 items-center justify-center max-w-md mx-auto">
                <input
                  type="number"
                  value={mathQuestion.answer || ""}
                  onChange={(e) => setMathQuestion({ ...mathQuestion, answer: parseInt(e.target.value) || 0 })}
                  onKeyPress={(e) => e.key === "Enter" && checkMathAnswer()}
                  className="flex-1 px-4 py-3 text-2xl text-center border-2 border-border rounded-xl bg-background focus:outline-none focus:border-primary"
                  placeholder="?"
                  autoFocus
                />
                <Button onClick={checkMathAnswer} size="lg" className="px-8">
                  Check
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : activeGame === "word" ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Word Recall Challenge</span>
              <Button variant="outline" onClick={() => {
                setActiveGame(null);
                showInfo("Word Game Exited", "Keep practicing your memory!");
              }}>
                Exit Game
              </Button>
            </CardTitle>
            <CardDescription>Memorize the words, then recall them in order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-6 bg-accent rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Words to memorize:</h3>

                  {wordPhase === "memorize" && (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                      <Clock className="w-4 h-4" />
                      <span>{timeLeft}s</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {wordPhase === "memorize" && wordSequence.map((word, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-lg"
                    >
                      {word}
                    </div>
                  ))}
                </div>
                {wordPhase === "recall" && (
                  <div className="text-center text-muted-foreground">
                    The words have been hidden. Recall them in the correct order!
                  </div>
                )}
              </div>
              <div className="p-6 bg-muted rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Available words:</h3>
                <div className="flex flex-wrap gap-2">
                  {healthWords.map((word, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      onClick={() => {
                        if (wordPhase !== "recall") {
                          showWarning("Wait!", "Memorize phase is still active");
                          return;
                        }
                        setUserSequence([...userSequence, { word, index: userSequence.length }]);
                        showInfo("Word Added", `Added "${word}" to your sequence`);
                      }}
                    >
                      {word}
                    </Button>
                  ))}
                </div>
              </div>
              {userSequence.length > 0 && (
                <div className="p-6 bg-accent rounded-xl">
                  <h3 className="text-lg font-semibold mb-4">Your sequence:</h3>
                  <div className="flex flex-wrap gap-3">
                    {userSequence.map((word, idx) => (
                      <div
                        key={idx}
                        className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold"
                      >
                        {word.word}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    const correct =
                      wordSequence.length === userSequence.length &&
                      wordSequence.every((word, i) => word === userSequence[i].word);
                    
                    if (correct) {
                      showSuccess("🎉 Perfect Memory! 🎉", "You recalled all words correctly!");
                      toast({
                        title: "🎉 Perfect!",
                        description: "You recalled all words correctly!",
                        variant: "default",
                      });
                    } else {
                      const correctWords = userSequence.filter((word, i) => word.word === wordSequence[i]).length;
                      showError("❌ Not quite right", `You got ${correctWords} out of ${wordSequence.length} correct`);
                      toast({
                        title: "❌ Not quite",
                        description: `You got ${correctWords} out of ${wordSequence.length} correct`,
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={userSequence.length !== wordSequence.length}
                  className="flex-1"
                >
                  Check Answer
                </Button>
                <Button variant="outline" onClick={() => {
                  setUserSequence([]);
                  showInfo("Reset", "Your sequence has been cleared");
                }}>
                  Reset Selections
                </Button>

                <Button variant="secondary" onClick={() => {
                  startWordGame();
                  showInfo("Game Restarted", "New words to memorize!");
                }}>
                  Restart Game
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card className="bg-gradient-to-br from-primary/5 to-primary-glow/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6 text-primary" />
            Benefits of Brain Training
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Improves memory and cognitive function</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Enhances problem-solving abilities</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Boosts concentration and focus</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>May help prevent cognitive decline</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrainGames;