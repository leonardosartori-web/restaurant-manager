// @ts-nocheck
import {Functions} from "./functions";
import {user} from "./models/User";
import {convert_user_to_user_salt_digest} from "./utils";
import {product} from "./models/Product";
import {table} from "./models/Table";
import {statistic} from "./models/Statistic";


function populate_users() {
    let users = [
        {username: "Leonardo Sartori", email: "cashier@gmail.com", password: "abc", role: "Cashier"},
        {username: "Riccardo Cappellaro", email: "bartender@gmail.com", password: "abc", role: "Bartender"},
        {username: "Filippo Callegari", email: "cook@gmail.com", password: "abc", role: "Cook"},
        {username: "Angelo Pagotto", email: "waiter@gmail.com", password: "abc", role: "Waiter"}
    ];
    for (const u of users) {
        Functions.add(user, convert_user_to_user_salt_digest(u)).then(() => {
            Functions.add(statistic, {user_email: u.email}).then(() => {});
        })
    }
}

function populate_products() {
    let products = [
        {name: "Pizza margherita", price: 8.90, kind: "Food"},
        {name: "Spaghetti alla carbonara", price: 8.90, kind: "Food"},
        {name: "Coke", price: 3.50, kind: "Drink"},
        {name: "Water", price: 3.00, kind: "Drink"}
    ];
    for (const p of products) {
        Functions.add(product, p);
    }
}

function populate_tables() {
    let tables = [
        {seats: 4, num: 1},
        {seats: 6, num: 2},
        {seats: 4, num: 3},
        {seats: 8, num: 4},
        {seats: 8, num: 5}
    ]
    for (const t of tables) {
        Functions.add(table, t);
    }
}

function populates_orders() {

}

function populates() {
    populate_users();
    populate_products();
    populate_tables();
}

export {populates};