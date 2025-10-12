import ShareDialog from '../ShareDialog';

export default function ShareDialogExample() {
  return (
    <ShareDialog 
      roomCode="ABC123" 
      onClose={() => console.log('Closed')} 
    />
  );
}
