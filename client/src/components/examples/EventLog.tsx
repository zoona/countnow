import EventLog from '../EventLog';

export default function EventLogExample() {
  const mockEvents = [
    { id: '1', playerName: '엄마 👩', delta: 1, timestamp: '00:12' },
    { id: '2', playerName: '아빠 👨', delta: 1, timestamp: '00:34' },
    { id: '3', playerName: '아들 👦', delta: -1, timestamp: '00:45' },
    { id: '4', playerName: '엄마 👩', delta: 1, timestamp: '01:02' },
    { id: '5', playerName: '아들 👦', delta: 1, timestamp: '01:15' },
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      <EventLog events={mockEvents} />
    </div>
  );
}
