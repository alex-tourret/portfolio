import type { Repo } from "../types/repo";

export type ProjectVisualId = "pong" | "eeg" | "mlp-network";

export interface ProjectContent {
  // GitHub repo name, the key into repos.json (URL and dates come from there).
  repo: string;
  hook: string;
  stack: string[];
  category: "Web" | "AI";
  featured?: boolean;
  visual?: ProjectVisualId;
}

export type Project = Repo & Omit<ProjectContent, "repo">;

// Display order: featured first, then the compact list.
export const projectContent: ProjectContent[] = [
  {
    repo: "ft_transcendence",
    hook: "Real-time multiplayer Pong with chat, friends and two-factor login.",
    stack: ["NestJS", "React", "PostgreSQL", "Socket.IO"],
    category: "Web",
    featured: true,
    visual: "pong",
  },
  {
    repo: "total-perspective-vortex",
    hook: "Tells left-hand from right-hand motor imagery in EEG signals, with a CSP written from scratch.",
    stack: ["Python", "MNE", "scikit-learn"],
    category: "AI",
    featured: true,
    visual: "eeg",
  },
  {
    repo: "multilayer-perceptron",
    hook: "A neural network library built from scratch, used to tell malignant from benign tumours.",
    stack: ["Python", "NumPy"],
    category: "AI",
    featured: true,
    visual: "mlp-network",
  },
  {
    repo: "leaffliction",
    hook: "A CNN that spots plant diseases from a photo of a leaf, from dataset balancing to evaluation.",
    stack: ["Python", "Keras"],
    category: "AI",
  },
  {
    repo: "hypertube",
    hook: "Streams films from BitTorrent while they are still downloading.",
    stack: ["Angular", "Express", "MySQL", "FFmpeg"],
    category: "Web",
  },
  {
    repo: "matcha",
    hook: "A dating app with real-time chat and notifications.",
    stack: ["Angular", "Express", "Socket.IO", "MySQL"],
    category: "Web",
  },
  {
    repo: "camagru",
    hook: "A webcam photo app with stickers, in plain PHP with a hand-made MVC.",
    stack: ["PHP", "JavaScript", "MySQL"],
    category: "Web",
  },
];
