export default function CartCheckbox({ checked, onChange }) {
    return (
        <button
            type="button"
            onClick={onChange}
            className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition ${
                checked
                    ? "bg-[#F59E0B] border-[#F59E0B]"
                    : "border-slate-300 hover:border-[#F59E0B]"
            }`}
        >
            {checked && (
                <svg viewBox="0 0 16 16" fill="white" className="w-3 h-3">
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                </svg>
            )}
        </button>
    );
}
