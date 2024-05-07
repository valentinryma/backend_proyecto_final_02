const passport = require('passport');
const { Strategy } = require('passport-github2');

const User = require(`${__dirname}/../dao/models/user.model.js`);
const Cart = require(`${__dirname}/../dao/models/cart.model.js`);
const { clientID, clientSecret, callbackURL } = require(`${__dirname}/github.private.js`);

const initializeStrategy = () => {
    passport.use('github', new Strategy({
        clientID,
        clientSecret,
        callbackURL
    },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                // Verifica si ya existe el user
                const user = await User.findOne({ email: profile._json.email });
                if (user) return done(null, user);

                // Si no existe, crea el user.
                const fullName = profile._json.name;
                const firstName = fullName.substring(0, fullName.lastIndexOf(' '));
                const lastName = fullName.substring(fullName.lastIndexOf(' ') + 1);

                const newCart = await Cart.create({ products: [] })
                const newUser = {
                    firstName,
                    lastName,
                    age: +0, // El usuario deberá actualizar el dato...
                    email: profile._json.email,
                    // password: '', // Inicio session con GitHub, sin Password
                    cart: newCart._id
                }

                const result = await User.create(newUser);
                return done(null, result);
            } catch (error) {
                console.log(error);
                return done(error);
            }
        }));

    passport.serializeUser((user, done) => {
        return done(null, user._id);
    })
    passport.deserializeUser(async (id, done) => {
        const user = await User.findOne({ _id: id });
        return done(null, user);
    })
}

module.exports = initializeStrategy;