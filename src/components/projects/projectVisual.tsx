import type { CSSProperties } from "react";
import type { ProjectVisualId } from "../../data/projects";

// Ball path: serve from the left paddle, bounce off the top and bottom walls,
// land on the right paddle. Shared by the dashed trail and the CSS motion path.
const PONG_PATH = "M 24 62 L 112 16 L 212 164 L 294 112";

function PongVisual() {
  return (
    <svg
      viewBox="0 0 320 180"
      className="project_visual_svg visual_pong"
      aria-hidden="true"
    >
      <line x1="160" y1="12" x2="160" y2="168" className="visual_net" />
      <rect x="14" y="44" width="5" height="36" rx="1.5" className="visual_fill" />
      <rect
        x="301"
        y="94"
        width="5"
        height="36"
        rx="1.5"
        className="visual_accent_fill"
      />
      <path d={PONG_PATH} className="visual_trail" />
      <circle
        r="4.5"
        className="visual_ball"
        style={{ offsetPath: `path("${PONG_PATH}")` }}
      />
    </svg>
  );
}

// EEG (total-perspective-vortex): channels and epoch window from the
// project's config (C3/Cz/C4, tmin 0.5 s, tmax 2.0 s over a 3 s strip).
const EEG = {
  plotX: 44,
  plotWidth: 264,
  period: 264,
  seconds: 3,
  window: [0.5, 2.0],
  channels: [
    { label: "C3", y: 46, phase: 0.4 },
    { label: "Cz", y: 92, phase: 2.1 },
    { label: "C4", y: 138, phase: 4.3 },
  ],
} as const;

// Sum of sines whose frequencies are whole multiples of the period, so two
// periods side by side loop seamlessly when the strip scrolls.
function eegPath(phase: number) {
  const points: string[] = [];
  for (let x = 0; x <= EEG.period * 2; x += 2) {
    const t = (2 * Math.PI * x) / EEG.period;
    const y =
      7 * Math.sin(3 * t + phase) +
      4 * Math.sin(8 * t + phase * 1.7) +
      2.5 * Math.sin(19 * t + phase * 2.3);
    points.push(`${x === 0 ? "M" : "L"} ${x} ${y.toFixed(2)}`);
  }
  return points.join(" ");
}

const eegPaths = EEG.channels.map((channel) => eegPath(channel.phase));

function EegVisual() {
  const toX = (seconds: number) =>
    EEG.plotX + (seconds / EEG.seconds) * EEG.plotWidth;
  const [windowStart, windowEnd] = EEG.window.map(toX);

  const traces = (className: string) =>
    EEG.channels.map((channel, index) => (
      <g key={channel.label} transform={`translate(${EEG.plotX} ${channel.y})`}>
        <g className="eeg_strip">
          <path d={eegPaths[index]} className={className} />
        </g>
      </g>
    ));

  return (
    <svg
      viewBox="0 0 320 180"
      className="project_visual_svg visual_eeg"
      style={{ "--eeg-period": `${EEG.period}px` } as CSSProperties}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="eeg-plot">
          <rect x={EEG.plotX} y="0" width={EEG.plotWidth} height="180" />
        </clipPath>
        <clipPath id="eeg-window">
          <rect x={windowStart} y="0" width={windowEnd - windowStart} height="180" />
        </clipPath>
      </defs>
      <rect
        x={windowStart}
        y="18"
        width={windowEnd - windowStart}
        height="146"
        className="eeg_window"
      />
      {EEG.channels.map((channel) => (
        <text key={channel.label} x="14" y={channel.y + 3} className="visual_label">
          {channel.label}
        </text>
      ))}
      <g clipPath="url(#eeg-plot)">{traces("eeg_trace")}</g>
      <g clipPath="url(#eeg-window)">{traces("eeg_trace is_windowed")}</g>
      <text x={windowStart} y="176" className="visual_label">
        {`${EEG.window[0].toFixed(1)}–${EEG.window[1].toFixed(1)} s`}
      </text>
    </svg>
  );
}

// MLP (multilayer-perceptron): the architecture from the project's
// model_config.yaml. Fewer nodes are drawn than real units, labels give the sizes.
const MLP_LAYERS = [
  { units: 30, activation: null, drawn: 6, x: 34 },
  { units: 24, activation: "ReLU", drawn: 5, x: 98 },
  { units: 16, activation: "ReLU", drawn: 4, x: 162 },
  { units: 1, activation: "Sigmoid", drawn: 1, x: 218 },
] as const;

