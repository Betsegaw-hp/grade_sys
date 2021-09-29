const form = document.getElementById("form")
const formWrapper = document.querySelector('.form-wrapper')
const result_display =  document.querySelector('.result-conatiner')
const submit_btn = document.getElementById("btn-submit")
const add_btn = document.getElementById("btn-add")
const rowCount = document.querySelector('.row-count')

form.addEventListener("submit", grade_analyzer)
add_btn.addEventListener("click", addForm)

function paint(Avg_point) {
    result_display.innerHTML = `
        <div class="result-display">
            <p>${ Avg_point }</p>
        </div>    
    `
}

function addForm() {
    const id = new Date().getTime().toString()

    const ele = document.createElement('div')
    let attr = document.createAttribute("data-id");
    attr.value = id;
    ele.setAttributeNode(attr);
    ele.classList.add('form-list')
    ele.innerHTML = `
        <input style="width: 4rem;" class="grade" type="number" placeholder="e.g. 90 " title="enter your grades" min=0 max=100 required>
        <input style="width: 4rem;" class="credit-hour" type="number" placeholder="credit hour" title="enter credit hour" min=0 max=100 required>
        <button class="btn-remove" type="button">remove</button><br>
    `
    formWrapper.appendChild(ele)


    const remove_btn = ele.querySelector('.btn-remove')
    remove_btn.addEventListener("click", removeForm)

    paint_row_num()
}

function paint_row_num() {
    const form_number = formWrapper.childElementCount;
    rowCount.innerHTML = `${form_number} rows`
}

function removeForm(e) {
    const ele = e.currentTarget.parentElement
    const id = ele.dataset.id

    formWrapper.removeChild(ele)
    paint_row_num()
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

    paint(result)

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