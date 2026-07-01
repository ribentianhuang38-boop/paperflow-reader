'use client';

import React from 'react';

export default function MasteryPage() {
  const masteryScore = 78;
  const trendData = [65, 70, 68, 75, 72, 78, 82, 78];
  const vocabStats = { total: 156, mastered: 89, recent: 12 };

  const chartHeight = 160;
  const chartWidth = 320;
  const stepX = chartWidth / (trendData.length - 1);

  const points = trendData.map((score, i) => ({
    x: i * stepX,
    y: chartHeight - (score / 100) * chartHeight,
  }));

  const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
  const fillD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="flex flex-col h-full overflow-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold">Reading Mastery</h2>

      <div className="card bg-base-100 border border-base-300 p-6">
        <div className="flex items-center gap-6">
          <div className="radial-progress text-primary"
            style={{ '--value': masteryScore, '--size': '120px', '--thickness': '10px' } as any}
            role="progressbar">
            <div className="text-center">
              <div className="text-2xl font-bold">{masteryScore}%</div>
              <div className="text-xs text-base-content/50">Overall</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-base-content/60 mb-1">Reading Mastery</div>
            <div className="text-3xl font-bold text-primary">{masteryScore}%</div>
            <div className="text-sm text-base-content/50 mt-1">
              {masteryScore >= 80 ? 'Excellent' : masteryScore >= 60 ? 'Good progress' : 'Keep going'}
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 p-4">
        <h3 className="font-semibold text-sm mb-4">Trend</h3>
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {[0, 25, 50, 75, 100].map((v) => {
            const y = chartHeight - (v / 100) * chartHeight;
            return <line key={v} x1={0} y1={y} x2={chartWidth} y2={y} stroke="currentColor" strokeOpacity={0.1} strokeWidth={1} />;
          })}
          <path d={fillD} fill="currentColor" fillOpacity={0.08} className="text-primary" />
          <path d={pathD} fill="none" stroke="currentColor" strokeWidth={2} className="text-primary" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill="currentColor" className="text-primary" />)}
        </svg>
        <div className="flex justify-between text-xs text-base-content/40 mt-2">
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 p-4">
        <h3 className="font-semibold text-sm mb-3">Vocabulary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><div className="text-2xl font-bold text-primary">{vocabStats.total}</div><div className="text-xs text-base-content/50">Collected</div></div>
          <div><div className="text-2xl font-bold text-success">{vocabStats.mastered}</div><div className="text-xs text-base-content/50">Mastered</div></div>
          <div><div className="text-2xl font-bold text-warning">{vocabStats.recent}</div><div className="text-xs text-base-content/50">This Week</div></div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span>Mastery Rate</span>
            <span>{Math.round((vocabStats.mastered / vocabStats.total) * 100)}%</span>
          </div>
          <progress className="progress progress-success w-full" value={vocabStats.mastered} max={vocabStats.total}></progress>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 p-4">
        <h3 className="font-semibold text-sm mb-3">Recent Review Sessions</h3>
        <div className="space-y-2">
          {[
            { date: 'Today', score: 82, paper: 'Attention Is All You Need' },
            { date: 'Yesterday', score: 75, paper: 'BERT: Pre-training of Deep Bidirectional Transformers' },
            { date: '3 days ago', score: 68, paper: 'ResNet: Deep Residual Learning' },
          ].map((session, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-base-200">
              <div className={`radial-progress text-sm ${session.score >= 80 ? 'text-success' : session.score >= 60 ? 'text-warning' : 'text-error'}`}
                style={{ '--value': session.score, '--size': '40px', '--thickness': '3px' } as any}>
                {session.score}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{session.paper}</div>
                <div className="text-xs text-base-content/50">{session.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
