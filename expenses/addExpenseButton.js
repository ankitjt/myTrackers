const addExpenseButton = document.querySelector(".addExpenseButton")
const formFields = document.querySelectorAll(".formField")

addExpenseButton.addEventListener("click", () => {

  let isValid = true
  let expenseData = {}
  let selectedTag = null
  const errorStyles = [ "border", "border-rose-600" ]
  const loader = document.querySelector(".loader")
  document.body.classList.remove("overflow-hidden")

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

  if (isValid) {
    loader.classList.remove("hidden")
    document.body.classList.add("overflow-hidden")

    formFields.forEach(field => {
      const parent = field.closest(".dropdownParent")
      if ([ "text", "number" ].includes(field.type)) {
        expenseData[ field.dataset.field ] = field.value.trim()
      }
      else {
        const selected = parent.querySelector(".dropdownSelected")
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
        alert("Expense Added.")
        formFields.forEach(field => {
          if ([ "text", "number" ].includes(field.type)) {
            field.value = ""
          }
          else {
            field.textContent = "Tag"
          }
        })
      })
      .catch(err => alert(err.message))
      .finally(() => {
        loader.classList.add("hidden")
        document.body.classList.remove("overflow-hidden")
      })
  }
})