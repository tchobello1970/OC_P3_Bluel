
console.log('login activation');
//const reponse = await fetch('http://localhost:5678/api/users/login');
//const users = await reponse.json();



const btnConnection = document.getElementById("btn_connection")

btn_connection.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Il n’y a pas eu de rechargement de page");

    verifierChamp(email);
    verifierChamp(password);

       
    console.log('Email');
    console.log(email.value);
    console.log('password');
    console.log(password.value);
    console.log('users');
    
    // Création de l’objet du login.
    const login = {
        email: email.value,
        password: password.value
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(login);
 
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Spécifie le type de contenu JSON
        },
        body: chargeUtile
    };
    

   /* le fetch renvoie un Promise (resolve,reject)
      then renvoie la réponse en cas de succès et 
      catch renvoie l'erreur en cas de reject
      response est la réponse http complète
      data sont les données extraites (la réponse après un appel valide)
*/
    fetch("http://localhost:5678/api/users/login", requestOptions)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la requête');
        }
        return response.json(); // Analyse la réponse en JSON
    })
    .then(data => {
        console.log('Réponse de la requête POST:', data);
        // Traitez la réponse de la requête ici
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });





});

function verifierChamp(champ) {
    // Si le champ est vide, on lance une exception
    if (champ.value === "") {
        throw new Error(`Le champ ${champ.id} est vide`)
    }

    if (champ.type === "email")
    {
        let regex_email = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");
        let resultat = regex_email.test(champ.value);
        if( resultat === false){
            throw new Error(`Le champ ${champ.id} n'est pas valide`);
        }
    }
}