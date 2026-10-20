export type GoalCategory =
  | 'travel'       // どこ行く・旅行
  | 'career'       // 仕事・キャリア
  | 'wealth'       // 資産・お金
  | 'learning'     // 学び・スキル・資格
  | 'health'       // 健康・スポーツ
  | 'family'       // 家族・人間関係
  | 'experience'   // 趣味・体験・挑戦
  | 'life_event';  // ライフイベント (結婚・住宅など)

export type GoalStatus = 'planned' | 'in_progress' | 'achieved';

export type GoalPriority = 'high' | 'medium' | 'normal';

export interface ActionStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface GoalItem {
  id: string;
  title: string;
  targetAge: number; // e.g. 30
  category: GoalCategory;
  status: GoalStatus;
  location?: string; // e.g. "ノルウェー（トロムソ）", "京都", "ハワイ"
  isTravel?: boolean; // explicit flag if it involves traveling
  budget?: number; // estimated cost in yen, e.g. 500000
  notes?: string;
  actionSteps: ActionStep[];
  priority: GoalPriority;
  achievedAge?: number;
  achievedDate?: string;
  reflection?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  birthYear: number;
  birthMonth: number;
  currentAge: number;
  targetLifespan: number; // e.g. 85, 90, 100
  motto: string;
  isCustomAge: boolean; // if user manually set currentAge directly
}

export interface CategoryMeta {
  id: GoalCategory;
  label: string;
  icon: string;
  color: string;
  lightBg: string;
  borderColor: string;
  textColor: string;
  description: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'travel',
    label: '旅行・行きたい場所',
    icon: 'Compass',
    color: '#0284c7', // sky-600
    lightBg: 'bg-sky-50',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-700',
    description: '国内外の行きたい絶景・世界遺産・温泉・旅',
  },
  {
    id: 'experience',
    label: '趣味・体験・バケットリスト',
    icon: 'Sparkles',
    color: '#7c3aed', // violet-600
    lightBg: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-700',
    description: '一生に一度はやってみたい体験・趣味・創作',
  },
  {
    id: 'career',
    label: '仕事・キャリア',
    icon: 'Briefcase',
    color: '#0d9488', // teal-600
    lightBg: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-700',
    description: '昇進・起業・プロジェクト・独立・天職',
  },
  {
    id: 'wealth',
    label: '資産・お金',
    icon: 'Coins',
    color: '#d97706', // amber-600
    lightBg: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    description: '貯蓄・投資・資産形成・経済的自由',
  },
  {
    id: 'learning',
    label: '学び・スキル',
    icon: 'GraduationCap',
    color: '#2563eb', // blue-600
    lightBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    description: '語学・資格・教養・読書・スキル習得',
  },
  {
    id: 'health',
    label: '健康・ウェルネス',
    icon: 'HeartPulse',
    color: '#16a34a', // green-600
    lightBg: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    description: '運動・マラソン・体型維持・メンタル・習慣',
  },
  {
    id: 'family',
    label: '家族・人間関係',
    icon: 'Users',
    color: '#e11d48', // rose-600
    lightBg: 'bg-rose-50',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-700',
    description: '家族旅行・親孝行・友人・パートナーシップ',
  },
  {
    id: 'life_event',
    label: 'ライフイベント・住まい',
    icon: 'Home',
    color: '#4f46e5', // indigo-600
    lightBg: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-700',
    description: '結婚・住宅購入・移住・定年・記念イベント',
  },
];
