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

  let selectedTag = null
  if (isValid) {
    const loader = document.querySelector(".loader")

    loader.classList.remove("hidden")
    document.getElementsByTagName("body")[ 0 ].classList.add("overflow-hidden")

    formFields.forEach(field => {
      if (field.type === "text" || field.type === "number") {
        expenseData[ field.dataset.field ] = field.value.trim()
      }
      if (field.type !== "text" && field.type !== "number") {
        let parent = field.closest(".dropdownParent")
        let dropdownSelected = parent.querySelector(".dropdownSelected")
        let tag = parent.querySelector(".itemName")

        dropdownSelected.dataset.tag = tag.dataset.field.trim()
        selectedTag = dropdownSelected.dataset.tag
        let itemIcon = parent.querySelector(".itemIcon")
        expenseData[ "tag" ] = dropdownSelected.dataset.tag
        expenseData[ "icon" ] = itemIcon.innerHTML.trim()
        expenseData[ "severTimestamp" ] = firebase.firestore.FieldValue.serverTimestamp()
      }
    })


    db.collection(`myTrackers/expenses/${selectedTag}`).add(expenseData)
      .then(() => {
        alert("Expense Added.")
        formFields.forEach(field => {
          if (field.type === "text" || field.type === "number") {
            field.value = ""
          }
          if (field.type !== "text" && field.type !== "number") {
            field.textContent = "Tag"
          }
        })
      })
      .catch(err => alert(err.message))
      .finally(() => {
        loader.classList.add("hidden")
        document.getElementsByTagName("body")[ 0 ].classList.remove("overflow-hidden")
      })
  }
})

const categoryHead = document.querySelectorAll(".categoryHead")
const content = document.querySelector(".content")

categoryHead.forEach(category => {

  category.addEventListener("click", () => {
    content.classList.add("hidden")
    let tagCount = 0
    const categoryColor = category.dataset.color
    const tagName = category.querySelector(".tagName")
    const itemName = category.querySelector(".itemName")
    const tag = itemName.dataset.field


    const showLogs = document.createElement("div")
    showLogs.classList.add("showLogs", "fixed", "top-0", "left-0", "px-6", "bg-white", "z-30", "h-[90vh]", "w-full", "overflow-x-hidden", "py-12")

    db.collection(`myTrackers/expenses/${tag}`).get()
      .then((querySnapshot) => {
        tagCount += querySnapshot.size
        const logDetailsWrapper = document.createElement("div")
        const logDetails = document.createElement("div")
        logDetailsWrapper.classList.add("logDetailsWrapper")
        logDetails.classList.add("logDetails", "mt-10", "w-full", "flex", "gap-y-6", "flex-col")

        querySnapshot.forEach(doc => {
          let data = doc.data()

          logDetails.innerHTML += /* html */ `
            <div class="logTitle flex flex-col overflow-hidden font-semibold text-base rounded-lg border border-slate-300" id=${doc.id}>
              <header class="flex items-center justify-between bg-[#333] p-3 text-white">
                <span>${data.detail}</span>
                <span class="text-sm" >${data.severTimestamp.toDate().toLocaleString()}</span>
              </header>
              <section class="flex items-center justify-between p-3">
                  <div class="text-base flex items-center gap-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                      <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 7.5A.75.75 0 0 0 9 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 0 0 9 12h3.622a2.251 2.251 0 0 1-2.122 1.5H9a.75.75 0 0 0-.53 1.28l3 3a.75.75 0 1 0 1.06-1.06L10.8 14.988A3.752 3.752 0 0 0 14.175 12H15a.75.75 0 0 0 0-1.5h-.825A3.733 3.733 0 0 0 13.5 9H15a.75.75 0 0 0 0-1.5H9Z" clip-rule="evenodd" />
                    </svg>
                    <span>${data.amount}</span> 
                  </div>
                  <span class="deleteEntry">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class=" size-5 text-rose-600">
                  <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                </svg>
                  
                  </span>
              </section>
            </div>
      
          `

          logDetailsWrapper.append(logDetails)
          showLogs.innerHTML = /* html */ `
              <div class="title">
                <header class="flex items-center justify-between font-bold text-base">
                  <span class="text-${categoryColor}">${tagName.outerHTML}</span> 
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 closeLogs">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
                  </svg>
                </header>

                <h1 class="text-center mt-10 font-bold uppercase text-sm">
                  <span>Logs -</span>
                  <span>${tagCount}</span>
                </h1>
              </div>
            `
          showLogs.append(logDetailsWrapper)
          document.getElementsByTagName("body")[ 0 ].append(showLogs)
          closeLogs(showLogs)
        })
        deleteLogs()
      })
  })
})

