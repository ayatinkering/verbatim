"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/nav/navbar";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { BottomGraphic } from "@/components/home/bottom-graphic";
import { AgentActivityPanel } from "@/components/agent/agent-activity-panel";
import { AgentCapabilitiesPanel } from "@/components/agent/agent-capabilities-panel";
import { DemoScenarioController } from "@/components/agent/demo-scenario-controller";
import { ActivePlanView } from "@/components/learning/active-plan-view";
import { LessonViewerModal } from "@/components/learning/lesson-viewer-modal";
import { LearnerProgressHeader } from "@/components/learning/learner-progress-header";
import { registerVerbatimWebMCPTools, invokeWebMCPTool } from "@/lib/webmcp";
import { learningStore, LearningState } from "@/lib/learning-store";

export default function HomePage() {
  const [storeState, setStoreState] = useState<LearningState>(learningStore.getState());
  const [openedLessonId, setOpenedLessonId] = useState<string | null>(null);

  // Register WebMCP tools on mount
  useEffect(() => {
    registerVerbatimWebMCPTools();

    const unsubscribe = learningStore.subscribe(() => {
      const current = learningStore.getState();
      setStoreState(current);
      if (current.currentLesson) {
        setOpenedLessonId(current.currentLesson);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleExplore = () => {
    const coursesSection = document.getElementById("courses-section");
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    try {
      await invokeWebMCPTool("search_learning", { query });
    } catch (e) {
      console.error("Search tool error:", e);
    }
  };

  const handleOpenLesson = (lessonId: string) => {
    invokeWebMCPTool("open_lesson", { lessonId });
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
      <main className="flex-1 flex flex-col max-w-6xl mx-auto w-full px-4 sm:px-6 pt-4 pb-16">
        {/* Learner Progress State Ribbon */}
        <LearnerProgressHeader />

        {/* Hero Section */}
        <HeroSection onExplore={handleExplore} onSearch={handleSearch} />

        {/* Primary Demo Scenario Controller (Judge-Ready 60-second flow) */}
        <DemoScenarioController />

        {/* Active Learning Plan Section if created by Agent */}
        {storeState.activePlan && (
          <ActivePlanView
            plan={storeState.activePlan}
            onOpenLesson={handleOpenLesson}
          />
        )}

        {/* Dual Agent Activity & WebMCP Capabilities Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <AgentActivityPanel />
          <AgentCapabilitiesPanel />
        </div>

        {/* Featured Courses Section */}
        <div id="courses-section">
          <FeaturedCourses />
        </div>

        {/* Bottom Abstract Waveform Graphic */}
        <BottomGraphic />
      </main>

      {/* Lesson Viewer Modal (Opens when open_lesson is executed) */}
      <LessonViewerModal
        lessonId={openedLessonId}
        onClose={() => {
          setOpenedLessonId(null);
          learningStore.setCurrentLesson(null);
        }}
      />
    </div>
  );
}
