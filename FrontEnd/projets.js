

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
        //console.log('token : '+sessionStorage.getItem("token"))
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
    modal1Element.id = "modale-1";
    modal1Element.classList.add("modal");

    const modalWrapperElement = document.createElement("div");
    modalWrapperElement.classList.add("modal-wrapper");
    
    const modalIconsElement = document.createElement("div");
    modalIconsElement.classList.add("modal-icons");

    const IconsWrapper1Element = document.createElement("div");
    IconsWrapper1Element.id = "close-id";
    IconsWrapper1Element.classList.add("icon-wrapper");

    const modalCloseElement = document.createElement("div");
    modalCloseElement.classList.add( "fa-lg", "fa-solid", "fa-xmark");
    modalCloseElement.setAttribute("aria-hidden", "true");
    

    const IconsWrapper2Element = document.createElement("div");
    IconsWrapper2Element.id = "go-back-id";
    IconsWrapper2Element.classList.add("icon-wrapper", "hidden");

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
        //event.preventDefault();
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
    console.log('create view 1')
    document.getElementById("go-back-id").classList.add("hidden");
    
    document.getElementById('modal-title').textContent = "Galerie photo";

    const modalGalleryContainer = document.createElement("div");
    modalGalleryContainer.id = "modal-gallery-id";
    modalGalleryContainer.classList.add("modal-gallery");

    const modalWrapperElement = document.querySelector(".modal-wrapper");
    modalWrapperElement.appendChild(modalGalleryContainer);
    

    Object.values(projets).forEach( projet => {
           // creates modal page element
           const modalFigureElement = document.createElement("figure");
           modalFigureElement.id = "fig_mod_img_"+projet.id;
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
    
        // adds elements to the DOM
           const modalGallery = document.querySelector(".modal-gallery");
           modalGallery.appendChild(modalFigureElement);
           modalFigureElement.appendChild(modalImageElement);
           modalFigureElement.appendChild(modalDustbinElement);
           modalDustbinElement.appendChild(modalDustbinImg);
           
           modalDustbinImg.addEventListener('click', confirmRemoveProject);
    });

    const modalLine1Element = document.createElement("div");
    modalLine1Element.id = "modal-line-id";
    modalLine1Element.classList.add("modal-line");

    const modalButtonElement = document.createElement("button");
    modalButtonElement.id = "btn-val";
    modalButtonElement.textContent = "Ajouter une photo";
    modalButtonElement.classList.add("modal-button");    

    modalWrapperElement.appendChild(modalLine1Element);
    modalWrapperElement.appendChild(modalButtonElement);

    // switch to view 2 (removes the gallery and shows the form)
    document.getElementById("btn-val").addEventListener("click", function(event) {
        event.preventDefault();
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
        event.preventDefault();
        removeModal1Form();
        generateModal1Gallery();
    }); 

    document.getElementById('modal-title').textContent = "Ajout photo";


    const modalFileBoxElement = document.createElement("div");
    modalFileBoxElement.id = "modal-file-box-id";
    modalFileBoxElement.classList.add("modal-file-box");

    const modalFileBoxContElement = document.createElement("div");
    modalFileBoxContElement.id = "modal-file-box-cont-id";
    modalFileBoxContElement.classList.add("modal-file-box-cont");

    const modalFileBoxImgElement = document.createElement("img");
    modalFileBoxImgElement.classList.add("landscape-svg");
    modalFileBoxImgElement.src = "/assets/icons/landscape.svg";
    modalFileBoxImgElement.alt = "icone paysage";

    const modalFileBoxButtonElement = document.createElement("button");
    modalFileBoxButtonElement.id = "btn-add";
    modalFileBoxButtonElement.classList.add("modal-filebox-button");    

    const modalFileBoxTitreElement = document.createElement("p");
    modalFileBoxTitreElement.innerHTML = "jpg, png : 4 mo max";
    modalFileBoxTitreElement.classList.add("modal-filebox-p");

