import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface Event {
  id: string;
  playerName: string;
  delta: number;
  timestamp: string;
}

interface EventLogProps {
  events: Event[];
}

export default function EventLog({ events }: EventLogProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const displayEvents = isExpanded ? events : events.slice(0, 3);

  return (
    <div className="border-t bg-muted/30 backdrop-blur-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between hover-elevate"
        data-testid="button-event-log-toggle"
      >
        <span className="text-sm font-medium">최근 기록</span>
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
      </button>
      
      {displayEvents.length > 0 && (
        <div className="px-4 pb-3 space-y-1">
          {displayEvents.map((event) => (
            <div 
              key={event.id} 
              className="text-xs text-muted-foreground flex items-center justify-between"
              data-testid={`event-${event.id}`}
            >
              <span>
                {event.playerName} {event.delta > 0 ? '+' : ''}{event.delta}
              </span>
              <span>{event.timestamp}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
