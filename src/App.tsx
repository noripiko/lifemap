import React, { useState, useEffect, useRef } from 'react';
import { GoalItem, UserProfile, GoalCategory } from './types/lifemap';
import {
  loadProfile,
  saveProfile,
  loadGoals,
  saveGoals,
} from './utils/lifemapUtils';
import { INITIAL_GOALS } from './data/initialData';
import { Navbar, ActiveTab } from './components/Navbar';
import { TimelineView } from './components/TimelineView';
import { TravelView } from './components/TravelView';
import { GoalModal } from './components/GoalModal';
import { ProfileModal } from './components/ProfileModal';
import { PWAInstallButton } from './components/PWAInstallButton';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [goals, setGoals] = useState<GoalItem[]>(loadGoals);
  const [activeTab, setActiveTab] = useState<ActiveTab>('timeline');

  // Modals
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<GoalItem | null>(null);
  const [initialAgeForModal, setInitialAgeForModal] = useState<number | undefined>(undefined);
  const [initialCategoryForModal, setInitialCategoryForModal] = useState<GoalCategory | undefined>(undefined);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to localStorage
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveGoals(goals);
  }, [goals]);

  // Goal Creation / Updating
  const handleSaveGoal = (
    goalData: Omit<GoalItem, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    const now = new Date().toISOString();
    if (id) {
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...goalData, updatedAt: now } : g))
      );
    } else {
      const newGoal: GoalItem = {
        ...goalData,
        id: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: now,
        updatedAt: now,
      };
      setGoals((prev) => [...prev, newGoal]);
    }
    setGoalModalOpen(false);
    setGoalToEdit(null);
  };

  // Delete Goal
  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Toggle Goal Status (tap to toggle between planned and achieved)
  const handleToggleStatus = (goal: GoalItem) => {
    const now = new Date().toISOString();
    const isCurrentlyAchieved = goal.status === 'achieved';
    const nextStatus = isCurrentlyAchieved ? 'planned' : 'achieved';

    setGoals((prev) =>
      prev.map((g) =>
        g.id === goal.id
          ? {
              ...g,
              status: nextStatus,
              achievedAge: nextStatus === 'achieved' ? profile.currentAge : undefined,
              achievedDate: nextStatus === 'achieved' ? now : undefined,
              updatedAt: now,
            }
          : g
      )
    );
  };

  const handleOpenNewGoalForAge = (targetAge: number) => {
    setGoalToEdit(null);
    setInitialAgeForModal(targetAge);
    setInitialCategoryForModal(undefined);
    setGoalModalOpen(true);
  };

  const handleOpenNewTravelGoal = () => {
    setGoalToEdit(null);
    setInitialAgeForModal(profile.currentAge);
    setInitialCategoryForModal('travel');
    setGoalModalOpen(true);
  };

  const handleEditGoal = (goal: GoalItem) => {
    setGoalToEdit(goal);
    setInitialAgeForModal(undefined);
    setInitialCategoryForModal(undefined);
    setGoalModalOpen(true);
  };

  // Import JSON File
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.profile) setProfile(parsed.profile);
        if (Array.isArray(parsed.goals)) setGoals(parsed.goals);
      } catch (err) {
        console.error('Invalid JSON file', err);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Clean, Uncluttered Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        profile={profile}
        onOpenSettings={() => setProfileModalOpen(true)}
        onOpenNewGoal={() => {
          setGoalToEdit(null);
          setInitialAgeForModal(profile.currentAge);
          setGoalModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 py-3 sm:py-5">
        <div className="max-w-xl mx-auto">
          <PWAInstallButton />
        </div>

        {activeTab === 'timeline' && (
          <TimelineView
            goals={goals}
            profile={profile}
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal}
            onToggleStatus={handleToggleStatus}
            onAddGoalForAge={handleOpenNewGoalForAge}
          />
        )}

        {activeTab === 'travel' && (
          <TravelView
            goals={goals}
            profile={profile}
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal}
            onToggleStatus={handleToggleStatus}
            onAddTravelGoal={handleOpenNewTravelGoal}
          />
        )}
      </main>

      {/* Modals */}
      <GoalModal
        isOpen={goalModalOpen}
        goalToEdit={goalToEdit}
        initialAge={initialAgeForModal}
        initialCategory={initialCategoryForModal}
        birthYear={profile.birthYear}
        currentAge={profile.currentAge}
        onSave={handleSaveGoal}
        onDelete={handleDeleteGoal}
        onClose={() => {
          setGoalModalOpen(false);
          setGoalToEdit(null);
        }}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        profile={profile}
        goals={goals}
        onSave={setProfile}
        onResetGoals={() => setGoals(INITIAL_GOALS)}
        onImportData={() => fileInputRef.current?.click()}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
