function response(done, next = () => {}) {
    return function (err, res) {
        if (err) return done(err);
        //console.log(res.body);
        next(res.body);
        done();
    }
}

function products(server, token){
    const p = {name: "Pizza", price: 8.90, kind: "Food"};

    describe('GET Products', () => {
        it('Get all products', (done) => {
            server.get('/products')
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done));
        })
    });


    let product_name;
    describe('POST Products', () => {
        it('Create new product', (done) => {
            server.post('/products')
                .auth(token, { type: 'bearer' })
                .send(p)
                .set('Accept', 'application/json')
                .expect(200)
                .end(response(done, (res) => {
                    product_name = res.name;
                }));
        })
    });

    describe('GET Products', () => {
        it('Get product', (done) => {
            server.get(`/products/${product_name}`)
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done));
        })
    });

    describe('PUT Products', () => {
        it('Put product', (done) => {
            const update = {price: 9.80};
            server.put(`/products/${product_name}`)
                .auth(token, { type: 'bearer' })
                .send(update)
                .set('Accept', 'application/json')
                .expect(200)
                .end(response(done));
        })
    });

    describe('DELETE Products', () => {
        it('Delete product', (done) => {
            server.delete(`/products/${product_name}`)
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done))
        })
    });

}

module.exports = products;