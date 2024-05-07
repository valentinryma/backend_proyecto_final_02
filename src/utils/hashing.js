const bcrypt = require('bcrypt');

module.exports = {
    hashPwd: value => bcrypt.hashSync(value, bcrypt.genSaltSync(10)),
    isValidPwd: (pwd, hashedPwd) => bcrypt.compareSync(pwd, hashedPwd)
}