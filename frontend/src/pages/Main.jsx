import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useOutletContext } from "react-router";
import { nanoid } from "nanoid";
import { resizeImageDataUrl } from "../utils/Resize";

// แปลง File -> dataURL
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) return reject(new Error("Not a File/Blob"));
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Main() {
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { history, setHistory } = useOutletContext();

  async function handleSubmitPhoto(e) {
    const inputEl = e.currentTarget; // << เก็บอ้างอิงไว้ก่อน
    const file = inputEl?.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const PUrl = await fileToDataUrl(file);
      const resized = await resizeImageDataUrl(PUrl, 1024);
      setPreview(resized);

      const res = await fetch("/api/hiw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: resized }),
      });

      const text = await res.text();
      if (!text) throw new Error(`Empty response (status ${res.status})`);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
      if (!res.ok)
        throw new Error(data?.error || data?.detail || res.statusText);

      setResult(data);

      const item = {
        id: nanoid(),
        image: resized,
        result: data,
      };

      const newHistory = [item, ...history].slice(0, 100);
      setHistory(newHistory);
    } catch (err) {
      alert(err.message || String(err));
    } finally {
      if (inputEl) inputEl.value = ""; // << ใช้ตัวแปรที่เก็บไว้
      setLoading(false);
    }
  }

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      {/* พรีวิวภาพ: อยู่กลาง + ขนาดลดลง */}
      {preview && (
        <div className="mt-4 flex justify-center">
          <img
            src={preview}
            alt="preview"
            className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl shadow"
          />
        </div>
      )}

      <p className="text-center text-md text-gray-700">
        Explain photo to Englist / Korea / Thai language to learning language
      </p>

      {/* ผลลัพธ์: กล่องกลางอ่านง่าย */}
      {result && (
        <div className="mt-4 p-4 border rounded-lg max-w-md mx-auto">
          <h3 className="font-semibold mb-2">Result</h3>
          {"raw" in result ? (
            <pre className="text-sm whitespace-pre-wrap">{result.raw}</pre>
          ) : (
            <ul className="text-sm space-y-1">
              <li>
                <b>English:</b> {result.english}
              </li>
              <li>
                <b>Korean:</b> {result.korean}
                {result.romanized ? ` (${result.romanized})` : ""}
              </li>
              <li>
                <b>Thai:</b> {result.thai}
              </li>
            </ul>
          )}
        </div>
      )}

      {/* สถานะ */}
      {loading && <div className="text-sm text-gray-600">Analying ....</div>}

      <div className="flex flex-col gap-2">
        {/* ปุ่มอัปโหลด */}
        <Button asChild>
          <label className="cursor-pointer">
            📷 Choose your photo
            <input
              type="file"
              id="imageInput"
              accept="image/jpeg,image/png,image/webp" // กัน AVIF
              capture="environment"
              className="hidden"
              onChange={handleSubmitPhoto}
            />
          </label>
        </Button>
        <Button asChild>
          <Link to="/log">Flash Card</Link>
        </Button>
      </div>
    </div>
  );
}
