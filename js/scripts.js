const Clickboton = document.querySelectorAll('.button')
const tbody = document.querySelector('.tbody')
let carrito = []

Clickboton.forEach(btn => {
  btn.addEventListener('click', addToCarritoItem)
})


function addToCarritoItem(a) {
  const button = a.target
  const item = button.closest('.card')
  const servicio = item.querySelector('.card-title').textContent;
  const servicioPrecio = item.querySelector('.precio').textContent;
  const servicioImg = item.querySelector('.card-img-top').src;

  const newServicio = {
    title: servicio,
    precio: servicioPrecio,
    img: servicioImg,
    cantidad: 1
  }

  addItemCarrito(newServicio)
}


function addItemCarrito(newServicio) {

  const alert = document.querySelector('.alert')

  setTimeout(function () {
    alert.classList.add('hide')
  }, 2000)
  alert.classList.remove('hide')

  const InputElemento = tbody.getElementsByClassName('input__elemento')
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === newServicio.title.trim()) {
      carrito[i].cantidad++;
      const inputValue = InputElemento[i]
      inputValue.value++;
      CarritoTotal()
      return null;
    }
  }

  carrito.push(newServicio)

  renderCarrito()
}


function renderCarrito() {
  tbody.innerHTML = ''
  carrito.map(servicio => {
    const tr = document.createElement('tr')
    tr.classList.add('ItemCarrito')
    const Content = `
    
    <th scope="row">1</th>
            <td class="table__productos">
              <img src=${servicio.img}  alt="">
              <h6 class="title">${servicio.title}</h6>
            </td>
            <td class="table__price"><p>${servicio.precio}</p></td>
            <td class="table__cantidad">
              <input type="number" min="1" value=${servicio.cantidad} class="input__elemento">
              <button class="delete btn btn-danger">x</button>
            </td>
    
    `
    tr.innerHTML = Content;
    tbody.append(tr)

    tr.querySelector(".delete").addEventListener('click', removeItemCarrito)
    tr.querySelector(".input__elemento").addEventListener('change', sumaCantidad)
  })
  CarritoTotal()
}

function CarritoTotal() {
  let Total = 0;
  const servicioCartTotal = document.querySelector('.itemCartTotal')
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("USD ", ''))
    Total = Total + precio * item.cantidad
  })

  servicioCartTotal.innerHTML = `Total $${Total}`
  addLocalStorage()
}

function removeItemCarrito(e) {
  const buttonDelete = e.target
  const tr = buttonDelete.closest(".ItemCarrito")
  const title = tr.querySelector('.title').textContent;
  for (let i = 0; i < carrito.length; i++) {

    if (carrito[i].title.trim() === title.trim()) {
      carrito.splice(i, 1)
    }
  }

  const alert = document.querySelector('.remove')

  setTimeout(function () {
    alert.classList.add('remove')
  }, 2000)
  alert.classList.remove('remove')

  tr.remove()
  CarritoTotal()
}

function sumaCantidad(e) {
  const sumaInput = e.target
  const tr = sumaInput.closest(".ItemCarrito")
  const title = tr.querySelector('.title').textContent;
  carrito.forEach(item => {
    if (item.title.trim() === title) {
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      CarritoTotal()
    }
  })
}

function addLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function () {
  const storage = JSON.parse(localStorage.getItem('carrito'));
  if (storage) {
    carrito = storage;
    renderCarrito()
  }
}