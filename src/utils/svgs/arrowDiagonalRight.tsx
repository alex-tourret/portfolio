// Stroke-based "↗" with equal head branches (11 units each). The previous
// filled outline had a shorter vertical branch and a hairline-thin top edge
// that looked broken at ~10px. The viewBox is cropped to the drawing so the
// icon keeps the same apparent size wherever it's used.
function ArrowDiagonalRight() {
  return (
    <svg
      viewBox="3.5 3.5 17.5 17.5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
    >
      <path d="M5 19 18.5 5.5M8 5h11v11" />
    </svg>
  );
}

export default ArrowDiagonalRight;
