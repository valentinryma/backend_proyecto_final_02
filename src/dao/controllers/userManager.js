const User = require(`${__dirname}/../models/user.model.js`);
const CartModel = require(`${__dirname}/../models/cart.model.js`)
class UserManager {
    constructor() { }

    async prepare() {
        if (User.db.readyState != 1) {
            throw new Error('Must be connect to DB!')
        }
    }

    async getUsers() {
        const users = await User.find();
        return users.map(u => u.toObject());
    }

    async addCartUser(uid, cid) {
        console.log('Add cart In User')
        try {
            const user = await User.findOne({ _id: uid })
            if (!user) throw new Error('User not found');

            const cart = await CartModel.findOne({ _id: cid });
            if (!cart) throw new Error('User not found');

            const userUpdate = await User.updateOne({ _id: uid }, {
                $set: { cart: uid }
            })
            return userUpdate
        } catch (error) {
            console.log(error);
            return { error: error.message }
        }
    }
}

module.exports = UserManager;