// TODO: Programar funcionalidad del boton comprar, envie ID para que se sume al carrito.
const buyBtn = document.querySelectorAll('.btn-buy');
for (const btn of buyBtn) {
    btn.addEventListener("click", function () {
        const product_id = this.id;
        console.log('Producto:', product_id, 'Agregado al carrito: {carrito id}')
    });
}