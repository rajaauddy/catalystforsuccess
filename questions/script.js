let questionData = {};
let dataLoaded = false;

fetch("./questions.json")
  .then(res => res.json())
  .then(data => {
    questionData = data.classes;
    dataLoaded = true;
    console.log("Loaded:", questionData);
  })
  .catch(err => console.error("JSON load error:", err));

function loadChapters() {
  const cls = document.getElementById("classSelect").value;
  const chapterSelect = document.getElementById("chapterSelect");

  chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;

  if (!questionData[cls]) return;

  Object.keys(questionData[cls]).forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    chapterSelect.appendChild(opt);
  });
}

function generatePaper() {
  if (!dataLoaded) {
    alert("Questions are still loading");
    return;
  }

  const cls = document.getElementById("classSelect").value;
  const ch = document.getElementById("chapterSelect").value;
  const count = Number(document.getElementById("questionCount").value);
  const paper = document.getElementById("questionPaper");

  paper.innerHTML = "";

  if (!cls || !ch || !count) {
    alert("Please select all fields");
    return;
  }

  const questions = questionData[cls][ch];

  if (!questions || questions.length === 0) {
    alert("No questions found");
    return;
  }

  questions.slice(0, count).forEach(q => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p>${q.question}</p>
      <ul>
        ${q.options.map(o => `<li>${o}</li>`).join("")}
      </ul>
    `;
    paper.appendChild(li);
  });
}
