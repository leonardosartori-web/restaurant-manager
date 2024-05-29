function response(done, next = () => {}) {
    return function (err, res) {
        if (err) return done(err);
        console.log(res.body);
        next(res.body);
        done();
    }
}

function tables(server, token){
    const t = {seats: 4, num: 10000000000};

    describe('GET Tables', () => {
        it('Get all tables', (done) => {
            server.get('/tables')
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done));
        })
    });


    let id;
    describe('POST Tables', () => {
        it('Create new table', (done) => {
            server.post('/tables')
                .auth(token, { type: 'bearer' })
                .send(t)
                .set('Accept', 'application/json')
                .expect(200)
                .end(response(done, (res) => {
                    id = res.num;
                }));
        })
    });

    describe('PUT Tables', () => {
        it('Put table', (done) => {
            const update = {isOccupied: true};
            server.put(`/tables/${id}`)
                .auth(token, { type: 'bearer' })
                .send(update)
                .set('Accept', 'application/json')
                .expect(200)
                .end(response(done, (res) => {
                    id = res.num;
                }));
        })
    });

    describe('DELETE Tables', () => {
        it('Delete table', (done) => {
            server.delete(`/tables/${id}`)
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done))
        })
    });

}

module.exports = tables;
