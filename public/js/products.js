// TODO: Programar funcionalidad del boton comprar, envie ID para que se sume al carrito.
const buyBtn = document.querySelectorAll('.btn-buy');
for (const btn of buyBtn) {
    btn.addEventListener("click", function () {
        const btnid = this.id;
        const productId = btnid.split('.')[0];
        const cartId = btnid.split('.')[1];
        addProductCart(cartId, productId);
    });
}

function addProductCart(cid, pid) {
    $.ajax(`/api/carts/${cid}/product/${pid}`, {
        dataType: 'json',
        method: 'POST',
        success: function () {
            console.log('Product add in cart')
        }
    })
}