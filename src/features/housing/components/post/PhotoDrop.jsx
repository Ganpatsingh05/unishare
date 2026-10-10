"use client";

import { useId, useRef, useState } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { GalleryAddIcon as GalleryAdd } from "@solar-icons/react/bold-duotone/gallery-add";
import { AddCircleIcon as AddCircle } from "@solar-icons/react/bold-duotone/add-circle";
import { StarIcon as Star } from "@solar-icons/react/bold-duotone/star";
import { TrashBinTrashIcon as TrashBinTrash } from "@solar-icons/react/bold-duotone/trash-bin-trash";
import { DangerTriangleIcon as DangerTriangle } from "@solar-icons/react/bold-duotone/danger-triangle";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { HOUSING_STRINGS } from "../../constants/housingStrings";
import { PHOTO_LIMITS } from "../../utils/postRoom";

const s = HOUSING_STRINGS.post.photos;
let seq = 0;

/**
 * Photo picker: drag files in or browse. Thumbnails show the cover first;
 * any photo can be made the cover or removed. Files that are not images,
 * too large, or over the limit are listed instead of silently dropped.
 */
export default function PhotoDrop({ photos, onChange, max = PHOTO_LIMITS.max, mb = PHOTO_LIMITS.mb, accept = "image/*" }) {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const inputId = useId();
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);
  const [problems, setProblems] = useState([]);

  const add = (fileList) => {
    const issues = [];
    const next = [...photos];
    for (const file of Array.from(fileList || [])) {
      const typeOk = accept === "image/*" ? file.type.startsWith("image/") : accept.split(",").includes(file.type);
      if (!typeOk) issues.push(s.notImage(file.name));
      else if (file.size > mb * 1024 * 1024) issues.push(s.tooBig(file.name, mb));
      else if (next.length >= max) {
        issues.push(s.tooMany(max));
        break;
      } else next.push({ id: `p${(seq += 1)}`, file, url: URL.createObjectURL(file) });
    }
    setProblems(issues);
    onChange(next);
  };
  const remove = (photo) => {
    URL.revokeObjectURL(photo.url);
    onChange(photos.filter((p) => p.id !== photo.id));
  };
  const makeCover = (photo) => onChange([photo, ...photos.filter((p) => p.id !== photo.id)]);

  const input = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept={accept}
      multiple
      hidden
      onChange={(event) => {
        add(event.target.files);
        event.target.value = "";
      }}
    />
  );
  const dropHandlers = {
    onDragOver: (event) => {
      event.preventDefault();
      setOver(true);
    },
    onDragLeave: () => setOver(false),
    onDrop: (event) => {
      event.preventDefault();
      setOver(false);
      add(event.dataTransfer.files);
    },
  };

  return (
    <Box>
      {input}
      {photos.length === 0 ? (
        <ButtonBase
          onClick={() => inputRef.current?.click()}
          {...dropHandlers}
          sx={{
            width: "100%",
            minHeight: 220,
            display: "flex",
            flexDirection: "column",
            gap: 1.25,
            borderRadius: `${t.radius.lg}px`,
            border: `2px dashed ${over ? c.action : c.borderStrong}`,
            backgroundColor: over ? c.actionSoft : c.surfaceAlt,
            transition: "background-color 160ms ease, border-color 160ms ease",
            "&.Mui-focusVisible": { outline: `3px solid ${c.focus}`, outlineOffset: 2 },
          }}
        >
          <Box component={m.span} animate={over && !reduce ? { y: -4, scale: 1.06 } : { y: 0, scale: 1 }} sx={{ display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: `${t.radius.lg}px`, backgroundColor: t.brand.yellow, color: t.brand.inkNavy }}>
            <GalleryAdd size={32} aria-hidden />
          </Box>
          <Box sx={{ fontSize: 16, fontWeight: 750, color: c.text }}>{s.drop}</Box>
          <Box sx={{ fontSize: 13.5, color: c.textMuted, px: 2, textAlign: "center" }}>{s.hint(max, mb)}</Box>
        </ButtonBase>
      ) : (
        <Box {...dropHandlers} sx={{ borderRadius: `${t.radius.lg}px`, outline: over ? `2px dashed ${c.action}` : "none", outlineOffset: 4 }}>
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1, gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" } }}>
            <AnimatePresence initial={false}>
              {photos.map((photo, i) => (
                <Box
                  component={m.li}
                  key={photo.id}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={t.motion.spring}
                  sx={{ position: "relative", aspectRatio: "1", borderRadius: `${t.radius.md}px`, overflow: "hidden", gridColumn: i === 0 ? "span 2" : "auto", gridRow: i === 0 ? "span 2" : "auto", backgroundColor: c.surfaceInteractive }}
                >
                  <Box component="img" src={photo.url} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {i === 0 ? (
                    <Box component="span" sx={{ position: "absolute", left: 8, top: 8, display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.35, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 800, backgroundColor: t.brand.yellow, color: t.brand.inkNavy }}>
                      <Star size={12} aria-hidden />
                      {s.cover}
                    </Box>
                  ) : null}
                  <Box sx={{ position: "absolute", right: 6, top: 6, display: "flex", gap: 0.5 }}>
                    {i > 0 ? (
                      <Tooltip title={s.makeCover}>
                        <IconButton aria-label={s.makeCover} onClick={() => makeCover(photo)} size="small" sx={{ width: 32, height: 32, backgroundColor: "rgba(8,18,32,0.6)", color: "#fff", "&:hover": { backgroundColor: "rgba(8,18,32,0.8)" } }}>
                          <Star size={15} aria-hidden />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                    <Tooltip title={s.remove}>
                      <IconButton aria-label={s.remove} onClick={() => remove(photo)} size="small" sx={{ width: 32, height: 32, backgroundColor: "rgba(8,18,32,0.6)", color: "#fff", "&:hover": { backgroundColor: "rgba(198,47,59,0.9)" } }}>
                        <TrashBinTrash size={15} aria-hidden />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ))}
            </AnimatePresence>
            {photos.length < max ? (
              <Box component="li" sx={{ aspectRatio: "1" }}>
                <ButtonBase
                  onClick={() => inputRef.current?.click()}
                  sx={{ width: "100%", height: "100%", flexDirection: "column", gap: 0.5, borderRadius: `${t.radius.md}px`, border: `2px dashed ${c.borderStrong}`, color: c.textSecondary, fontSize: 13, fontWeight: 700, "&:hover": { borderColor: c.action, color: c.accentText }, "&.Mui-focusVisible": { outline: `3px solid ${c.focus}` } }}
                >
                  <AddCircle size={22} aria-hidden />
                  {s.add}
                  <Box component="span" sx={{ fontSize: 12, fontWeight: 600, color: c.textMuted }}>
                    {s.count(photos.length, max)}
                  </Box>
                </ButtonBase>
              </Box>
            ) : null}
          </Box>
        </Box>
      )}
      {problems.length ? (
        <Box role="alert" sx={{ mt: 1.25, display: "flex", flexDirection: "column", gap: 0.5 }}>
          {problems.map((p) => (
            <Box key={p} sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 13.5, fontWeight: 600, color: c.danger }}>
              <DangerTriangle size={16} aria-hidden />
              {p}
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
