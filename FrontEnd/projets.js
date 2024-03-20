// Récupération des projets depuis le fichier JSON

const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

function genererProjets(projets){

    const categorySet = new Set();

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
        nomElement.innerText = projet.title;
              
        // On rattache la balise article a la section Fiches
        sectionGallery.appendChild(ProjetElement);
        ProjetElement.appendChild(imageElement);
        ProjetElement.appendChild(nomElement); 

        if( categorySet.has(projet.category.name) === false ){
            categorySet.add(projet.category.name);
        }
    }
    console.log( "categorySet");
    console.log(categorySet);

    const sectionFilters = document.querySelector(".filters");

    for (let category of categorySet.values()){
        const filterElement = document.createElement("button");
        filterElement.innerText = category;
        filterElement.classList.add("filter");
        sectionFilters.appendChild(filterElement);
    }
}

genererProjets(projets);