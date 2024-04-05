

// Récupération des projets depuis le fichier JSON
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();

const categorySet = new Set();


/***********************************
 * 
 * dynamic filters in index.html
 * 
 *   add all categories and listeners to filter projects
 * 
 **********************************/

function genererFiltres(projets){
    // a new Set of categories is created
   // const categorySet = new Set();
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
        
        // filter is added in the DOM
        sectionFilters.appendChild(filterElement);

        // listener on click
        filterElement.addEventListener("click", function () {
            // picks all projects whose category matches (useless for 'tout')
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

/***********************************
 * 
 * dynamic projects in index.html
 * 
 *    add images in main page and thumbnails in modal page
 * 
 **********************************/

function genererProjets(projets){
    console.log('générerprojets');
    

    Object.values(projets).forEach( projet => {  
        //console.log(projet);   
        
        // creates main page element
        const ProjetElement = document.createElement("figure");
          // img
        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl; // adds API value
          // title
        const nomElement = document.createElement("figcaption");
        nomElement.innerText = projet.title; // adds API value

        // adds elements to the DOM
        const sectionGallery = document.querySelector(".gallery");
        sectionGallery.appendChild(ProjetElement);
        ProjetElement.appendChild(imageElement);
        ProjetElement.appendChild(nomElement);
    });
}


/*****************************
 * 
 * generates page in both cases logged or not
 * removes token in sesssionStorage in click on logout
 * 
 *******************************/


// show/hide DOM elements if logged in or not
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
        sessionStorage.removeItem("token");
        window.location.href = "index.html";  // go back to main page in all cases
    });

    // modify
    document.getElementById("modify-id").addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        //document.getElementById("modale-1").classList.remove("hidden"); // display modal
        generateModal1();
        generateModal1Gallery(projets);
        // add listener to body to close modal only when modal is visible
        document.body.addEventListener('click', closeModal);
    });
}

function generateModal1Gallery(projets) {

    document.getElementById("go-back-id").classList.add("hidden");
    
    document.getElementById('modal-title').textContent = "Galerie photo";

    const modalGalleryContainer = document.createElement("div");
    modalGalleryContainer.classList.add("modal-gallery");
    modalGalleryContainer.id = "modal-gallery-id";

    const modalWrapperElement = document.querySelector(".modal-wrapper");
    modalWrapperElement.appendChild(modalGalleryContainer);

    Object.values(projets).forEach( projet => {
           // creates modal page element
           const modalFigureElement = document.createElement("figure");
           modalFigureElement.classList.add("image-container");
             // img
           const modalImageElement = document.createElement("img");
           modalImageElement.src = projet.imageUrl; // adds API value
             // dustbin container
           const modalDustbinElement = document.createElement("div");
           modalDustbinElement.id = "img_"+projet.id; // updates id with API value
           modalDustbinElement.classList.add("dustbin-container");
             // dustbin img
           const modalDustbinImg = document.createElement("span");
           modalDustbinImg.classList.add( "fa-sm","fa-regular","fa-trash-can", "dustbin");
           modalDustbinImg.setAttribute("aria-hidden", "true");
           modalDustbinImg.addEventListener('click', removeProject);
    
        // adds elements to the DOM
           const modalGallery = document.querySelector(".modal-gallery");
           modalGallery.appendChild(modalFigureElement);
           modalFigureElement.appendChild(modalImageElement);
           modalFigureElement.appendChild(modalDustbinElement);
           modalDustbinElement.appendChild(modalDustbinImg);
    });

    const modalLine1Element = document.createElement("div");
    modalLine1Element.classList.add("modal-line");
    modalLine1Element.id = "modal-line-id";

    const modalButtonElement = document.createElement("button");
    modalButtonElement.classList.add("modal-button");
    modalButtonElement.id = "btn-val";
    
    modalWrapperElement.appendChild(modalLine1Element);
    modalWrapperElement.appendChild(modalButtonElement);

    document.getElementById('btn-val').textContent = "Ajouter une photo";

    document.getElementById("btn-val").addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        removeModal1Gallery();
        generateModal1Form();
        

    }); 
}

function removeModal1Gallery(){
    console.log('remove view 1')
    document.getElementById("modal-gallery-id").remove();
    document.getElementById("modal-line-id").remove();
    document.getElementById("btn-val").remove();

}

