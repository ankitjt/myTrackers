const spentDetailsWrapper = document.querySelector(".spentDetailsWrapper")
const spentCount = document.querySelector(".spentCount")
const categoryHead = document.querySelectorAll(".categoryHead")
let unsubscribeFns = []

const updateAllCategory = (startOfMonth, endOfMonth) => {

  unsubscribeFns.forEach(unsub => unsub())
  unsubscribeFns = []

  let highExpenseCount = 0
  spentDetailsWrapper.innerHTML = ""

  categoryHead.forEach(category => {

    let tagCount = category.querySelector(".tagCount")
    let tagTotal = category.querySelector(".total")
    let itemName = category.querySelector(".itemName")
    let tag = itemName.dataset.field

    const unsubscribe = db.collection(`myTrackers/expenses/${tag}`).orderBy("timeStamp", "desc")
      .where("timeStamp", ">=", startOfMonth)
      .where("timeStamp", "<=", endOfMonth)
      .onSnapshot(querySnapshot => {
        let total = 0
        let count = 0


        querySnapshot.forEach(doc => {
          let data = doc.data()

          if (tag === data.tag) {
            total += Number(data.amount)
            count++
          }

          if (Number(data.amount) >= 1000 && highExpenseCount < 5) {
            highExpenseCount++

            const spentDetails = document.createElement("div")
            spentDetails.classList.add("text-sm", "flex", "items-center", "justify-between", "bg-slate-200", "p-3", "rounded-lg")
            spentDetails.innerHTML = /* html */ `
              <div class="flex flex-col">
              <span class="spentAmount">${data.amount}</span>
              <span class="spentName">${data.detail}</span>
            </div>
            <div class="flex flex-col text-xs">
              <span class="spentTime">${data.timeStamp.toDate().toLocaleString() || "NA"}</span>
              <div class="spentTag uppercase text-right">
                <span class="w-4 itemIcon">${data.icon}</span>
                <span class="itemName" data-field=${data.tag}>${data.tag}</span>
              </div>
            </div>

            `
            spentDetailsWrapper.append(spentDetails)
          }

        })
        spentCount.textContent = highExpenseCount
        tagTotal.textContent = total
        tagCount.textContent = count
      })

    unsubscribeFns.push(unsubscribe)

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