/*    const modalFileBoxMinipixElement = document.createElement("div");
    modalFileBoxMinipixElement.id = "imageContainer";
    modalFileBoxMinipixElement.classList.add("modal-filebox-minipix");*/

    
    
    modalFileBoxElement.appendChild(modalFileBoxContElement);
    modalFileBoxContElement.appendChild(modalFileBoxImgElement);
    modalFileBoxContElement.appendChild(modalFileBoxButtonElement);
    modalFileBoxContElement.appendChild(modalFileBoxTitreElement);
    //modalFileBoxElement.appendChild(modalFileBoxMinipixElement);

  
    const modalFormElement = document.createElement("form");
    Object.assign(modalFormElement, {
        //action: '',
        method: 'post',
        id: 'modal-form-id'
    });
    
   // inupt file is hidden
    
    const modalFormInputImgElement = document.createElement('input');
    Object.assign(modalFormInputImgElement, {
        type: 'file',
        name: 'image',
        id: 'imageInput',
        accept: '.png, .jpg',
        //required: true
    });
    modalFormInputImgElement.classList.add("hidden");

    const modalLabelTitreElement = document.createElement("label");
    modalLabelTitreElement.for = "titre";
    modalLabelTitreElement.innerHTML = "titre";
   
    const modalFormTitreElement = document.createElement("input");
    Object.assign(modalFormTitreElement, {
        type: 'text',
        name: 'title',
        id: 'titre',
        //required: true
    });
    

    const modalLabelCategorieElement = document.createElement("label");
    modalLabelCategorieElement.for = "categorie";
    modalLabelCategorieElement.innerHTML = "catégorie";

    const modalSelectCategorieElement = document.createElement("select");
    modalSelectCategorieElement.name = "category";
    modalSelectCategorieElement.id = "categorie";
    //modalSelectCategorieElement.required = true;
    
    const optionElement = document.createElement("option");
    optionElement.innerText = "";
    optionElement.value = 0;
    
    modalSelectCategorieElement.appendChild(optionElement);

    let i = 1;
    for (const category of categorySet.values()){
        const optionElement = document.createElement("option");
        optionElement.innerText = category;
        optionElement.value = i;
        modalSelectCategorieElement.appendChild(optionElement);
        i ++;
    }

    /*console.log('liste des catégories FETCH');
    Object.values( categories).forEach( category => {
            console.log(category);   
    });*/


    const modalLine1Element = document.createElement("div");
    modalLine1Element.id = "modal-line-id";
    modalLine1Element.classList.add("modal-line-form");

    const modalSubmitElement = document.createElement("input");
    modalSubmitElement.type = "submit";
    modalSubmitElement.id = "btn-validate";
    modalSubmitElement.value ="Valider";
    modalSubmitElement.disabled =true;
    
 
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

    document.getElementById('btn-add').textContent = "+ Ajouter photo";
    

    function checkFormValues(){
        if( document.getElementById('titre').value.trim() !== "" 
        && document.getElementById('categorie').value > 0 
        && document.getElementById('modal-file-box-cont-id').classList.contains("hidden") )
        {
            console.log("3 champs valides");
            document.getElementById('btn-validate').disabled = false;
            document.getElementById('btn-validate').style.backgroundColor ="#1D6154";
        }
            
        

    }

/********
 * 
 *   load image in fileBox
 * 
 * 
 ********/
    
    document.getElementById('btn-add').addEventListener('click', function(event) {
        event.preventDefault(); 
        document.getElementById('imageInput').click();
        
      });
      
    document.getElementById('imageInput').addEventListener('change', function(event) {
        event.preventDefault();
        const file = event.target.files[0];
        
        if (file) {
            if(file.size > 4000000)
            {
                alert('file too big');
                return;
            }

            console.log('file length');
            console.log(file);

            const reader = new FileReader();
            reader.readAsDataURL(file);
          
            reader.onload = function(event) {
            const imgElement = document.createElement('img');
            //les données binaires de l'image
            imgElement.src = event.target.result;
            imgElement.classList.add("modal-filebox-minipix");
            
            imgElement.onload = function() {
                document.getElementById('modal-file-box-id').appendChild(imgElement);
                document.getElementById('modal-file-box-cont-id').classList.add("hidden");
                checkFormValues();
            };
          };
        }
    });


    document.getElementById('titre').addEventListener('change', function(event) {
        event.preventDefault();
        checkFormValues();
    });

    document.getElementById('categorie').addEventListener('change', function(event) {
        event.preventDefault();
        checkFormValues();
    });


 /********
 * 
 *   submit Add Project
 * 
 * 
 ********/

    document.getElementById('modal-form-id').addEventListener('submit', function(event) {
        event.preventDefault(); // Empêcher le formulaire de se soumettre par défaut
        
        const formData = new FormData(event.target);

        
        const project_file = document.getElementById("imageInput").files[0];
        formData.set("image", project_file);
        formData.set("title", formData.get("title").trim());

        console.log('formData 2');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        addNewProject(formData);
        document.getElementById("go-back-id").click();
    });
}





function removeModal1Form(){
    console.log('remove view 2')
    document.getElementById("modal-file-box-id").remove();
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

    let confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (confirmation) {
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
        if (!response.ok) {
            // déclenche le catch error
            throw new Error('Erreur lors de la requête');
        }
        else{
            console.log('project ' + projectId + ' removed');

            document.getElementById("fig_img_"+projectId).remove();
            document.getElementById("fig_mod_img_"+projectId).remove();
        }
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });
}


function addNewProject(formData){
    const token =  sessionStorage.getItem("token"); 
   
    const requestOptions = {
        method: 'POST',
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
        //    "Content-Type": "multipart/form-data"
        },
        body:formData
    };

    fetch(`http://localhost:5678/api/works/`, requestOptions)
    .then(response => {

        if (!response.ok) {
            // déclenche le catch error
            throw new Error('Erreur lors de la requête');
        }
        else{
            console.log('project '+formData.title+ ' added');

            //document.getElementById("fig_img_"+projectId).remove();
            //document.getElementById("fig_mod_img_"+projectId).remove();
        }

    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });
}

genererPage();
genererFiltres();
genererProjets(projets);




