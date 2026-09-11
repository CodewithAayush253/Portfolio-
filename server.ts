import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const AAYUSH_PROFILE = `You are the AI Assistant for Aayush Verma's professional portfolio. You represent Aayush and answer visitor questions accurately and politely based on the following resume and profile details:
- Name: Aayush Verma
- Title: Aspiring Software Engineer, Java Developer, Full-Stack Builder
- Education: B.Tech in Computer Science & Engineering at SDGI Global University, Ghaziabad (Expected 08/2027), CGPA: 9.63. Intermediate: 81.6%, High School: 88.2% from H.S.S Public School.
- Experience: Java Developer Intern at Algonive Technologies, Bengaluru (06/2025 — 07/2025). Engineered a Java-based File Size Calculator supporting 4 storage-unit conversions (Bytes, KB, MB, GB) using core Java and OOP principles, collaborated with senior devs using Agile methodologies and conducted code reviews.
- Projects:
  1. CRMS (Customer Relationship Management System): A robust system for managing client records, tracking interactions, pipeline analytics, and business workflows (Java, Spring Boot, MySQL, Tailwind).
  2. Sudoku Game: Java-based Sudoku game with multiple difficulty levels, real-time move validation, and puzzle generation.
  3. E-Commerce Website: Full-stack e-commerce platform on MERN stack with authentication, shopping cart, product management, and responsive UI.
  4. Movie Recommendation System: Java application recommending movies based on mood/genre, integrating with TMDB API.
- Certifications: AI for All (AI & Cybersecurity) from TCS iON, IDE Bootcamp from Wadhwani Foundation & AICTE, Workshop on DSA from DUCAT, VOIS & AI Design Challenge workshops, Analytics Unlocked from Brain Mentor.
- Technical Skills: Java (Advanced), Python, C++, C, React, Web Development, Data Structures & Algorithms (DSA).
- Soft Skills: Communication, Leadership, Time Management.
- Contact: Email: av827977@gmail.com, Phone: 8279775014, GitHub: https://github.com/CodewithAayush253, LinkedIn: https://linkedin.com/in/aayush-verma-b06abb300, Location: Hasanpur (244241).

Be helpful, concise, professional, and friendly. Answer questions specifically about Aayush's qualifications, projects, and background.`;

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const contents = history && Array.isArray(history) 
      ? [...history, { role: 'user', parts: [{ text: message }] }]
      : message;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction: AAYUSH_PROFILE,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || "I couldn't generate a response right now." });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: err.message || "Failed to communicate with AI" });
  }
});

app.get("/api/resume", (req, res) => {
  try {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Aayush_Verma_Resume.pdf");
    doc.pipe(res);

    // Header
    doc.fontSize(22).font('Helvetica-Bold').text("AAYUSH VERMA", { align: "center" });
    doc.fontSize(10).font('Helvetica').fillColor("#555555").text("Aspiring Software Engineer | Java Developer | Full-Stack Builder", { align: "center" });
    doc.moveDown(0.3);
    doc.fontSize(9).fillColor("#0066cc").text("Email: av827977@gmail.com | Phone: 8279775014 | Location: Hasanpur", { align: "center" });
    doc.text("GitHub: github.com/CodewithAayush253 | LinkedIn: linkedin.com/in/aayush-verma-b06abb300", { align: "center" });
    doc.moveDown(0.8);

    // Divider
    doc.strokeColor("#cccccc").lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.8);

    // Education
    doc.fontSize(13).font('Helvetica-Bold').fillColor("#111111").text("EDUCATION");
    doc.moveDown(0.2);
    doc.fontSize(10).font('Helvetica-Bold').text("B.Tech in Computer Science & Engineering");
    doc.fontSize(9).font('Helvetica').fillColor("#444444").text("SDGI Global University, Ghaziabad (Expected 08/2027) | CGPA: 9.63 / 10");
    doc.fontSize(9).text("Intermediate (81.6%) & High School (88.2%) — H.S.S Public School");
    doc.moveDown(0.8);

    // Experience
    doc.fontSize(13).font('Helvetica-Bold').fillColor("#111111").text("EXPERIENCE");
    doc.moveDown(0.2);
    doc.fontSize(10).font('Helvetica-Bold').text("Java Developer Intern — Algonive Technologies, Bengaluru");
    doc.fontSize(9).font('Helvetica').fillColor("#666666").text("06/2025 — 07/2025");
    doc.moveDown(0.2);
    doc.fontSize(9).font('Helvetica').fillColor("#333333").text("• Engineered a Java-based File Size Calculator supporting 4 storage-unit conversions (Bytes, KB, MB, GB) using core Java and OOP principles.");
    doc.text("• Collaborated with senior developers using Agile methodologies and conducted code reviews.");
    doc.moveDown(0.8);

    // Projects
    doc.fontSize(13).font('Helvetica-Bold').fillColor("#111111").text("KEY PROJECTS");
    doc.moveDown(0.2);
    doc.fontSize(10).font('Helvetica-Bold').text("1. CRMS (Customer Relationship Management System)");
    doc.fontSize(9).font('Helvetica').fillColor("#333333").text("• Robust system for managing client records, tracking interactions, pipeline analytics, and business workflows (Java, Spring Boot, MySQL, Tailwind).");
    doc.moveDown(0.3);

    doc.fontSize(10).font('Helvetica-Bold').text("2. Sudoku Game");
    doc.fontSize(9).font('Helvetica').text("• Java-based Sudoku game featuring multiple difficulty levels, real-time move validation, and dynamic puzzle generation.");
    doc.moveDown(0.3);

    doc.fontSize(10).font('Helvetica-Bold').text("3. E-Commerce Website");
    doc.fontSize(9).font('Helvetica').text("• Full-stack e-commerce platform built on MERN stack with authentication, shopping cart, product management, and responsive UI.");
    doc.moveDown(0.3);

    doc.fontSize(10).font('Helvetica-Bold').text("4. Movie Recommendation System");
    doc.fontSize(9).font('Helvetica').text("• Java application recommending movies based on mood and genre, integrating with TMDB API.");
    doc.moveDown(0.8);

    // Technical Skills
    doc.fontSize(13).font('Helvetica-Bold').fillColor("#111111").text("TECHNICAL SKILLS & CERTIFICATIONS");
    doc.moveDown(0.2);
    doc.fontSize(9).font('Helvetica').text("• Languages: Java (Advanced), Python, C++, C");
    doc.text("• Web & Frameworks: React, Spring Boot, Web Development, MySQL, MongoDB");
    doc.text("• Foundations: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP)");
    doc.text("• Certifications: AI for All (TCS iON), IDE Bootcamp (Wadhwani Foundation & AICTE), DSA Workshop (DUCAT), Analytics Unlocked (Brain Mentor).");

    doc.end();
  } catch (err: any) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate resume PDF" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
