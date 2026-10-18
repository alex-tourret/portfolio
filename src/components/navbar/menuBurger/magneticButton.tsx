import React, { useRef } from "react";
import gsap from "gsap";

interface MagneticOptions {
  speed?: number;
  tolerance?: number;
  scale?: number;
  debug?: boolean;
  borderRadius?: number | string;
}

type MagneticHandlers<T extends HTMLElement> = Pick<
  React.HTMLAttributes<T>,
  | "onMouseEnter"
  | "onMouseMove"
  | "onMouseLeave"
  | "onTouchStart"
  | "onTouchMove"
  | "onTouchEnd"
>;

interface MagneticButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    MagneticOptions {
  children: React.ReactNode;
}

interface MagneticLayerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    MagneticOptions {
  children: React.ReactNode;
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null): void {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

const isWebsiteOnDesktop = () =>
  window.innerWidth > 768 &&
  window.innerHeight > 768 &&
  window.navigator.userAgent.indexOf("Mobile") === -1 &&
  window.navigator.userAgent.indexOf("Tablet") === -1;

// Pulls the inner item towards the pointer within the root's bounds, and
// springs it back on leave. Shared by MagneticButton (outer) and
// MagneticLayer (inner) so the two layers move with the same physics.
function useMagnetic<T extends HTMLElement>(
  {
    speed = 1,
    tolerance = 0.9,
    scale = 1,
    debug = false,
    borderRadius = 0,
  }: MagneticOptions,
  external: MagneticHandlers<T>,
) {
  const rootRef = useRef<T | null>(null);
  const itemRef = useRef<HTMLSpanElement | null>(null);
  const hoverRef = useRef<HTMLSpanElement | null>(null);
  const rootBound = useRef<DOMRect | null>(null);
  const itemBound = useRef<DOMRect | null>(null);
  const diffBound = useRef({ x: 0, y: 0 });

  const refreshBounds = () => {
    if (!rootRef.current || !itemRef.current) return;
    rootBound.current = rootRef.current.getBoundingClientRect();
    itemBound.current = itemRef.current.getBoundingClientRect();
    diffBound.current.x =
      (rootBound.current.width * scale - rootBound.current.width) / 2;
    diffBound.current.y =
      (rootBound.current.height * scale - rootBound.current.height) / 2;
  };

  const getMagneticPosition = (x: number, y: number) => {
    if (!rootBound.current || !itemBound.current) return null;

    const maxX =
      ((rootBound.current.width - itemBound.current.width) / 2) * tolerance;
    const maxY =
      ((rootBound.current.height - itemBound.current.height) / 2) * tolerance;

    const mappedX = gsap.utils.mapRange(
      0,
      rootBound.current.width * scale,
      -maxX,
      maxX,
      x - rootBound.current.x + diffBound.current.x,
    );
    const mappedY = gsap.utils.mapRange(
      0,
      rootBound.current.height * scale,
      -maxY,
      maxY,
      y - rootBound.current.y + diffBound.current.y,
    );

    return {
      newX: gsap.utils.clamp(-maxX, maxX, mappedX),
      newY: gsap.utils.clamp(-maxY, maxY, mappedY),
    };
  };

  const expandHoverArea = () => {
    gsap.set(hoverRef.current, {
      scale,
      borderRadius,
      background: debug ? "rgba(0, 125, 255, .4)" : "transparent",
    });
  };

  const followPointer = (x: number, y: number, animate: boolean) => {
    refreshBounds();
    const position = getMagneticPosition(x, y);
    if (!position) return;

    gsap.killTweensOf(itemRef.current);
    if (animate) {
      gsap.to(itemRef.current, {
        x: position.newX,
        y: position.newY,
        ease: "power3.out",
        duration: speed,
      });
    } else {
      expandHoverArea();
      gsap.set(itemRef.current, { x: position.newX, y: position.newY });
    }
  };

  const handlers: MagneticHandlers<T> = {
    onMouseEnter: (event) => {
      gsap.killTweensOf(itemRef.current);
      expandHoverArea();
      if (hoverRef.current) refreshBounds();
      external.onMouseEnter?.(event);
    },
    onMouseMove: (event) => {
      if (isWebsiteOnDesktop()) followPointer(event.clientX, event.clientY, true);
      external.onMouseMove?.(event);
    },
    onMouseLeave: (event) => {
      gsap.killTweensOf(itemRef.current);
      gsap.to(itemRef.current, {
        x: 0,
        y: 0,
        ease: "elastic.out(1.1, .4)",
        duration: 1.2,
      });
      gsap.set(hoverRef.current, { scale: 1 });
      external.onMouseLeave?.(event);
    },
    onTouchStart: (event) => {
      const touch = event.touches[0];
      followPointer(touch.clientX, touch.clientY, false);
      external.onTouchStart?.(event);
    },
    onTouchMove: (event) => {
      const touch = event.touches[0];
      followPointer(touch.clientX, touch.clientY, true);
      external.onTouchMove?.(event);
    },
    onTouchEnd: (event) => {
      gsap.killTweensOf(itemRef.current);
      expandHoverArea();
      gsap.set(itemRef.current, { x: 0, y: 0 });
      external.onTouchEnd?.(event);
    },
  };

  return { rootRef, itemRef, hoverRef, handlers };
}

const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      children,
      className,
      speed,
      tolerance,
      scale,
      debug,
      borderRadius,
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      ...props
    },
    forwardedRef,
  ) => {
    const { rootRef, itemRef, hoverRef, handlers } =
      useMagnetic<HTMLButtonElement>(
        { speed, tolerance, scale, debug, borderRadius },
        {
          onMouseEnter,
          onMouseMove,
          onMouseLeave,
          onTouchStart,
          onTouchMove,
          onTouchEnd,
        },
      );

    return (
      <div className="magnetic-button-container">
        <button
          ref={(node) => {
            rootRef.current = node;
            assignRef(forwardedRef, node);
          }}
          className={`magnetic-button ${className ?? ""}`.trim()}
          {...handlers}
          {...props}
        >
          <span ref={itemRef} className="magnetic-button--item">
            {children}
          </span>
          <span ref={hoverRef} className="magnetic-button--hover" />
        </button>
      </div>
    );
  },
);

MagneticButton.displayName = "MagneticButton";

export function MagneticLayer({
  children,
  className,
  speed,
  tolerance,
  scale,
  debug,
  borderRadius,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  ...props
}: MagneticLayerProps) {
  const { rootRef, itemRef, hoverRef, handlers } = useMagnetic<HTMLDivElement>(
    { speed, tolerance, scale, debug, borderRadius },
    { onMouseEnter, onMouseMove, onMouseLeave, onTouchStart, onTouchMove, onTouchEnd },
  );

  return (
    <div
      ref={rootRef}
      className={`magnetic-layer ${className ?? ""}`.trim()}
      {...handlers}
      {...props}
    >
      <span ref={itemRef} className="magnetic-button--item">
        {children}
      </span>
      <span ref={hoverRef} className="magnetic-button--hover" />
    </div>
  );
}

export default MagneticButton;
