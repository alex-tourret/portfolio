import { motion, useReducedMotion } from "framer-motion";
import "../../styles/about.scss";
import { PROFILE } from "../../config/profile";

type Org = { name: string; url?: string };

const orgs = {
  fanatics: {
    name: "Fanatics Collect",
    url: "https://www.fanaticscollect.com",
  },
  onepoint: { name: "Onepoint", url: "https://www.groupeonepoint.com" },
  school42: { name: "42 School Lyon", url: "https://42lyon.fr" },
} satisfies Record<string, Org>;

const path: {
  period: string;
  role: string;
  org: Org;
  // Overrides org.url, e.g. to point at the team's product page.
  orgUrl?: string;
  context?: string;
  note: string;
  current?: boolean;
}[] = [
  {
    period: "Jun 2026 — Now",
    role: "Software Engineer",
    org: orgs.fanatics,
    context: "Instant Rips",
    orgUrl: "https://www.fanaticscollect.com/instant-rips",
    note: "Owning the product's move to a dedicated service, strangler fig style over gRPC and GraphQL, alongside new features.",
    current: true,
  },
  {
    period: "Oct 2025 — May 2026",
    role: "Freelance",
    org: orgs.fanatics,
    context: "Platform, then Collecting",
    note: "Started on Platform alongside my first mentor, learning Elixir and GraphQL through large ADR-driven refactors. Moved to Collecting in January to build features and keep improving the product.",
  },
  {
    period: "Sep 2024 — Aug 2025",
    role: "Full-stack Developer",
    org: orgs.onepoint,
    context: "Apprenticeship",
    note: "Microservices for a public-sector housing renovation platform.",
  },
  {
    period: "Feb 2024 — Aug 2024",
    role: "AI & Automation Developer",
    org: orgs.onepoint,
    context: "Internship",
    note: "RAG proof of concept for tender analysis, plus UiPath automation.",
  },
  {
    period: "2020 — 2025",
    role: "Computer Systems Architecture",
    org: orgs.school42,
    note: "Web and AI tracks, with detours into DevOps and security.",
  },
];


const principles = [
  {
    title: "Write it down first",
    detail:
      "For anything non-trivial, a design doc before the first commit: the problem, the options, the trade-offs. Bad ideas are cheaper to kill on paper.",
  },
  {
    title: "Small, reversible steps",
    detail:
      "Big-bang rewrites rarely land. I'd rather change a system piece by piece, each step tested and easy to roll back.",
  },
  {
    title: "Ship it, then watch it",
    detail:
      "Metrics, alerts and dashboards go out with the feature, and I keep them up to date. It isn't done until I can see it behave in production.",
  },
  {
    title: "AI as a pair, not a pilot",
    detail:
      "Claude and GPT are in my daily workflow, from exploring a codebase to drafting and reviewing code. I still read every line and make the calls.",
  },
];


const offTheClock = [
  {
    title: "Mountains",
    detail: "Hiking, bivouac, snowboard. Hence the snow.",
  },
  {
    title: "Sport",
    detail: "Pretty much all of it. It helps me keep a clear mind.",
  },
  {
    title: "Chess",
    detail: "Read the position before you move. Same habit as at work.",
  },
];

const toolkit = [
  { group: "Backend", items: "Elixir · Node.js · Java · Python" },
  { group: "APIs & data", items: "GraphQL · gRPC · PostgreSQL · MariaDB" },
  { group: "Frontend", items: "TypeScript · React · Angular" },
  { group: "Delivery", items: "Docker · CI/CD · DataDog" },
];

function About() {
  const reduceMotion = useReducedMotion();

  const reveal = (delay = 0) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "0px 0px -12% 0px" },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section id="about" className="about_section" aria-labelledby="about_title">
      <header className="about_head">
        <p className="section_eyebrow">About</p>
        <motion.h2 id="about_title" className="about_statement" {...reveal()}>
          <em>Curious</em> by nature, hands-on by necessity.
        </motion.h2>
      </header>

      <div className="about_body">
        <aside className="about_aside">
          <motion.figure className="about_portrait" {...reveal(0.1)}>
            <div className="about_portrait_frame">
              <picture>
                <source srcSet="/portrait.avif" type="image/avif" />
                <source srcSet="/portrait.webp" type="image/webp" />
                <img
                  src="/portrait.jpg"
                  alt="Portrait of Alexandre Tourret in a snowy forest"
                  width={1500}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
          </motion.figure>

          <motion.div className="about_block about_offclock" {...reveal(0.2)}>
            <p className="about_block_label">Off the clock</p>
            <dl className="about_offclock_list">
              {offTheClock.map((item) => (
                <div className="about_offclock_item" key={item.title}>
                  <dt>{item.title}</dt>
                  <dd>{item.detail}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </aside>

        <div className="about_main">
          <motion.div className="about_lede" {...reveal(0.15)}>
            <p>
              It started with Minecraft: my own game modes, capture the flag
              or domination, wired together with redstone and command blocks
              on servers I rented by the day.
            </p>
            <p>
              In high school, our group project was an RFID system for booking
              canteen meals ahead and cutting food waste. It never left the
              classroom, but two ideas stuck with me: build for real users,
              and mind your footprint.
            </p>
            <p>
              I always knew I wanted <strong>42</strong>. I failed my first
              attempt to get in, worked as a plumber (pipes before pipelines)
              and spent the savings on six weeks in Japan, flying out two days
              before France went into lockdown. Then I went back and saw it
              through.
            </p>
            <p>
              Today, what I enjoy most is helping collectors, and owning my
              part of Instant Rips from idea to production.
            </p>
          </motion.div>

          <div className="about_block">
            <p className="about_block_label">Path</p>
            <ol className="about_path">
              {path.map((step, index) => (
                <motion.li
                  key={step.period}
                  className={`about_path_row${step.current ? " is_current" : ""}`}
                  {...reveal(0.05 * index)}
                >
                  <span className="about_path_period">{step.period}</span>
                  <span className="about_path_role">
                    {step.role}
                    <span className="about_path_place">
                      {(step.orgUrl ?? step.org.url) ? (
                        <a
                          href={step.orgUrl ?? step.org.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="about_path_org"
                        >
                          {step.org.name}
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      ) : (
                        step.org.name
                      )}
                      {step.context ? ` · ${step.context}` : null}
                    </span>
                    <span className="about_path_note">{step.note}</span>
                  </span>
                </motion.li>
              ))}
            </ol>
          </div>

          <a
            href={PROFILE.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="about_more ui_inline_link"
          >
            Full experience on LinkedIn ↗
          </a>
        </div>
      </div>

      <div className="about_practice">
        <div className="about_practice_head">
          <p className="about_block_label">How I work</p>
          <p className="about_practice_intro">
            Four habits I bring to every team.
          </p>
        </div>

        <ol className="about_principles_list">
          {principles.map((principle, index) => (
            <motion.li
              key={principle.title}
              className="about_principle"
              {...reveal(0.08 * index)}
            >
              <span className="about_principle_index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="about_principle_title">{principle.title}</h3>
              <p className="about_principle_detail">{principle.detail}</p>
            </motion.li>
          ))}
        </ol>

        <div className="about_toolkit_tray">
          <p className="about_block_label">Toolkit</p>
          <dl className="about_toolkit">
            {toolkit.map((entry) => (
              <div className="about_toolkit_group" key={entry.group}>
                <dt>{entry.group}</dt>
                <dd>{entry.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

    </section>
  );
}

export default About;
