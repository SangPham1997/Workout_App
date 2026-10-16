import { memo } from 'react';
import HabitCard from './HabitCard';
import EmptyHabits from './EmptyHabits';

const HabitList = memo(function HabitList({
  habits,
  onCheckIn,
  onUndoCheckIn,
  onDelete,
  onAddClick,
}) {
  if (!habits.length) {
    return <EmptyHabits onAddClick={onAddClick} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onCheckIn={onCheckIn}
          onUndoCheckIn={onUndoCheckIn}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
});

export default HabitList;