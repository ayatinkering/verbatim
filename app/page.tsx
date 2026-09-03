"use client";

import React from "react";
import posthog from "posthog-js";
import { Navbar } from "@/components/nav/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { BottomGraphic } from "@/components/home/bottom-graphic";

export default function HomePage() {
  const handleExplore = () => {
    posthog.capture("hero_explore_clicked");
    const coursesSection = document.getElementById("courses-section");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = (query: string) => {
    posthog.capture("hero_search_submitted", {
      query_length: query.length,
    });
    console.log("Searching for:", query);
  };

  return (
    <div className="min-h-screen bg-[#FAFCF9] text-neutral-900 flex flex-col selection:bg-primary-100 selection:text-primary-800">
      {/* Header / Navbar */}
      <Navbar
        items={[
          { label: "Courses", href: "/courses", active: false },
          { label: "My Learning", href: "/my-learning", active: false },
        ]}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <HeroSection onExplore={handleExplore} onSearch={handleSearch} />

        {/* Featured Courses Section */}
        <div id="courses-section">
          <FeaturedCourses />
        </div>

        {/* Bottom Abstract Waveform Graphic */}
        <BottomGraphic />
      </main>
    </div>
  );
}
