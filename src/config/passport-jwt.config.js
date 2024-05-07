const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { JWT_SECRET } = require(`${__dirname}/../utils/jwt.js`);

const cookieExtractor = req => req && req.cookies ? req.cookies['accessToken'] : null;
const initializeStrategy = () => {
    passport.use('jwt', new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            console.log('jwt_payload', jwt_payload);
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));
    passport.serializeUser((user, done) => {
        return done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findOne({ _id: id });
            return done(null, user)
        } catch (error) {
            return done(error);
        }
    })
}
module.exports = initializeStrategy;