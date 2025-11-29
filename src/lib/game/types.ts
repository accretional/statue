
export enum NodeType {
  Hub = 'Hub', // Central non-clickable platform anchors
  Vanity = 'Vanity', // Trap: High cost, useless metrics
  EchoChamber = 'EchoChamber', // Low risk, low reward, noise
  Growth = 'Growth', // The real deal
  GoldMine = 'GoldMine', // Hidden, high reward
  IRL = 'IRL', // Physical locations, RNG heavy
  Product = 'Product', // The core
  DarkPattern = 'DarkPattern' // Unethical but effective
}

export enum NodeStatus {
  Locked = 'locked',
  Unlocked = 'unlocked',
  Banned = 'banned',
  Active = 'active' // Currently processing
}

export interface GameNode {
  id: string;
  label: string;
  cluster: string; // Grouping ID (e.g., 'reddit', 'code', 'linkedin')
  type: NodeType;
  status: NodeStatus;
  x?: number;
  y?: number;
  tier: number; // 1-5
  description: string;
  energyCost: number;
  risk: number; // 0-100 probability of something bad happening
  rewardType: 'users' | 'sanity' | 'cash' | 'stars' | 'vanity' | 'mrr' | 'techDebt';
  baseRewardAmount?: number;
}

export interface GameMetrics {
  cash: number;
  discordMembers: number;
  githubStars: number;
  mrr: number;
  sanity: number;
  users: number; // Vanity metric
  techDebt: number;
}

export interface WeeklyEvent {
  title: string;
  description: string;
  effectType: 'good' | 'bad';
}

export interface GameState {
  week: number;
  maxWeeks: number;
  energy: number;
  maxEnergy: number;
  metrics: GameMetrics;
  nodes: GameNode[];
  logs: string[];
  gameOver: { won: boolean; reason: string } | null;
  isProcessing: boolean;
  modalOpen: boolean;
  selectedNodeId: string | null;
  weeklyEvent: WeeklyEvent | null;
}

export interface YCQuestion {
  id: string;
  question: string;
  condition: (metrics: GameMetrics) => boolean;
  answerWait: string;
  answerPass: string;
  answerFail: string;
}
