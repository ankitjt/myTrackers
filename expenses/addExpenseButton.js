const addExpenseButton = document.querySelector(".addExpenseButton")
const formFields = document.querySelectorAll(".formField")
const onLoad = document.querySelector(".onLoad")
const sendingData = document.querySelector(".sendingData")
const confirmation = document.querySelector(".confirmation")
const error = document.querySelector(".error")

const show = section => {
  [ onLoad, sendingData, confirmation, error ].forEach(div => {
    div.classList.add("opacity-0", "pointer-events-none")
    div.classList.remove("opacity-100")
  })
  section.classList.add("opacity-100")
  section.classList.remove("opacity-0", "pointer-events-none")
}

addExpenseButton.addEventListener("click", () => {

  show(sendingData)
  let isValid = true
  let expenseData = {}
  let selectedTag = null
  const errorStyles = [ "border", "border-rose-600" ]

  // Reset Error styles
  formFields.forEach(field => {
    let parent = field.closest(".dropdownParent")
    field.classList.remove(...errorStyles)
    parent?.classList.remove(...errorStyles)
  })

  // Validation checks.
  formFields.forEach(field => {
    const parent = field.closest(".dropdownParent")
    if ([ "text", "number" ].includes(field.type)) {
      if (!field.value.trim()) {
        field.classList.add(...errorStyles)
        isValid = false
      }
    }
    else {
      const selected = parent?.querySelector(".dropdownSelected")
      if (!selected || selected.textContent === "Tag") {
        parent?.classList.add(...errorStyles)
        isValid = false
      }
    }
  })

  if (!isValid) {
    show(error)
    setTimeout(() => show(onLoad), 2000)
    return
  }

  if (isValid) {

    formFields.forEach(field => {
      const parent = field.closest(".dropdownParent")
      if ([ "text", "number" ].includes(field.type)) {
        expenseData[ field.dataset.field ] = field.value.trim()
      }
      else {
        const tag = parent.querySelector(".itemName")
        const icon = parent.querySelector(".itemIcon")
        selectedTag = tag.dataset.field.trim()
        expenseData.tag = selectedTag
        expenseData.icon = icon?.innerHTML.trim()
        expenseData.timeStamp = firebase.firestore.FieldValue.serverTimestamp()
      }
    })

    db.collection(`myTrackers/expenses/${selectedTag}`).add(expenseData)
      .then(() => {
        show(confirmation)
        setTimeout(() => show(onLoad), 2000)
        formFields.forEach(field => {
          if ([ "text", "number" ].includes(field.type)) {
            field.value = ""
          }
          else {
            field.textContent = "Tag"
          }
        })
      })
      .catch(err => {
        alert(err.message)
        show(failed)
      })
  }
})