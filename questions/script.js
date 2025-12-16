let data = {};

fetch("questions.json")
  .then(res => res.json())
  .then(json => {
    data = json.chapters;

    const chapterSelect = document.getElementById("chapterSelect");

    Object.keys(data).forEach(chapter => {
      const option = document.createElement("option");
      option.value = chapter;
      option.text = chapter;
      chapterSelect.appendChild(option);
    });
  });

function generatePaper() {
  const chapter = document.getElementById("chapterSelect").value;
  const count = parseInt(document.getElementById("questionCount").value);
  const questions = [...data[chapter]];

  if (!count || count > questions.length) {
    alert("Invalid number of questions");
    return;
  }

  // Shuffle questions
  questions.sort(() => Math.random() - 0.5);

  const selected = questions.slice(0, count);
  const paper = document.getElementById("questionPaper");
  paper.innerHTML = "";

  selected.forEach((q, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <p>${q.question}</p>
      <ul>
        ${q.options.map(opt => `<li>${opt}</li>`).join("")}
      </ul>
    `;
    paper.appendChild(li);
  });
}
