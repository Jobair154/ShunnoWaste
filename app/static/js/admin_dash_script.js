function user_submissions_func(email) {
    const formContainer = document.getElementById('user_history');
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('uh-divider').style.display = 'block';

    fetch(`/usub_admin/${email}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            const user_submissions = data.user_submissions;
            const tableBody = document.querySelector('#user_history table tbody');
            if (!tableBody) {
                console.error('Table body not found!');
                return;
            }
            tableBody.innerHTML = '';

            const title = document.getElementById('usub_table');
            title.innerHTML = `Submission History for ${email}`;

            user_submissions.forEach(user_submissions => {
                const row = document.createElement('tr');

                row.innerHTML = `
                <td>${user_submissions.user_history_date}</td>
                <td>${user_submissions.user_history_branch}</td>
                <td>${user_submissions.plastic_bottles}</td>
                <td>${user_submissions.cardboards}</td>
                <td>${user_submissions.glasses}</td>
                <td><a href="#editSubmissionModal" onclick="openModal(${user_submissions.user_history_id})"><u><i>edit</i></u></a></td>`
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function company_submissions_func(email) {
    const formContainer = document.getElementById('company_history');
    formContainer.style.display = 'block';
    formContainer.scrollIntoView({ behavior: 'smooth' });
    document.getElementById('ch-divider').style.display = 'block';


    fetch(`/csub_admin/${email}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            const company_submissions = data.company_submissions;
            const tableBody = document.querySelector('#company_history table tbody');
            if (!tableBody) {
                console.error('Table body not found!');
                return;
            }
            tableBody.innerHTML = '';

            const title = document.getElementById('csub_table');
            title.innerHTML = `Submission History for ${email}`;

            company_submissions.forEach(company_submissions => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${company_submissions.company_history_date}</td>
                <td>${company_submissions.plastic_bottles}</td>
                <td>${company_submissions.cardboards}</td>
                <td>${company_submissions.glasses}</td>
            <td><a href="#editCompanyModal" onclick="openCompanyModal(${company_submissions.company_history_id})"><u><i>edit</i></u></a></td>
        `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
}

function openModal(sub_id) {
    document.getElementById('editSubmissionModal').style.display = 'block';
    fetch(`/fetch_usub_d/${sub_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('modal-title').innerHTML = `Edit Submission #${sub_id}`;
            document.getElementById('plastic').value = data.plastic;
            document.getElementById('cardboard').value = data.cardboard;
            document.getElementById('glass').value = data.glass;
            document.getElementById('delete').setAttribute("onclick", `deleteSub(${sub_id})`);
            document.getElementById('edit').setAttribute("onclick", `editSub(${sub_id})`);
        })
}

function editSub(sub_id) {
    const plastic = document.getElementById('plastic').value;
    const cardboard = document.getElementById('cardboard').value;
    const glass = document.getElementById('glass').value;

    fetch(`/usub_edit/${sub_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `plastic=${plastic}&cardboard=${cardboard}&glass=${glass}`
    })
        .then(response => response.json())
        .then(data => {
            closeModal();
        })
        .catch(error => console.error('Error:', error));
}

function deleteSub(sub_id) {
    fetch(`/usub_delete/${sub_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            closeModal();
        })
        .catch(error => console.error('Error:', error));
}

function closeModal() {
    document.getElementById('editSubmissionModal').style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('editSubmissionModal');
    if (event.target === modal) {
        closeModal();
    }
};

function openCompanyModal(company_history_id) {
    document.getElementById('editCompanyModal').style.display = 'block';
    fetch(`/fetch_csub_d/${company_history_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('company-modal-title').innerHTML = `Edit Company Submission #${company_history_id}`;
            document.getElementById('company-plastic').value = data.plastic;
            document.getElementById('company-cardboard').value = data.cardboard;
            document.getElementById('company-glass').value = data.glass;
            document.getElementById('company-delete').setAttribute("onclick", `deleteCompanySub(${company_history_id})`);
            document.getElementById('company-edit').setAttribute("onclick", `editCompanySub(${company_history_id})`);
        })
        .catch(error => console.error('Error:', error));
}

function editCompanySub(company_history_id) {
    const plastic = document.getElementById('company-plastic').value;
    const cardboard = document.getElementById('company-cardboard').value;
    const glass = document.getElementById('company-glass').value;

    fetch(`/csub_edit/${company_history_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `plastic=${plastic}&cardboard=${cardboard}&glass=${glass}`
    })
        .then(response => response.json())
        .then(data => {
            closeCompanyModal();
        })
        .catch(error => console.error('Error:', error));
}

function deleteCompanySub(company_history_id) {
    fetch(`/csub_delete/${company_history_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            closeCompanyModal();
        })
        .catch(error => console.error('Error:', error));
}

function closeCompanyModal() {
    document.getElementById('editCompanyModal').style.display = 'none';
}

window.onclick = function (event) {
    const companyModal = document.getElementById('editCompanyModal');
    if (event.target === companyModal) {
        closeCompanyModal();
    }
};


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