import type { CSSProperties } from "react";
import "../../styles/certifications.scss";
import SectionIntro from "../shared/sectionIntro";
import ArrowDiagonalRight from "../../utils/svgs/arrowDiagonalRight";

// European Qualifications Framework: 8 levels, RNCP levels map 1:1.
const EQF_LEVELS = 8;

const certifications = [
  {
    title: "Expert in Computer Architecture",
    issuer: "42 School",
    source: "Credly",
    level: 7,
    levelLabel: "Master's equivalent",
    summary:
      "Data architecture, technical specifications, project coordination and production launches.",
    link: "https://www.credly.com/badges/d1980401-c0b8-4610-8f63-be03bda9ecd9/public_url",
  },
  {
    title: "Computer Architecture",
    issuer: "42 School",
    source: "Credly",
    level: 6,
    levelLabel: "Bachelor's equivalent",
    summary:
      "Web and mobile development, requirement analysis, testing, deployment and maintenance.",
    link: "https://www.credly.com/badges/d811cf64-fb93-44dc-89f2-cf3595f25aa9/public_url",
  },
  {
    title: "AI Engineering Specialization",
    issuer: "IBM",
    source: "Coursera",
    levelLabel: "Professional certificate",
    summary:
      "Machine and deep learning with Scikit-learn, Keras, PyTorch and TensorFlow, plus Spark pipelines.",
    link: "https://www.coursera.org/account/accomplishments/specialization/LCBSMW299C72",
  },
];

function Certifications() {
  return (
    <section id="certifications" className="certifications_section">
      <div className="certifications_container">
        <SectionIntro
          eyebrow="Certifications"
          title="Validated Credentials"
          subtitle="What 42 left me with, plus a detour into AI engineering."
          className="certifications_section_intro"
        />

        <div className="certifications_grid">
          {certifications.map((certification) => (
            <a
              className="cert_card"
              key={certification.title}
              href={certification.link}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-certification="true"
              aria-label={`Open ${certification.title} credential on ${certification.source}`}
            >
              <div className="cert_top">
                <span className="cert_issuer">{certification.issuer}</span>
                <span className="cert_verified">
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3.5 8.5l3 3 6-7" />
                  </svg>
                  Verified on {certification.source}
                </span>
              </div>

              <div className="cert_level">
                {certification.level ? (
                  <span className="cert_ladder" aria-hidden="true">
                    {Array.from({ length: EQF_LEVELS }, (_, index) => (
                      <span
                        key={index}
                        className={`cert_step${index < certification.level ? " is_filled" : ""}`}
                        style={{ "--i": index } as CSSProperties}
                      />
                    ))}
                  </span>
                ) : null}
                <span className="cert_level_text">
                  {certification.level
                    ? `RNCP level ${certification.level} · `
                    : ""}
                  {certification.levelLabel}
                </span>
              </div>

              <h3>{certification.title}</h3>
              <p className="cert_summary">{certification.summary}</p>

              <span className="cert_cta" aria-hidden="true">
                View credential
                <ArrowDiagonalRight />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Certifications;
