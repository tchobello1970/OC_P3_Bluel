

// Récupération des projets depuis le fichier JSON
const reponse = await fetch('http://localhost:5678/api/works');
let projets = await reponse.json();

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
        console.log('token : '+sessionStorage.getItem("token"))
        document.getElementById("nav-login").classList.add("hidden");
    }
    else{
        console.log('pas de token');
        document.getElementById("editor-id").classList.add("hidden");
        document.getElementById("nav-logout").classList.add("hidden");
        document.getElementById("modify-id").classList.add("hidden");
    }

    genererFiltres();
    genererProjets(projets);

   // logout
    document.getElementById("nav-logout").addEventListener("click", function(event) {
        sessionStorage.removeItem("token");
        window.location.href = "index.html";  // go back to main page in all cases
    });

    // modify
    document.getElementById("modify-id").addEventListener("click", function(event) {
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
    categorySet.add("Tout");
    Object.values( categories ).forEach( category => {
     /*   if( categorySet.has(category.name) === false ){
            categorySet.add(category.name);
                    
    }*/
    // useless test in Set.
        categorySet.add(category.name);
});

    // add filters Elements in the DOM
    const sectionFilters = document.querySelector(".filters");
    
    categorySet.forEach( category => {
        const filterElement = document.createElement("button");
        filterElement.innerText = category;
        filterElement.classList.add("filter");
        if( category === "Tout"){
            // green
            filterElement.classList.add("filter-selected"); 
        }
        sectionFilters.appendChild(filterElement);
        // add eventListener
        ajouteListenerFiltre(filterElement);
    });
}

function ajouteListenerFiltre(filterElement){
    // listener on click
    
    filterElement.addEventListener("click", function () {
        // picks all projects whose category matches (useless for 'tout')
        
        let projetsFiltres = projets;
        const category = filterElement.innerText;
        if( category !== "Tout")
        {
            // uses anonymous function on filter method of JSON data 
            projetsFiltres = projets.filter(function (projet) {
                return projet.category.name === category;
            });
        }
    
        // update selected filter (green button for class fliter-selected)
        // remove 
        document.querySelector('.filter-selected').classList.remove('filter-selected');
        // add new one 
        filterElement.classList.add("filter-selected");

        // remove all projects
        document.querySelector(".gallery").innerHTML = "";
        
        // add selected projects
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

        // adds element to the DOM
        const sectionGallery = document.querySelector(".gallery");
        sectionGallery.appendChild(ProjetElement);
        ProjetElement.appendChild(imageElement);
        ProjetElement.appendChild(nomElement);
    });
}



 /********
 * 
 *   click on go-back in Modal
 * 
 * 
 ********/

 function switchToGallery(event){
    event.preventDefault();
    removeModal1Form();
    generateModal1Gallery();
}

function removeModal1Form(){
    console.log('remove view 2')
    document.getElementById("modal-file-box-id").remove();
    document.getElementById("modal-form-id").remove();
}




/***********************************
 * 
 * creates Modal
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


    document.getElementById("go-back-id").addEventListener("click", switchToGallery );

    // add listener to body to close modal only when modal is visible
    document.body.addEventListener('click', closeModal);

    // add listener to close modal when clicking on X upper right
    document.getElementById("close-id").addEventListener("click", function(event) {
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
    if( event.target.id == "modale-1" )
    {
        console.log('Modal closed')
        document.getElementById("modale-1").remove();
        document.body.removeEventListener('click', closeModal);   
    }
};



/************************************
 * 
 * generates Modal's Gallery
 * show/hides elements and updates texts
 * 
 ***********************************/

function generateModal1Gallery() {
    console.log('create view 1')

    // hides go back button
    document.getElementById("go-back-id").classList.add("hidden");
    // change title's name
    document.getElementById('modal-title').textContent = "Galerie photo";

    //creates Gallery
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

    // adds line
    const modalLine1Element = document.createElement("div");
    modalLine1Element.id = "modal-line-id";
    modalLine1Element.classList.add("modal-line");
    // adds button
    const modalButtonElement = document.createElement("button");
    modalButtonElement.id = "btn-val";
    modalButtonElement.textContent = "Ajouter une photo";
    modalButtonElement.classList.add("modal-button");    

    modalWrapperElement.appendChild(modalLine1Element);
    modalWrapperElement.appendChild(modalButtonElement);

    // switch to view 2 (removes the gallery and shows the form)
    document.getElementById("btn-val").addEventListener("click", switchToForm );
}




/************************************
 * 
 * removes project in backend API when clicking on dustbin
 * show/hides elements and updates texts
 * 
 ***********************************/

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
            document.getElementById("fig_mod_img_"+projectId).remove();
        }
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });

    fetch(`http://localhost:5678/api/works/`)
    .then(response => {
        if (!response.ok) {
            // déclenche le catch error
            throw new Error('Erreur lors de la requête');
        }
        else{
            
            response.json().then(data => {
             projets = data;
            // all children are removed
            document.getElementById("gallery-id").innerHTML= "";
            genererProjets(data);
            });
        }
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });


}


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





 /********
 * 
 *   click on add Picture in Modal
 * 
 * 
 ********/

