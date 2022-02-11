
//VARIABLES Y SELECTORES
const formulario = document.querySelector('#agregar-gasto');
const listadoGastos = document.querySelector('#gastos ul');


//EVENTOS
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);

}

//CLASES
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];

    }

    nuevosGastos(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {

        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;

    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
    }

}


class UI {

    insertarPresupuesto(cantidad) {
        // extraendo el valor
        const { presupuesto, restante } = cantidad;

        //insertar en el html
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }



    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //mensaje error
        divMensaje.textContent = mensaje;

        //insertar en el html

        document.querySelector('.primario').insertBefore(divMensaje, formulario)

        //quitar alerta despues 3 segundo

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);

    }


    mostrarGastos(gastos) {

        //elimina el html previo
        this.limpiarHTML();

        //iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombreGasto, id } = gasto;

            //crear un li
            const nuevosGasto = document.createElement('li');
            nuevosGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            //nuevosGasto.setAttrubute('data-id', id);
            nuevosGasto.dataset.id = id;


            //agregar en el html los gastos
            nuevosGasto.innerHTML = `
        ${nombreGasto}
         <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
        
        `;


            //boton para borrar los gastos
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.textContent = 'Borrar';

            btnBorrar.onclick = () => {
               eliminarGasto(id);

            };

            nuevosGasto.appendChild(btnBorrar);


            //agregar en el html
            listadoGastos.appendChild(nuevosGasto);

        });

    }


    limpiarHTML() {
        while (listadoGastos.firstChild) {
            listadoGastos.removeChild(listadoGastos.firstChild);
        }
    }

    actualizararRestante(restante) {
        document.querySelector('#restante').textContent = restante;

    }


    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        //comprobar 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');

        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //si el total es cero o menor

        if(restante <= 0){
            ui.imprimirAlerta('su presupuesto se ha agotado','error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }



}


//instanciar UI
const ui = new UI();

let presupuesto;





//FUNCIONES
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('cual es su presupuesto');

    //console.log(Number(presupuestoUsuario));

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    //presupruesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    //console.log(presupuesto);


    ui.insertarPresupuesto(presupuesto);

}


//agregar gastos

function agregarGasto(e) {
    e.preventDefault();

    const nombreGasto = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);


    //validar
    if (nombreGasto === '' || cantidad === '') {
        ui.imprimirAlerta('ambos campos son obligatorio', 'error');

        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {

        ui.imprimirAlerta('cantidad no valida', 'error');

        return;

    }


    //generando objeto con el gasto
    const gasto = { nombreGasto, cantidad, id: Date.now() }

    // agrega un nuevo gasto
    presupuesto.nuevosGastos(gasto);

    ui.imprimirAlerta('gasto agregado correctamente');

    //imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizararRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reiniciar el formulario
    formulario.reset();


}



//eliminar gastos

function eliminarGasto(id){
    //elimina del objeto
    presupuesto.eliminarGasto(id);

    //elimina del html
    const { gastos,restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizararRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

}