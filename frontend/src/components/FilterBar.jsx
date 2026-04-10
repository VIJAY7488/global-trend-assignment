const FILTERS = [
    { value: "all", label: "All" },
    { value: "incomplete", label: "Incomplete" },
    { value: "completed", label: "Completed" },
];

export default function FilterBar({ active, onChange, counts }){
    return (
        <nav className="filter-bar" aria-label="Filter tasks">
            {FILTERS.map(({value, label}) => (
                <button
                    key={value}
                    type="button"
                    className={`filter-bar__btn${active === value ? " filter-bar__btn--active" : ""}`}
                    onClick={() => onChange(value)}
                    aria-current={active === value ? "true" : undefined}>
                    {label}
                    {counts && counts[value] !== undefined && (
                        <span>{counts[value]}</span>
                    )}
                </button>
            ))}
        </nav>
    )
}