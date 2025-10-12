import { useState } from 'react';
import TimerSelector from '../TimerSelector';

export default function TimerSelectorExample() {
  const [selectedTimer, setSelectedTimer] = useState(180);

  return (
    <div className="max-w-2xl mx-auto">
      <TimerSelector selectedTimer={selectedTimer} onTimerChange={setSelectedTimer} />
    </div>
  );
}
