const highSpentCount = document.querySelector(".highSpentCount")
const highSpentDetails = document.querySelector(".highSpentDetails")
const categoryHeads = document.querySelectorAll(".categoryHead")
let dataArr = []

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
  highExpenseData(start, end)
  showTotal(start, end)
})

monthFilter.addEventListener("change", () => {
  const { start, end } = getMonth(monthFilter.value)
  highExpenseData(start, end)
})

const highExpenseData = (start, end) => {
  let highAmount = []

  categoryHeads.forEach(category => {
    let itemName = category.querySelector(".itemName")
    let tag = itemName.dataset.field

    const dataQuery = db.collection(`myTrackers/expenses/${tag}`)
      .where("timeStamp", ">=", start)
      .where("timeStamp", "<=", end)
      .orderBy("timeStamp", "desc")

    dataQuery.onSnapshot(querySnapshot => {

      querySnapshot.forEach(doc => {
        const data = doc.data()
        highAmount.push({ ...data, amount: Number(data.amount) })
      })

      if (highAmount.length === 0) {
        highSpentDetails.innerHTML = "No data found."
        highSpentCount.textContent = 0
        return
      }

      highSpentDetails.innerHTML = ""
      const top5Expenses = highAmount.sort((a, b) => b.amount - a.amount).slice(0, 5)
      top5Expenses.forEach(myData => {
        const spentDetails = document.createElement("div")
        spentDetails.classList.add("text-sm", "flex", "items-center", "justify-between", "bg-slate-200", "p-3", "rounded-lg")
        spentDetails.innerHTML = /* html */
          `<div class="flex flex-col">
            <span class="spentAmount">${myData.amount}</span>
            <span class="spentName">${myData.detail}</span>
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
    })
  })
}

const showTotal = (start, end) => {
  const dataQuery = db.collection(`myTrackers/expenses/${tag}`)
    .where("timeStamp", ">=", start)
    .where("timeStamp", "<=", end)
    .orderBy("timeStamp", "desc")

  dataQuery.onSnapshot(querySnapshot => {
    const total = 0
    const count = 0
    querySnapshot.forEach(doc => {
      let data = doc.data()

    })
  })
}

