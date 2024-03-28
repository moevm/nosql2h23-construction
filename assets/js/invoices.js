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

function returnInvoiceType(){
    let bool = document.querySelector('div .btn_new_mat').style.visibility == 'hidden'; 
    return bool; 
}

function incrementValue(span, max){
    const row = span.closest('div')
    const number = row.querySelector('.num')

    console.log(returnInvoiceType())
    if(returnInvoiceType()){
        number.innerText = (parseInt(number.innerText) + 1) > max ? max : (parseInt(number.innerText) + 1);
    }else{
        number.innerText = parseInt(number.innerText) + 1;
    }
    
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


function performNewMaterialNotification(){
    document.querySelector('.toast .toast_content .message #title').innerHTML = "Success !";
    document.querySelector('.toast .toast_content .message #message').innerHTML = "The new material is successfully saved into the database";
    document.querySelector('.toast .toast_content i').innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
    document.querySelector('.toast').style.borderLeft = "6px solid green";
    document.querySelector('.toast_content .check').style.background = "green";
    document.head.appendChild(document.createElement("style")).innerHTML = '.toast .progress:before {content: ""; position: absolute;bottom: 0; right: 0;  height: 100%; width: 100%; background: green;}';
    
    window.scrollTo(0, 0);
    
    toastEl.classList.add('active');
    progressEl.classList.add('active');

    setTimeout(function(){
        window.location.replace('/invoices');
        toastEl.classList.remove('active')
        progressEl.classList.remove('active')
    }, 3000);

}

function CreateNewMaterial(){

    console.log(modal)

    /* Collect data from elements in the modal */
    const name = document.querySelector('.modal_newmat #name');
    const type = document.querySelector('.modal_newmat #type');
    const unit = document.querySelector('.modal_newmat #unit');
    const description = document.querySelector('.modal_newmat #description');
    
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
    let other = tag.id === "enter" ? document.querySelector('.cardBox #exit') : document.querySelector('.cardBox #enter');


    if (other.className.includes("selected")){
        other.classList.toggle("selected");
    }
    
    tag.classList.toggle("selected");

    if(tag.id === "exit" && tag.className.includes("selected")){
        document.querySelector('div .btn_new_mat').style.visibility = 'hidden';
    }else{
        document.querySelector('div .btn_new_mat').style.visibility = 'visible';
    }
    
}


closeEl.addEventListener('click', ()=>{
    toastEl.classList.remove('active');
})

const modal = document.querySelector(".modal_newmat");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn_new_mat");
const closeModalBtn = document.querySelector(".modal_newmat .flex i");

// close modal function
const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
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


