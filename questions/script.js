console.log("Script loaded");

let questionData = {};

fetch("./questions.json")
  .then(res => {
    console.log("JSON fetch status:", res.status);
    return res.json();
  })
  .then(data => {
    questionData = data.classes;
    console.log("Questions loaded:", questionData);
  })
  .catch(err => console.error("Fetch error:", err));

document.getElementById("classSelect").addEventListener("change", () => {
  const cls = document.getElementById("classSelect").value;
  const chapterSelect = document.getElementById("chapterSelect");

  chapterSelect.innerHTML = `<option value="">Select Chapter</option>`;

  if (!questionData[cls]) {
    console.log("No data for class", cls);
    return;
  }

  Object.keys(questionData[cls]).forEach(ch => {
    const opt = document.createElement("option");
    opt.value = ch;
    opt.textContent = ch;
    chapterSelect.appendChild(opt);
  });

  console.log("Chapters loaded");
});

document.getElementById("generateBtn").addEventListener("click", () => {
  const cls = document.getElementById("classSelect").value;
  const ch = document.getElementById("chapterSelect").value;
  const count = Number(document.getElementById("questionCount").value);
  const paper = document.getElementById("questionPaper");

  paper.innerHTML = "";

  if (!cls || !ch) {
    alert("Select class and chapter");
    return;
  }

  const questions = questionData[cls][ch];

  questions.slice(0, count).forEach(q => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p>${q.question}</p>
      <ul>${q.options.map(o => `<li>${o}</li>`).join("")}</ul>
    `;
    paper.appendChild(li);
  });

  console.log("Questions rendered");
});
