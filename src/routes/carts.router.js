const Router = require(`${__dirname}/router.js`);
const { PUBLIC, USER } = require(`${__dirname}/policies.constants.js`);
class CartsRouter extends Router {
    init() {
        // Instancia del CartManager
        const getManager = (req) => {
            return req.app.get('cartManager');
        }

        // Retorna todos los carritos
        this.get('/', [PUBLIC], async (req, res) => {
            const cartManager = getManager(req);
            try {
                const carts = await cartManager.getCart();
                res.json(carts);

            } catch (error) {
                console.error(error);
                return res.status(400).json({ success: false });
            }
        });

        // Retorna un carrito por ID
        this.get('/:id', [PUBLIC], async (req, res) => {
            const cartManager = getManager(req);

            try {
                const cart = await cartManager.getCartById(req.params.id);
                res.json(cart);
            } catch (error) {
                console.error(error);
                return res.status(400).json({ success: false, error: error.message });
            }
        });

        // Crea un carrito vacio
        this.post('/', [PUBLIC], async (req, res) => {
            const cartManager = getManager(req);

            try {
                const cart = await cartManager.addCart();
                res.json(cart);
            } catch (error) {
                console.error(error)
                return res.status(400).json({ success: false });
            }
        });

        // Agrega un producto a un carrito existente.
        this.post('/:cid/product/:pid', [PUBLIC], async (req, res) => {
            const cartManager = getManager(req);

            const cid = req.params.cid;
            const pid = req.params.pid;
            const quantity = req.body.quantity;

            try {
                const cart = await cartManager.addProductCart(cid, { pid, quantity });
                if (cart.error) {
                    res.status(404).json({ success: false, error: cart.error });
                }

                res.json({ success: true });
            } catch (error) {
                return res.status(400).json({ success: false, error: error.message });
            }
        })

        // Elimina un producto de un carrito
        this.delete('/:cid/product/:pid', [PUBLIC], async (req, res) => {
            const cartManager = getManager(req);
            const cid = req.params.cid;
            const pid = req.params.pid;

            try {
                const cart = await cartManager.deleteProductCart(cid, pid);

                if (cart.error) {
                    res.status(404).json({ success: false, error: cart.error });
                }

                res.json({ success: true });
            } catch (error) {
                return res.status(400).json({ success: false, error: error.message });
            }
        })

        // Actualiza un carrito con un array de productos (_id, quantity)
        this.put('/:cid', [PUBLIC], async (req, res) => {
            const cartManager = getManager(req);
            const cid = req.params.cid;
            const productsArray = req.body;

            try {
                const cart = await cartManager.updateCartProductArray(cid, productsArray);
                res.json({ success: true });
            } catch (error) {
                return res.status(400).json({ success: false, error: error.message });
            }
        })

        // Actualiza el Quantity de un producto en un carrito existente.
        this.put('/:cid/carts/:pid', [PUBLIC], async (req, res) => {
            const cartManager = getManager(req);
            const cid = req.params.cid;

            const product = { pid: req.params.pid, quantity: req.body.quantity }
            try {
                const cartUpdate = await cartManager.updateCartProductQuantity(cid, product)
                res.json({ success: true });
            } catch (error) {
                return res.status(400).json({ success: false, error: error.message });
            }
        })

        // Limpia el Carrito (products = [])
        this.delete('/:id', [PUBLIC], async (req, res) => {
            const cartManager = getManager(req);
            try {
                const cart = await cartManager.clearCart(req.params.id);
                res.json({ success: true });
            } catch (error) {
                return res.status(400).json({ success: false, error: error.message });
            }
        })
    }
}

module.exports = CartsRouter;