// Dependencias
const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose')
const app = express();

// Routes
const viewsRouter = require(`${__dirname}/routes/views.js`);
const productsRouter = require(`${__dirname}/routes/products.js`);
const cartsRouter = require(`${__dirname}/routes/carts.js`);

// Managers
const ProductManager = require(`${__dirname}/dao/controllers/productManager.js`)
const CartManager = require(`${__dirname}/dao/controllers/cartManager.js`)

// Public
app.use(express.static(`${__dirname}/../public`));

// Express Config.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars Config.
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

// Endpoints
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const main = async () => {
    // Conexion DB
    const connectStr = 'mongodb+srv://user:UMDpnTEXC4OoOtSq@cluster0.fl7yeip.mongodb.net/';
    const dbName = 'proyecto_final_rymaszewski';
    await mongoose.connect(connectStr, { dbName })

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
    const serverHTTP = app.listen(PORT, () => {
        console.log(`Sever on http://localhost:${PORT}/`);
    })

};

main();