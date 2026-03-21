// Audit History Storage - localStorage based

export const STORES_LIST = [
  'AAST Abu Kir',
  'PLATZ',
  'Namaa Ramsis',
  'Smouha',
  'W.D Alnakhil',
  'Alex West',
  'W.D Maadi',
  'Platinum',
  'W.D ALEX',
  'Namaa Palm Hills',
  'TP Plaza',
  'Namaa NestleA',
  'BUE',
  'TP San Stefano',
];

export interface AuditRecord {
  id: string;
  branchName: string;
  auditorName: string;
  date: string;
  score: number;
  percentage: number;
  ccpPercentage: number;
  passed: boolean;
  auditMode: 'shortlist' | 'full';
  categories: {
    name: string;
    score: number;
    maxScore: number;
    percentage: number;
  }[];
  actionItems: ActionItem[];
  timestamp: number;
}

export interface ActionItem {
  id: string;
  questionId: number;
  question: string;
  branchName: string;
  assignedTo: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
  completedAt?: number;
  notes?: string;
}

const HISTORY_KEY = 'green-cafe-audit-history';
const ACTION_ITEMS_KEY = 'green-cafe-audit-actions';

// Audit History
export function saveAuditRecord(record: Omit<AuditRecord, 'id' | 'timestamp'>): AuditRecord {
  const history = getAuditHistory();
  const newRecord: AuditRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now()
  };
  history.unshift(newRecord); // newest first
  // Keep last 100 records
  const trimmed = history.slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  return newRecord;
}

export function getAuditHistory(): AuditRecord[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function getAuditByBranch(branchName: string): AuditRecord[] {
  const history = getAuditHistory();
  return history.filter(r => r.branchName.toLowerCase().includes(branchName.toLowerCase()));
}

export function getAuditTrend(branchName: string, limit = 10): { date: string; percentage: number }[] {
  const records = getAuditByBranch(branchName)
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-limit);
  return records.map(r => ({ date: r.date, percentage: r.percentage }));
}

// Action Items
export function saveActionItem(item: Omit<ActionItem, 'id'>): ActionItem {
  const items = getActionItems();
  const newItem: ActionItem = {
    ...item,
    id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };
  items.unshift(newItem);
  localStorage.setItem(ACTION_ITEMS_KEY, JSON.stringify(items));
  return newItem;
}

export function getActionItems(filters?: {
  branchName?: string;
  status?: ActionItem['status'];
  assignedTo?: string;
}): ActionItem[] {
  try {
    let items = JSON.parse(localStorage.getItem(ACTION_ITEMS_KEY) || '[]') as ActionItem[];
    if (filters) {
      if (filters.branchName) {
        items = items.filter((i: ActionItem) => i.branchName.toLowerCase().includes(filters.branchName!.toLowerCase()));
      }
      if (filters.status) {
        items = items.filter((i: ActionItem) => i.status === filters.status);
      }
      if (filters.assignedTo) {
        items = items.filter((i: ActionItem) => i.assignedTo.toLowerCase().includes(filters.assignedTo!.toLowerCase()));
      }
    }
    return items;
  } catch {
    return [];
  }
}

export function updateActionItem(id: string, updates: Partial<ActionItem>): void {
  const items = JSON.parse(localStorage.getItem(ACTION_ITEMS_KEY) || '[]');
  const index = items.findIndex((i: ActionItem) => i.id === id);
  if (index !== -1) {
    items[index] = { ...items[index], ...updates };
    localStorage.setItem(ACTION_ITEMS_KEY, JSON.stringify(items));
  }
}

export function deleteActionItem(id: string): void {
  const items = JSON.parse(localStorage.getItem(ACTION_ITEMS_KEY) || '[]');
  const filtered = items.filter((i: ActionItem) => i.id !== id);
  localStorage.setItem(ACTION_ITEMS_KEY, JSON.stringify(filtered));
}

// Statistics
export function getStats() {
  const history = getAuditHistory();
  const actions = getActionItems();
  
  const totalAudits = history.length;
  const passRate = totalAudits > 0 
    ? Math.round((history.filter(h => h.passed).length / totalAudits) * 100) 
    : 0;
  
  const avgScore = totalAudits > 0 
    ? Math.round(history.reduce((sum, h) => sum + h.percentage, 0) / totalAudits) 
    : 0;

  const pendingActions = actions.filter(a => a.status !== 'completed').length;
  const overdueActions = actions.filter(a => {
    if (a.status === 'completed' || !a.deadline) return false;
    return new Date(a.deadline) < new Date();
  }).length;

  // Category performance
  const categoryStats: Record<string, { total: number; count: number }> = {};
  history.forEach(h => {
    h.categories.forEach(c => {
      if (!categoryStats[c.name]) {
        categoryStats[c.name] = { total: 0, count: 0 };
      }
      categoryStats[c.name].total += c.percentage;
      categoryStats[c.name].count++;
    });
  });

  const categoryPerformance = Object.entries(categoryStats).map(([name, data]) => ({
    name,
    avgPercentage: Math.round(data.total / data.count)
  }));

  // Recent branches
  const branchScores: Record<string, { latest: number; count: number; trend: number[] }> = {};
  history.slice(0, 50).forEach(h => {
    if (!branchScores[h.branchName]) {
      branchScores[h.branchName] = { latest: h.percentage, count: 1, trend: [h.percentage] };
    } else {
      branchScores[h.branchName].count++;
      branchScores[h.branchName].trend.push(h.percentage);
      branchScores[h.branchName].latest = h.percentage;
    }
  });

  const topBranches = Object.entries(branchScores)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.latest - a.latest)
    .slice(0, 10);

  return {
    totalAudits,
    passRate,
    avgScore,
    pendingActions,
    overdueActions,
    categoryPerformance,
    topBranches
  };
}
