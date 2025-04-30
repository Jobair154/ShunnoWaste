function openOrderForm() {
    document.getElementById("orderFormModal").style.display = "flex";
  }
  
  function closeOrderForm() {
    document.getElementById("orderFormModal").style.display = "none";
  }
  
  function submitOrder() {
    
    const form = document.getElementById("orderForm");
    
    
    form.reset();
  
    
    document.getElementById("orderFormModal").style.display = "none";
    
    
    document.getElementById("successMessage").style.display = "flex";
  }
  
  function closeSuccessMessage() {
    document.getElementById("successMessage").style.display = "none";
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('edit-profile-modal');
    const btn = document.getElementById('edit-profile-btn');
    const closeBtn = document.getElementsByClassName('close')[0];
    const editForm = document.getElementById('edit-profile-form');
  
    // Open modal
    btn.onclick = function () {
      modal.style.display = 'block';
    }
  
    // Close modal
    closeBtn.onclick = function () {
      modal.style.display = 'none';
    }
  
    // Close when clicking outside
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    }
  
    // Handle form submission
    editForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const name = document.getElementById('edit-name').value;
      const location = document.getElementById('edit-location').value;
  
      console.log(name, location)
  
      fetch('/cupdate_profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, location })
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Update the UI
            document.getElementById('company_name').innerText = name;
            document.getElementById('company_location').innerText = location;
            modal.style.display = 'none';
            alert('Profile updated successfully!');
          } else {
            alert('Error: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while updating your profile.');
        });
    });
  });
  
  
  
  let inactivityTimer;
  
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      fetch('/logout_inactivity', { method: 'POST' })
        .then(() => {
          alert('You have been logged out due to inactivity.');
          window.location.href = '/login';
        })
        .catch(error => console.error('Error logging out:', error));
    }, 5 * 60 * 1000); // 5 minutes inactivity threshold
  }
  
  document.addEventListener('mousemove', resetInactivityTimer);
  document.addEventListener('keydown', resetInactivityTimer);
  document.addEventListener('click', resetInactivityTimer);
  document.addEventListener('scroll', resetInactivityTimer);
  
  resetInactivityTimer();