import { memo, useMemo } from 'react';
import HabitCard from './HabitCard';
import EmptyHabits from './EmptyHabits';

const HabitList = memo(function HabitList({
  habits,
  onCheckIn,
  onUndoCheckIn,
  onDelete,
  onEdit,
  onArchive,
  onApplyFreeze,
  onAddClick,
  onTwoMinuteStart,
}) {
  // Hook phải chạy trước mọi early return (rules-of-hooks).
  const habitById = useMemo(() => {
    const map = new Map();
    for (const habit of habits || []) map.set(habit.id, habit);
    return map;
  }, [habits]);

  if (!habits?.length) return <EmptyHabits onAddClick={onAddClick} />;

  return (
    <div className="flex flex-col gap-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          parentHabitName={
            habit.stackAfter ? habitById.get(habit.stackAfter)?.name : undefined
          }
          onCheckIn={onCheckIn}
          onUndoCheckIn={onUndoCheckIn}
          onDelete={onDelete}
          onEdit={onEdit}
          onArchive={onArchive}
          onApplyFreeze={onApplyFreeze}
          onTwoMinuteStart={onTwoMinuteStart}
        />
      ))}
    </div>
  );
});

export default HabitList;
