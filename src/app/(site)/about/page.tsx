import React from "react";
import { Metadata } from "next";
import HeroSub from "@/app/components/shared/hero-sub";
import ContactInfo from "@/app/components/contact/contact-info";
import ContactForm from "@/app/components/contact/form";
import Location from "@/app/components/contact/office-location";
import AboutIntro from "@/app/components/about/about-intro";
import MissionValues from "@/app/components/about/mission-values";
import HistoryTimeline from "@/app/components/about/history-timeline";
import TeamGrid from "@/app/components/about/team-grid";
import StatsRow from "@/app/components/about/stats-row";
// use testimonial component from home/testimonial folder
import HomeTestimonials from "@/app/components/home/testimonial";

export const metadata: Metadata = {
  title: "About | Gajera Group",
};

const page = () => {
  const breadcrumbLinks = [
    { href: "/", text: "Home" },
    { href: "/about", text: "About Us" },
  ];
  return (
    <>
      {/* About introduction */}
      <AboutIntro
        headline="Who we are"
        text="Gajera Group is a multi-disciplinary organization focused on sustainable development, community growth and responsible business. Since our founding, we blend tradition with innovation to deliver long-term value to stakeholders and the communities we serve."
        breadcrumbLinks={breadcrumbLinks}
      />

      {/* Mission and values */}
      <MissionValues
        mission="To drive inclusive economic growth through ethical practices, cutting-edge solutions and community partnerships."
        values={[
          "Integrity",
          "Sustainability",
          "Innovation",
          "Community focus",
        ]}
      />

      {/* Key milestones / history */}
      <HistoryTimeline
        events={[
          { year: 1995, title: "Founded", desc: "Established with a focus on local development." },
          { year: 2005, title: "Expansion", desc: "Entered new markets and diversified services." },
          { year: 2018, title: "Sustainability Initiative", desc: "Launched long-term environmental programs." },
          { year: 2024, title: "Digital Transformation", desc: "Adopted modern platforms and scaled operations." },
        ]}
      />

      {/* Quick stats */}
      <StatsRow
        stats={[
          { label: "Years", value: 30 },
          { label: "Projects", value: 120 },
          { label: "Employees", value: 450 },
          { label: "Locations", value: 8 },
        ]}
      />

      {/* Team */}
      <TeamGrid
        members={[
          { name: "Mr. Gajera", role: "Founder & Chairman", photo: "/images/team/gajera.jpg" },
          { name: "S. Patel", role: "CEO", photo: "/images/team/ceo.jpg" },
          { name: "A. Mehta", role: "Head of Operations", photo: "/images/team/ops.jpg" },
        ]}
      />

      {/* Use existing home testimonial component */}
      <HomeTestimonials
        // quotes={[
        //   { text: "Working with Gajera Group transformed our community project.", author: "Community Leader" },
        //   { text: "Professional, reliable, and mission-driven.", author: "Partner Organization" },
        // ]}
      />

      {/* Existing contact components (kept commented for now) */}
      {/* <ContactInfo />
      <ContactForm />
      <Location /> */}
    </>
  );
};

export default page;
