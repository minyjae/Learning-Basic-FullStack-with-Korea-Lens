import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function splitDataUrl(dataUrl) {
  const [meta, data] = (dataUrl || "").split(",");
  if (!meta || !data) throw new Error("Invalid data URL");
  // ตัวอย่าง meta: "data:image/jpeg;base64"
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
  return { mimeType, dataBase64: data };
}

app.post("/api/hiw", async (req, res) => {
  try {
    const { imageBase64 } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ error: "imageBase64 is required" });
    }

    const { mimeType, dataBase64 } = splitDataUrl(imageBase64);

    const contents = [
      { inlineData: { mimeType, data: dataBase64 } },
      {
        text:
          `You are an assistant that identifies the main object(s) in the image, ` +
          `then returns vocabulary in Korean, English, and Thai.\n\n` +
          `Return ONLY JSON with this exact schema (no extra text):\n` +
          `{\n` +
          `  "english": "string",\n` +
          `  "korean": "string",\n` +
          `  "thai": "string",\n` +
          `  "romanized": "string",\n` + // ✅ ให้สอดคล้องกับที่อธิบาย
          `  "labels": ["string"],\n` +
          `  "confidence": 0.0\n` +
          `}\n` +
          `- english/korean/thai: common noun for the main subject\n` +
          `- romanized: Korean romanization if applicable\n` +
          `- labels: a few alternative tags\n` +
          `- confidence: 0..1\n`,
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: { responseMimeType: "application/json" },
    });

    const text = response.text; // ควรเป็นสตริง JSON
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // กันกรณีโมเดลไม่คืน JSON เป๊ะ
      return res.status(200).json({ raw: text });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("ERROR /api/hiw:", err);
    return res
      .status(500)
      .json({ error: "Server error", detail: String(err?.message || err) });
  }
});

app.listen(port, () => {
  console.log("Server run on port:", port);
});

// import "dotenv/config";
// import express from "express";
// import cors from "cors";
// import { GoogleGenAI } from "@google/genai";

// const app = express();
// const port = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json({ limit: "10mb" }));

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// function splitDataUrl(dataUrl) {
//   const [meta, data] = (dataUrl || "").split(",");
//   if (!meta || !data) throw new Error("Invalid data URL");
//   // ตัวอย่าง meta: "data:image/jpeg;base64"
//   const mimeMatch = meta.match(/data:(.*?);base64/);
//   const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
//   return { mimeType, dataBase64: data };
// }

// app.get("/health", (_, res) => res.send("OK"));

// app.post("/api/hiw", async (req, res) => {
//   try {
//     const { imageBase64 } = req.body || {};
//     if (!imageBase64) {
//       return res.status(400).json({ error: "imageBase64 is required" });
//     }

//     const { mimeType, dataBase64 } = splitDataUrl(imageBase64);

//     const contents = [
//       { inlineData: { mimeType, data: dataBase64 } },
//       {
//         text:
//           `You are an assistant that identifies the main object(s) in the image, ` +
//           `then returns vocabulary in Korean, English, and Thai.\n\n` +
//           `Return ONLY JSON with this exact schema (no extra text):\n` +
//           `{\n` +
//           `  "english": "string",\n` +
//           `  "korean": "string",\n` +
//           `  "thai": "string",\n` +
//           `  "romanized": "string",\n` + // ✅ ให้สอดคล้องกับที่อธิบาย
//           `  "labels": ["string"],\n` +
//           `  "confidence": 0.0\n` +
//           `}\n` +
//           `- english/korean/thai: common noun for the main subject\n` +
//           `- romanized: Korean romanization if applicable\n` +
//           `- labels: a few alternative tags\n` +
//           `- confidence: 0..1\n`,
//       },
//     ];

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents,
//       config: { responseMimeType: "application/json" },
//     });

//     const text = response.text; // ควรเป็นสตริง JSON
//     let parsed;
//     try {
//       parsed = JSON.parse(text);
//     } catch {
//       // กันกรณีโมเดลไม่คืน JSON เป๊ะ
//       return res.status(200).json({ raw: text });
//     }

//     return res.status(200).json(parsed);
//   } catch (err) {
//     console.error("ERROR /api/hiw:", err);
//     return res
//       .status(500)
//       .json({ error: "Server error", detail: String(err?.message || err) });
//   }
// });

// app.listen(port, () => {
//   console.log("Server run on port:", port);
// });
