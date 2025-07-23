document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.querySelector('input[name="role"]:checked')?.value;
  if (name.length < 3) {
    alert('Username must be at least 3 characters long.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(password)) {
    alert('Password must be at least 6 characters and contain letters and numbers.');
    return;
  }

  if (!role) {
    alert('Please select if you are signing up as a Client or Freelancer.');
    return;
  }
  try {
    const res = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Signup successful! Please login.');
      window.location.href = 'login.html';
    } else {
      alert(data.msg);
    }
  } catch (err) {
    alert('Server error. Please try again later.');
  }
});
