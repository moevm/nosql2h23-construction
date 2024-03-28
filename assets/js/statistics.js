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

        performNotification();

        setTimeout(function(){
            window.location.reload();
        }, 3000)

        // return response;
    }).catch((error) => {
        console.log(error)
    })
}

// Sample data for each month and quantity
const data = {
    January: 50,
    February: 25,
    March: 45,
    April: 95,
    May: 440,
    June: 10,
    July: 23,
    August: 100,
    September: 1500,
    October: 198,
    November: 45,
    December: 20
};



const persons = {
    'Christian' : 75,
    'Paul' : 25,
    'Andrey': 375,
    'Nikita': 1000
}


const months = Object.keys(data);
const quantities = Object.values(data);

console.log(months)
console.log(quantities)

const labels = new_data_ejs.map(item => item.label);
const dataArray = new_data_ejs.map(item => item.data);

console.log(labels)
console.log(dataArray)
console.log(data_ejs)

const color = '#2a2185';

const ctx  = document.getElementById('myChart').getContext('2d');
const ctx_ = document.getElementById('myDonut').getContext('2d');

const plot = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: months,
        datasets: [{
            data: data_ejs,
            backgroundColor: color,
            borderColor: color,
        }]
    },
    options: {
        responsive: true,
        legend: {
            display: false
        },
        
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});




const plot_ = new Chart(ctx_, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            label: 'Cement',
            data: dataArray,
        }]
    },
    options: {
        responsive: true,
        
        scales: {

            yAxes: [{
                ticks: {
                    display: false
                },
                gridLines: {
                    display: false
                }
            }]
        
            
        
        },

        plugins: {

            colorschemes: {
      
              scheme: 'brewer.SetOne3'
      
            }
      
          }
    }
});
