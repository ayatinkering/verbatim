import React, { useEffect, useState } from "react";
import {
  X,
  Play,
  CheckCircle2,
  Sparkles,
  Award,
} from "lucide-react";
import { getLessonById, Lesson } from "@/lib/learning-data";
import { learningStore } from "@/lib/learning-store";

interface LessonViewerModalProps {
  lessonId: string | null;
  onClose: () => void;
}

export function LessonViewerModal({ lessonId, onClose }: LessonViewerModalProps) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!lessonId) {
      setLesson(null);
      return;
    }
    const found = getLessonById(lessonId);
    setLesson(found || null);

    const state = learningStore.getState();
    setIsCompleted(state.completedLessons.includes(lessonId));

    const unsubscribe = learningStore.subscribe(() => {
      const currentState = learningStore.getState();
      setIsCompleted(currentState.completedLessons.includes(lessonId));
    });

    return () => unsubscribe();
  }, [lessonId]);

  if (!lessonId || !lesson) return null;

  const handleToggleComplete = () => {
    const nextStatus = isCompleted ? "in_progress" : "completed";
    learningStore.updateProgress(lesson._id, nextStatus);
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-xl border border-neutral-200 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200/80 flex items-center justify-between bg-neutral-50/70">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-primary-700 bg-primary-100/70 px-2 py-0.5 rounded border border-primary-200/60 font-semibold">
                {lesson.courseTitle || "Next.js Course"}
              </span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs text-neutral-600 font-medium">
                {lesson.moduleTitle || "Module Lesson"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif text-neutral-900 font-semibold">
              {lesson.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleToggleComplete}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer shadow-2xs ${
                isCompleted
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                  : "bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-300"
              }`}
            >
              <CheckCircle2
                className={`w-4 h-4 ${
                  isCompleted ? "text-emerald-600 fill-emerald-100" : "text-neutral-400"
                }`}
              />
              <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {lesson.videoUrl ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-sm">
              <iframe
                src={getEmbedUrl(lesson.videoUrl)}
                title={lesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="w-full aspect-video rounded-xl bg-neutral-100 flex flex-col items-center justify-center text-neutral-500 border border-dashed border-neutral-300">
              <Play className="w-10 h-10 text-neutral-400 mb-2" />
              <p className="text-sm font-medium">Interactive Code & Lecture Notes</p>
            </div>
          )}

          {lesson.keyPoints && lesson.keyPoints.length > 0 && (
            <div className="p-4 rounded-xl bg-primary-50/40 border border-primary-100/80 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                Core Learning Objectives
              </h4>
              <ul className="space-y-1.5 pl-1">
                {lesson.keyPoints.map((pt, i) => (
                  <li
                    key={i}
                    className="text-xs sm:text-sm text-neutral-700 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0"></span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lesson.proTip && (
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-3">
              <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-semibold text-amber-900">Instructor Pro-Tip:</span>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  {lesson.proTip}
                </p>
              </div>
            </div>
          )}

          {lesson.notes && lesson.notes.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Lesson Overview & Notes
              </h4>
              <div className="space-y-2">
                {lesson.notes.map((block, idx) => {
                  const text = block.children?.map((c) => c.text).join(" ") || "";
                  if (block.style === "h2") {
                    return (
                      <h3
                        key={block._key || idx}
                        className="text-sm font-bold text-neutral-800 pt-2"
                      >
                        {text}
                      </h3>
                    );
                  }
                  return (
                    <p
                      key={block._key || idx}
                      className="text-xs sm:text-sm text-neutral-600 leading-relaxed"
                    >
                      {text}
                    </p>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200/80 flex items-center justify-between text-xs text-neutral-500">
          <span className="font-mono">ID: {lesson._id}</span>
          <span>WebMCP Target Lesson View</span>
        </div>
      </div>
    </div>
  );
}
