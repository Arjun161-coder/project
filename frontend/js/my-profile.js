const fields = [
  "name", "email", "education", "resumeLink", "github", "linkedin",
  "projects", "reviews", "hourlyRate", "role", "skills", "country", "image"
];

const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const profileImage = document.getElementById("profileImage");

let originalData = {};

function toggleEditMode(enable) {
  fields.forEach(id => {
    const el = document.getElementById(id);
    el.disabled = !enable;
    if (id === "image") el.classList.toggle("hidden", !enable);
  });
  saveBtn.classList.toggle("hidden", !enable);
  cancelBtn.classList.toggle("hidden", !enable);
  editBtn.classList.toggle("hidden", enable);
}

function loadData() {
  fetch("http://localhost:3000/api/user")
    .then(res => res.json())
    .then(data => {
      originalData = data;
      fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = data[id] || "";
      });
      profileImage.src = data.image || "https://via.placeholder.com/150";
    });
}

function saveData() {
  const updated = {};
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) updated[id] = el.value;
  });

  fetch("http://localhost:3000/api/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  }).then(() => {
    toggleEditMode(false);
    loadData();
  });
}

editBtn.addEventListener("click", () => toggleEditMode(true));
cancelBtn.addEventListener("click", () => {
  toggleEditMode(false);
  loadData();
});
saveBtn.addEventListener("click", saveData);

window.onload = loadData;
window.addEventListener('DOMContentLoaded', () => {
  const card = document.querySelector('.profile-card');
  const left = document.createElement('div');
  left.classList.add('left-section');

  const right = document.createElement('div');
  right.classList.add('right-section');

  const fields = Array.from(card.querySelectorAll('.field-group'));
  const image = card.querySelector('#profileImage');
  const imageInput = card.querySelector('#image');
  const btnGroup = card.querySelector('.btn-group');
  left.appendChild(image);
  left.appendChild(imageInput);
  const leftLabels = ['Role:', 'Country:', 'GitHub:', 'LinkedIn:', 'Hourly Rate ($):'];
  fields.forEach(group => {
    const label = group.querySelector('label')?.innerText?.trim();
    if (leftLabels.includes(label)) {
      left.appendChild(group);
    } else {
      right.appendChild(group);
    }
  });

  card.innerHTML = '';
  card.appendChild(left);
  card.appendChild(right);
  card.appendChild(btnGroup);
});
