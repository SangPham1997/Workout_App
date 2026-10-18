import { memo, useMemo } from 'react';
import HabitCard from './HabitCard';
import EmptyHabits from './EmptyHabits';

const HabitList = memo(function HabitList({
  habits,
  checkInsMap = {},
  onCheckIn,
  onUndoCheckIn,
  onDelete,
  onEdit,
  onArchive,
  onUseFreeze,
  onAddClick,
  onTwoMinuteStart,
  getTwoMinuteRemaining,
}) {
  if (!habits?.length) return <EmptyHabits onAddClick={onAddClick} />;

  const habitById = useMemo(() => {
    const map = new Map();
    habits.forEach((h) => map.set(h.id, h));
    return map;
  }, [habits]);

  return (
    <div className="flex flex-col gap-3">
      {habits.map((habit) => {
        const parentHabit = habit.stackAfter
          ? habitById.get(habit.stackAfter)
          : null;

        return (
          <HabitCard
            key={habit.id}
            habit={habit}
            parentHabitName={parentHabit?.name}
            checkIns={checkInsMap[habit.id] || []}
            twoMinuteRemaining={
              getTwoMinuteRemaining ? getTwoMinuteRemaining(habit.id) : 0
            }
            onCheckIn={onCheckIn}
            onUndoCheckIn={onUndoCheckIn}
            onDelete={onDelete}
            onEdit={onEdit}
            onArchive={onArchive}
            onUseFreeze={onUseFreeze}
            onTwoMinuteStart={onTwoMinuteStart}
          />
        );
      })}
    </div>
  );
});

export default HabitList;