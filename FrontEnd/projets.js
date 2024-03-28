// Récupération des projets depuis le fichier JSON

const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

function genererFiltres(projets){
    // a new Set of categories is created
    const categorySet = new Set();
    categorySet.add("Tout");

    // loop all projects and add each category name once
    Object.values( projets).forEach( projet => {
        if( categorySet.has(projet.category.name) === false ){
            categorySet.add(projet.category.name);       
    }});

    // add filters Elements in the DOM
    const sectionFilters = document.querySelector(".filters");

    for (const category of categorySet.values()){
        const filterElement = document.createElement("button");
        filterElement.innerText = category;
        filterElement.classList.add("filter");

        if( category === "Tout" ){
            filterElement.classList.add("filter-selected");
        }

        sectionFilters.appendChild(filterElement);
        filterElement.addEventListener("click", function () {
            let projetsFiltres = projets;
            if( category !== "Tout")
            {
                projetsFiltres = projets.filter(function (projet) {
                    return projet.category.name === category;
                });
           }
            let elements = document.querySelectorAll('.filter-selected');
            elements.forEach( function(element) {element.classList.remove('filter-selected');});

            filterElement.classList.add("filter-selected");

            document.querySelector(".gallery").innerHTML = "";
            genererProjets(projetsFiltres);
            }
        );
    }
}


function genererProjets(projets){
    Object.values(projets).forEach( projet => {     
        const sectionGallery = document.querySelector(".gallery");
        const ProjetElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = projet.title;
                   
        sectionGallery.appendChild(ProjetElement);
        ProjetElement.appendChild(imageElement);
        ProjetElement.appendChild(nomElement); 
    });
}

function genererPage(){
        document.getElementById("nav-logout").addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        sessionStorage.removeItem("token"); // Appelle la fonction
    });
    
    
    if( sessionStorage.getItem("token")){
        document.getElementById("nav-login").classList.add("hidden");
    }
    else{
        console.log('pas de token');
        document.getElementById("editor-id").classList.add("hidden");
        document.getElementById("nav-logout").classList.add("hidden");
        document.getElementById("modify-id").classList.add("hidden");
    }

}


genererPage();
genererFiltres(projets);
genererProjets(projets);



