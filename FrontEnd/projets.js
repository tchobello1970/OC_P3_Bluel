// Récupération des projets depuis le fichier JSON

const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

function genererFiltres(projets){
    // a new Set of categories is created
    const categorySet = new Set();


    // loop all projects and add each category name once
    for (let i = 0; i < projets.length; i++) {

        const projet = projets[i];
        if( categorySet.has(projet.category.name) === false ){
            categorySet.add(projet.category.name);
        }
    }

    // add filters Elements in the DOM
    const sectionFilters = document.querySelector(".filters");
    for (let category of categorySet.values()){
        const filterElement = document.createElement("button");
        filterElement.innerText = category;
        filterElement.classList.add("filter");
        sectionFilters.appendChild(filterElement);

        filterElement.addEventListener("click", function () {
            const projetsFiltres = projets.filter(function (projet) {
                return projet.category.name === category;
            });
            document.querySelector(".gallery").innerHTML = "";
            genererProjets(projetsFiltres);
            }
        );
    }
}


function genererProjets(projets){

    console.log('projj')
    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];
       
        const sectionGallery = document.querySelector(".gallery");
        
        const ProjetElement = document.createElement("figure");
        
        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = projet.title;
              
        
        sectionGallery.appendChild(ProjetElement);
        ProjetElement.appendChild(imageElement);
        ProjetElement.appendChild(nomElement); 
    }
    
}


const boutonNoFilter = document.querySelector("#no_filter");
boutonNoFilter.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    genererProjets(projets);
});


genererFiltres(projets)
genererProjets(projets);