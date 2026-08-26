import { Head, Link, usePage } from "@inertiajs/react";
import { CheckCircle } from "lucide-react";
import PublicLayout from "../../Layouts/PublicLayout";
import ProfileCard from "./ProfileCard";
import PasswordCard from "./PasswordCard";
import SecurityTips from "./SecurityTips";

export default function Profile({ user }) {
    const { props } = usePage();
    const flash = props.flash || {};

    return (
        <PublicLayout>
            <Head title="Profil & Password - Multikon" />

            <div className="bg-[#F8F9FA] min-h-screen">
                <div className="w-full max-w-[1024px] mx-auto px-6 sm:px-12 py-10">
                    <p className="text-xs text-slate-400 mb-2.5">
                        Settings <span className="text-slate-500">/ Profil & Password</span>
                    </p>
                    <p className="text-[22px] font-medium italic text-slate-900 mb-1.5">Profil & Password</p>
                    <p className="text-sm text-slate-500 mb-6">Kelola informasi profil dan keamanan akun kamu</p>

                    {flash.success && (
                        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4">
                            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                            <p className="text-sm text-emerald-700">{flash.success}</p>
                        </div>
                    )}

                    <div className="flex flex-col gap-4">
                        <ProfileCard user={user} />
                        <PasswordCard />
                        <SecurityTips />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
