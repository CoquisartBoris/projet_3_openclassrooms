// récupération des datas en json + 1ere génération des travaux
displayWorks(".gallery");

function displayWorks(containerSelector, filter) {
    getWorksData().then(data => {
        let withButtons = containerSelector === ".modal-content";
        let generatedWorks = generateWorks(data, filter, withButtons);
        renderWorks(generatedWorks, document.querySelector(containerSelector));

});
}

function getWorksData() {
    return fetch('http://localhost:5678/api/works')
    .then(res => {
        if(res.ok){
            return res.json();
            
        }
    }).catch(err => {
        console.log("ERREUR");
        document.getElementById('title').innerHTML = "Erreur :("
    })
}
// génération de tous les travaux
    function generateWorks(worksData, filterCategory, withButtons) {
        const workElements = []
        for (let workData of worksData) {
            if (workData.category.name != filterCategory && filterCategory != null) {
                continue;
            }
            const workElement = document.createElement("article")
            const nameWork = document.createElement("h3");
            const imgWork = document.createElement("img");
            

            nameWork.innerText = workData.title;
            imgWork.src = workData.imageUrl;
            

            workElement.appendChild(imgWork);
            workElement.appendChild(nameWork);
            

            if (withButtons) {
                //console.log(tok);
                nameWork.innerText = "éditer";
                const btnWork = document.createElement("button")
                const iconWork = document.createElement("i");
                iconWork.classList.add("fa-solid");
                iconWork.classList.add("fa-trash-can");
                btnWork.classList.add("modal-delete-btn");
                btnWork.addEventListener("click", function(e){
                    e.preventDefault();
                    fetch('http://localhost:5678/api/works/' + workData.id, { 
                        method: 'DELETE',
                        headers: {authorization: "Bearer " + tok}
                    }).then(function test(){
                        workElement.remove();
                    })
                    
                })
                workElement.appendChild(btnWork);
                btnWork.appendChild(iconWork);
            }

            workElements.push(workElement);
        }
        return workElements;
    }
    function renderWorks(elements, container) {
        container.innerHTML = "";
        for(let element of elements) {
            container.appendChild(element)
        }
    }

// ajout de l'évenement du bouton sur les travaux
    const btnsSort = document.querySelectorAll(".filtersElements");
    for (let btnSort of btnsSort) {
        btnSort.addEventListener("click", function (e) {
        displayWorks(".gallery", e.target.dataset.filter);
    });
}

// génération de l'en tete de mode éditeur si le token est ok
const tok = window.localStorage.getItem("token");
//console.log(tok);
if (tok != null) {
    const workElement = document.createElement("ul");
    const editorMode = document.createElement("li");
    const publishChanges = document.createElement("li");

    editorMode.innerText = "mode édition";
    publishChanges.innerText = "publier les changements";
    /*
    publishChanges.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(".modal")
        target.style.display = null;
        modal = target
        modal.addEventListener('click', closeModal)
        modal.querySelector('js-close-modal').addEventListener('click', closeModal)
        modal.querySelector('js-modal-stop').addEventListener('click', stopPropagation)
        
    })
*/
    workElement.appendChild(editorMode);
    workElement.appendChild(publishChanges);

    document.querySelector(".editorMode").appendChild(workElement);
}

let modal = null;

