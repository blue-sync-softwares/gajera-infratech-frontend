import React from "react";
import { readFileSync } from 'fs';
import { join } from 'path';
import AboutIntro from "./about-intro";
import MissionValues from "./mission-values";
import HistoryTimeline from "./history-timeline";
import TeamGrid from "./team-grid";
import StatsRow from "./stats-row";

interface AboutData {
    "business-slug": string;
    intros: {
        title: string;
        description: string;
    };
    mission: {
        heading: string;
        title: string;
        description: string;
    };
    our_values: {
        heading: string;
        title: Array<{
            title: string;
            description: string;
        }>;
    };
    history: Array<{
        year: number;
        title: string;
        desc: string;
    }>;
    stats: Array<{
        label: string;
        value: number;
    }>;
    team: Array<{
        name: string;
        position: string;
        profile_image: {
            url: string;
            public_id: string;
        };
    }>;
}

interface AboutProps {
    slug?: string;
}

const About: React.FC<AboutProps> = ({ slug }) => {
    // Load about data from JSON file
    const filePath = join(process.cwd(), 'public/data/aboutdata.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const aboutDataArray: AboutData[] = JSON.parse(fileContents);

    // Find the data for the current business slug
    const aboutData = aboutDataArray.find(item => item["business-slug"] === slug);

    // Only render if data is found for the slug
    if (!aboutData) {
        return null;
    }

    return (
        <section className="mx-auto dark:bg-darkmode about-us">
            {/* About introduction */}
            <AboutIntro
                headline={aboutData.intros.title}
                text={aboutData.intros.description}
            />

            {/* Mission and values */}
            <MissionValues
                mission={aboutData.mission.title}
                values={aboutData.our_values.title.map(value => value.title)}
            />

            {/* Key milestones / history */}
            <HistoryTimeline
                events={aboutData.history}
            />

            {/* Quick stats */}
            <StatsRow
                stats={aboutData.stats}
            />

            {/* Team */}
            <TeamGrid
                members={aboutData.team.map(member => ({
                    name: member.name,
                    role: member.position,
                    photo: member.profile_image.url
                }))}
            />
        </section>
    );
};

export default About;
