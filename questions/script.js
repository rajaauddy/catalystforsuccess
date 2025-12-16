let questionData = {};

fetch("../questions.json")
  .then(res => res.json())
  .then(data => {
    questionData = data.classes;
    console.log("Loaded:", questionData);
  })
  .catch(err => console.error("JSON load error:", err));

function generatePaper() {
  const selectedClass = document.getElementById("classSelect").value;
  const selectedChapter = document.getElementById("chapterSelect").value;
  const count = Number(document.getElementById("questionCount").value);
  const paper = document.getElementById("questionPaper");

  paper.innerHTML = "";

  if (!selectedClass || !selectedChapter || !count) {
    alert("Please select all fields");
    return;
  }

  if (
    !questionData[selectedClass] ||
    !questionData[selectedClass][selectedChapter]
  ) {
    alert("No questions found for selected class/chapter");
    return;
  }

  const questions = [...questionData[selectedClass][selectedChapter]];

  questions.sort(() => Math.random() - 0.5);

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
