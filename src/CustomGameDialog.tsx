import type { GameConfig } from '@/GameSettings';

interface CustomGameDialogProps {
  isOpen: boolean;
  initialConfig: GameConfig;
  onClose: () => void;
  onSubmit: (config: GameConfig) => void;
}

export default function CustomGameDialog(_: CustomGameDialogProps) {
  return null;
}
