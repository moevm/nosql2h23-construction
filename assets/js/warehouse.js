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
        window.location.replace('/warehouse');
        toastEl.classList.remove('active');
        progressEl.classList.remove('active');
    }, 3000);
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