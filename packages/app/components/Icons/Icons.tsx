export const ClockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 6.5H6.5V6V2H5.5V5.5H3V6.5H6ZM11.5 6C11.5 9.03757 9.03757 11.5 6 11.5C2.96243 11.5 0.5 9.03757 0.5 6C0.5 2.96243 2.96243 0.5 6 0.5C9.03757 0.5 11.5 2.96243 11.5 6Z"
      stroke="#324841"
    />
  </svg>
);

export const SpeechIcon = ({
  className,
  fill,
}: {
  className?: string;
  fill: boolean;
}) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.5 8.5H0.5V0.5H11.5V10.9129L8.8254 8.62037L8.68496 8.5H8.5Z"
      fill={fill === true ? "#324841" : ""}
      stroke="#324841"
    />
  </svg>
);

export const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 8.5H8.5V9V11.5H0.5V4H11.5V8.5H9ZM9.5 11.5V9.5H11.5V11.5H9.5ZM11.5 3H0.5V0.5H11.5V3Z"
      stroke="#324841"
    />
  </svg>
);

export const ExternalLinkIcon = ({
  className,
  href,
}: {
  className?: string;
  href: string;
}) => (
    <a href={href} target="_blank" rel="noreferrer">
      <svg
        className={className}
        width="11"
        height="11"
        viewBox="0 0 11 11"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.5 0.5L4 7M10.5 0.5H7M10.5 0.5V4M5 0.5H0.5L0.5 10.5H10.5V6"
          stroke="#324841"
        />
      </svg>
    </a>
);
