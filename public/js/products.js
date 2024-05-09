const buyBtn = document.querySelectorAll('.btn-buy');
const loginBtn = document.querySelectorAll('.btn-login');

// Agrega el producto al carrito
for (const btn of buyBtn) {
    btn.addEventListener("click", function () {
        const btnid = this.id;
        const productId = btnid.split('.')[0];
        const cartId = btnid.split('.')[1];
        addProductCart(cartId, productId);
    });
}

// Redireciona al panel de Login
for (const btn of loginBtn) {
    btn.addEventListener("click", function () {
        alert('You must log in first. \nRedirect...')
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

function stopDefAction(evt) {
    evt.preventDefault();
}