const output = document.getElementById("questionPaper");
output.innerHTML = "<li>Loading questions...</li>";

fetch("questions.json")
  .then(res => res.json())
  .then(data => {
    window.DB = data.classes;
    output.innerHTML = "<li>JSON loaded successfully</li>";
  })
  .catch(err => {
    output.innerHTML = "<li>JSON failed to load</li>";
    console.error(err);
  });

function generatePaper() {
  output.innerHTML = "";

  const cls = document.getElementById("classSelect").value;
  const ch = document.getElementById("chapterSelect").value;
  const n = Number(document.getElementById("questionCount").value);

  if (!cls || !ch || !n) {
    output.innerHTML = "<li>Please select all fields</li>";
    return;
  }

  if (!window.DB || !window.DB[cls] || !window.DB[cls][ch]) {
    output.innerHTML = "<li>No data found for selected class/chapter</li>";
    return;
  }

  const qs = window.DB[cls][ch];

  qs.slice(0, n).forEach(q => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${q.question}</strong>
      <ul>
        ${q.options.map(o => `<li>${o}</li>`).join("")}
      </ul>
    `;
    output.appendChild(li);
  });
}
