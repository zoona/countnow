import ResultsScreen from '../ResultsScreen';

export default function ResultsScreenExample() {
  const mockResults = [
    { id: '1', name: '아들', emoji: '👦', color: '#A7FFEB', count: 12, rank: 1 },
    { id: '2', name: '엄마', emoji: '👩', color: '#FF8A80', count: 8, rank: 2 },
    { id: '3', name: '아빠', emoji: '👨', color: '#80D8FF', count: 5, rank: 3 },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <ResultsScreen
        results={mockResults}
        onPlayAgain={() => console.log('Play again clicked')}
        onRandomPenalty={() => console.log('Random penalty clicked')}
      />
    </div>
  );
}
