function response(done, next = () => {}) {
    return function (err, res) {
        if (err) return done(err);
        //console.log(res.body);
        next(res.body);
        done();
    }
}

function orders(server, token, product_name) {
    let p;
    describe('GET Products', () => {
        it('Get product', (done) => {
            server.get(`/products/${product_name}`)
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done, (res) => {
                    p = res;
                }));
        })
    });

    describe('GET Orders', () => {
        it('Get all orders', (done) => {
            server.get('/orders')
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done));
        })
    });

    let id;
    describe('POST Orders', () => {
        it('Create new order', (done) => {
            server.post('/orders')
                .auth(token, { type: 'bearer' })
                .send({table: 1, productionTime: new Date(), products: [p, p]})
                .set('Accept', 'application/json')
                .expect(200)
                .end(response(done, (res) => {
                    id = res.id;
                }));
        })
    });

    let o;
    describe('GET Order', () => {
        it('Get order', (done) => {
            server.get(`/orders/${id}`)
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done, (res) => {
                    o = res;
                }));
        })
    })


    describe('PUT Orders', () => {
        it('Put order', (done) => {
            const update = {products: [p]};
            server.put(`/orders/${id}`)
                .auth(token, { type: 'bearer' })
                .send(update)
                .set('Accept', 'application/json')
                .expect(200)
                .end(response(done));
        })
    });

    describe('PUT Orders', () => {
        it('Update specific product\'s order', (done) => {
            const update = {status: "processing", operator: "Me"};
            server.put(`/orders/${id}/products/${o.products[1].product_id}`)
                .auth(token, { type: 'bearer' })
                .send(update)
                .set('Accept', 'application/json')
                .expect(200)
                .end(response(done));
        })
    });


    describe('DELETE Orders', () => {
        it('Delete order', (done) => {
            server.delete(`/orders/${id}`)
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done))
        })
    });

}

module.exports = orders;