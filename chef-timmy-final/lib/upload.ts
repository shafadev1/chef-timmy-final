import { getBrowserSupabase } from "./supabase-browser";

// Perkecil foto besar di browser sebelum diunggah (maks 2000px) supaya situs tetap cepat.
async function shrinkImage(file: File, maxSide = 2000): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") return file;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size < 1_500_000) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.88));
  return blob ?? file;
}

export async function uploadFile(file: File, bucket: "images" | "documents", folder: string): Promise<string> {
  const sb = getBrowserSupabase();
  if (!sb) throw new Error("Supabase is not configured.");
  const body = bucket === "images" ? await shrinkImage(file) : file;
  const isResized = body !== file;
  const base = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50) || "file";
  const ext = isResized ? "jpg" : (file.name.split(".").pop() ?? "bin").toLowerCase();
  const path = `${folder}/${Date.now()}-${base}.${ext}`;
  const { error } = await sb.storage.from(bucket).upload(path, body, {
    contentType: isResized ? "image/jpeg" : file.type,
    cacheControl: "31536000",
  });
  if (error) throw error;
  return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
