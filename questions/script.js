let questionData = {};

fetch("./questions.json")
  .then(res => res.json())
  .then(data => {
    questionData = data.classes;
    console.log("Loaded data:", questionData);
  })
  .catch(err => console.error("Fetch error:", err));

function generatePaper() {
  const selectedClass = document.getElementById("classSelect").value;
  const selectedChapter = document.getElementById("chapterSelect").value;
  const count = Number(document.getElementById("questionCount").value);
  const paper = document.getElementById("questionPaper");

  paper.innerHTML = "";

  if (!selectedClass || !selectedChapter || !count) {
    alert("Select class, chapter and number of questions");
    return;
  }

  if (!questionData[selectedClass]) {
    alert("Class not found in JSON");
    return;
  }

  if (!questionData[selectedClass][selectedChapter]) {
    alert("Chapter not found in JSON");
    return;
  }

  const questions = [...questionData[selectedClass][selectedChapter]];

  if (count > questions.length) {
    alert(`Only ${questions.length} questions available`);
    return;
  }

  // Shuffle
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
