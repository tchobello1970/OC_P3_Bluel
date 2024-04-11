

// Récupération des projets depuis le fichier JSON
const reponse = await fetch('http://localhost:5678/api/works');
const projets = await reponse.json();
// Récupération des catégories depuis le fichier JSON
const reponse_cat = await fetch('http://localhost:5678/api/categories');
const categories = await reponse_cat.json();


//initialisation du Set comportant toutes les catégories
const categorySet = new Set();






/*****************************
 * 
 * generates page in both cases logged or not
 * removes token in sesssionStorage in click on logout
 * 
 *******************************/


// show/hide DOM elements if logged in or not
function genererPage(){

    //Elements hidden if logged or not
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
        event.preventDefault();
        sessionStorage.removeItem("token");
        window.location.href = "index.html";  // go back to main page in all cases
    });

    // modify
    document.getElementById("modify-id").addEventListener("click", function(event) {
        event.preventDefault();
        
        generateModal1();
    });
}



/***********************************
 * 
 * dynamic filters in index.html
 * 
 *   add all categories and listeners to filter projects
 * 
 **********************************/

function genererFiltres(){
 
    // a new Set of categories is created
    Object.values( categories).forEach( category => {
        if( categorySet.has(category.name) === false ){
            categorySet.add(category.name);       
    }});

    // add filters Elements in the DOM
    const sectionFilters = document.querySelector(".filters");
 
    // 'Tout' button, not in categories
    const filterElement = document.createElement("button");
    filterElement.innerText = "Tout";
    filterElement.classList.add("filter", "filter-selected");
    sectionFilters.appendChild(filterElement);
    ajouteListenerFiltre(filterElement);
    
    
    for (const category of categorySet.values()){
        const filterElement = document.createElement("button");
        filterElement.innerText = category;
        filterElement.classList.add("filter");
        sectionFilters.appendChild(filterElement);
        ajouteListenerFiltre(filterElement);
    }
}

function ajouteListenerFiltre(filterElement){
    // listener on click
    let projetsFiltres = projets;
    filterElement.addEventListener("click", function () {
        // picks all projects whose category matches (useless for 'tout')
        let category = filterElement.innerText;
        if( category !== "Tout")
        {
            projetsFiltres = projets.filter(function (projet) {
                return projet.category.name === category;
            });
        }
    
        // update selected filter (green button)
        // remove all
        let elements = document.querySelectorAll('.filter-selected');
        elements.forEach( function(element) {
            element.classList.remove('filter-selected');
        });
        // add new one 
        filterElement.classList.add("filter-selected");

        // remove all projects
        document.querySelector(".gallery").innerHTML = "";
        // add selected prjects
        genererProjets(projetsFiltres);
        }); 
    }

/***********************************
 * 
 * dynamic projects in index.html
 * 
 *    add images in main page and thumbnails in modal page
 * 
 **********************************/

