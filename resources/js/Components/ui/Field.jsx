export default function Field({ label, required, error, children }) {
    return (
        <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                {label} {required && <span className="text-[#F59E0B]">*</span>}
            </label>
            {children}
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        </div>
    );
}
