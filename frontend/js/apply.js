document.querySelectorAll(".apply-btn").forEach(button => {
  button.addEventListener("click", () => {
    const projectId = button.getAttribute("data-project-id");
    document.getElementById("apply-form-container").style.display = "block";
    document.getElementById("projectId").value = projectId;

    // Fetch user info (from session backend)
    fetch('/get-user-info')
      .then(res => res.json())
      .then(data => {
        document.getElementById("email").value = data.email;
      });
  });
});

document.getElementById("apply-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const response = await fetch('/submit-bid', {
    method: 'POST',
    body: formData
  });
  const result = await response.json();
  alert(result.message);
});
