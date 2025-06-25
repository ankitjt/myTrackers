const arrow = document.querySelectorAll(".arrow")
arrow.forEach(arrow => {
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
})