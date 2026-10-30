// Optional AI backend. API keys stay on the server and are never sent to the browser.
const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, "public");
const TYPES = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8"};
const server = http.createServer(async (req,res) => {
  if (req.method === "POST" && req.url === "/api/chat") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const {message} = JSON.parse(body || "{}");
        if (!message || typeof message !== "string" || message.length > 4000) {
          res.writeHead(400, {"Content-Type":"application/json"}); return res.end(JSON.stringify({error:"Please send a question under 4,000 characters."}));
        }
        if (!process.env.OPENAI_API_KEY) {
          res.writeHead(503, {"Content-Type":"application/json"}); return res.end(JSON.stringify({error:"Demo mode"}));
        }
        const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method:"POST",
          headers:{"Authorization":"Bearer "+process.env.OPENAI_API_KEY,"Content-Type":"application/json"},
          body:JSON.stringify({model:process.env.OPENAI_MODEL || "gpt-4o-mini",messages:[
            {role:"system",content:"You are StudyBuddy, a patient study assistant. Explain concepts clearly for university beginners. Use examples, admit uncertainty, and remind students to verify important facts. Do not do graded work dishonestly; teach the method."},
            {role:"user",content:message}
          ],temperature:0.5})
        });
        const data = await apiRes.json();
        if (!apiRes.ok) throw new Error(data.error?.message || "AI service error");
        const reply = data.choices?.[0]?.message?.content || "I could not create an answer. Please try again.";
        res.writeHead(200, {"Content-Type":"application/json"}); res.end(JSON.stringify({reply}));
      } catch (err) {
        res.writeHead(502, {"Content-Type":"application/json"}); res.end(JSON.stringify({error:"AI service unavailable",detail:err.message}));
      }
    });
    return;
  }
  const pathname = req.url.split("?")[0] === "/" ? "/index.html" : decodeURIComponent(req.url.split("?")[0]);
  const file = path.join(ROOT, pathname);
  if (!file.startsWith(ROOT)) {res.writeHead(403); return res.end("Forbidden");}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);return res.end("Not found");}res.writeHead(200,{"Content-Type":TYPES[path.extname(file)]||"application/octet-stream"});res.end(data);});
});
server.listen(PORT,()=>console.log(`StudyBuddy running at http://localhost:${PORT}`));