// Train loss per epoch, read off the project's assets/metrics.png (36 epochs).
// Only the shape is shown, without axis values.
const MLP_TRAIN_LOSS = [
  0.78, 0.68, 0.6, 0.56, 0.51, 0.47, 0.43, 0.4, 0.36, 0.32, 0.29, 0.265, 0.26,
  0.205, 0.185, 0.165, 0.145, 0.135, 0.12, 0.11, 0.125, 0.09, 0.085, 0.08,
  0.078, 0.075, 0.074, 0.073, 0.074, 0.075, 0.105, 0.085, 0.08, 0.078, 0.076,
  0.075,
];

const LOSS_BOX = { x: 248, y: 46, width: 62, height: 50 };

function lossPath() {
  const max = Math.max(...MLP_TRAIN_LOSS);
  const min = Math.min(...MLP_TRAIN_LOSS);
  return MLP_TRAIN_LOSS.map((value, index) => {
    const x = LOSS_BOX.x + (index / (MLP_TRAIN_LOSS.length - 1)) * LOSS_BOX.width;
    const y = LOSS_BOX.y + (1 - (value - min) / (max - min)) * LOSS_BOX.height;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");
}

const MLP_LOSS_PATH = lossPath();

const nodeY = (index: number, count: number) =>
  74 + (index - (count - 1) / 2) * 22;

function MlpVisual() {
  const layers = MLP_LAYERS.map((layer) =>
    Array.from({ length: layer.drawn }, (_, index) => ({
      x: layer.x,
      y: nodeY(index, layer.drawn),
    })),
  );
  const lastEdgeLayer = layers.length - 2;

  // Same lines drawn twice: once for the forward pass (left to right), once
  // for backpropagation (right to left), each with its own timing.
  const edges = (className: string, order: (layerIndex: number) => number) =>
    layers.slice(0, -1).map((nodes, layerIndex) => (
      <g
        key={layerIndex}
        className={className}
        style={{ "--step": order(layerIndex) } as CSSProperties}
      >
        {nodes.flatMap((from, i) =>
          layers[layerIndex + 1].map((to, j) => (
            <line key={`${i}-${j}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
          )),
        )}
      </g>
    ));

  return (
    <svg
      viewBox="0 0 320 180"
      className="project_visual_svg visual_mlp"
      aria-hidden="true"
    >
      {edges("mlp_edges", () => 0)}
      {edges("mlp_edges is_forward", (layerIndex) => layerIndex)}
      {edges("mlp_edges is_backward", (layerIndex) => lastEdgeLayer - layerIndex)}
      {layers.map((nodes, layerIndex) => (
        <g
          key={layerIndex}
          className={`mlp_nodes${layerIndex === layers.length - 1 ? " is_output" : ""}`}
        >
          {nodes.map((node, index) => (
            <circle key={index} cx={node.x} cy={node.y} r="5" />
          ))}
        </g>
      ))}
      {MLP_LAYERS.map((layer) => (
        <text
          key={layer.x}
          x={layer.x}
          y="160"
          textAnchor="middle"
          className="visual_label"
        >
          {layer.units}
          {layer.activation ? (
            <tspan x={layer.x} dy="10">
              {layer.activation}
            </tspan>
          ) : null}
        </text>
      ))}

      <text x={LOSS_BOX.x} y={LOSS_BOX.y - 10} className="visual_label">
        loss
      </text>
      <path d={MLP_LOSS_PATH} className="mlp_loss" />
      <circle
        r="2.6"
        className="mlp_loss_dot"
        style={{ offsetPath: `path("${MLP_LOSS_PATH}")` }}
      />
      <text x={LOSS_BOX.x} y="128" className="visual_label mlp_legend_forward">
        → forward
      </text>
      <text x={LOSS_BOX.x} y="140" className="visual_label mlp_legend_backward">
        ← backprop
      </text>
    </svg>
  );
}


const visuals: Partial<Record<ProjectVisualId, () => JSX.Element>> = {
  pong: PongVisual,
  eeg: EegVisual,
  "mlp-network": MlpVisual,
};

function ProjectVisual({ id }: { id: ProjectVisualId }) {
  const Visual = visuals[id];
  if (!Visual) return null;

  return (
    <figure className="project_visual">
      <Visual />
    </figure>
  );
}

export default ProjectVisual;