function switchToForm(event){
    removeModal1Gallery();
    generateModal1Form();
}

function removeModal1Gallery(){
    //console.log('remove view 1');

    document.getElementById("btn-val").removeEventListener("click", switchToForm);
    document.getElementById("modal-gallery-id").remove();
    document.getElementById("modal-line-id").remove();
    document.getElementById("btn-val").remove();
}


/************************************
 * 
 * generates Modal's Form
 * show/hides elements and updates texts
 * 
 ***********************************/


function generateModal1Form(){
    //console.log('create view 2');
    //shows go-back button
    document.getElementById("go-back-id").classList.remove("hidden");
    //change title 
    document.getElementById('modal-title').textContent = "Ajout photo";

    // creates add file content
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

    modalFileBoxElement.appendChild(modalFileBoxContElement);
    modalFileBoxContElement.appendChild(modalFileBoxImgElement);
    modalFileBoxContElement.appendChild(modalFileBoxButtonElement);
    modalFileBoxContElement.appendChild(modalFileBoxTitreElement);


    // creates form
    const modalFormElement = document.createElement("form");
    Object.assign(modalFormElement, {
        action: '#',
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
     });
    

    const modalLabelCategorieElement = document.createElement("label");
    modalLabelCategorieElement.for = "categorie";
    modalLabelCategorieElement.innerHTML = "catégorie";

    const modalSelectCategorieElement = document.createElement("select");
    modalSelectCategorieElement.name = "category";
    modalSelectCategorieElement.id = "categorie";

    
    let i = 0;
    for (const category of categorySet.values()){
        const optionElement = document.createElement("option");
        optionElement.innerText = ( i == 0 ) ? "" : category;
        optionElement.value = i;
        modalSelectCategorieElement.appendChild(optionElement);
        i ++;
    }

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
    


/************************************************
 * 
 * check if all 3 fileds are valid in order to make submit possible
 * 
 ***********************************************/

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


/**************************
 * 
 *   load image in fileBox
 *   add listener to all fields
 *
 **************************/
    
    document.getElementById('btn-add').addEventListener('click', function(event) {
        event.preventDefault(); 
        //event.stopPropagation();
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
            // reads image file content and displays it
            const reader = new FileReader();
            reader.readAsDataURL(file);
          
            reader.onload = function(event) {
            const imgElement = document.createElement('img');
            //binary data of the picture
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
        event.preventDefault();
        const formData = new FormData(event.target); //the element form
        //console.log(event.target);
        console.log('formData entries');
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        
        formData.set("title", formData.get("title").trim());

        addNewProject(formData);
    });
}


function addNewProject(formData){
    const token =  sessionStorage.getItem("token"); 
   
    const requestOptions = {
        method: 'POST',
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${token}`,
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
            console.log('project '+formData.get("title").trim()+ ' added');

            fetch(`http://localhost:5678/api/works/`)
            .then(response => {
                if (!response.ok) {
                    // déclenche le catch error
                    throw new Error('Erreur lors de la requête');
                }
                else{
                    response.json().then(data => {
                    projets = data;
                    // all children are removed
                    document.getElementById("gallery-id").innerHTML= "";
                    genererProjets(data);
                    document.getElementById('go-back-id').click();
                    });
                }
            })
            .catch(error => {
                console.error('Une erreur s\'est produite:', error);
            });
        }
    })
    .catch(error => {
        console.error('Une erreur s\'est produite:', error);
    });
}


document.getElementById("btn-sendmail").addEventListener("click", sendMail );

function sendMail(event){
    event.preventDefault();

    if( verifierChamp(nom) && verifierChamp(email) && verifierChamp(message)) {
        console.log('Envoi Email')
    }
};

/********************************
 *  check if empty
 *  specific regex check on email 
 ********************************/

function verifierChamp(champ) {
    // Si le champ est vide, on envoie une alerte
    if (champ.value.trim() === "") {
        alert(`Le champ ${champ.name} est vide`);
        return false;
    }

    if (champ.type === "email")
    {
        let regex_email = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+");
        let resultat = regex_email.test(champ.value);
        if( resultat === false){
            alert(`Le champ ${champ.name} n'est pas valide`);
            return false;
        }
    }
    return true;
}

genererPage();