function genererProjets(projets){
    console.log('générer projets');
 
    Object.values(projets).forEach( projet => {  
        //console.log(projet);   
        
        // creates main page element
        const ProjetElement = document.createElement("figure");
        ProjetElement.id = "fig_img_"+projet.id;
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

/***********************************
 * 
 * dynamic projects in index.html
 * 
 *    add images in main page and thumbnails in modal page
 * 
 **********************************/


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

    generateModal1Gallery();




    // add listener to body to close modal only when modal is visible
    document.body.addEventListener('click', closeModal);

    // add listener to close modal when clicking on X upper right
    document.getElementById("close-id").addEventListener("click", function(event) {
        event.preventDefault();
        document.getElementById("modale-1").remove();
        
        // remove useless listener on body
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
    //event.preventDefault();
    console.log('Modal closing')
    console.log(event.target.id);
    if( event.target.id == "modale-1" )
    {
        console.log('Modal closed')
        document.getElementById("modale-1").remove();
    //    document.getElementById("close-id").removeEventListener('click', closeModal);
    //    document.getElementById("go-back-id").removeEventListener('click', closeModal);
        document.body.removeEventListener('click', closeModal);       
    }
};

/************************************
 * 
 * closes Modal when clicking outside
 * show/hides elements and updates texts
 * 
 ***********************************/


function generateModal1Gallery() {

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
           modalFigureElement.id = "fig_mod_img_"+projet.id;
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
           modalDustbinImg.addEventListener('click', confirmRemoveProject);
    
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
        generateModal1Gallery();
    }); 

    document.getElementById('modal-title').textContent = "Ajout photo";


    const modalFileBoxElement = document.createElement("div");
    modalFileBoxElement.classList.add("modal-file-box");
    modalFileBoxElement.id = "modal-file-box-id";

    const modalFileBoxContElement = document.createElement("div");
    modalFileBoxContElement.classList.add("modal-file-box-cont");
    modalFileBoxContElement.id = "modal-file-box-cont-id";

    const modalFileBoxImgElement = document.createElement("img");
    modalFileBoxImgElement.src = "/assets/icons/landscape.svg";
    modalFileBoxImgElement.alt = "icone paysage";
    modalFileBoxImgElement.classList.add("landscape-svg");

    const modalFileBoxButtonElement = document.createElement("button");
    modalFileBoxButtonElement.classList.add("modal-filebox-button");
    modalFileBoxButtonElement.id = "btn-add";

    const modalFileBoxTitreElement = document.createElement("p");
    modalFileBoxTitreElement.classList.add("modal-filebox-p");
    modalFileBoxTitreElement.innerHTML = "jpg, png : 4 mo max";

    const modalFileBoxMinipixElement = document.createElement("div");
    modalFileBoxMinipixElement.id = "imageContainer";
    modalFileBoxMinipixElement.classList.add("modal-filebox-minipix");

    
    
    modalFileBoxElement.appendChild(modalFileBoxContElement);
    modalFileBoxContElement.appendChild(modalFileBoxImgElement);
    modalFileBoxContElement.appendChild(modalFileBoxButtonElement);
    modalFileBoxContElement.appendChild(modalFileBoxTitreElement);
    modalFileBoxElement.appendChild(modalFileBoxMinipixElement);

  
    const modalFormElement = document.createElement("form");
    modalFormElement.action = "";
    modalFormElement.method = "post";
    modalFormElement.id = "modal-form-id";


    const modalFormInputImgElement = document.createElement("input");
    modalFormInputImgElement.type="file";
    modalFormInputImgElement.name="file";
    modalFormInputImgElement.id="imageInput";
    modalFormInputImgElement.accept=".png, .jpg";
    modalFormInputImgElement.classList.add("hidden");

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
    modalSelectCategorieElement.name = "categorie";
    modalSelectCategorieElement.id = "categorie";
    let i = 1;
    for (const category of categorySet.values()){
        const optionElement = document.createElement("option");
        optionElement.innerText = category;
        optionElement.value = i;
        modalSelectCategorieElement.appendChild(optionElement);
        i ++;
    }

    console.log('liste des catégories FETCH');
    Object.values( categories).forEach( category => {

            console.log(category);   
    });


    const modalLine1Element = document.createElement("div");
    modalLine1Element.classList.add("modal-line-form");
    modalLine1Element.id = "modal-line-id";

    const modalSubmitElement = document.createElement("input");
    modalSubmitElement.type = "submit";
    modalSubmitElement.value ="Valider";
 
    const modalWrapperElement = document.querySelector(".modal-wrapper");

    modalWrapperElement.appendChild(modalFileBoxElement);
    modalWrapperElement.appendChild(modalFormElement);
 
    modalFormElement.appendChild(modalFormInputImgElement);
    modalFormElement.appendChild(modalLabelTitreElement);
    modalFormElement.appendChild(modalFormTitreElement);
    modalFormElement.appendChild(modalLabelCategorieElement);
    modalFormElement.appendChild(modalSelectCategorieElement);
    
    modalFormElement.appendChild(modalLine1Element);
    modalFormElement.appendChild(modalSubmitElement);

/********
 * 
 *   load image in fileBox
 * 
 * 
 ********/
    document.getElementById('btn-add').textContent = "+ Ajouter photo";
    document.getElementById('btn-add').addEventListener('click', function(event) {
        event.preventDefault(); 
        document.getElementById('imageInput').click();
      });
      
    document.getElementById('imageInput').addEventListener('change', function(event) {
        event.preventDefault();
        console.log(event.target);
        console.log(event.target.files);
        const file = event.target.files[0];
        
        if (file) {
            console.log('file_name');
            console.log(file.name);
          const reader = new FileReader();
          
          reader.onload = function(event) {
            const imgElement = document.createElement('img');
            imgElement.src = event.target.result;
            
            imgElement.onload = function() {
              document.getElementById('imageContainer').appendChild(imgElement);
              document.getElementById('modal-file-box-cont-id').classList.add("hidden");
            };
          };
          
          reader.readAsDataURL(file);
          console.log('FileReader');
          console.log(reader);
        }
    });


    document.getElementById('modal-form-id').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher le formulaire de se soumettre par défaut
        

        //create formData with 3 values to be sent
        const formData = new FormData(event.target);


        const image_container = document.getElementById('imageContainer');
        if( image_container.childNodes.length === 0) {
            alert("il n'y a pas d'image !");
            return;
        }
        else
        {
            console.log('files0000000');
            const imageInput = document.getElementById('imageInput');
            console.log(imageInput.files[0])
            // update file field with file name extracted from the files array
            formData.set("file", document.getElementById('imageInput').files[0].name);
        }
    

        if( formData.get("titre") === "" )
        {
            alert("il n'y a pas de titre !");
            return;
        }

        let photo = formData.get("file");
        console.log( "photo");
        console.log( photo);

        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
          }

      });
}





function removeModal1Form(){
    console.log('remove view 2')
    document.getElementById("modal-form-id").remove();
    //TODO remove all eventListeners
}







/************************************
 * 
 * removes project in backend API when clicking on dustbin
 * show/hides elements and updates texts
 * 
 ***********************************/


function confirmRemoveProject(event){
    event.preventDefault();
    const dustbin = event.target;
    const projectName = dustbin.parentNode.id; // img_5
    const projectId = projectName.slice(4); // removes first 4 characters

    // Afficher la boîte de dialogue de confirmation
    let confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
      
    // Vérifier si l'utilisateur a cliqué sur OK ou Annuler
    if (confirmation) {
      // L'utilisateur a cliqué sur OK
      removeProject( projectId );
    } 
}


function removeProject(projectId){
  



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
        else{
            console.log('project removed');

            document.getElementById("fig_img_"+projectId).remove();
            document.getElementById("fig_mod_img_"+projectId).remove();
        }

    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });

}

genererPage();
genererFiltres();
genererProjets(projets);




