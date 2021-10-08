const form = document.getElementById("form")
const formWrapper = document.querySelector('.form-wrapper')
const result_display =  document.querySelector('.result-wrapper')
const result_container =  document.querySelector('.result-conatiner')
const submit_btn = document.getElementById("btn-submit")
const add_btn = document.getElementById("btn-add")
const rowCount = document.querySelector('.row-count')
const prompt_btn = document.getElementById('install-prompt-btn')
const clearAll_btn = document.getElementById('btn-clear-all')

form.addEventListener("submit", grade_analyzer)
add_btn.addEventListener("click", addForm)
window.addEventListener('load', () => {
    addForm() 
    clearAll_btn_state()
    // setTheme()
})
clearAll_btn.addEventListener("click", clearAllForm)
//  install prompt api
let deferredPrompt 

window.addEventListener('beforeinstallprompt', (e) => {
    // prevent chrome <67
    e.preventDefault()
    deferredPrompt = e

    //  update UI 
    prompt_btn.style.display = 'block'
})

prompt_btn.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceRes => {
        if( choiceRes.outcome === 'accepted') {
            console.log('user accepted')
        }
        deferredPrompt = null
    })
})


function paint(Avg_point) {
    const colors = ['bg-dark', 'bg-success', 'bg-warning', 'bg-danger']
    colors.forEach(color  => result_container.classList.remove(color))

    if(Avg_point >= 3) {
        result_container.classList.add(colors[1])
        result_display.classList.add('text-white')
        paint_celebration()
    } else if(Avg_point >= 2 ) {
        result_container.classList.add(colors[2])
        result_display.classList.add('text-dark')
    } else {
        result_container.classList.add(colors[3])
        result_display.classList.add('text-white')
    }


    result_display.innerHTML = `
        <div class="result-display">
            <p class="h1 d-inline-block text-truncate" style="
            max-width: 150px;" >
            ${ Number.isInteger(Avg_point) ? Avg_point.toFixed(2) :Avg_point }</p>
        </div>    
    `
}


function paint_celebration() {
    const ele = document.createElement('div')
    ele.innerHTML = `
    <div class="confetti">
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
        <div class="confetti-piece"></div>
    </div>
    `
    document.body.appendChild(ele)
}

function addForm() {
    const id = new Date().getTime().toString()

    const ele = document.createElement('div')
    let attr = document.createAttribute("data-id");
    attr.value = id;
    ele.setAttributeNode(attr);
    ele.classList.add('form-list')
    ele.classList.add('input-group')
    ele.classList.add('mb-2')
    ele.innerHTML = `
  <input type="number" aria-label="First name" class="grade form-control" placeholder="e.g. 90 " title="enter your grades with two dp" min=0 max=100 step="0.01" required>
  <input type="number" aria-label="Last name" class="credit-hour form-control" placeholder="credit hour" title="enter credit hour with two dp" min=0 max=100 step="0.01" required>
  <button class="btn-remove btn btn-outline-danger rounded-end" type="button">remove</button><br>
    `
    formWrapper.appendChild(ele)


    const remove_btn = ele.querySelector('.btn-remove')
    remove_btn.addEventListener("click", removeForm)
    clearAll_btn_state()
    paint_row_num()
}

function paint_row_num() {
    const form_number = formWrapper.childElementCount;
    rowCount.innerHTML = `${form_number > 1 ? form_number + ' subjects': form_number+ ' subject' }`
}

function removeForm(e) {
    const ele = e.currentTarget.parentElement
    const id = ele.dataset.id

    formWrapper.removeChild(ele)
    clearAll_btn_state()
    paint_row_num()
}
function clearAllForm() {
    const form_number = formWrapper.childElementCount;

    if(form_number > 1 ) { 
        while (formWrapper.firstChild) {
            formWrapper.removeChild(formWrapper.firstChild);
        }
        clearAll_btn_state()
        return paint_row_num()
    }
}
function clearAll_btn_state() {
    const form_number = formWrapper.childElementCount;
    return form_number > 1  ?
            clearAll_btn.removeAttribute("disabled") :
            clearAll_btn.setAttribute("disabled", "")
}

function grade_analyzer(e) {
    e.preventDefault()
    const inputs = form.querySelectorAll('input')
    const grade_list = []
    const credit_hours = []

    if(inputs.length == 0) {
        return alert('nothing to work with. \n use "Add" button to start')
    }

    inputs.forEach((input, i )=> {
        if( input.classList.contains('grade')) {
            input = JSON.parse(input.value)
            const grade = grading_sys(input)
            const credit_hour = JSON.parse(inputs[i+1].value)
            const grade_credit = grade * credit_hour
            grade_list.push(grade_credit)
            credit_hours.push(credit_hour)
        }
    })
    console.log(grade_list)

    const grade_sum = grade_list.reduce((p,c) => {
        return p + c
    },0)

    const credit_hour_sum = credit_hours.reduce((p, c) => {
        return p + c
    }, 0)
    const result = grade_sum / credit_hour_sum

    paint(result ? result : 0)

}

function grading_sys(point) {
    let grade = undefined
    let grade_letter = ''

        if (point >= 90 ) {
            grade = 4.00
            grade_letter = 'A+'
            }
        else if(point >= 85){
            grade = 4.00
            grade_letter = 'A'
            }
        else if( point >= 80 ){
            grade = 3.75
            grade_letter = 'A-'
            }

        else if (point >= 75 ){
            grade = 3.50
            grade_letter = 'B+'
            }
        else if (point >= 70 ){
            grade = 3.00
            grade_letter = 'B'
            }
        else if (point >= 65 ){
            grade = 2.75
            grade_letter = 'B-'
         }
        else if (point >= 60) {
            grade = 2.50
            grade_letter = 'C+'
          }
        else if( point >= 50 ){
            grade = 2.00
            grade_letter = 'C'
           }
        else if (point >= 45 ){
            grade = 1.75
            grade_letter = 'C-'
            }
        else if (point >= 40 ){
            grade = 1.00
            grade_letter = 'D'
            }
        else if( point >= 0 ){
            grade = 0.00
            grade_letter = 'F'
            }
        else
            alert(`invalid input: '${point}'`)
           
    return grade
}

//  THEME

// function setTheme() {
//     const isThemeExist = localStorage.getItem("Theme")
    
//     if(isThemeExist) {

//     } else {
//         localStorage.setItem("Theme", "light")
//     }
// }