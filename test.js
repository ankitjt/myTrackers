const button = document.querySelector(".button")
const onLoad = document.querySelector(".onLoad")
const sendingData = document.querySelector(".sendingData")
const confirmation = document.querySelector(".confirmation")

const show = section => {
  [ onLoad, sendingData, confirmation ].forEach(div => {
    div.classList.add("opacity-0", "pointer-events-none")
    div.classList.remove("opacity-100")
  })
  section.classList.add("opacity-100")
  section.classList.remove("opacity-0", "pointer-events-none")
}

button.addEventListener("click", () => {
  show(sendingData)
  setTimeout(() => show(confirmation), 5000)
  setTimeout(() => show(onLoad), 7000)
})

const animateWavers = () => {

  const balls = document.querySelectorAll(".balls")
  let forwards = true

  setInterval(() => {
    const ballsArr = Array.from(balls)
    const flowOrder = forwards ? ballsArr : ballsArr.reverse()
    flowOrder.forEach((ball, i) => {
      setTimeout(() => {
        ball.classList.toggle("h-16")
        ball.classList.toggle("h-4")
      }, i * 150)
    })
    forwards = !forwards
  }, 150 * balls.length + 300)

}

animateWavers()

const arrowMovers = () => {
  const uploadArrow = document.querySelector(".uploadArrow")
  const uploadButton = document.querySelector(".uploadButton")
  const btnText = document.querySelector(".btnText")
  const successArrow = document.querySelector(".successArrow")

  uploadButton.addEventListener("click", () => {
    uploadArrow.classList.add("animate-bounce")
    btnText.textContent = "Uploading data..."
    setTimeout(() => {
      successArrow.classList.remove("hidden")
      uploadArrow.classList.remove("animate-bounce")
      uploadArrow.classList.add("hidden")
      btnText.textContent = "Data uploaded."
    }, 3000)
    setTimeout(() => {
      uploadArrow.classList.remove("animate-bounce")
      uploadArrow.classList.remove("hidden")
      successArrow.classList.add("hidden")
      btnText.textContent = "Upload Data"
    }, 6000)
  })
}

arrowMovers()
