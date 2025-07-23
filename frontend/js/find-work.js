/*document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/api/projects')
    .then(response => response.json())
    .then(projects => {
      const container = document.getElementById('projectsContainer');
      if (projects.length === 0) {
        container.innerHTML = '<p>No projects found.</p>';
        return;
      }

      projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
          <h2>${project.name}</h2>
          <p><strong>Description:</strong> ${project.description}</p>
          <p><strong>Skills:</strong> ${project.skills}</p>
          <p><strong>Budget:</strong> $${project.budget}</p>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading projects:', error);
    });
});
*/