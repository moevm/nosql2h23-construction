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

function incrementValue(span, max){
    const row = span.closest('div')
    const number = row.querySelector('.num')
    number.innerText = (parseInt(number.innerText) + 1) >= max ? max : ((parseInt(number.innerText) + 1));
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


function countValues(){
    let i = 0
    let array = {}
    let num = document.querySelector(`.wrapper_${i} .num`);
    let wrapper = document.querySelector(`.wrapper_${i}`);

    while(num != null){
        if(num.innerHTML != 0){
            array[wrapper.id] = Number(num.innerHTML)
        }
        i++;
        num = document.querySelector(`.wrapper_${i} .num`);
        wrapper = document.querySelector(`.wrapper_${i}`);
    }
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

function postMaterials() {
    
    let data = countValues();

    if(Object.keys(data).length == 0){
        document.querySelector('.toast .toast_content i').innerHTML = '<ion-icon name="warning-outline"></ion-icon>';
        document.querySelector('.toast .toast_content .message #title').innerHTML = "Error !";
        document.querySelector('.toast .toast_content .message #message').innerHTML = "Select at least one material to use.";

        performNotification();


    }else{
        fetch("/useMaterials", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            if(!response.ok){
                throw new Error("HTTP error" + response.status);
            }

            /* Part for changing style to positive toast notification */
            document.querySelector('.toast').style.borderLeft = "6px solid green";
            document.querySelector('.toast_content .check').style.background = "green";
            document.querySelector('.toast .toast_content i').innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';

            document.querySelector('.toast .toast_content .message #title').innerHTML = "Success !";
            document.querySelector('.toast .toast_content .message #message').innerHTML = "Your data has been saved in our database.";
            document.head.appendChild(document.createElement("style")).innerHTML = '.toast .progress:before {content: ""; position: absolute;bottom: 0; right: 0;  height: 100%; width: 100%; background: green;}';

    
            performNotification();
    
            setTimeout(function(){
                window.location.reload();
            }, 3500)
    
            // return response;
        }).catch((error) => {
            console.log(error)
        })
    }
}


setTimeout(function(){
    toastEl.classList.remove('active')
}, 3000);

closeEl.addEventListener('click', ()=>{
    toastEl.classList.remove('active');
})