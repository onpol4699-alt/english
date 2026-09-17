import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Crown, 
  Medal, 
  Search, 
  UserCheck, 
  ShieldCheck, 
  Award,
  Zap,
  TrendingUp,
  Filter
} from 'lucide-react';
import { UserProgress, DifficultyLevel, UserRole } from '../types';
import { loadMembers } from '../utils/memberStorage';
import { getRegisteredAccounts } from '../utils/storage';

interface LeaderboardUser {
  id: string;
  fullName: string;
  identifier: string;
  displayIdentifier: string;
  avatarUrl: string;
  xp: number;
  streakDays: number;
  level: DifficultyLevel;
  role: UserRole;
  isCurrentUser: boolean;
}

interface GlobalLeaderboardProps {
  progress: UserProgress;
}

/**
 * Format user identities clearly via Phone Number (e.g., "092 *** 1234") 
 * or Gmail Username (e.g., "phonphai***@gmail.com")
 */
export function formatLeaderboardIdentifier(rawIdentifier?: string): string {
  if (!rawIdentifier) return 'student***@gmail.com';
  const clean = rawIdentifier.trim();

  // If phone number
  const digits = clean.replace(/[^0-9]/g, '');
  if (digits.length >= 8) {
    const prefix = digits.slice(0, 3);
    const suffix = digits.slice(-4);
    return `${prefix} *** ${suffix}`;
  }

  // If email / Gmail
  if (clean.includes('@')) {
    const [local, domain] = clean.split('@');
    if (local.length <= 4) {
      return `${local.slice(0, 2)}***@${domain}`;
    }
    const visibleLen = Math.min(8, Math.max(3, local.length - 3));
    return `${local.slice(0, visibleLen)}***@${domain}`;
  }

  // Username or other string
  if (clean.length > 5) {
    return `${clean.slice(0, 4)}***`;
  }
  return `${clean}***`;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({ progress }) => {
  const [sortMetric, setSortMetric] = useState<'xp' | 'streak'>('xp');
  const [levelFilter, setLevelFilter] = useState<'all' | DifficultyLevel>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Assemble and compute live leaderboard members
  const leaderboardList = useMemo(() => {
    const members = loadMembers();
    const accounts = getRegisteredAccounts();

    const userMap = new Map<string, LeaderboardUser>();

    // 1. Add members directory
    members.forEach((m, idx) => {
      const emailOrPhone = m.email || m.phone || `student_${idx}@gmail.com`;
      const baseXP = m.role === 'Developer' ? 5200 : m.role === 'Admin' ? 4400 : m.role === 'Teacher' ? 3850 : 1200 + (idx * 320);
      const baseStreak = m.role === 'Developer' ? 42 : m.role === 'Admin' ? 28 : 12 + (idx * 3);

      userMap.set(emailOrPhone.toLowerCase(), {
        id: m.id,
        fullName: m.fullName,
        identifier: emailOrPhone,
        displayIdentifier: formatLeaderboardIdentifier(emailOrPhone),
        avatarUrl: m.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(m.fullName)}&backgroundColor=c0aede`,
        xp: baseXP,
        streakDays: baseStreak,
        level: m.level || 'intermediate',
        role: m.role || 'Student',
        isCurrentUser: false,
      });
    });

    // 2. Add registered accounts
    accounts.forEach((acc) => {
      const idKey = (acc.email || acc.phoneNumber || acc.userIdentifier || acc.userName).toLowerCase();
      if (!userMap.has(idKey)) {
        userMap.set(idKey, {
          id: acc.id,
          fullName: acc.userName || 'Learner',
          identifier: idKey,
          displayIdentifier: formatLeaderboardIdentifier(idKey),
          avatarUrl: acc.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(acc.userName)}&backgroundColor=c0aede`,
          xp: 850,
          streakDays: 5,
          level: 'beginner',
          role: acc.role || 'Student',
          isCurrentUser: false,
        });
      }
    });

    // 3. Inject / sync current active user
    const currentIdKey = (progress.email || progress.phoneNumber || progress.userIdentifier || progress.userName || 'current_user').toLowerCase();
    userMap.set(currentIdKey, {
      id: 'current-active-user',
      fullName: progress.userName || 'អ្នកសិក្សា (You)',
      identifier: currentIdKey,
      displayIdentifier: formatLeaderboardIdentifier(currentIdKey),
      avatarUrl: progress.avatarUrl || 'https://api.dicebear.com/7.x/adventurer/svg?seed=Dara&backgroundColor=c0aede',
      xp: progress.xp,
      streakDays: Math.max(1, progress.streakDays),
      level: progress.currentLevel,
      role: progress.role || 'Student',
      isCurrentUser: true,
    });

    let list = Array.from(userMap.values());

    // Apply level filter
    if (levelFilter !== 'all') {
      list = list.filter((u) => u.level === levelFilter);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((u) => 
        u.fullName.toLowerCase().includes(q) || 
        u.displayIdentifier.toLowerCase().includes(q)
      );
    }

    // Sort by selected metric
    if (sortMetric === 'xp') {
      list.sort((a, b) => b.xp - a.xp || b.streakDays - a.streakDays);
    } else {
      list.sort((a, b) => b.streakDays - a.streakDays || b.xp - a.xp);
    }

    return list;
  }, [progress, sortMetric, levelFilter, searchQuery]);

  // Current user's ranking position
  const currentUserRank = useMemo(() => {
    const idx = leaderboardList.findIndex((u) => u.isCurrentUser);
    return idx >= 0 ? idx + 1 : null;
  }, [leaderboardList]);

  // Top 3 for Podiums
  const topThree = leaderboardList.slice(0, 3);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-md border border-indigo-900/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
              <Crown className="w-3.5 h-3.5" />
              <span>Angkor English Academy Global Arena</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>Global Leaderboard & Competition</span>
              <Trophy className="w-6 h-6 text-amber-400" />
            </h2>
            <p className="font-khmer text-xs sm:text-sm text-indigo-200 mt-1 max-w-xl">
              តារាងកិត្តិយសសកលផ្អែកលើពិន្ទុ XP និងថ្ងៃសិក្សាជាប់ៗគ្នា (Streak)។ ប្រកួតប្រជែងដើម្បីដណ្តើមចំណាត់ថ្នាក់លេខ ១!
            </p>
          </div>

          {/* Current User Standing Badge */}
          {currentUserRank && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 sm:p-4 text-center shrink-0">
              <div className="text-[11px] font-khmer text-indigo-200">ចំណាត់ថ្នាក់របស់អ្នក (Your Rank)</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono mt-0.5">
                #{currentUserRank}
              </div>
              <div className="text-[10px] text-slate-300 font-khmer mt-0.5">
                {progress.xp} XP • {progress.streakDays} ថ្ងៃ Streak
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {topThree.length >= 3 && !searchQuery && levelFilter === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2">
          
          {/* 2nd Place (Silver) */}
          <div className="order-2 sm:order-1 bg-white rounded-2xl border-2 border-slate-200 p-4 shadow-sm flex flex-col items-center text-center relative hover:shadow-md transition-all">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-black border border-slate-300 flex items-center gap-1 shadow-xs">
              <span>🥈 2nd Place</span>
            </div>
            <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-slate-400 to-slate-200 mt-2 mb-2 shadow-sm">
              <img 
                src={topThree[1].avatarUrl} 
                alt={topThree[1].fullName} 
                className="w-full h-full object-cover rounded-full bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-bold text-slate-900 text-sm truncate max-w-full">
              {topThree[1].fullName}
            </h3>
            <span className="text-[11px] font-mono text-slate-500 truncate max-w-full">
              {topThree[1].displayIdentifier}
            </span>
            <div className="mt-3 w-full pt-2 border-t border-slate-100 flex items-center justify-around text-xs">
              <span className="font-black text-indigo-700">{topThree[1].xp} XP</span>
              <span className="font-bold text-amber-600 flex items-center gap-0.5">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                {topThree[1].streakDays}d
              </span>
            </div>
          </div>

          {/* 1st Place (Gold Champion) */}
          <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-white rounded-2xl border-2 border-amber-400 p-5 shadow-md flex flex-col items-center text-center relative sm:-translate-y-2 hover:shadow-lg transition-all">
            <div className="absolute -top-3.5 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-black shadow-sm flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-amber-200" />
              <span>🥇 Champion</span>
            </div>
            <div className="w-20 h-20 rounded-full p-1.5 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 mt-2 mb-2 shadow-md">
              <img 
                src={topThree[0].avatarUrl} 
                alt={topThree[0].fullName} 
                className="w-full h-full object-cover rounded-full bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-black text-slate-900 text-base truncate max-w-full">
              {topThree[0].fullName}
            </h3>
            <span className="text-xs font-mono text-amber-900/80 font-bold truncate max-w-full">
              {topThree[0].displayIdentifier}
            </span>
            <div className="mt-3 w-full pt-2.5 border-t border-amber-200/60 flex items-center justify-around text-xs font-bold">
              <span className="font-black text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                {topThree[0].xp} XP
              </span>
              <span className="font-black text-amber-600 flex items-center gap-0.5">
                <Flame className="w-4 h-4 fill-amber-500" />
                {topThree[0].streakDays} Days
              </span>
            </div>
          </div>

          {/* 3rd Place (Bronze) */}
          <div className="order-3 bg-white rounded-2xl border-2 border-amber-200/80 p-4 shadow-sm flex flex-col items-center text-center relative hover:shadow-md transition-all">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black border border-amber-300 flex items-center gap-1 shadow-xs">
              <span>🥉 3rd Place</span>
            </div>
            <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-amber-600 to-orange-400 mt-2 mb-2 shadow-sm">
              <img 
                src={topThree[2].avatarUrl} 
                alt={topThree[2].fullName} 
                className="w-full h-full object-cover rounded-full bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
            <h3 className="font-bold text-slate-900 text-sm truncate max-w-full">
              {topThree[2].fullName}
            </h3>
            <span className="text-[11px] font-mono text-slate-500 truncate max-w-full">
              {topThree[2].displayIdentifier}
            </span>
            <div className="mt-3 w-full pt-2 border-t border-slate-100 flex items-center justify-around text-xs">
              <span className="font-black text-indigo-700">{topThree[2].xp} XP</span>
              <span className="font-bold text-amber-600 flex items-center gap-0.5">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                {topThree[2].streakDays}d
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Metric Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSortMetric('xp')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              sortMetric === 'xp'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>ពិន្ទុ XP (All XP)</span>
          </button>
          <button
            type="button"
            onClick={() => setSortMetric('streak')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              sortMetric === 'streak'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>ថ្ងៃ Streak (Daily)</span>
          </button>
        </div>

        {/* Level Filters & Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកឈ្មោះ / គណនី..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 font-khmer"
            />
          </div>

          <div className="flex items-center gap-1">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold uppercase transition cursor-pointer ${
                  levelFilter === lvl
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {lvl === 'all' ? 'All' : lvl.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Leaderboard Table List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                <th className="py-3 px-3 sm:px-4 text-center w-14">Rank</th>
                <th className="py-3 px-3 sm:px-4">Learner / សិស្ស</th>
                <th className="py-3 px-3 sm:px-4 text-center">Level</th>
                <th className="py-3 px-3 sm:px-4 text-center">Streak</th>
                <th className="py-3 px-3 sm:px-4 text-right">Earned XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {leaderboardList.map((user, index) => {
                const rankNumber = index + 1;
                const isTop1 = rankNumber === 1;
                const isTop2 = rankNumber === 2;
                const isTop3 = rankNumber === 3;

                return (
                  <tr 
                    key={user.id}
                    className={`transition-colors ${
                      user.isCurrentUser 
                        ? 'bg-indigo-50/70 font-semibold ring-1 ring-inset ring-indigo-300' 
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-3 px-3 sm:px-4 text-center font-bold">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-black shadow-xs">
                          🥇
                        </span>
                      ) : isTop2 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-black shadow-xs">
                          🥈
                        </span>
                      ) : isTop3 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-800 font-black shadow-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="font-mono text-slate-500 text-xs font-bold">
                          #{rankNumber}
                        </span>
                      )}
                    </td>

                    {/* Learner Identity */}
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <img 
                            src={user.avatarUrl} 
                            alt={user.fullName} 
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-white"
                            referrerPolicy="no-referrer"
                          />
                          {user.isCurrentUser && (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-600" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`font-bold truncate max-w-[140px] sm:max-w-[200px] ${
                              user.isCurrentUser ? 'text-indigo-950 font-black' : 'text-slate-900'
                            }`}>
                              {user.fullName}
                            </span>
                            {user.isCurrentUser && (
                              <span className="px-1.5 py-0.2 rounded-md bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider">
                                YOU (អ្នក)
                              </span>
                            )}
                            {user.role === 'Developer' && (
                              <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold">
                                Dev 🛠️
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 truncate">
                            {user.displayIdentifier}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Level */}
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.level === 'advanced'
                          ? 'bg-purple-100 text-purple-800'
                          : user.level === 'intermediate'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {user.level}
                      </span>
                    </td>

                    {/* Streak */}
                    <td className="py-3 px-3 sm:px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 font-mono">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{user.streakDays}d</span>
                      </span>
                    </td>

                    {/* XP */}
                    <td className="py-3 px-3 sm:px-4 text-right">
                      <span className="font-extrabold text-slate-900 font-mono text-xs sm:text-sm">
                        {user.xp.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold ml-1">XP</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {leaderboardList.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs font-khmer">
            មិនមានទិន្នន័យសិស្សត្រូវនឹងការស្វែងរកនេះទេ។
          </div>
        )}
      </div>

    </div>
  );
};
