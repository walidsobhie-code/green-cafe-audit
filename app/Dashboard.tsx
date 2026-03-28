'use client';

import { useState, useEffect } from 'react';
import { getAuditHistory, getActionItems, updateActionItem, deleteActionItem, getStats, AuditRecord, ActionItem } from '@/lib/history';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'actions'>('overview');
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);
  const [history, setHistory] = useState<AuditRecord[]>([]);
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    setStats(getStats());
    setHistory(getAuditHistory());
    setActions(getActionItems());
  }

  // Show notification if score drops
  useEffect(() => {
    if (stats && stats.avgScore < 80) {
      setNotification(`⚠️ Average score is ${stats.avgScore}% - below target!`);
    }
    if (stats && stats.overdueActions > 0) {
      setNotification(`${stats.overdueActions} action items are overdue!`);
    }
  }, [stats]);

  function toggleActionStatus(action: ActionItem) {
    const newStatus = action.status === 'completed' ? 'pending' : action.status === 'pending' ? 'in-progress' : 'completed';
    updateActionItem(action.id, { 
      status: newStatus,
      completedAt: newStatus === 'completed' ? Date.now() : undefined 
    });
    loadData();
  }

  function handleDeleteAction(id: string) {
    if (confirm('Delete this action item?')) {
      deleteActionItem(id);
      loadData();
    }
  }

  const filteredHistory = selectedBranch 
    ? history.filter(h => h.branchName.toLowerCase().includes(selectedBranch.toLowerCase()))
    : history;

  const filteredActions = actions.filter(a => {
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Green Cafe logo" className="w-10 h-10 rounded-lg shadow" />
              <div>
                <h1 className="text-lg font-bold text-gray-800">Green Cafe</h1>
                <p className="text-xs text-gray-500">Dashboard & Analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-colors">
                + New Audit
              </a>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex px-4 border-t border-gray-100">
          {(['overview', 'history', 'actions'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-green-600 text-green-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'overview' && '📊 Overview'}
              {tab === 'history' && '📋 History'}
              {tab === 'actions' && '📝 Actions'}
            </button>
          ))}
        </div>
      </header>

      {/* Notification Alert */}
      {notification && (
        <div className="mx-4 mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
          <p className="text-amber-800 font-bold text-sm">{notification}</p>
        </div>
      )}

      <main className="px-4 py-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Total Audits</p>
                <p className="text-2xl font-black text-gray-900">{stats.totalAudits}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Pass Rate</p>
                <p className={`text-2xl font-black ${stats.passRate >= 90 ? 'text-green-600' : stats.passRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {stats.passRate}%
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Avg Score</p>
                <p className="text-2xl font-black text-gray-900">{stats.avgScore}%</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase">Pending Actions</p>
                <p className="text-2xl font-black text-amber-600">{stats.pendingActions}</p>
              </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Category Performance</h3>
              <div className="space-y-3">
                {stats.categoryPerformance.map(cat => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-gray-600">{cat.name}</span>
                      <span className={`font-bold ${cat.avgPercentage >= 90 ? 'text-green-600' : cat.avgPercentage >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {cat.avgPercentage}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${cat.avgPercentage >= 90 ? 'bg-green-500' : cat.avgPercentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${cat.avgPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                {stats.categoryPerformance.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
                )}
              </div>
            </div>

            {/* Top Branches */}
            <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Branch Rankings</h3>
              <div className="space-y-2">
                {stats.topBranches.map((branch, i) => (
                  <div key={branch.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-yellow-500 text-white' : i === 1 ? 'bg-gray-400 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800">{branch.name}</span>
                      <span className="text-xs text-gray-400">({branch.count} audits)</span>
                    </div>
                    <span className={`text-sm font-bold ${branch.latest >= 90 ? 'text-green-600' : branch.latest >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {branch.latest}%
                    </span>
                  </div>
                ))}
                {stats.topBranches.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No data yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {/* Search Filter */}
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <input
                type="text"
                placeholder="Search by branch name..."
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:border-green-500 outline-none"
              />
            </div>

            {/* History List */}
            <div className="space-y-3">
              {filteredHistory.map(record => (
                <div key={record.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-gray-800">{record.branchName}</h4>
                      <p className="text-xs text-gray-400">{record.date} • {record.auditorName}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      record.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {record.passed ? '✓ PASS' : '✗ FAIL'}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Score</p>
                      <p className="text-lg font-black text-gray-900">{record.percentage}%</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">CCP</p>
                      <p className="text-lg font-black text-gray-900">{record.ccpPercentage}%</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400">Points</p>
                      <p className="text-lg font-black text-gray-900">{record.score}/{record.auditMode === 'shortlist' ? 50 : 100}</p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredHistory.length === 0 && (
                <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 text-center">
                  <p className="text-gray-400">No audit history found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'in-progress', 'completed'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    filterStatus === status 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'All' : status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Actions List */}
            <div className="space-y-3">
              {filteredActions.map(action => (
                <div key={action.id} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">{action.question}</h4>
                      <p className="text-xs text-gray-400">{action.branchName}</p>
                    </div>
                    <select
                      value={action.status}
                      onChange={e => {
                        updateActionItem(action.id, { 
                          status: e.target.value as any,
                          completedAt: e.target.value === 'completed' ? Date.now() : undefined
                        });
                        loadData();
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-bold border-0 ${
                        action.status === 'completed' ? 'bg-green-100 text-green-700' :
                        action.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>👤 {action.assignedTo || 'Unassigned'}</span>
                      <span>📅 {action.deadline || 'No deadline'}</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteAction(action.id)}
                      className="text-red-400 hover:text-red-600 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {filteredActions.length === 0 && (
                <div className="bg-white rounded-xl p-8 shadow-md border border-gray-100 text-center">
                  <p className="text-gray-400">No action items found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
