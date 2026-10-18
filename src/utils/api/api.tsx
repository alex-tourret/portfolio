import reposData from "../../data/repos.json";
import { projectContent, type Project } from "../../data/projects";
import type { Repo } from "../../types/repo";

function getCuratedProjects(allRepos: Repo[]): Project[] {
  const repoByName = new Map(
    allRepos.map((repo) => [repo.name.toLowerCase(), repo]),
  );

  return projectContent.flatMap(({ repo: repoName, ...content }) => {
    const repo = repoByName.get(repoName.toLowerCase());
    return repo ? [{ ...repo, ...content }] : [];
  });
}

export async function fetchRepos({
  limit,
}: {
  limit?: number;
} = {}) {
  const projects = getCuratedProjects(reposData as Repo[]);
  return typeof limit === "number" ? projects.slice(0, limit) : projects;
}
