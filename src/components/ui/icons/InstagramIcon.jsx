// Instagram mark for contact links. Solar (@solar-icons/react) has no brand
// logos, so this follows its API (size, color) and its two-tone look.
export default function InstagramIcon({ size = 24, color = "currentColor", ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...rest}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill={color} opacity="0.5" />
      <circle cx="12" cy="12" r="4.2" stroke={color} strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.2" fill={color} />
    </svg>
  );
}
