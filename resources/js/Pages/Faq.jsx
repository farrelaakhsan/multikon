import { useState } from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "../Layouts/PublicLayout";
import FaqHero from "./Faq/FaqHero";
import FaqCategorySection from "./Faq/FaqCategorySection";
import FaqCtaSection from "./Faq/FaqCtaSection";

export default function Faq() {
    const [openItems, setOpenItems] = useState(new Set());

    const toggleItem = (id) => {
        setOpenItems((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    return (
        <PublicLayout>
            <Head title="FAQ" />
            <FaqHero />
            <FaqCategorySection openItems={openItems} toggleItem={toggleItem} />
            <FaqCtaSection />
        </PublicLayout>
    );
}
