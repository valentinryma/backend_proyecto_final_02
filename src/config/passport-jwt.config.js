const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require(`${__dirname}/../utils/jwt.js`);

// Extraemos el JWT desde la cookie 'accesToken'
const cookieExtractor = req => req && req.cookies ? req.cookies['accessToken'] : null;

const initializeStrategy = () => {
    // JWT
    passport.use('jwt', new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            // en jwt_payload.user viene de 'credentials' en el router login.
            const user = jwt_payload.user
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    // Serialize
    // passport.serializeUser((user, done) => {
    //     return done(null, user._id);
    // })

    // // Deserialize
    // passport.deserializeUser(async (id, done) => {
    //     try {
    //         const user = await User.findOne({ _id: id });
    //         return done(null, user)
    //     } catch (error) {
    //         return done(error);
    //     }
    // })
}
module.exports = initializeStrategy;