function generateModal1Form(){
    console.log('create view 2');

    document.getElementById("go-back-id").classList.remove("hidden");
    document.getElementById("go-back-id").addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        removeModal1Form();
        generateModal1Gallery(projets);
    }); 

    document.getElementById('modal-title').textContent = "Ajout photo";

    const modalFormElement = document.createElement("form");
    modalFormElement.action = "#";
    modalFormElement.method = "post";
    modalFormElement.id = "modal-form-id";

    const modalFileBoxElement = document.createElement("div");
    modalFileBoxElement.classList.add("modal-file-box");
    modalFileBoxElement.id = "modal-file-box-id";

    const modalLabelTitreElement = document.createElement("label");
    modalLabelTitreElement.for = "titre";
    modalLabelTitreElement.innerHTML = "titre";
   
    const modalFormTitreElement = document.createElement("input");
    modalFormTitreElement.type = "text";
    modalFormTitreElement.name = "titre";
    modalFormTitreElement.id = "titre";

    const modalLabelCategorieElement = document.createElement("label");
    modalLabelCategorieElement.for = "categorie";
    modalLabelCategorieElement.innerHTML = "catégorie";

    const modalSelectCategorieElement = document.createElement("select");
    modalSelectCategorieElement.name = "titre";
    modalSelectCategorieElement.id = "titre";

    for (const category of categorySet.values()){
        const optionElement = document.createElement("option");
        optionElement.innerText = category;
        optionElement.value = category;
        modalSelectCategorieElement.appendChild(optionElement);
    }

    const modalSubmitElement = document.createElement("input");
    modalSubmitElement.type = "submit";
    modalSubmitElement.value ="Valider";
 
    const modalWrapperElement = document.querySelector(".modal-wrapper");
    modalWrapperElement.appendChild(modalFormElement);
    modalFormElement.appendChild(modalFileBoxElement);
    modalFormElement.appendChild(modalLabelTitreElement);
    modalFormElement.appendChild(modalFormTitreElement);
    modalFormElement.appendChild(modalLabelCategorieElement);
    modalFormElement.appendChild(modalSelectCategorieElement);

    modalFormElement.appendChild(modalSubmitElement);

}


function removeModal1Form(){
    console.log('remove view 2')
    document.getElementById("modal-form-id").remove();
}

function generateModal1(){

    const modal1Element = document.createElement("aside");
    modal1Element.classList.add("modal");
    modal1Element.id = "modale-1";

    const modalWrapperElement = document.createElement("div");
    modalWrapperElement.classList.add("modal-wrapper");
    
    const modalIconsElement = document.createElement("div");
    modalIconsElement.classList.add("modal-icons");

    const IconsWrapper1Element = document.createElement("div");
    IconsWrapper1Element.classList.add("icon-wrapper");
    IconsWrapper1Element.id = "close-id";

    const modalCloseElement = document.createElement("div");
    modalCloseElement.classList.add( "fa-lg", "fa-solid", "fa-xmark");
    modalCloseElement.setAttribute("aria-hidden", "true");
    

    const IconsWrapper2Element = document.createElement("div");
    IconsWrapper2Element.classList.add("icon-wrapper", "hidden");
    IconsWrapper2Element.id = "go-back-id";

    const modalGoBackElement = document.createElement("div");
    modalGoBackElement.classList.add( "fa-lg", "fa-solid", "fa-arrow-left");
    modalGoBackElement.setAttribute("aria-hidden", "true");

    const modalTitleElement = document.createElement("h2");
    modalTitleElement.id = "modal-title";
    

    const mainElement = document.querySelector("main");
    mainElement.appendChild(modal1Element);
    modal1Element.appendChild(modalWrapperElement);
    modalWrapperElement.appendChild(modalIconsElement);
    modalIconsElement.appendChild(IconsWrapper1Element);
    IconsWrapper1Element.appendChild(modalCloseElement);
    modalIconsElement.appendChild(IconsWrapper2Element);
    IconsWrapper2Element.appendChild(modalGoBackElement);
    modalWrapperElement.appendChild(modalTitleElement);

    document.getElementById("close-id").addEventListener("click", function(event) {
        event.preventDefault(); // Empêche le comportement par défaut du lien
        document.getElementById("modale-1").remove();
        
        document.body.removeEventListener('click', closeModal);
    });

}


/************************************
 * 
 * closes Modal when clicking outside
 * show/hides elements and updates texts
 * 
 ***********************************/

function closeModal(event){
    event.preventDefault();
    //console.log(event.target.id);
    if( event.target.id == "modale-1" )
    {
        document.getElementById("modale-1").remove();
        document.body.removeEventListener('click', closeModal);       
    }
};


/************************************
 * 
 * removes project in backend API when clicking on dustbin
 * show/hides elements and updates texts
 * 
 ***********************************/


function removeProject(event){
    event.preventDefault();

    const dustbin = event.target;
    const projectName = dustbin.parentNode.id; // img_5
    const projectId = projectName.slice(4); // removes first 4 characterss
    
    const token =  sessionStorage.getItem("token"); 
    
    const requestOptions = {
        method: 'DELETE',
        headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
    };

    fetch(`http://localhost:5678/api/works/${projectId}`, requestOptions)
    .then(response => {

        console.log('response');
        console.log(response);
        if (!response.ok) {
            // déclenche le catch error
            throw new Error('Erreur lors de la requête');
        }

    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });

}


genererPage();
genererFiltres(projets);
genererProjets(projets);




