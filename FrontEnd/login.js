
console.log('login activation');


const btnConnection = document.getElementById("btn_connection")

btn_connection.addEventListener("click", (event) => {
    event.preventDefault(); // to prevent page reloading


/* check fields */
    if( verifierChamp(email) && verifierChamp(password)) {

        // Création de l’objet du login.
        const login = {
            email: email.value,
            password: password.value
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(login);
    
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' }, // Spécifie le type de contenu JSON
            body: chargeUtile
        };
        

    /* 
        connexion à l'API
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
                response.json().then(data => {
                    sessionStorage.setItem("token", data.token);
                    window.location.href = "index.html";
                });
            }
        })
        .catch(error => {
            console.error('Une erreur s\'est produite:', error);
            afficherErreur("Connexion non établie. Vérifiez l'email et le mot de passe...")
        });
    }

});


/*************************
 * 
 * removes error message when clicking on email or password field
 * 
 ************************/
const field_email = document.getElementById("email");
field_email.addEventListener("click", (event) => {
    event.preventDefault();
    supprimerErreur();
});

const field_password = document.getElementById("password");
field_password.addEventListener("click", (event) => {
    event.preventDefault();
    supprimerErreur();
});


function supprimerErreur(){
    const erreurElement = document.querySelector("#erreur-id");
    if (erreurElement) {
        // Supprimer l'élément du DOM
        erreurElement.remove();
    }
}


function afficherErreur(messsage){
    console.log('afficheErreur');
    const mainElement = document.querySelector("main");
    const erreurElement = document.createElement("h2");
    erreurElement.id = "erreur-id";
    erreurElement.innerText = messsage;
    mainElement.appendChild(erreurElement);

}


/********************************
 *  check if empty
 *  specific regex check on email 
 ********************************/

function verifierChamp(champ) {
    // Si le champ est vide, on lance une exception
    if (champ.value === "") {
        afficherErreur(`Le champ ${champ.id} est vide`);
        return false;
    }

    if (champ.type === "email")
    {
        let regex_email = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");
        let resultat = regex_email.test(champ.value);
        if( resultat === false){
            afficherErreur(`Le champ ${champ.id} n'est pas valide`);
            return false;
        }
    }
    return true;
}