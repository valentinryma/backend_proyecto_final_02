const Router = require(`${__dirname}/router.js`);
const User = require(`${__dirname}/../dao/models/user.model.js`);
const { PUBLIC, USER } = require(`${__dirname}/policies.constants.js`);
class ViewsRouter extends Router {
    init() {
        this.get('/', [PUBLIC], (req, res) => {
            let isLoggedIn = false;

            // Verifica si el user esta logueado.
            if (req.user) isLoggedIn = true;

            res.render('index', {
                title: 'Home',
                isLoggedIn,
                isNotLoggedIn: !isLoggedIn,
            })
        })

        this.get('/login', [PUBLIC], (req, res) => {
            res.render('login', {
                title: 'Login'
            })
        })

        this.get('/register', [PUBLIC], (req, res) => {
            res.render('register', {
                title: 'Register'
            })
        })

        this.get('/profile', [USER], async (req, res) => {
            const id = req.user.id
            const user = await User.findOne({ _id: id });

            res.render('profile', {
                title: 'My profile',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email
                }
            })
        })

        this.get('/products', [PUBLIC], async (req, res) => {
            const productManager = req.app.get('productManager');
            const results = await productManager.getProducts(req.query);
            res.render('products', {
                title: 'Pagina Principal',
                scripts: ['products.js'],
                styles: ['products.css'],
                results,
                cartId: req.user.cart.toString()
            })
        })

        this.get('/carts/', [USER], async (req, res) => {
            const cartManager = req.app.get('cartManager');

            const id = (req.user.cart.toString());
            const cart = await cartManager.getCartById(id);

            const calcTotal = (cart) => {
                let total = 0;
                for (const product of cart) {
                    total += product._id.price * product.quantity;
                }
                return total.toLocaleString()
            }

            const total = calcTotal(cart.products);
            res.render('cartId', {
                title: 'Cart Buy',
                scripts: ['carts.js'],
                styles: ['carts.css'],
                products: cart.products,
                total,
                cartId: id
            })
        })
    }
}

module.exports = ViewsRouter