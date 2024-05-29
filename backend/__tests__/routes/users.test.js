function response(done, next = () => {}) {
    return function (err, res) {
        if (err) return done(err);
        next(res.body);
        done();
    }
}

function users(server, token){
   const u =  {username: "Riccardo Cappellaro", email: "test@gmail.com", password: "abc", role: "Bartender"}

    describe('GET Users', () => {
        it('Get all users', (done) => {
            server.get('/users')
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done));
        })
    });

    let email;
    describe('POST Users', () => {
        it('Create new user', (done) => {
            server.post('/users')
                .send(u)
                .set('Accept', 'application/json')
                .expect(200)
                .end(response(done, (res) => {
                    email = res.email;
                }));
        })
    });

    describe('GET Users', () => {
        it('Get user', (done) => {
            server.get(`/users/${email}`)
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done));
        })
    });

    describe('DELETE Users', () => {
        it('Delete user', (done) => {
            server.delete(`/users/${email}`)
                .auth(token, { type: 'bearer' })
                .expect(200)
                .end(response(done))
        })
    });

}

module.exports = users;
