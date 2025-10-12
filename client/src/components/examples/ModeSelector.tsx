import { useState } from 'react';
import ModeSelector from '../ModeSelector';

export default function ModeSelectorExample() {
  const [selectedMode, setSelectedMode] = useState('free');

  return (
    <div className="max-w-2xl mx-auto">
      <ModeSelector selectedMode={selectedMode} onModeChange={setSelectedMode} />
    </div>
  );
}
