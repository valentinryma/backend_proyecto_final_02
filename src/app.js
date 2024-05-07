// Dependencias
const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');

// Handlebars Config.
const app = express()

// Passport Config.
const initializeStrategyGitHub = require(`${__dirname}/config/passport-github.config.js`);
const initializeStrategyLocal = require(`${__dirname}/config/passport-local.config.js`);
const initializeStrategyJWT = require(`${__dirname}/config/passport-jwt.config.js`);

// Session
const sessionMiddleware = require(`${__dirname}/session/mongoStorage.js`);

// Managers
const ProductManager = require(`${__dirname}/dao/controllers/productManager.js`)
const CartManager = require(`${__dirname}/dao/controllers/cartManager.js`)

// Routers
const TestRouter = require(`${__dirname}/routes/test.router.js`);
const testRouter = new TestRouter();

const SessionsRouter = require(`${__dirname}/routes/session.router.js`);
const sessionsRouter = new SessionsRouter();

const ViewsRouter = require(`${__dirname}/routes/views.router.js`);
const viewsRouter = new ViewsRouter();

const ProductsRouter = require(`${__dirname}/routes/products.router.js`);
const productsRouter = new ProductsRouter();

const CartsRouter = require(`${__dirname}/routes/carts.router.js`);
const cartsRouter = new CartsRouter();

// Handlebars Config.
app.engine('handlebars', handlebars.engine())
app.set('views', `${__dirname}/views`)
app.set('view engine', 'handlebars')

// Express Config.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public
app.use(express.static(`${__dirname}/../public`));

// Mongo Session 
app.use(sessionMiddleware);

// Passport - Strategys
initializeStrategyGitHub();
initializeStrategyLocal();
initializeStrategyJWT();

app.use(passport.initialize())
app.use(passport.session())


// Endpoints
app.use('/', viewsRouter.getRouter());
app.use('/test/', testRouter.getRouter());
app.use('/api/sessions', sessionsRouter.getRouter());
app.use('/api/products', productsRouter.getRouter());
app.use('/api/carts', cartsRouter.getRouter());

const main = async () => {
    // Conexion DB
    const { mongoUrl, dbName } = require(`${__dirname}/dbConfig.js`);
    await mongoose.connect(mongoUrl, { dbName })

    // Instancias Managers
    const productManager = new ProductManager();
    const cartManager = new CartManager();

    // Verifica que se haya conectado correctamente
    await productManager.prepare();
    await cartManager.prepare();

    // Instancias de los Managers en req.app.get(Manager)
    app.set('productManager', productManager);
    app.set('cartManager', cartManager);

    // HTTP Server on.
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Sever on http://localhost:${PORT}/`);
    });
};

main();


