import { Head } from "@inertiajs/react";
import PublicLayout from "../Layouts/PublicLayout";
import AboutHero from "./About/AboutHero";
import AboutTimeline from "./About/AboutTimeline";
import AboutVisionMission from "./About/AboutVisionMission";
import AboutContact from "./About/AboutContact";

export default function About() {
    return (
        <PublicLayout hideChatbot={false}>
            <Head title="About Us" />
            <AboutHero />
            <AboutTimeline />
            <AboutVisionMission />
            <AboutContact />
        </PublicLayout>
    );
}
