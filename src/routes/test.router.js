const Router = require(`${__dirname}/router.js`);
const { PUBLIC, USER, ADMIN } = require(`${__dirname}/policies.constants.js`);
class TestRouter extends Router {
    init() {
        //* TEST USERS
        this.get('/all'/*, [PUBLIC]*/, (req, res) => {
            console.log(req.headers.authorization);
            res.sendSuccess({
                id: 100,
                email: 'test@gmail.com'
            })
        })

        this.get('/current', [USER], (req, res) => {
            res.sendSuccess({
                id: 100,
                email: 'test@gmail.com'
            })
        })

        this.get('/current', [ADMIN], (req, res) => {
            res.sendSuccess({
                id: 100,
                email: 'test@gmail.com'
            })
        }) // <------------------------------------------------------------- END Test User
    }
}

module.exports = TestRouter;