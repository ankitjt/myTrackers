const highSpentCount = document.querySelector(".highSpentCount")
const highSpentDetails = document.querySelector(".highSpentDetails")
const categoryHeads = document.querySelectorAll(".categoryHead")

const monthFilter = document.querySelector(".monthFilter")
const getMonth = userMonth => {
  const [ year, month ] = userMonth.split("-")
  const start = new Date(year, month - 1, 1)
  const end = new Date(year, month, 0, 23, 59, 59)
  return { start, end }
}

// Default Month Value
document.addEventListener("DOMContentLoaded", () => {
  const today = new Date()
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
  const { start, end } = getMonth(defaultDate)
  monthFilter.value = defaultDate
  expenseData(start, end)
})

monthFilter.addEventListener("change", () => {
  const { start, end } = getMonth(monthFilter.value)
  expenseData(start, end)
})

const expenseData = (start, end) => {
  let highAmount = []

  categoryHeads.forEach(category => {
    let tagCount = category.querySelector(".tagCount")
    let tagTotal = category.querySelector(".total")
    let itemName = category.querySelector(".itemName")
    let tag = itemName.dataset.field

    const dataQuery = db.collection(`myTrackers/expenses/${tag}`)
      .where("timeStamp", ">=", start)
      .where("timeStamp", "<=", end)
      .orderBy("timeStamp", "desc")

    dataQuery.onSnapshot(querySnapshot => {

      let total = 0
      let count = 0
      tagTotal.textContent = 0
      tagCount.textContent = 0

      querySnapshot.forEach(doc => {
        const data = doc.data()
        highAmount.push({ ...data, amount: Number(data.amount) })

        if (tag === data.tag) {
          total += Number(data.amount)
          count++
        }

      })

      if (highAmount.length === 0) {
        highSpentDetails.innerHTML = "No data found."
        highSpentCount.textContent = 0
        return
      }

      const top5Expenses = highAmount.sort((a, b) => b.amount - a.amount).slice(0, 5)
      highSpentDetails.innerHTML = ""
      top5Expenses.forEach(myData => {
        const spentDetails = document.createElement("div")
        spentDetails.classList.add("text-sm", "flex", "items-center", "justify-between", "bg-slate-200", "p-3", "rounded-lg")
        spentDetails.innerHTML = /* html */
          `<div class="flex flex-col">
              <div class="spentAmount flex items-center gap-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
                <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 7.5A.75.75 0 0 0 9 9h1.5c.98 0 1.813.626 2.122 1.5H9A.75.75 0 0 0 9 12h3.622a2.251 2.251 0 0 1-2.122 1.5H9a.75.75 0 0 0-.53 1.28l3 3a.75.75 0 1 0 1.06-1.06L10.8 14.988A3.752 3.752 0 0 0 14.175 12H15a.75.75 0 0 0 0-1.5h-.825A3.733 3.733 0 0 0 13.5 9H15a.75.75 0 0 0 0-1.5H9Z" clip-rule="evenodd" />
              </svg>

              <span>${myData.amount}</span> 
              </div>
              <div class="spentName">${myData.detail}</div>
            </div>
            <div class="flex flex-col text-xs">
              <span class="spentTime">${myData.timeStamp.toDate().toLocaleString() || "NA"}</span>
              <div class="spentTag uppercase text-right">
                <span class="w-4 itemIcon">${myData.icon}</span>
                <span class="itemName" data-field=${myData.tag}>${myData.tag}</span>
              </div>
            </div>
            `

        highSpentDetails.append(spentDetails)
        highSpentCount.textContent = top5Expenses.length
      })

      tagTotal.textContent = total
      tagCount.textContent = count
    })
  })

}

