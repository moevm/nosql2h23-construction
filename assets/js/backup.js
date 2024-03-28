let list = document.querySelectorAll(".navigation li")

function activeLink(){
    list.forEach(item=>{
        item.classList.remove("hovered");
    });
    this.classList.add("hovered");
}

list.forEach((item) => item.addEventListener("mouseover", activeLink))

// Menu Toggle
let toggle = document.querySelector(".toggle");
let navigation = document.querySelector(".navigation");
let main = document.querySelector(".main")

toggle.onclick = function(){
    navigation.classList.toggle("active")
    main.classList.toggle("active")
}

function incrementValue(span){
    const row = span.closest('div')
    const number = row.querySelector('.num')
    number.innerText = parseInt(number.innerText) + 1;
}

function decrementValue(span){
    const row = span.closest('div')
    const number = row.querySelector('.num')
    number.innerText = (parseInt(number.innerText) - 1) >= 0 ? (parseInt(number.innerText) - 1) : 0;
}

const btnEl = document.querySelector('button');
const toastEl = document.querySelector('.toast');
const closeEl = document.querySelector('.close');
const progressEl = document.querySelector('.progress');

const btnCreateMaterial = document.querySelector('div .button_create_material')





function countValues(){
    let i = 0
    let array = []
    let num = document.querySelector(`.wrapper_${i} .num`);
    let wrapper = document.querySelector(`.wrapper_${i}`);

    while(num != null){
        if(num.innerHTML != 0){
            array.push({material_id: wrapper.id, quantity: Number(num.innerHTML)})
        }
        i++;
        num = document.querySelector(`.wrapper_${i} .num`);
        wrapper = document.querySelector(`.wrapper_${i}`);
    }
    console.log(array)
    return array
}

function performNotification(){
    window.scrollTo(0, 0);
    
    toastEl.classList.add('active');
    progressEl.classList.add('active');

    setTimeout(function(){
        toastEl.classList.remove('active')
        progressEl.classList.remove('active')
    }, 3000);
}


function cleanTable(){
    /* Write the code to clean the table after doing our choices to make the table clean for second use */
}

function changeClassStyle(){
    console.log("null");
}


function performBackupNotification(notif){
    document.querySelector('.toast .toast_content .message #title').innerHTML = "Success !";
    document.querySelector('.toast .toast_content .message #message').innerHTML = (notif == 1) ? "The data was successfully imported into the database." : "The data was successfully exported into the json.";
    document.querySelector('.toast .toast_content i').innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
    document.querySelector('.toast').style.borderLeft = "6px solid green";
    document.querySelector('.toast_content .check').style.background = "green";
    document.head.appendChild(document.createElement("style")).innerHTML = '.toast .progress:before {content: ""; position: absolute;bottom: 0; right: 0;  height: 100%; width: 100%; background: green;}';
    
    window.scrollTo(0, 0);
    
    toastEl.classList.add('active');
    progressEl.classList.add('active');

    setTimeout(function(){
        window.location.replace('/backup');
        toastEl.classList.remove('active')
        progressEl.classList.remove('active')
    }, 3000);

}

function CreateNewMaterial(){

    /* Collect data from elements in the modal */
    const name = document.querySelector('.modal #name');
    const type = document.querySelector('.modal #type');
    const unit = document.querySelector('.modal #unit');
    const description = document.querySelector('.modal #description');
    
    if(name.validity.valid){
        console.log("ta mere")
    }

    console.log("show this text in the client side\n", name.value, type.value, unit.value, description.value);
}