const closeLogs = (showLogs) => {
  const closeLogs = document.querySelector(".closeLogs")
  closeLogs.addEventListener("click", () => {
    showLogs.innerHTML = ""
    showLogs.classList.add("hidden")
    content.classList.remove("hidden")
  })
}

const deleteLogs = () => {
  const logDetails = document.querySelector(".logDetails")
  logDetails.addEventListener("click", e => {
    const deleteButton = e.target.closest(".deleteEntry")
    if (deleteButton) {
      const parent = deleteButton.closest(".logTitle")
      if (parent) {
        console.log(parent.getAttribute("id"))
      }
    }
  })
}

const spentDetailsWrapper = document.querySelector(".spentDetailsWrapper")
const spentCount = document.querySelector(".spentCount")
let spentCountTag = 0
const updateAllCategory = (startOfMonth, endOfMonth) => {

  categoryHead.forEach(category => {

    let tagCount = category.querySelector(".tagCount")
    let tagTotal = category.querySelector(".total")
    let itemName = category.querySelector(".itemName")
    let tag = itemName.dataset.field


    db.collection(`myTrackers/expenses/${tag}`)
      .where("severTimestamp", ">=", startOfMonth)
      .where("severTimestamp", "<=", endOfMonth)
      .onSnapshot(querySnapshot => {
        let total = 0
        let count = 0

        querySnapshot.forEach(doc => {
          let data = doc.data()

          if (tag === data.tag) {
            total += Number(data.amount)
            count++
          }

          if (Number(data.amount) >= 1000) {
            spentCountTag++

            const spentDetails = document.createElement("div")
            spentDetails.classList.add("text-sm", "flex", "items-center", "justify-between", "bg-slate-200", "p-3", "rounded-lg")
            spentDetails.innerHTML = /* html */ `
              <div class="flex flex-col">
              <span class="spentAmount">${data.amount}</span>
              <span class="spentName">${data.detail}</span>
            </div>
            <div class="flex flex-col text-xs">
              <span class="spentTime">${data.severTimestamp.toDate().toLocaleString()}</span>
              <div class="spentTag uppercase text-right">
                <span class="w-4 itemIcon">${data.icon}</span>
                <span class="itemName" data-field=${data.tag}>${data.tag}</span>
              </div>
            </div>

            `
            spentDetailsWrapper.append(spentDetails)
          }
          spentCount.textContent = spentCountTag

        })
        tagTotal.textContent = total
        tagCount.textContent = count

      })

  })
}

const updateWithFilters = () => {
  let startOfMonth = null
  let endOfMonth = null

  const date = new Date()
  startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

  updateAllCategory(startOfMonth, endOfMonth)

  const monthFilter = document.querySelector(".monthFilter")
  monthFilter.addEventListener("change", () => {
    let input = monthFilter.value.split("-")
    let year = Number(input[ 0 ])
    let month = Number(input[ 1 ])
    startOfMonth = new Date(year, month - 1, 1);
    endOfMonth = new Date(year, month, 0, 23, 59, 59);
    updateAllCategory(startOfMonth, endOfMonth)
  })
}

updateWithFilters()