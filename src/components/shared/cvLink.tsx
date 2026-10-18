import type { AnchorHTMLAttributes } from "react";
import { PROFILE } from "../../config/profile";

interface CvLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label?: string;
}

function CvLink({ label = "Download CV", className, ...props }: CvLinkProps) {
  return (
    <a
      href={PROFILE.cvPublicPath}
      className={`cv_link_button ui_button ui_button_secondary ${className ?? ""}`.trim()}
      target="_blank"
      rel="noopener noreferrer"
      download
      {...props}
    >
      {label}
    </a>
  );
}

export default CvLink;
