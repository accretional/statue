
import { writable, get } from 'svelte/store';
import { NodeStatus } from './types';
import type { GameState, GameMetrics, GameNode } from './types';
import { INITIAL_METRICS, INITIAL_NODES, YC_QUESTIONS } from './constants';
import { generateWeeklyEvent, generateFlavorText } from './services/geminiService';

const MAX_WEEKS = 24;
const MAX_ENERGY = 100;

const initialState: GameState = {
  week: 1,
  maxWeeks: MAX_WEEKS,
  energy: 100,
  maxEnergy: MAX_ENERGY,
  metrics: INITIAL_METRICS,
  nodes: INITIAL_NODES,
  logs: ["Welcome to the incubator. Burn rate is active. Good luck."],
  gameOver: null,
  isProcessing: false,
  modalOpen: false,
  selectedNodeId: null,
  weeklyEvent: null,
};

function createGameStore() {
  const store = writable<GameState>(initialState);
  const { subscribe, set, update } = store;

  const methods = {
    setNodeSelection: (id: string | null) => {
      update(s => ({ ...s, selectedNodeId: id, modalOpen: !!id }));
    },

    closeModal: () => {
      update(s => ({ ...s, modalOpen: false, selectedNodeId: null }));
    },

    resetGame: () => {
      set({
        ...initialState,
        logs: ["Welcome back. Try not to fail this time."]
      });
    },

    checkGameOver: () => {
      const state = get(store);
      const { metrics, week } = state;
      
      if (metrics.cash <= 0) {
        update(s => ({ ...s, gameOver: { won: false, reason: "Insolvent. You are now a consultant." } }));
      } else if (metrics.sanity <= 0) {
        update(s => ({ ...s, gameOver: { won: false, reason: "Burnout. You moved to a yurt in Montana." } }));
      } else if (week > MAX_WEEKS) {
        // Check YC status
        const score = YC_QUESTIONS.filter(q => q.condition(metrics)).length;
        if (score === YC_QUESTIONS.length) {
           update(s => ({ ...s, gameOver: { won: true, reason: "ACCEPTED. Now the real pain begins." } }));
        } else {
           update(s => ({ ...s, gameOver: { won: false, reason: "REJECTED. 'Just not a billion dollar market.'" } }));
        }
      }
    },

    performAction: async (nodeId: string) => {
      const state = get(store);
      const node = state.nodes.find(n => n.id === nodeId);
      
      if (!node || state.energy < node.energyCost || state.isProcessing) return;

      update(s => ({ ...s, isProcessing: true, energy: s.energy - node.energyCost }));

      // Simulation Logic
      let outcomeText = "";
      let newMetrics = { ...state.metrics };
      let nodesUpdate = [...state.nodes];

      // Risk Check
      if (node.risk > 0 && Math.random() * 100 < node.risk) {
         newMetrics.sanity -= 15;
         outcomeText = "FAILURE. ";
         if (Math.random() > 0.8) {
           outcomeText += " You have been BANNED.";
           nodesUpdate = nodesUpdate.map(n => n.id === nodeId ? { ...n, status: NodeStatus.Banned } : n);
         }
      } else {
         // Success logic
         const multiplier = 1 + (Math.random() * 0.5); // Variance
         const baseAmount = node.baseRewardAmount || 10;
         
         switch (node.rewardType) {
           case 'users': newMetrics.users += Math.floor(baseAmount * multiplier); break;
           case 'cash': newMetrics.cash += Math.floor(baseAmount * multiplier); break;
           case 'mrr': newMetrics.mrr += Math.floor(baseAmount * multiplier); break;
           case 'stars': newMetrics.githubStars += Math.floor((baseAmount / 10) * multiplier); break;
           case 'sanity': newMetrics.sanity = Math.min(100, newMetrics.sanity + Math.floor(baseAmount / 2)); break;
           case 'vanity': 
              newMetrics.users += Math.floor(baseAmount * 5); 
              outcomeText = "Vanity spike! Investors are confused.";
              break;
           case 'techDebt':
              newMetrics.techDebt = (newMetrics.techDebt || 0) + Math.floor(baseAmount * multiplier);
              outcomeText = "Technical debt increased. Future features will cost more energy.";
              break;
         }
         if (!outcomeText) outcomeText = "Action complete.";
      }
      
      // Unlock hidden nodes logic (simplified)
      if (node.cluster === 'code' && Math.random() > 0.7) {
          const aws = nodesUpdate.find(n => n.id === 'aws_credits');
          if (aws && aws.status === NodeStatus.Locked) {
              nodesUpdate = nodesUpdate.map(n => n.id === 'aws_credits' ? { ...n, status: NodeStatus.Unlocked } : n);
              update(s => ({ ...s, logs: ["Unlocked: AWS Credits!", ...s.logs] }));
          }
      }
      
      if (node.cluster === 'ai' && node.id === 'train_model') {
          // Unlocking high burn
          update(s => ({ ...s, logs: ["Warning: High GPU Burn Rate Activated.", ...s.logs] }));
      }

      // Generate Flavor Text
      const flavor = await generateFlavorText(node.label, outcomeText);
      
      update(s => ({
        ...s,
        metrics: newMetrics,
        nodes: nodesUpdate,
        logs: [`> ${flavor}`, ...s.logs].slice(0, 50),
        isProcessing: false,
        modalOpen: false,
        selectedNodeId: null
      }));

      methods.checkGameOver();
    },

    endWeek: async () => {
      update(s => ({ ...s, isProcessing: true }));
      const state = get(store);
      const nextWeek = state.week + 1;

      // Burn Calculation
      let burn = 200; // Living
      if (state.metrics.users > 500) burn += 100; // Hosting
      if (state.metrics.users > 5000) burn += 500; // Scaling
      
      // AI Tax
      const hasTrainedModel = state.nodes.find(n => n.id === 'train_model' && n.status === NodeStatus.Unlocked);
      if (hasTrainedModel) burn += 500; // GPU Costs

      // Revenue
      const revenue = state.metrics.mrr;
      
      const newCash = state.metrics.cash - burn + revenue;
      
      // Event
      const event = await generateWeeklyEvent(nextWeek, state.metrics.sanity);
      let newSanity = state.metrics.sanity;
      
      if (event.effectType === 'bad') newSanity -= 10;
      else newSanity += 5;

      update(s => ({
        ...s,
        week: nextWeek,
        energy: MAX_ENERGY,
        metrics: { ...s.metrics, cash: newCash, sanity: Math.min(100, newSanity) },
        weeklyEvent: event,
        isProcessing: false
      }));

      methods.checkGameOver();
    },
    
    closeEvent: () => {
        update(s => ({ ...s, weeklyEvent: null }));
    }
  };

  return {
    subscribe,
    ...methods
  };
}

export const gameStore = createGameStore();
