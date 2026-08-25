/**
 * Inline SVG icons, replacing the FontAwesome kit script the old app loaded
 * from a CDN. Each inherits currentColor and sizes from the parent font size.
 */
const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const SearchIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const CrosshairIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </svg>
);

export const StarIcon = ({ filled, ...props }) => (
  <svg {...base} fill={filled ? 'currentColor' : 'none'} {...props}>
    <path d="m12 3.6 2.5 5.1 5.6.8-4 3.9 1 5.6-5.1-2.7-5 2.7 1-5.6-4.1-3.9 5.6-.8Z" />
  </svg>
);

export const DropletIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3.2c3 3.5 5.4 6.3 5.4 9.1a5.4 5.4 0 0 1-10.8 0c0-2.8 2.4-5.6 5.4-9.1Z" />
  </svg>
);

export const WindIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M3 8h11a2.8 2.8 0 1 0-2.8-2.8M3 12h15a3 3 0 1 1-3 3M3 16h9a2.5 2.5 0 1 1-2.5 2.5" />
  </svg>
);

export const GaugeIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4.5 17a8.5 8.5 0 1 1 15 0" />
    <path d="m12 13 4-3.5" />
    <circle cx="12" cy="13.5" r="1.3" fill="currentColor" stroke="none" />
  </svg>
);

export const EyeIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M2.5 12s3.6-6 9.5-6 9.5 6 9.5 6-3.6 6-9.5 6-9.5-6-9.5-6Z" />
    <circle cx="12" cy="12" r="2.6" />
  </svg>
);

export const CloudIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M7 18h10.5a3.5 3.5 0 0 0 .3-7 5.5 5.5 0 0 0-10.6-1.2A4.1 4.1 0 0 0 7 18Z" />
  </svg>
);

export const ThermometerIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M14 14.8V5.5a2 2 0 1 0-4 0v9.3a4 4 0 1 0 4 0Z" />
  </svg>
);

export const DewIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 4.5c2.3 2.7 4 4.6 4 6.6a4 4 0 0 1-8 0c0-2 1.7-3.9 4-6.6Z" />
    <path d="M5 19h14" />
  </svg>
);

export const SunIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
  </svg>
);

export const MoonIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />
  </svg>
);

export const MonitorIcon = (props) => (
  <svg {...base} {...props}>
    <rect x="2.5" y="4" width="19" height="13" rx="2" />
    <path d="M8.5 21h7M12 17v4" />
  </svg>
);

export const ChevronIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg {...base} {...props}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const AlertIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 4.5 2.8 20h18.4L12 4.5Z" />
    <path d="M12 10v4.2" />
    <circle cx="12" cy="17" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const RefreshIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M20 12a8 8 0 1 1-2.4-5.7" />
    <path d="M20 4v4.5h-4.5" />
  </svg>
);

/** Wind direction arrow. `deg` is the meteorological direction the wind blows *from*. */
export const WindArrow = ({ deg = 0, ...props }) => (
  <svg {...base} {...props} style={{ transform: `rotate(${deg + 180}deg)`, ...props.style }}>
    <path d="M12 4v16" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
  </svg>
);
