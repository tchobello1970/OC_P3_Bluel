

// Récupération des projets depuis le fichier JSON
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();


/***********************************
 * 
 * dynamic filters in index.html
 * 
 **********************************/




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
            /* default selected (green button) */
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
            
            // update selected filter (green button)
            // remove all
            let elements = document.querySelectorAll('.filter-selected');
            elements.forEach( function(element) {element.classList.remove('filter-selected');});
            // add new one 
            filterElement.classList.add("filter-selected");

            // remove all projects
            document.querySelector(".gallery").innerHTML = "";
            // add selected prjects
            genererProjets(projetsFiltres);
            }
        );
    }
}


function genererProjets(projets){
    console.log('générerprojets')
    Object.values(projets).forEach( projet => {  
        //console.log(projet);   
        const sectionGallery = document.querySelector(".gallery");
        const ProjetElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = projet.title;
                   
        sectionGallery.appendChild(ProjetElement);
        ProjetElement.appendChild(imageElement);
        ProjetElement.appendChild(nomElement);

        const modalGallery = document.querySelector(".modal-gallery");
        const modalProjetElement = document.createElement("figure");
        modalProjetElement.classList.add("image-container");
        const modalImageElement = document.createElement("img");
        modalImageElement.src = projet.imageUrl;
        const modalDustbinElement = document.createElement("div");
        modalDustbinElement.id = "img_"+projet.id;
        modalDustbinElement.classList.add("dustbin-container");
        const modalDustbinImg = document.createElement("span");
        modalDustbinImg.classList.add( "fa-sm","fa-regular","fa-trash-can", "dustbin");
        modalDustbinImg.setAttribute("aria-hidden", "true");

        modalGallery.appendChild(modalProjetElement);
        modalProjetElement.appendChild(modalImageElement);
        modalProjetElement.appendChild(modalDustbinElement);
        modalDustbinElement.appendChild(modalDustbinImg);
        //TODO Ajouter la poubelle ProjetElement.appendChild(nomElement);

    });
    const modal = document.getElementById("modale-1");
    console.log('test hidden');
    console.log(modal.classList.contains("hidden") );
    if (modal.classList.contains("hidden") === false)
    {
        document.body.addEventListener('click', function(event) {
            // Vérifiez si le clic a eu lieu en dehors de la modale
            
            if (document.getElementById("modale-1").contains(event.target === false) ) {
                document.getElementById("modale-1").classList.toggle("hidden");
            }
        });
    }
}


/*****************************
 * 
 * generates page in both cases logged or not
 * removes token in sesssionStorage in clikc on logout
 * 
 *******************************/

function genererPage(){
    
    if( sessionStorage.getItem("token")){
        document.getElementById("nav-login").classList.add("hidden");
    }
    else{
        console.log('pas de token');
        document.getElementById("editor-id").classList.add("hidden");
        document.getElementById("nav-logout").classList.add("hidden");
        document.getElementById("modify-id").classList.add("hidden");
    }

    // logout
    document.getElementById("nav-logout").addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        sessionStorage.removeItem("token"); // Appelle la fonction
        window.location.href = "index.html";
    });

    // modify
    document.getElementById("modify-id").addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        document.getElementById("modale-1").classList.toggle("hidden");
    });

    //modale
    document.getElementById("close-id").addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        document.getElementById("modale-1").classList.toggle("hidden");
    });


}


genererPage();
genererFiltres(projets);
genererProjets(projets);



