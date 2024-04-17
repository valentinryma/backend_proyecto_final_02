// TODO: Programar funcionalidad del boton eliminar, envie ID para que se elimine del carrito.

const removeBtn = document.querySelectorAll('.btn-remove');
const cid = document.getElementById('cid').innerText;
let pid = '';

// Obtenemos el ID del producto que queremos eliminar.
for (const btn of removeBtn) {
    btn.addEventListener("click", function () {
        pid = this.id;
        removeProductCart(cid, pid)
    });
}

function removeProductCart(cid, pid) {
    $.ajax(`/api/carts/${cid}/product/${pid}`, {
        dataType: 'json',
        method: 'DELETE',
        success: function () {
            // eliminar el elemento <li> con el user
            $(`#cart-item-${pid}`).remove()
        }
    })
}
