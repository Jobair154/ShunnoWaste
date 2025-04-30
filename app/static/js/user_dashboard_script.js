function handleWithdraw(event) {
    event.preventDefault();

    var availablePoints = parseInt(document.getElementById('available-points').textContent);
    var withdrawalAmount = parseInt(document.getElementById('amount').value);
    console.log(availablePoints, withdrawalAmount);

    if (withdrawalAmount > availablePoints) {
        alert("You cannot withdraw more points than you have available.");
        location.reload();
        return;
    }

    // If valid, send the data to the backend
    fetch('/withdraw', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: withdrawalAmount })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Withdrawal successful!');
                location.reload();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while processing your request.');
        });
}

// Edit Profile Modal Functionality
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
        const password = document.getElementById('edit-password').value;
        const location = document.getElementById('edit-location').value;

        fetch('/update_profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, password, location })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.querySelector('.user-info h1').innerText = `Hi, ${name}!`;
                    document.getElementById('user-location').innerText = location;
                    // document.getElementById('user-password').innerText = password;
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
