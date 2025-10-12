import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, RotateCcw, Dices } from 'lucide-react';

interface PlayerResult {
  id: string;
  name: string;
  emoji: string;
  color: string;
  count: number;
  rank: number;
}

interface ResultsScreenProps {
  results: PlayerResult[];
  onPlayAgain: () => void;
  onRandomPenalty: () => void;
}

export default function ResultsScreen({ results, onPlayAgain, onRandomPenalty }: ResultsScreenProps) {
  const maxCount = Math.max(...results.map(r => r.count));
  const winner = results.find(r => r.rank === 1);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-bounce">🎉</div>
        <h1 className="text-3xl font-bold">게임 종료!</h1>
        {winner && (
          <p className="text-xl text-muted-foreground">
            {winner.emoji} {winner.name}님이 1등!
          </p>
        )}
      </div>

      <div className="space-y-3">
        {results.map((result) => (
          <Card 
            key={result.id} 
            className="p-4"
            data-testid={`card-result-${result.id}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12">
                {result.rank === 1 && <Trophy className="h-8 w-8 text-yellow-500" />}
                {result.rank === 2 && <Medal className="h-8 w-8 text-gray-400" />}
                {result.rank === 3 && <Award className="h-8 w-8 text-amber-600" />}
                {result.rank > 3 && <span className="text-2xl font-bold text-muted-foreground">{result.rank}</span>}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{result.emoji}</span>
                  <span className="font-bold text-lg" data-testid={`text-result-name-${result.id}`}>
                    {result.name}
                  </span>
                </div>
                
                <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                    style={{
                      width: `${maxCount > 0 ? (result.count / maxCount) * 100 : 0}%`,
                      backgroundColor: result.color,
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-md">
                    {result.count}점
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="pt-4 space-y-3">
        <Button 
          onClick={onRandomPenalty} 
          className="w-full" 
          size="lg"
          data-testid="button-random-penalty"
        >
          <Dices className="h-5 w-5 mr-2" />
          벌칙 랜덤 뽑기
        </Button>
        
        <Button 
          onClick={onPlayAgain} 
          variant="outline" 
          className="w-full" 
          size="lg"
          data-testid="button-play-again"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          다시하기
        </Button>
      </div>
    </div>
  );
}
