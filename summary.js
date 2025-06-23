const expandCategoryLogs = document.querySelectorAll(".expandCategoryLogs")

expandCategoryLogs.forEach(log => {
  log.addEventListener("click", () => {
    const parent = log.closest(".categoryHead")
    const category = parent.querySelector(".itemName")
    const categoryName = category.dataset.field.trim()
    console.log(categoryName)
    let parentContainer = document.createElement("div")
    parentContainer.classList.add("fixed", "top-0", "left-0", "h-screen", "w-full", "overflow-x-hidden", "overflow-y-auto", "hideScroller", "bg-white", "p-6", "z-30")
    let content = document.querySelector(".content")
    content.classList.add("overflow-hidden")
    parentContainer.innerHTML = /* html */ `
      <div>
        <header class="uppercase font-bold text-center">
          Logs - ${categoryName}
        </header>
      </div>
    `
    document.getElementsByTagName("body")[ 0 ].append(parentContainer)

  })
})