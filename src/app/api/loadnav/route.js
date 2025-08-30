import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

function looksLikeLottie(json) {
  try {
    return json && (json.v || json.layers || json.assets);
  } catch {
    return false;
  }
}

export async function GET() {
  const cwd = process.cwd();
  const candidates = [
    path.join(cwd, "public", "loadnav.json"),
    path.join(cwd, "loadnav.json"),
  ];

  for (const p of candidates) {
    try {
      const raw = await fs.readFile(p, "utf-8");
      if (!raw || !raw.trim()) continue;
      const json = JSON.parse(raw);
      if (!looksLikeLottie(json)) continue;
      return NextResponse.json(json, {
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      });
    } catch (err) {
      // try next candidate
    }
  }

  return NextResponse.json(
    { error: "loadnav.json not found or invalid" },
    { status: 404 }
  );
}