function postInvoices() {
    
    let data = countValues();
    let flag = !document.querySelector('.cardBox #exit').className.includes("selected") && !document.querySelector('.cardBox #enter').className.includes("selected");


    console.log(data.length);


    if(flag){
        document.querySelector('.toast .toast_content .message #title').innerHTML = "Error !";
        document.querySelector('.toast .toast_content .message #message').innerHTML = "Select the invoice type before pressing the button to save it.";
        performNotification()
    }

    else if (data.length === 0){
        console.log("Empty");
        console.log(document.querySelector('.toast .toast_content .message #title'))

        document.querySelector('.toast .toast_content .message #title').innerHTML = "Error !";
        document.querySelector('.toast .toast_content .message #message').innerHTML = "Select at least one material to validate the invoice.";
        performNotification()

    }
    
    
    else{

        document.querySelector('.toast .toast_content .message #title').innerHTML = "Done !";
        document.querySelector('.toast .toast_content .message #message').innerHTML = "The invoice has been successfully added to the database";
        document.querySelector('.toast .toast_content i').innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';


        /* Part for changing style to positive toast notification */
      
        document.querySelector('.toast').style.borderLeft = "6px solid green";
        document.querySelector('.toast_content .check').style.background = "green";
        document.head.appendChild(document.createElement("style")).innerHTML = '.toast .progress:before {content: ""; position: absolute;bottom: 0; right: 0;  height: 100%; width: 100%; background: green;}';
    
        let bool = document.querySelector('div .btn_new_mat').style.visibility == 'hidden';

        let new_data = {
            type: bool ? "Exit" : "Enter",
            creation: "31.01.2024",
            author: "Christian",
            contain: data
        }
    
        fetch("/invoices", {
            method: 'POST',
            body: JSON.stringify(new_data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if(!response.ok){
                throw new Error("HTTP error" + response.status);
            }
    
            performNotification();
            setTimeout(() => { window.location.reload();}, 3500);
    
            // return response;
        }).catch((error) => {
            console.log(error)
        })
    }


}

function action(tag){

    const ImportImage = `<img width="100" height="100" src="https://img.icons8.com/ios-filled/100/database-import.png" alt="database-import"/>`
    const ExportImage = `<img width="100" height="100" src="https://img.icons8.com/ios-filled/100/database-export.png" alt="database-export"/>`
    
    
    const ImportModalHTML = `
    <input type="file" name="fileUpload" style="text-align: center; justify-content: center;" accept = ".json" required/>
    <div class="container_modal_btn">
        <button type = "submit" class="btn-modal-submit">Import</button>
    </div>` 

    const ExportModalHTML = `<h4 style = "margin-bottom: 15px;">Name</h4>
    <input type="text" name="output" placeholder="Give a name to the material" required="true" autocomplete="off" value = "output.json" />
    <div class="container_modal_btn">
        <button type = "submit" class="btn-modal-submit">Export</button>
    </div>`

    const ImportTitleHTML = `<h3>Import data</h3><p>Choose the file (.json) to import into the database. Make sure that your file is located in the backup folder</p>`
    const ExportTitleHTML = `<h3>Export data</h3><p>Write the name of the json file to generate (.json). The file will be located in the folder « backup »</p>`
    
    console.log(document.querySelector('.modal_container form'))


    document.querySelector('.modal_container form').innerHTML = (tag.id === "enter") ? ImportModalHTML: ExportModalHTML;
    document.querySelector('.modal_container section .title').innerHTML = (tag.id === "enter") ? ImportTitleHTML: ExportTitleHTML;
    document.querySelector('.modal .flex-logo').innerHTML = (tag.id === "enter") ? ImportImage: ExportImage;
    
    if(tag.id === "exit"){
        document.querySelector('.modal form').classList.add('export');
        document.querySelector('.modal_container form').setAttribute("action", "/export");

    }else{
        document.querySelector('.modal form').classList.remove('export');
        document.querySelector('.modal_container form').setAttribute("action", "/import");
    }
    
    
    openModal();
    

    
    let other = tag.id === "enter" ? document.querySelector('.cardBox #exit') : document.querySelector('.cardBox #enter');


    if (other.className.includes("selected")){
        other.classList.toggle("selected");
    }
    
    tag.classList.toggle("selected");
    
}


closeEl.addEventListener('click', ()=>{
    toastEl.classList.remove('active');
})

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn_new_mat");
const closeModalBtn = document.querySelector(".modal .flex i");

// close modal function
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);


// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// open modal function
const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};
// open modal event

// open modal event
openModalBtn.addEventListener("click", openModal);


document.querySelector('.cardBox #enter').addEventListener("click", openModal);
document.querySelector('.cardBox #exit').addEventListener("click", openModal);