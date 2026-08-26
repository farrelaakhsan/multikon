import { Head } from "@inertiajs/react";
import PublicLayout from "../../Layouts/PublicLayout";
import { User, MapPin, ChevronRight } from "lucide-react";

const settingsMenus = [
    {
        icon: User,
        title: "Profil & Password",
        description: "Edit nama, email, dan ubah password akun kamu",
        href: "/settings/profile",
    },
    {
        icon: MapPin,
        title: "Alamat",
        description: "Kelola alamat pengiriman kamu",
        href: "/settings/addresses",
    },
];

function AccountSettingRow({ icon: Icon, title, description, href }) {
    return (
        <div className="bg-white rounded-[20px] border border-slate-200 overflow-hidden">
            <div className="flex">
                <div className="w-1 flex-shrink-0 bg-amber-500" />
                <div className="flex-1 px-7 py-5 flex items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                        <div className="w-[46px] h-[46px] rounded-[10px] bg-slate-800 flex items-center justify-center flex-shrink-0 text-amber-500">
                            <Icon size={21} />
                        </div>
                        <div>
                            <p className="text-[15.5px] font-medium text-slate-900 mb-0.5">{title}</p>
                            <p className="text-[13px] text-slate-500">{description}</p>
                        </div>
                    </div>
                    <a
                        href={href}
                        className="text-[13.5px] font-medium text-amber-600 hover:text-amber-700 flex items-center gap-0.5 flex-shrink-0"
                    >
                        Kelola <ChevronRight size={15} />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function SettingsIndex() {
    return (
        <PublicLayout>
            <Head title="Pengaturan Akun - Multikon" />

            <div className="bg-[#F8F9FA] min-h-screen">
                <div className="w-full max-w-[1024px] mx-auto px-6 sm:px-12 py-10">
                    <p className="text-[22px] font-medium italic text-slate-900 mb-1.5">Pengaturan Akun</p>
                    <p className="text-sm text-slate-500 mb-6">Kelola profil, keamanan, dan preferensi akun kamu</p>

                    <div className="flex flex-col gap-3">
                        {settingsMenus.map((menu) => (
                            <AccountSettingRow
                                key={menu.href}
                                icon={menu.icon}
                                title={menu.title}
                                description={menu.description}
                                href={menu.href}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
