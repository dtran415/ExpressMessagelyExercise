const jwt = require("jsonwebtoken")
const { SECRET_KEY } = require("../config")
const ExpressError = require("../expressError")
const User = require("../models/user")
const Router = require("express").Router
const router = new Router()

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body
        if (!username || !password)
            throw new ExpressError("Please supply username and password", 400)

        if (await User.authenticate(username, password)) {
            const token = jwt.sign({ username }, SECRET_KEY)
            User.updateLoginTimestamp(username)
            return res.json({ token })
        } else {
            throw new ExpressError("Invalid username/password", 400)
        }
    } catch (e) {
        return next(e)
    }
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async function (req, res, next) {
    try {
        const {username, password, first_name, last_name, phone} = req.body
        if (!username || !password)
            throw new ExpressError("Please supply username and password", 400)

        await User.register({username, password, first_name, last_name, phone})
        const token = jwt.sign({username}, SECRET_KEY)
        User.updateLoginTimestamp(username)
        return res.json({token})
    } catch (e) {
        return next(e)
    }
})

module.exports = router