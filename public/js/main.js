const remindAll = document.getElementById('remindAll')
remindAll.addEventListener('click', confirmSent)

function confirmSent() {
  document.getElementById('confirmation').classList.toggle('hidden')
}

// // const checkedBox = document.querySelectorAll('.checkBox')
// const clientMailbox = document.querySelectorAll('.clientMailbox')


// // Array.from(checkBox).forEach((el) => {
// //   if (clientMailbox)
// //   el.addEventListener('click', markChecked)
// // })

// async function markChecked() {
//   const mailboxId = this.parentNode.dataset.mailboxId
//   try {
//     const 
//   } catch (err) {
//     console.error(err)
//   }
// }