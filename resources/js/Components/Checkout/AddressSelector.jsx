import { router } from "@inertiajs/react";
import Field from "../ui/Field";

export default function AddressSelector({ addresses, selectedAddress, onSelect, error, userName }) {
    return (
        <Field label="Alamat Pengiriman" required error={error}>
            {addresses.length > 0 && selectedAddress ? (
                <div>
                    <button
                        type="button"
                        onClick={() => router.visit('/settings/addresses?redirect=' + encodeURIComponent(window.location.pathname + window.location.search))}
                        className="w-full flex items-start gap-4 p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#F59E0B]/50 transition text-left group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#1E293B] flex items-center justify-center shrink-0 mt-0.5">
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#F59E0B]">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <p className="text-sm font-black text-[#1E293B]">{selectedAddress.label}</p>
                                {selectedAddress.is_default && (
                                    <span className="text-[8px] bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Utama</span>
                                )}
                            </div>
                            {(userName || selectedAddress.receiver_phone) && (
                                <p className="text-[11px] text-slate-500 mt-1">
                                    {userName}{selectedAddress.receiver_phone ? ` · ${selectedAddress.receiver_phone}` : ''}
                                </p>
                            )}
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{selectedAddress.address}</p>
                            {selectedAddress.subdistrict_name && (
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                    {[
                                        selectedAddress.subdistrict_name,
                                        selectedAddress.district_name,
                                        selectedAddress.city_name,
                                    ].filter(Boolean).join(", ")}
                                </p>
                            )}
                        </div>
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-slate-300 shrink-0 group-hover:text-[#1E293B] transition">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <p className="text-[9px] text-slate-400 mt-2 text-center">
                        Klik card untuk kelola atau ganti alamat
                    </p>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => router.visit('/settings/addresses')}
                    className="w-full p-6 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 text-left hover:border-amber-400 transition group"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">📍</span>
                        <div>
                            <p className="text-sm font-bold text-amber-800">Belum ada alamat tersimpan</p>
                            <p className="text-xs text-amber-600 mt-0.5">Atur alamat pengiriman kamu dulu</p>
                        </div>
                    </div>
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] text-[#1E293B] text-[10px] font-black uppercase tracking-widest hover:brightness-105 transition">
                        Atur Alamat
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>
            )}
        </Field>
    );
}