const openModal = function (e) {
    e.preventDefault()
    displayWorks(".modal-content");
    const target = document.querySelector(e.target.getAttribute('href'))
    //const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = null;
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    //console.log(target);
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-close-modal').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
    if(modal === null) return
    e.preventDefault()
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-close-modal').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null;
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

const stopPropagation = function (e) {
    e.stopPropagation()
}

document.querySelector('.modalAddPicture').addEventListener('click', generateModalAddPicture)

function generateModalAddPicture() {
    document.querySelector('.modalTitle').style.display = "none";
    document.querySelector('.modal-content').style.display = "none";
    document.querySelector('.modalStyleLine').style.display = "none";
    document.querySelector('.modalDeletePicture').style.display = "none";
    document.querySelector('.modalAddPicture').style.display = "none";
    document.querySelector('.modalStyleLine').style.display = "none";
    
    const addPict = document.createElement("article");
    const titleAddPict = document.createElement("p");
    const iconBlueStyle = document.createElement("div");
    const titleInputAddPict = document.createElement("p");
    const inputAddPict = document.createElement("input");
    const tittleCatAddPict = document.createElement("p");
    const inputCategory = createCategorySelect();
    const arrowIcon = document.createElement("i");
    const addPictIcon = document.createElement("i");
    const styleLine = document.createElement("div");
    const btnUpload = document.createElement("p");
    const btnAddPict = document.createElement("button");
    const maxFileWeight = document.createElement("p");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.setAttribute("accept", 'image/png, image/jpg, image/jpeg');
    fileInput.style.display = "none";

    arrowIcon.classList.add("fa-solid");
    arrowIcon.classList.add("fa-arrow-left");

    addPictIcon.classList.add("fa-sharp");
    addPictIcon.classList.add("fa-regular");
    addPictIcon.classList.add("fa-image");
    addPictIcon.classList.add("stylePictIcon");

    titleAddPict.classList.add("modalAddPictTitle");
    titleInputAddPict.classList.add("modalAddPictSubtitle");
    tittleCatAddPict.classList.add("modalAddPictSubtitle");
    inputAddPict.classList.add("inputModalStyle");
    inputCategory.classList.add("inputModalStyle");
    iconBlueStyle.classList.add("blueStyle");
    maxFileWeight.classList.add("fileWeight");
    btnUpload.classList.add("btnUploadStyle")

    styleLine.classList.add("styleLine");
    btnAddPict.classList.add("btnAddPictModal");

    arrowIcon.addEventListener("click", function(e) {
        e.preventDefault();
        addPict.style.display = "none";
        document.querySelector('.modalTitle').style.display = "flex";
        document.querySelector('.modal-content').style.display = "grid";
        document.querySelector('.modalStyleLine').style.display = "flex";
        document.querySelector('.modalDeletePicture').style.display = "flex";
        document.querySelector('.modalAddPicture').style.display = "flex";
        document.querySelector('.modalStyleLine').style.display = "flex";
    })

    btnUpload.addEventListener("click", function(e) {
        e.preventDefault();
        fileInput.click();
        //const imagePreview = document.createElement("img");
        //imagePreview.src = 
        //iconBlueStyle.appendChild(imagePreview);
        //maxFileWeight.style.display = "none";
        fileInput.addEventListener('change', previewFile);
    })

    btnAddPict.addEventListener("click", function() {
        createNewWork(fileInput, inputAddPict, inputCategory);
    })

    titleAddPict.innerText = "Ajout Photo";
    titleInputAddPict.innerText = "Titre";
    tittleCatAddPict.innerText = "catégorie";
    btnAddPict.innerText = "Valider";
    btnUpload.innerText = "+ Ajouter photo";
    maxFileWeight.innerText = "jpg, png : 4mo max";

    addPict.appendChild(arrowIcon);
    addPict.appendChild(titleAddPict);
    addPict.appendChild(iconBlueStyle);
    iconBlueStyle.appendChild(addPictIcon);
    iconBlueStyle.appendChild(fileInput);
    iconBlueStyle.appendChild(btnUpload);
    iconBlueStyle.appendChild(maxFileWeight);
    addPict.appendChild(titleInputAddPict);
    addPict.appendChild(inputAddPict);
    addPict.appendChild(tittleCatAddPict);
    addPict.appendChild(inputCategory);
    addPict.appendChild(styleLine);
    addPict.appendChild(btnAddPict);
    
    
    document.querySelector(".modal-wrapper").appendChild(addPict);
    
}

function createCategorySelect() {
    const inputCategory = document.createElement("select");
    getCategoryData().then(data => {
        for (let category of data) {
            const option = document.createElement("option");
            option.value = category.id;
            option.innerText = category.name;
            inputCategory.appendChild(option);
        }
    });
    return inputCategory;
}

function getCategoryData() {
    return fetch('http://localhost:5678/api/categories')
    .then(res => {
        if(res.ok){
            return res.json();
            
        }
    }).catch(err => {
        console.log("ERREUR");
        document.getElementById('title').innerHTML = "Erreur :("
    })
}

function createNewWork(fileInput, inputTitle, inputCategory) {
    var formData = new FormData();

    formData.append("id", 0);
    formData.append("image", fileInput.files[0]);
    formData.append("title", inputTitle.value);
    formData.append("category", inputCategory.value);
    formData.append("userId", 0);

    fetch('http://localhost:5678/api/works', {
        method: 'POST',
        body: formData
    })
    .then(console.log('success'))
}

/*
    fileElement.src = URL.createObjectURL(file);
*/

function previewFile() {
    //console.log(this.files[0].name);

    const file_extension_regex = /\.(jpg|png)$/i;

    if (this.files.length === 0 || !file_extension_regex.test(this.files[0].name)) {
        return;
    }

    const file = this.files[0];

    const filereader = new FileReader();

    filereader.readAsDataURL(file);
    filereader.addEventListener('load', (e) => displayImage(e, file));

}

function displayImage(event, file) {
    const imagePreview = document.createElement("img");
    imagePreview.src = event.target.result;
    document.querySelector('.blueStyle').appendChild(imagePreview);
}
