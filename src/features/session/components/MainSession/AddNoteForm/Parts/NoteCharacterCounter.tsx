export const NoteCharacterCounter = ({ current, max }: { current: number; max: number }) => (
    current > 0 ? (
        <span className={`absolute bottom-2.5 right-3 text-[10px] font-mono transition-colors ${current > max ? "text-rose-500" : "text-slate-400"}`}>
            {current}/{max}
        </span>
    ) : null
);