export default function ExerciseItem({ exercise, currentIndex, onSelect, idx }) {
    const isActive = currentIndex === idx;
    return (
        <div
            key={exercise.id}
            className={`p-3 transition cursor-pointer flex flex-col gap-1 ${isActive ? 'bg-emerald-900/20 border-l-4 border-emerald-500' : 'hover:bg-slate-800/30'
                }`}
            onClick={() => onSelect(idx)}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? 'bg-emerald-500 text-slate-900' : 'bg-slate-700 text-slate-400'
                        }`}>
                        {idx + 1}
                    </div>
                    <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {exercise.name}
                    </span>
                </div>
                <span className="text-xs text-slate-500">{exercise.duration}s</span>
            </div>
        </div>
    );
}
