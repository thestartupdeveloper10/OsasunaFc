const closeBtn = document.querySelector('.close');
const openBtn = document.querySelector('.openBtn');
const sidebar = document.querySelector('.sidebar');
const horizontalNav = document.querySelector('.horizontalNav')


closeBtn.addEventListener('click', () => {
    sidebar.style.display = 'none';
})

openBtn.addEventListener('click', () => {
    sidebar.style.display = 'flex';
})

// VALIDATE FORM

function validateForm() {
    
    // Get form fields
    const fullName = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const enquire = document.getElementById('bio').value.trim();

    // Check if any required field is empty
    if (!fullName || !email || !enquire) {
      alert('Please fill out all required fields.');
      return false;
    }
    
    // If all required fields are filled, return true to submit the form
    return true;
  }



// Admin form validation

