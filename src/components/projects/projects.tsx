import "../../styles/projects.scss";
import "../../styles/style.scss";
import SectionIntro from "../shared/sectionIntro";
import ProjectVisual from "./projectVisual";
import ArrowDiagonalRight from "../../utils/svgs/arrowDiagonalRight";
import { PROFILE } from "../../config/profile";
import type { Project } from "../../data/projects";

const yearOf = (project: Project) => new Date(project.created_at).getFullYear();

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="project_featured" data-cursor-project="true">
      <div className="project_featured_body">
        <p className="project_meta">
          {project.category} · {yearOf(project)}
        </p>
        <h3 className="project_featured_title">
          <a href={project.html_url} target="_blank" rel="noopener noreferrer">
            {project.name}
          </a>
        </h3>
        <p className="project_hook">{project.hook}</p>
        <p className="project_stack">{project.stack.join(" · ")}</p>
        <div className="project_links">
          <a
            className="project_link"
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Code on GitHub
            <ArrowDiagonalRight />
          </a>
        </div>
      </div>
      {project.visual ? <ProjectVisual id={project.visual} /> : null}
    </article>
  );
}

function Projects({
  repos,
  isDataFetched,
}: {
  repos: Project[];
  isDataFetched: boolean;
}) {
  const featured = repos.filter((project) => project.featured);
  const others = repos.filter((project) => !project.featured);

  return (
    <section id="projects" className="projects">
      <div className="projects_container">
        <SectionIntro
          eyebrow="Projects"
          title="Selected Work"
          subtitle="Mostly built at 42: no lectures, just a subject, a blank repo and peers to review with."
          titleTag="h2"
          className="projects_section_intro"
        />

        {!isDataFetched ? (
          <div className="projects_skeleton" aria-hidden="true">
            {Array.from({ length: 3 }, (_, index) => (
              <div className="projects_skeleton_row skeleton-line" key={index} />
            ))}
          </div>
        ) : repos.length > 0 ? (
          <>
            <div className="projects_featured">
              {featured.map((project) => (
                <FeaturedProject project={project} key={project.id} />
              ))}
            </div>

            {others.length > 0 ? (
              <div className="projects_more">
                <p className="projects_more_label">More from 42</p>
                <ul className="projects_compact">
                  {others.map((project) => (
                    <li key={project.id}>
                      <a
                        className="projects_container_list_item project_compact"
                        href={project.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="project_compact_title">
                          {project.name}
                        </span>
                        <span className="project_compact_hook">
                          {project.hook}
                        </span>
                        <span className="project_compact_stack">
                          {project.stack.join(" · ")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : (
          <div className="projects_container_info">
            <p>
              Projects data is temporarily unavailable. You can still visit my{" "}
              <a
                className="ui_inline_link"
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        )}

        <a
          className="projects_all"
          href={PROFILE.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Browse all repositories on GitHub</span>
          <ArrowDiagonalRight />
        </a>
      </div>
    </section>
  );
}

export default Projects;
