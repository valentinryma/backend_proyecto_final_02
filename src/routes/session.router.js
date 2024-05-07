const passport = require('passport');
const Router = require(`${__dirname}/router.js`);

const { PUBLIC, USER, ADMIN } = require(`${__dirname}/policies.constants.js`);

// JWT
// const { authenticateMddl, authorizateMddl } = require('./utils/passportMiddleware');
const { JWT_SECRET, generateToken } = require(`${__dirname}/../utils/jwt.js`);

class SessionRouter extends Router {
    init() {
        // --------> Extract Cookie
        this.get('/current', [PUBLIC], (req, res) => {
            // TODO: Extraer Cookie passport jwt y cookie extractor
            res.json(req.user);
        })

        // --------> LOCAL 
        this.post('/register', [PUBLIC], passport.authenticate('register', { failureRedirect: './failregister' }),
            async (req, res) => {
                res.redirect('/');
            })

        this.get('/failregister', [PUBLIC], (_, res) => {
            res.send('Register fail');
        })

        this.post('/login', [PUBLIC], passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin' }),
            async (req, res) => {

                const user = req.user;
                const credentials = { id: user._id.toString(), email: user.email, role: user.role } // => jwt_payload
                const accessToken = generateToken(credentials)
                res.cookie('accessToken', accessToken, { maxAge: 60 * 1000, httpOnly: true });

                // res.redirect('/');
                res.redirect('/');
            })

        this.get('/faillogin', [PUBLIC], (_, res) => {
            res.send('Login fail');
        })

        // --------> GITHUB
        this.get('/github', [PUBLIC], passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {
            res.redirect('/');
        });

        this.get('/githubcallback', [PUBLIC], passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
            res.redirect('/');
        });

        this.get('/logout', [PUBLIC], (req, res) => {
            req.session.destroy(_ => {
                res.redirect('/');
            })
        })

        // --------> Path Status 
        this.get('/status', (req, res) => {
            res.send('ok');
        })
    }
}

module.exports = SessionRouter;