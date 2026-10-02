import Avatar from "antd/es/avatar";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { initials } from "../../../utils/rideFormat";

function hash(value = "") {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Person avatar with a photo when available, otherwise initials on one of the
 * brand fills. Every fill pairs with ink navy text at 4.5:1 or better.
 * @param {"driver"|"rider"} role tints the ring so rider and driver read apart
 */
export default function PersonAvatar({ name, src, size = 36, role = "driver", ring = true, decorative = false }) {
  const t = useRideTokens();
  const fills = [t.brand.yellow, t.brand.handBlue, "#BFE6F6", "#FFE7A3"];
  const fill = fills[hash(name) % fills.length];
  const ringColor = role === "rider" ? t.color.rider : t.color.driver;
  return (
    <Avatar
      size={size}
      src={src || undefined}
      alt={decorative ? "" : name}
      aria-hidden={decorative || undefined}
      style={{
        backgroundColor: fill,
        color: t.brand.inkNavy,
        fontWeight: 700,
        fontSize: Math.round(size * 0.38),
        flexShrink: 0,
        boxShadow: ring ? `0 0 0 2px ${t.color.surface}, 0 0 0 4px ${ringColor}` : undefined,
      }}
    >
      {initials(name)}
    </Avatar>
  );
}
