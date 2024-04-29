console.log('login activation');

const btnConnection = document.getElementById("btn_connection")
btnConnection.addEventListener("click", (event) => {
    event.preventDefault(); // to prevent page reloading

/* check input elements */
    if( verifierChamp(email) && verifierChamp(password)) {

        // Création de l’objet du login.
        const login = {
            email: email.value,
            password: password.value
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(login);
        console.log(chargeUtile);
    
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' }, // Spécifie le type de contenu JSON
            body: chargeUtile
        };
        

    /* 
        connexion grâce à l'API
        le fetch renvoie un Promise (resolve,reject)

        then renvoie la réponse en cas de succès et 
        catch renvoie l'erreur en cas de reject
        
        response est la réponse http complète
        data sont les données extraites (la réponse après un appel valide)
    */
        fetch("http://localhost:5678/api/users/login", requestOptions)
        .then(response => {
            if (!response.ok) {
                // déclenche le catch error
                throw new Error('Erreur lors de la requête');
            }
            else
            {
                // token i saved in a session storage
                // go back to index page
                response.json().then(data => {
                    sessionStorage.setItem("token", data.token);
                    window.location.href = "index.html";
                });
            }
        })
        .catch(error => {
            console.error('Une erreur s\'est produite:', error);
            alert("Connexion non établie. Vérifiez l'email et le mot de passe...");
        });
    }

});


/********************************
 *  check if empty
 *  specific regex check on email 
 ********************************/

function verifierChamp(champ) {
    // Si le champ est vide, on envoie une alerte
    if (champ.value.trim() === "") {
        alert(`Le champ ${champ.name} est vide`);
        return false;
    }

    if (champ.type === "email")
    {
        let regex_email = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");
        let resultat = regex_email.test(champ.value);
        if( resultat === false){
            alert(`Le champ ${champ.name} n'est pas valide`);
            return false;
        }
    }
    return true;
}