import { Suspense, lazy, useEffect, useLayoutEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { LayoutGrid, Sparkles } from "lucide-react";
import { fallbackResume } from "./data/fallback";
import { staticEducations } from "./data/static-educations";
import { publicApi } from "./lib/api";
import { toTimelineItems } from "./lib/format";
import { usePerfGuard } from "./hooks/use-perf-guard";
import { NavMagnet } from "./components/nav-magnet";

import { HeroStage } from "./components/hero-stage";
import { SectionFrame } from "./components/section-frame";
import { ProjectShowroom } from "./components/project-showroom";
import { TechStackGrid } from "./components/tech-stack-grid";
import { TimelineRail } from "./components/timeline-rail";
import { ContactDock } from "./components/contact-dock";

gsap.registerPlugin(ScrollTrigger);

const LazyWebGLBackdrop = lazy(() =>
  import("./components/webgl-backdrop").then((mod) => ({
    default: mod.WebGLBackdrop
  }))
);

const navItems = [
  { href: "#selected-work", label: "Work" },
  { href: "#tech-stack", label: "Tech Stack" },
  { href: "#timeline", label: "Timeline" },
  { href: "#contact-dock", label: "Contact" }
];

const heroLines = {
  zh: "与 AI 同行，把复杂需求打磨成可交付产品。",
  en: "Building with AI, shaping complex needs into shippable products."
};

function DevGridToggle({ active, onToggle }) {
  return (
    <button
      type="button"
      className={`grid-toggle ${active ? "is-active" : ""}`}
      onClick={onToggle}
      aria-label="Toggle design grid"
      title="Toggle grid (G)"
    >
      <LayoutGrid size={15} />
      <span>Grid</span>
    </button>
  );
}

function App() {
  const [data, setData] = useState(fallbackResume);
  const [showGrid, setShowGrid] = useState(false);
  const perf = usePerfGuard();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() === "g") {
        setShowGrid((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const endpointLoaders = {
        profile: publicApi.getProfile,
        skills: publicApi.getSkills,
        projects: publicApi.getProjects,
        workExperiences: publicApi.getWorkExperiences,
        honors: publicApi.getHonors,
        contacts: publicApi.getContacts
      };

      const entries = Object.entries(endpointLoaders);
      const results = await Promise.allSettled(entries.map(([, fn]) => fn()));

      if (!mounted) {
        return;
      }

      const next = { ...fallbackResume };

      results.forEach((result, idx) => {
        const [key] = entries[idx];

        if (result.status === "fulfilled" && result.value != null) {
          next[key] = result.value;
        }
      });

      setData(next);
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onMove = (event) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      document.documentElement.style.setProperty("--pointer-x", x.toFixed(4));
      document.documentElement.style.setProperty("--pointer-y", y.toFixed(4));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from(".brand-mark", { opacity: 0, y: -16, duration: 0.64 })
        .from(".hero-title-word", { opacity: 0, yPercent: 100, stagger: 0.14, duration: 1.2 }, "<0.16")
        .from(".hero-stage-media", { opacity: 0, y: 28, duration: 0.95 }, "<0.1")
        .from(".hero-quote-line", {
          clipPath: "inset(0 100% 0 0)",
          opacity: 0,
          duration: 1.26,
          stagger: 0.26,
          ease: "power2.out"
        }, "<0.26");

      gsap.utils.toArray(".reveal-section:not(.no-reveal)").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 42,
          duration: 0.68,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%"
          }
        });
      });

      if (!perf.isMobile && !perf.reducedMotion) {
        gsap.to(".hero-stage-media", {
          yPercent: -6,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-stage",
            start: "top top",
            end: "bottom top",
            scrub: 1
          }
        });
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [perf.isMobile, perf.reducedMotion]);

  const timelineItems = useMemo(
    () => toTimelineItems(data),
    [data]
  );

  const heroEducations = useMemo(
    () => staticEducations,
    []
  );

  return (
    <div className={`site-root ${showGrid ? "show-grid" : ""}`}>
      <Suspense fallback={<div className="fallback-backdrop" aria-hidden="true" />}>
        <LazyWebGLBackdrop enabled={!perf.isMobile && !perf.reducedMotion} sceneQuality={perf.sceneQuality} />
      </Suspense>
      <div className="pointer-aura" aria-hidden="true" />

      <NavMagnet items={navItems} />
      <div className="shell-actions">
        <DevGridToggle active={showGrid} onToggle={() => setShowGrid((prev) => !prev)} />
      </div>

      <main className="container shell">
        <HeroStage
          profile={data.profile}
          lines={heroLines}
          educations={heroEducations}
        />

        <SectionFrame
          id="tech-stack"
          badge="Tech Stack"
          title="技术栈"
          description="我常用并持续打磨的工程技术栈。"
        >
          <TechStackGrid skills={data.skills} />
        </SectionFrame>

        <SectionFrame
          id="selected-work"
          badge="Selected Work"
          title="项目经历"
          description="聚焦关键项目，呈现问题拆解、方案设计与交付结果。"
          className="no-reveal"
        >
          <ProjectShowroom
            projects={data.projects}
            isMobile={perf.isMobile}
            reducedMotion={perf.reducedMotion}
          />
        </SectionFrame>

        <SectionFrame
          id="timeline"
          badge="Timeline"
          title="经历轨迹"
          description="围绕关键阶段沉淀工程判断与项目推进节奏。"
        >
          <TimelineRail items={timelineItems} />
        </SectionFrame>

        <SectionFrame
          id="contact-dock"
          badge="Contact"
          title="交流方式"
          description="欢迎通过以下方式交流技术、项目合作或岗位机会。"
        >
          <ContactDock contacts={data.contacts} />
        </SectionFrame>
      </main>

      <motion.footer
        className="site-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.6 }}
      >
        <p>
          <Sparkles size={14} />
          Crafted as an advanced creative engineering portfolio · {new Date().getFullYear()}
        </p>
      </motion.footer>
    </div>
  );
}

export default App;

