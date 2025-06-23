const arrow = document.querySelector(".arrow")
arrow.addEventListener("click", () => {
  const parent = arrow.closest(".dropdownParent")
  const dropdownSelected = parent.querySelector(".dropdownSelected")
  const dropdownList = parent.querySelector(".dropdownList")
  const dropdownItem = parent.querySelectorAll(".dropdownItem")

  arrow.classList.toggle("rotate-180")
  dropdownList.classList.toggle("hidden")

  dropdownItem.forEach(item => {
    item.addEventListener("click", () => {
      dropdownSelected.innerHTML = item.innerHTML
      dropdownList.classList.add("hidden")
      arrow.classList.remove("rotate-180")
    })
  })

})

const addExpenseButton = document.querySelector(".addExpenseButton")
const formFields = document.querySelectorAll(".formField")
addExpenseButton.addEventListener("click", () => {
  let isValid = true
  let expenseData = {}

  formFields.forEach(field => {
    let parent = field.closest(".dropdownParent")
    field.classList.remove("border", "border-rose-600")
    parent?.classList.remove("border", "border-rose-600")
  })


  formFields.forEach(field => {

    if (field.type === "text" || field.type === "number") {
      if (field.value === "") {
        field.classList.add("border", "border-rose-600")
        isValid = false
      }
    }
    if (field.type !== "text" && field.type !== "number") {
      if (field.textContent === "Tag") {
        let parent = field.closest(".dropdownParent")
        parent.classList.add("border", "border-rose-600")
        isValid = false
      }
    }
  })

  if (isValid) {
    formFields.forEach(field => {
      if (field.type === "text" || field.type === "number") {
        expenseData[ field.dataset.field ] = field.value.trim()
      }
      if (field.type !== "text" && field.type !== "number") {
        let parent = field.closest(".dropdownParent")
        let dropdownSelected = parent.querySelector(".dropdownSelected")
        let tag = parent.querySelector(".itemName")

        dropdownSelected.dataset.tag = tag.dataset.field
        let itemIcon = parent.querySelector(".itemIcon")
        expenseData[ "tag" ] = tag.dataset.field
        expenseData[ "icon" ] = itemIcon.innerHTML.trim()
      }
    })
    console.log(expenseData)
    formFields.forEach(field => {
      if (field.type === "text" || field.type === "number") {
        field.value = ""
      }
      if (field.type !== "text" && field.type !== "number") {
        field.textContent = "Tag"
      }
    })
  }
})