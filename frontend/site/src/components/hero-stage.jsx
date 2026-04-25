import { useEffect, useState } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { safe } from "../lib/format";

const WHUT_LOGO_URL = "./whut-logo.webp";
const LOCAL_AVATAR_URL = "./avatar.webp";
const GITHUB_URL = "https://github.com/Gbbfine";

function splitName(fullName) {
  const value = safe(fullName, "葛宝斌");
  return value.split(/\s+/).filter(Boolean);
}

function educationRange(education) {
  const start = safe(education?.startDate, "");
  const end = safe(education?.endDate, "");

  if (!start && !end) {
    return "";
  }

  return `${start}${start && end ? " ~ " : ""}${end}`;
}

function degreeText(value) {
  return String(value || "").trim().toLowerCase();
}

function isBachelor(education) {
  const degree = degreeText(education?.degree);
  return degree.includes("bachelor") || degree.includes("本科");
}

function toSortTs(education) {
  const end = Date.parse(education?.endDate || "");
  if (!Number.isNaN(end)) {
    return end;
  }
  const start = Date.parse(education?.startDate || "");
  return Number.isNaN(start) ? 0 : start;
}

function pickEducations(educations) {
  const ordered = [...(educations || [])].sort((a, b) => toSortTs(b) - toSortTs(a));
  if (ordered.length <= 2) {
    return ordered;
  }

  const picked = ordered.slice(0, 2);
  const bachelor = ordered.find((item) => isBachelor(item));
  if (bachelor && !picked.includes(bachelor)) {
    picked[picked.length - 1] = bachelor;
  }

  return picked;
}

function normalizeGithubAssetUrl(url) {
  if (!url) {
    return "";
  }

  if (!url.includes("github.com") || !url.includes("/blob/")) {
    return url;
  }

  return url
    .replace("https://github.com/", "https://raw.githubusercontent.com/")
    .replace("/blob/", "/");
}

function normalizeResumeUrl(url) {
  return normalizeGithubAssetUrl(String(url || "").trim());
}

function schoolLogoUrl(education) {
  const custom = normalizeGithubAssetUrl(String(education?.logoUrl || "").trim());
  if (custom) {
    return custom;
  }

  const school = String(education?.school || "").trim();
  if (/武汉理工大学|Wuhan University of Technology|WHUT/i.test(school)) {
    return WHUT_LOGO_URL;
  }

  return "";
}

export function HeroStage({ profile, lines, educations }) {
  const words = splitName(profile?.fullName);
  const resumeUrl = normalizeResumeUrl(profile?.resumePdfUrl);
  const heroEducations = pickEducations(educations);
  const remoteAvatarUrl = String(profile?.avatarUrl || "").trim();
  const [avatarUrl, setAvatarUrl] = useState(LOCAL_AVATAR_URL);

  useEffect(() => {
    let active = true;
    setAvatarUrl(LOCAL_AVATAR_URL);

    if (!remoteAvatarUrl) {
      return () => {
        active = false;
      };
    }

    const isRemote = /^https?:\/\//i.test(remoteAvatarUrl);
    if (!isRemote) {
      setAvatarUrl(remoteAvatarUrl);
      return () => {
        active = false;
      };
    }

    const probe = new Image();
    probe.decoding = "async";
    probe.src = remoteAvatarUrl;
    probe.onload = () => {
      if (active) {
        setAvatarUrl(remoteAvatarUrl);
      }
    };
    probe.onerror = () => {
      if (active) {
        setAvatarUrl(LOCAL_AVATAR_URL);
      }
    };

    return () => {
      active = false;
      probe.onload = null;
      probe.onerror = null;
    };
  }, [remoteAvatarUrl]);

  return (
    <section id="top" className="hero-stage section-anchor" data-testid="hero-stage">
      <div className="hero-copy hero-copy-minimal">
        <h1 className="hero-title hero-title-minimal">
          {words.map((word, idx) => (
            <span key={`${word}-${idx}`} className="hero-title-word">
              {word}
            </span>
          ))}
        </h1>

        <div className="hero-quote-block">
          <p className="hero-quote hero-quote-cn">
            <span className="hero-quote-line">{safe(lines?.zh, "与 AI 同行，把复杂需求打磨成可交付产品。")}</span>
          </p>
          <p className="hero-quote hero-quote-en">
            <span className="hero-quote-line">{safe(lines?.en, "Building with AI, shaping complex needs into shippable products.")}</span>
          </p>
        </div>

        <div className="hero-home-panel">
          {heroEducations.length ? (
            <article className="hero-home-card hero-education-card">
              <p>Education</p>
              <div className="hero-education-list">
                {heroEducations.map((education, idx) => {
                  const logoUrl = schoolLogoUrl(education);
                  return (
                    <div key={`${safe(education.school)}-${idx}`} className="hero-education-item">
                      <div className="hero-education-head">
                        {logoUrl ? (
                          <span className="hero-school-logo">
                            <img src={logoUrl} alt={`${safe(education.school)} logo`} loading="lazy" />
                          </span>
                        ) : null}
                        <h3>{safe(education.school)} · {safe(education.major)}</h3>
                      </div>
                      <span>{safe(education.degree)}{educationRange(education) ? ` · ${educationRange(education)}` : ""}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          ) : null}

          <article className="hero-home-card hero-resume-card">
            <p>Resume</p>
            <div className="hero-resume-main">
              <h3>简历下载</h3>
            </div>
            {resumeUrl ? (
              <a className="hero-resume-link" href={resumeUrl} target="_blank" rel="noreferrer" download>
                下载简历 PDF
                <Download size={14} />
              </a>
            ) : (
              <span className="hero-resume-link hero-resume-link-disabled">暂未上传简历附件</span>
            )}
          </article>

          <article className="hero-home-card hero-link-card">
            <p>GitHub</p>
            <div className="hero-link-row">
              <h3>开源主页</h3>
              <a className="hero-resume-link hero-resume-link-secondary hero-link-inline" href={GITHUB_URL} target="_blank" rel="noreferrer">
                GBBFINE
                <ArrowUpRight size={14} />
              </a>
            </div>
          </article>
        </div>
      </div>

      <aside className="hero-stage-media">
        <div className="hero-media-shell">
          <img
            src={safe(avatarUrl, LOCAL_AVATAR_URL)}
            alt="Profile"
            loading="eager"
          />
        </div>
      </aside>

      <div className="hero-scroll-cue" aria-hidden="true">
        <span />
        <span />
      </div>
    </section>
  );
}


