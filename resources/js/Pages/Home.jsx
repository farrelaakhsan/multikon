import { useState } from "react";
import { Head } from "@inertiajs/react";
import PublicLayout from "../Layouts/PublicLayout";
import FloatingAdminChat from "../Components/Chat/FloatingAdminChat";
import HeroSection from "./Home/HeroSection";
import ClientLogos from "./Home/ClientLogos";
import AboutSection from "./Home/AboutSection";
import ServicesSection from "./Home/ServicesSection";
import FeaturedProducts from "./Home/FeaturedProducts";

export default function Home({ featuredProducts = [] }) {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <PublicLayout chatbotContext="home" chatbotPayload={{}} hideChatbot={isChatOpen}>
            <Head title="Home" />
            <HeroSection />
            <ClientLogos />
            <AboutSection />
            <ServicesSection onChatOpen={() => setIsChatOpen(true)} />
            <FeaturedProducts products={featuredProducts} />
            <FloatingAdminChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </PublicLayout>
    );
}
