const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require(`${__dirname}/../dao/models/user.model.js`);
const Cart = require(`${__dirname}/../dao/models/cart.model.js`);
const { hashPwd, isValidPwd } = require(`${__dirname}/../utils/hashing.js`)

const initializeStrategy = () => {
    passport.use('register', new Strategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { firstName, lastName, age } = req.body;

            try {
                const user = await User.findOne({ email: username });
                if (user) return done(null, false);

                const newCart = await Cart.create({ products: [] })
                const newUser = {
                    firstName,
                    lastName,
                    age: +age,
                    email: username,
                    password: hashPwd(password),
                    cart: newCart._id
                }

                const result = await User.create(newUser);
                done(null, result);

            } catch (error) {
                done(error);
            }
        }));

    passport.use('login', new Strategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            // Verifica que tenga los campos de user y pwd
            if (!username || !password) return done(null, false);

            // Verifica si existe un user con ese email
            const user = await User.findOne({ email: username });
            if (!user) return done(null, false);

            // Verifica la password
            if (!isValidPwd(password, user.password)) return done(null, false);

            // Envia el user ✔.
            done(null, user);
        } catch (error) {
            done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        return done(null, user._id);
    })
    passport.deserializeUser(async (id, done) => {
        const user = await User.findOne({ _id: id });
        return done(null, user);
    })
}

module.exports = initializeStrategy;