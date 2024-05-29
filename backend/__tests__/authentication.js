const jsonwebtoken = require('jsonwebtoken');
const result = require('dotenv').config();

const user = {
    username: "Leonardo Sartori",
    role: "Cashier",
    email: "cashier@gmail.com",
    id: "65424fc0f1bce619d423de08"
}

let token_signed = jsonwebtoken.sign(user, process.env.JWT_SECRET, { expiresIn: '8h' } );
module.exports = {token_signed};