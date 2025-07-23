document.getElementById('postProjectForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    name: form.name.value,
    description: form.description.value,
    skills: form.skills.value,
    budget: form.budget.value,
    clientEmail: localStorage.getItem('email') || 'client@example.com' // fallback
  };

  const res = await fetch('http://localhost:3000/api/post-project', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await res.json();
  alert(result.msg);

  if (res.ok) {
    form.reset();
  }
});
