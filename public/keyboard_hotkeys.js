const leftColumn = document.querySelector(`.left-column`)
const rightColumn = document.querySelector(`.right-column`)

// Ctrl + B
let hideSidebar = false
function toggleSidebar() {
    hideSidebar = !hideSidebar
}
document.addEventListener(`keydown`, (event) => {
    if (event.ctrlKey && event.key.toLowerCase() == `b`) {
        if (hideSidebar) {
            // console.log(`sidebar on`);
            leftColumn.classList.remove(`left-slide-out`)
            leftColumn.classList.add(`left-slide-in`)
            
            rightColumn.classList.remove(`right-slide-out`)
            rightColumn.classList.add(`right-slide-in`)
            toggleSidebar()
        } else {
            // console.log(`sidebar off`);
            leftColumn.classList.remove(`left-slide-in`)
            leftColumn.classList.add(`left-slide-out`)
            
            rightColumn.classList.remove(`right-slide-in`)
            rightColumn.classList.add(`right-slide-out`)
            toggleSidebar()
        }
    }
})
