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





function postMaterials() {
    
    let data = countValues();

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

        console.log("We are entering in this condition")
        window.scrollTo(0, 0);
        toastEl.classList.add('active');
        progressEl.classList.add('active');

        setTimeout(function(){
            window.location.reload();
        }, 3000)

        // return response;
    }).catch((error) => {
        console.log(error)
    })
}


setTimeout(function(){
    toastEl.classList.remove('active')
}, 3000);

closeEl.addEventListener('click', ()=>{
    toastEl.classList.remove('active');
})


