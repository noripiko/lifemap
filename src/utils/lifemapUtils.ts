import { GoalItem, UserProfile, GoalCategory } from '../types/lifemap';
import { DEFAULT_PROFILE, INITIAL_GOALS } from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'lifemap_user_profile_v1',
  GOALS: 'lifemap_user_goals_v1',
};

// Current year reference
export const CURRENT_CALENDAR_YEAR = 2026;
export const CURRENT_CALENDAR_MONTH = 10;

/**
 * Calculates current age from birth year and month
 */
export function calculateCurrentAge(birthYear: number, birthMonth: number): number {
  let age = CURRENT_CALENDAR_YEAR - birthYear;
  if (CURRENT_CALENDAR_MONTH < birthMonth) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Calculates calendar year when user will be targetAge
 */
export function calculateYearForAge(birthYear: number, targetAge: number): number {
  return birthYear + targetAge;
}

/**
 * Formats Yen currency to clean Japanese string (e.g. 4.5万円, 100万円, 5,000円)
 */
export function formatYen(amount?: number): string {
  if (amount === undefined || amount === null || amount <= 0) return '';
  if (amount >= 100000000) {
    const oku = (amount / 100000000).toFixed(1).replace(/\.0$/, '');
    return `${oku}億円`;
  }
  if (amount >= 10000) {
    const man = amount / 10000;
    const formatted = Number.isInteger(man) ? `${man}万円` : `${man.toFixed(1)}万円`;
    return formatted;
  }
  return `${amount.toLocaleString()}円`;
}

export interface DecadeGroup {
  decade: number; // 20, 30, 40, etc.
  label: string;  // "20代", "30代", etc.
  subLabel: string;
  minAge: number;
  maxAge: number;
  goals: GoalItem[];
  isCurrentDecade: boolean;
  isPastDecade: boolean;
}

export const DECADE_THEMES: Record<number, { title: string; subtitle: string }> = {
  10: { title: '青春と探求', subtitle: '感受性を育み、自分の興味を見つける時期' },
  20: { title: '挑戦と自己投資', subtitle: '失敗を恐れず挑戦し、土台をつくる黄金の10年' },
  30: { title: '飛躍とライフイベント', subtitle: 'キャリアと人生が大きく展開する充実の年代' },
  40: { title: '成熟とキャリア確立', subtitle: '培った力を活かし、人生の深みを味わう時期' },
  50: { title: '収穫と次のステージ', subtitle: '豊かさを実感し、次の暮らしを見据える時期' },
  60: { title: '第2の人生スタート', subtitle: '時間にゆとりを持ち、ずっとやりたかった旅や趣味へ' },
  70: { title: '自由と感謝の黄金期', subtitle: 'マイペースに心豊かな時間を家族や友人と過ごす' },
  80: { title: '達観と温もり', subtitle: '人生の軌跡に感謝し、穏やかな日々を楽しむ' },
  90: { title: '百寿へ向かう日々', subtitle: '命の尊さと日々の喜びに満ちた穏やかな時間' },
  100: { title: '100歳・人生の集大成', subtitle: '世紀を生きた軌跡と感謝の日々' },
};

/**
 * Groups goals by decade based on user's current age & lifespan
 */
export function groupGoalsByDecade(goals: GoalItem[], currentAge: number, targetLifespan: number): DecadeGroup[] {
  const currentDecade = Math.floor(currentAge / 10) * 10;
  const maxGoalAge = goals.reduce((max, g) => Math.max(max, g.targetAge), 0);
  const effectiveMaxAge = Math.max(100, targetLifespan || 100, maxGoalAge);
  const maxDecade = Math.min(100, Math.floor(effectiveMaxAge / 10) * 10);

  const groups: DecadeGroup[] = [];

  for (let dec = 20; dec <= maxDecade; dec += 10) {
    const minAge = dec;
    const maxAge = dec === 100 ? 120 : dec + 9;
    const decadeGoals = goals
      .filter((g) => g.targetAge >= minAge && (dec === 100 ? g.targetAge <= 120 : g.targetAge <= maxAge))
      .sort((a, b) => a.targetAge - b.targetAge);

    const theme = DECADE_THEMES[dec] || {
      title: dec === 100 ? '100歳〜' : `${dec}代`,
      subtitle: '人生のステージを歩む',
    };

    groups.push({
      decade: dec,
      label: dec === 100 ? '100歳〜' : `${dec}代`,
      subLabel: theme.title,
      minAge,
      maxAge,
      goals: decadeGoals,
      isCurrentDecade: dec === currentDecade,
      isPastDecade: dec < currentDecade,
    });
  }

  return groups;
}

/**
 * Storage Helpers
 */
export function loadProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure age is accurate based on birth date if not custom
      if (!parsed.isCustomAge && parsed.birthYear) {
        parsed.currentAge = calculateCurrentAge(parsed.birthYear, parsed.birthMonth || 1);
      }
      if (!parsed.targetLifespan || parsed.targetLifespan < 100) {
        parsed.targetLifespan = 100;
      }
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load profile', e);
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function loadGoals(): GoalItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load goals', e);
  }
  return INITIAL_GOALS;
}

export function saveGoals(goals: GoalItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  } catch (e) {
    console.error('Failed to save goals', e);
  }
}

/**
 * Exports all data to a downloadable JSON file
 */
export function exportDataAsJSON(profile: UserProfile, goals: GoalItem[]): void {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    profile,
    goals,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `lifemap-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
