// Definimos funciones globales para guardar datos//

let clickboton = document.querySelectorAll('.button')
let tbody = document.querySelector('.tbody')
let carrito = []

clickboton.forEach(btn => {
  btn.addEventListener('click', addCarritoServicio)
})

// Definimos funcion para sumar el carrito //

function addCarritoServicio(a) {
  let button = a.target
  let item = button.closest('.card')
  let servicio = item.querySelector('.card-title').textContent;
  let servicioPrecio = item.querySelector('.precio').textContent;
  let servicioImg = item.querySelector('.card-img-top').src;

  const newServicio = {
    title: servicio,
    precio: servicioPrecio,
    img: servicioImg,
    cantidad: 1
  }

  addServicioCarrito(newServicio)
}

// Definimos funcion para sumar los servicios al carrito // 

function addServicioCarrito(newServicio) {

  const alert = document.querySelector('.alert')

  setTimeout(function () {
    alert.classList.add('hide')
  }, 2000)
  alert.classList.remove('hide')

  let InputElemento = tbody.getElementsByClassName('input__elemento')
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === newServicio.title.trim()) {
      carrito[i].cantidad++;
      const inputValue = InputElemento[i]
      inputValue.value++;
      carritoTotal()
      return null;
    }
  }

  carrito.push(newServicio)

  rendercarrito()

  Swal.fire({
    title: 'Servicio añadido a carrito!',
    text: 'Haz click en el boton!',
    icon: 'success',
    confirmButtonText: 'Aceptar'
    // Encadena la promesa para saber lo que pasó en la ventana modal
  }).then(resp => {
    if (resp.isConfirmed) {
      // El usuario hizo clic en el botón aceptar
    } else {
      // El usuario cerró la ventana sin hacer clic en el botón aceptar
    }
  });;
}

function rendercarrito() {
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
  carritoTotal()
}

// Definimos funcion donde mostramos el total de los servicios seleccionados // 

function carritoTotal() {
  let Total = 0;
  const servicioCartTotal = document.querySelector('.servicioCartTotal')
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("USD ", ''))
    Total = Total + precio * item.cantidad
  })

  servicioCartTotal.innerHTML = `Total USD ${Total}`
  addLocalStorage()
}

// Definimos funcion para remover productos del carrito // 

function removeItemCarrito(e) {
  let buttonDelete = e.target
  let tr = buttonDelete.closest(".ItemCarrito")
  let title = tr.querySelector('.title').textContent;

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
  carritoTotal()

  Swal.fire({
    title: 'Servicio removido de carrito!',
    text: 'Haz click en el boton!',
    icon: 'success',
    confirmButtonText: 'Aceptar'
    // Encadena la promesa para saber lo que pasó en la ventana modal
  }).then(resp => {
    if (resp.isConfirmed) {
      // El usuario hizo clic en el botón aceptar
    } else {
      // El usuario cerró la ventana sin hacer clic en el botón aceptar
    }
  });;
}



// Recorrer botones para asignar función
clickboton.forEach(btn => btn.addEventListener('click', comprar));
function sumaCantidad(e) {
  let sumaInput = e.target
  let tr = sumaInput.closest(".ItemCarrito")
  let title = tr.querySelector('.title').textContent;
  carrito.forEach(servicios => {
    if (servicios.title.trim() === title) {
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
      servicios.cantidad = sumaInput.value;
      carritoTotal()
    }
  })
}

function addLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function () {

  const storage = JSON.parse(localStorage.getItem('carrito')) || [];

}

// Funcionalidad de pago al botón de compra// 

const button = document.getElementById("comprar");
const metodosPago = [
  {
    supportedMethods: "https://bobbucks.dev/pay"
  },
  {
    supportedMethods: "https://google.com/pay",
    data: {
      environment: "TEST",
      apiVersion: 2,
      apiVersionMinor: 0,
      merchantInfo: {
        merchantId: '1234567890',
        merchantName: "Example Merchant"
      },
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: [
              "AMEX",
              "DISCOVER",
              "INTERAC",
              "JCB",
              "MASTERCARD",
              "MIR",
              "VISA"
            ]
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "example",
              gatewayMerchantId: "exampleGatewayMerchantId"
            }
          }
        }
      ]
    }
  }
];

const detallesPago = {
  id: "pago-001",
  displayItems: [
    {
      label: "Comprar este producto",
      amount: { currency: "USD", value: "10" }
    }
  ],
  total: {
    label: "Total",
    amount: { currency: "USD", value: "10" }
  }
};

const opcionesPago = {
  requestPayerName: true,
  requestPayerEmail: true,
  requestPayerPhone: true,
  requestShipping: true,
  shippingType: "shipping"
};

const solicitud = new PaymentRequest(
  metodosPago,
  detallesPago,
  opcionesPago
);

button.addEventListener("click", () => {
  solicitud.show().then((paymentResponse) => {
    console.log(paymentResponse);
    paymentResponse
      .complete("success")
      .then(() => {
        response.innerText = "Gracias por tu compra !";
      })
      .catch(function (error) {
        response.innerText = "Perdón, algo salió mal.";
      });
  });
});

