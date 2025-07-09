// Pagination State
let PAGE_SIZE = 5
let cursors = []
let lastVisibleDoc = 0
let currentPage = 0
let noMorePages = false

const categoryHead = document.querySelectorAll(".categoryHead")
const content = document.querySelector(".content")

categoryHead.forEach(category => {

  category.addEventListener("click", () => {

    // cursors = []
    // lastVisibleDoc = 0
    // currentPage = 0
    // noMorePages = false

    document.querySelectorAll(".showLogs").forEach(log => log.remove())
    content.classList.add("hidden")

    let tagCount = 0
    const categoryColor = category.dataset.color
    const tagName = category.querySelector(".tagName")
    const itemName = category.querySelector(".itemName")
    const tag = itemName.dataset.field

    db.collection(`myTrackers/expenses/${tag}`).get().then(snapshot => {
      tagCount = snapshot.size
    })

    const showLogs = document.createElement("div")
    showLogs.classList.add("showLogs", "fixed", "top-0", "left-0", "bg-white", "z-30", "h-[90vh]", "w-full", "overflow-x-hidden")

    const renderHeader = () => {
      showLogs.innerHTML = /* html */ `
        <div class="title sticky top-0 left-0 w-full bg-white z-20 p-6">
          <header class="flex items-center justify-between font-bold text-base">
            <span class="text-${categoryColor}">${tagName.outerHTML}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 closeLogs">
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" />
            </svg>
          </header>
    
          <h1 class="text-center mt-10 font-bold uppercase text-sm">
            <span>Logs -</span>
            (<span>${tagCount}</span>)
          </h1>
        </div>
      `
      closeLogs(showLogs)
    }

    document.body.appendChild(showLogs)

    const fetchLogs = (direction = "initial") => {
      let query = db.collection(`myTrackers/expenses/${tag}`).orderBy("timeStamp", "desc").limit(PAGE_SIZE)
      if (direction === "next" && lastVisibleDoc) query = query.startAfter(lastVisibleDoc)
      if (direction === "prev" && currentPage > 1) query = query.startAt(cursors[ currentPage - 2 ])

      query.get().then(querySnapshot => {
        const docs = querySnapshot.docs
        noMorePages = docs.length < PAGE_SIZE

        renderHeader()

        if (!docs.length) {
          noMorePages = true
          renderPagination()
          return
        }

        lastVisibleDoc = docs[ docs.length - 1 ]
        const firstVisibleDoc = docs[ 0 ]

        if (direction !== "prev") {
          cursors[ currentPage ] = firstVisibleDoc
          currentPage++
        }
        else {
          currentPage--
        }

        renderLogs(docs)
        renderPagination()

      })

    }

    const renderLogs = docs => {

      // Clear only the old logDetails section, not the whole showLogs
      const oldLogDetails = showLogs.querySelector(".logDetailsWrapper")
      if (oldLogDetails) oldLogDetails.remove()

      const logDetailsWrapper = document.createElement("div")
      const logDetails = document.createElement("div")

      if (!docs.length) {
        logDetailsWrapper.classList.add("flex", "justify-center", "items-center", "h-[60vh]", "z-30")
        logDetailsWrapper.innerHTML = `
          <span class="text-lg font-bold text-slate-500">No Logs Found.</span>
        `
        showLogs.appendChild(logDetailsWrapper)
        return
      }

      docs.forEach(doc => {
        const data = doc.data()

        logDetailsWrapper.classList.add("logDetailsWrapper")
        logDetails.classList.add("logDetails", "mt-0", "w-full", "flex", "gap-y-6", "flex-col", "px-6")

        logDetails.innerHTML += /* html */ `
          <div class="logTitle flex flex-col overflow-hidden font-semibold text-base rounded-lg border border-slate-300" id="${doc.id}">
            <header class="flex items-center justify-between bg-[#333] p-3 text-white">
              <span>${data.detail || "NA"}</span>
              <span class="text-sm">${data.timeStamp.toDate().toLocaleString() || "NA"}</span>
            </header>
            <section class="flex items-center justify-between p-3">
              <div class="text-base flex items-center gap-x-1">
                <span>${data.amount || "NA"}</span>
              </div>
              <span class="deleteEntry">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class=" size-5 text-rose-600">
                  <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                </svg>
              </span>
            </section>
          </div>
        `
      })

      logDetailsWrapper.appendChild(logDetails)
      showLogs.appendChild(logDetailsWrapper)
      closeLogs(showLogs)
      deleteLogs()
    }

    const renderPagination = () => {
      // Remove previous pagination if exists
      const oldPagination = showLogs.querySelector(".pagination")
      if (oldPagination) oldPagination.remove()

      const pagination = document.createElement("div")
      pagination.classList.add("pagination", "flex", "justify-between", "items-center", "p-6", "pb-4", "fixed", "bottom-4.478v", "left-0", "w-full")

      pagination.innerHTML = `
        <button class="prevArrow text-sm font-bold uppercase ${currentPage <= 1 ? "text-slate-400" : ""}" ${currentPage <= 1 ? "disabled" : ""}>Prev</button>
        <button class="nextArrow text-sm font-bold uppercase ${noMorePages ? "text-slate-400" : ""}" ${noMorePages ? "disabled" : ""}>Next</button>
  `

      showLogs.appendChild(pagination)
    }

    // Listeners for navigation
    document.addEventListener("click", e => {
      if (e.target.closest(".nextArrow")) fetchLogs("next")
      if (e.target.closest(".prevArrow")) fetchLogs("prev")
    })

    fetchLogs()

  })
})

const closeLogs = (showLogs) => {
  const closeLogs = document.querySelector(".closeLogs")
  closeLogs?.addEventListener("click", () => {
    showLogs.innerHTML = ""
    showLogs.classList.add("hidden")
    content.classList.remove("hidden")
  })
}

const deleteLogs = () => {
  const logDetails = document.querySelector(".logDetails")
  logDetails?.addEventListener("click", e => {
    const deleteButton = e.target.closest(".deleteEntry")
    if (deleteButton) {
      const parent = deleteButton.closest(".logTitle")
      if (parent) {
        console.log(parent.getAttribute("id"))
      }
    }
  })
}
