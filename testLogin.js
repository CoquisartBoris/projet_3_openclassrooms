document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    }).then(res => {
        return res.json()
    })
    .then(data => {
        if (data.userId) {
            window.localStorage.setItem("token", data.token);
            window.location.href = 'index.html';
        }else {
            var errorAlert = document.getElementById("errorMsg");
            errorAlert.innerHTML = "Adresse email / mot de passe non valide";
        }
    })
    .catch(error => console.log('ERROR'))
    

})