const $ = (id) => document.getElementById(id);
const views = ["chat","quiz","summary","english","planner"];
document.querySelectorAll(".nav-item").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".nav-item").forEach(x => x.classList.toggle("active", x===btn));
  views.forEach(v => $("view-"+v).classList.toggle("active", v===btn.dataset.view));
  $("page-title").textContent = btn.textContent.trim();
}));
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function demoAnswer(q){
  const s=q.toLowerCase();
  if(s.includes("machine learning")) return "Machine learning is a way for computers to learn patterns from examples instead of receiving a separate instruction for every situation.\n\nExample: show a computer many labelled photos of cats and dogs. It can learn patterns that help it classify a new photo.\n\nRemember: data + patterns + practice = a model that can make predictions.";
  if(s.includes("photosynthesis")) return "Photosynthesis is how plants make their own food. They use sunlight, water and carbon dioxide to make sugar, and they release oxygen.\n\nThink of a leaf as a tiny solar-powered kitchen: sunlight provides the energy, and the plant uses it to make food.";
  if(s.includes("artificial intelligence") || s.includes("what is ai")) return "Artificial intelligence (AI) is technology that performs tasks that usually require human-like abilities, such as understanding language, recognizing images or making predictions.\n\nExample: a map app predicting traffic or a chatbot explaining a topic. AI can be useful, but its answers should still be checked.";
  return "Here is a simple way to approach this topic:\n\n1. Start with the main idea: identify what the concept is meant to explain.\n2. Look for an everyday example.\n3. Break the process into smaller steps.\n4. Check your understanding by explaining it in your own words.\n\nFor a more specific answer, try asking about one part of the topic at a time. This is a prepared demo response, not a live AI-generated answer.";
}
function addMessage(role, content){
  const wrap=document.createElement("div"); wrap.className="message "+role;
  if(role==="assistant") wrap.innerHTML='<div class="bot-icon">✦</div><div><strong>StudyBuddy</strong><p>'+escapeHTML(content)+'</p></div>';
  else wrap.innerHTML='<div class="bubble">'+escapeHTML(content)+'</div>';
  $("chat-messages").appendChild(wrap); $("chat-messages").scrollTop=$("chat-messages").scrollHeight;
}
async function ask(q){
  addMessage("user",q); $("chat-input").value="";
  try{
    const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q})});
    if(res.ok){const data=await res.json(); addMessage("assistant",data.reply); return;}
  }catch(e){}
  addMessage("assistant",demoAnswer(q));
}
$("chat-form").addEventListener("submit",e=>{e.preventDefault();const q=$("chat-input").value.trim();if(q)ask(q);});
document.querySelectorAll(".suggestion").forEach(b=>b.addEventListener("click",()=>ask(b.dataset.prompt)));
function makeQuiz(topic,count){
  const t=topic.toLowerCase();
  if(t.includes("machine learning")||t.includes("ai")||t.includes("artificial intelligence")) return [
    ["What is machine learning?","A way for computers to learn patterns from data","A type of computer monitor","A programming keyboard",0],
    ["What is training data used for?","Decorating a website","Helping a model learn patterns","Charging a computer",1],
    ["Why should AI output be checked?","AI can make mistakes or reflect biased data","AI never uses data","Checking makes the internet faster",0],
    ["Which is an example of AI?","A plain notebook","A wooden ruler","A system that recognizes speech",2],
    ["What does a model do?","Stores only photos","Uses learned patterns to make predictions","Replaces every teacher",1]
  ].slice(0,count);
  return [
    ["What is the best first step when learning a new topic?","Memorize every word immediately","Identify the main idea","Skip the examples",1],
    ["Why are examples useful?","They connect an idea to something familiar","They make notes longer","They remove the need to practise",0],
    ["What is a good way to check understanding?","Read the title only","Copy a paragraph","Explain the idea in your own words",2],
    ["What should you do if an answer is unclear?","Break it into smaller questions","Give up immediately","Ignore the confusing part",0],
    ["Why review your mistakes?","To avoid all future study","To learn what needs more practice","To make the quiz shorter",1]
  ].slice(0,count);
}
$("make-quiz").addEventListener("click",()=>{
 const topic=$("quiz-topic").value.trim()||"Study skills";const qs=makeQuiz(topic,Number($("quiz-count").value));
 $("quiz-output").innerHTML='<div class="result-box"><h3>Practice quiz: '+escapeHTML(topic)+'</h3>'+qs.map((q,i)=>'<div class="quiz-q"><strong>'+(i+1)+'. '+q[0]+'</strong>'+q.slice(1,4).map((a,j)=>'<label><input type="radio" name="q'+i+'" value="'+j+'"> '+a+'</label>').join('')+'<p class="answer" id="a'+i+'" hidden>Correct answer: '+q[q[4]+1]+'</p></div>').join('')+'<button class="primary-btn" id="grade-quiz">Check answers →</button><p id="quiz-score"></p></div>';
 $("grade-quiz").addEventListener("click",()=>{let score=0;qs.forEach((q,i)=>{const chosen=document.querySelector('input[name="q'+i+'"]:checked');if(chosen&&Number(chosen.value)===q[4])score++;$("a"+i).hidden=false;});$("quiz-score").textContent="Your score: "+score+" / "+qs.length+". Review the explanations and try again!";});
});
$("summarize").addEventListener("click",()=>{
 const text=$("notes-input").value.trim();if(!text){$("summary-output").textContent="Please paste some notes first.";return;}
 const sentences=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text];
 const words=text.split(/\s+/).filter(Boolean);const key=sentences.slice(0,Math.min(3,sentences.length));
 $("summary-output").innerHTML='<div class="result-box"><h3>Your quick study guide</h3><p><strong>Main points</strong></p><ul>'+key.map(s=>'<li>'+escapeHTML(s.trim())+'</li>').join('')+'</ul><p><strong>Key terms to review</strong></p><p>'+escapeHTML([...new Set(words.filter(w=>w.length>6).map(w=>w.replace(/[.,;:!?]/g,"")))].slice(0,8).join(" · ")||"Review the main terms in your notes.")+'</p><p class="small-note">Demo summarizer: extracts opening points and longer terms. Connect an AI API for deeper semantic summaries.</p></div>';
});
$("check-english").addEventListener("click",()=>{
 const s=$("english-input").value.trim();if(!s){$("english-output").textContent="Please write a sentence first.";return;}
 let corrected=s;let note="Your sentence is understandable. Check punctuation and verb tense.";
 if(/\byesterday\b/i.test(s)&&/\bgo\b/i.test(s)){corrected=s.replace(/\bgo\b/i,"went");note="Use the past tense 'went' with 'yesterday'.";}
 else if(/\bhe go\b/i.test(s)){corrected=s.replace(/\bhe go\b/i,"he goes");note="With 'he' in the present simple, add -s: 'he goes'.";}
 else if(/\bshe have\b/i.test(s)){corrected=s.replace(/\bshe have\b/i,"she has");note="Use 'has' with 'she' in the present simple.";}
 $("english-output").innerHTML='<div class="result-box"><h3>Friendly feedback</h3><p><strong>Suggested sentence:</strong> '+escapeHTML(corrected)+'</p><p>'+escapeHTML(note)+'</p><p class="small-note">Demo grammar checker: checks a few common patterns. It is not a complete grammar assessment.</p></div>';
});
let tasks=JSON.parse(localStorage.getItem("studybuddy-tasks")||"[]");
function renderTasks(){ $("task-list").innerHTML=tasks.map((t,i)=>'<div class="task '+(t.done?'done':'')+'"><input type="checkbox" data-check="'+i+'" '+(t.done?'checked':'')+'><span>'+escapeHTML(t.text)+'</span><button class="delete-task" data-delete="'+i+'" aria-label="Delete task">×</button></div>').join('')||'<p class="muted">No tasks yet. Add one small goal to get started.</p>';localStorage.setItem("studybuddy-tasks",JSON.stringify(tasks));}
$("task-form").addEventListener("submit",e=>{e.preventDefault();const v=$("task-input").value.trim();if(v){tasks.push({text:v,done:false});$("task-input").value="";renderTasks();}});
$("task-list").addEventListener("change",e=>{if(e.target.dataset.check!==undefined){tasks[Number(e.target.dataset.check)].done=e.target.checked;renderTasks();}});
$("task-list").addEventListener("click",e=>{if(e.target.dataset.delete!==undefined){tasks.splice(Number(e.target.dataset.delete),1);renderTasks();}});
renderTasks();
