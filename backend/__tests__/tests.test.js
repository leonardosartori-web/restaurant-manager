const {connect, disconnect} = require("../database");
const {token_signed} = require("./authentication");
const request = require("supertest");
const app = require("../app");
const server = request.agent(app);
const users = require("./routes/users.test");
const tables = require("./routes/tables.test");
const products = require("./routes/products.test");
const orders = require("./routes/orders.test");


beforeAll(async () => {
    connect();
});

jest.setTimeout(30000);

users(server, token_signed);
tables(server, token_signed);
products(server, token_signed);
orders(server, token_signed, "Water");

afterAll(async () => {
    disconnect();
});