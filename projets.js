// Récupération des projets depuis le fichier JSON
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

function genererProjets(projets){

    for (let i = 0; i < projets.length; i++) {

        const projet = projets[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const sectionGallery = document.querySelector(".gallery");
        // Création d’une balise dédiée à une pièce automobile
        const ProjetElement = document.createElement("figure");
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = article.nom;
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;

          
        // On rattache la balise article a la section Fiches
        sectionGallery.appendChild(ProjetElement);
        ProjetElement.appendChild(imageElement);
        ProjetElement.appendChild(nomElement); 
    }
}

genererProjets(projets);