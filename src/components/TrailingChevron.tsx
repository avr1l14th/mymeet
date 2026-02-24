import type { ReactNode } from "react";

type TrailingChevronProps = {
  iconSrc: string;
  className?: string;
  iconClassName?: string;
  label?: ReactNode;
  labelClassName?: string;
};

export function TrailingChevron({ iconSrc, className, iconClassName, label, labelClassName }: TrailingChevronProps) {
  return (
    <div className={className}>
      {label !== undefined ? <span className={labelClassName}>{label}</span> : null}
      <img alt="" className={iconClassName ?? "trailing-chevron-icon"} src={iconSrc} />
    </div>
  );
}
