import TimerDisplay from '../TimerDisplay';

export default function TimerDisplayExample() {
  return (
    <div className="w-full">
      <TimerDisplay 
        totalSeconds={180}
        onComplete={() => console.log('Timer completed!')}
      />
      <div className="p-4 text-center text-sm text-muted-foreground">
        Timer example: 3 minutes countdown
      </div>
    </div>
  );
}
