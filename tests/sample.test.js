const request = require('supertest');
const app = require('../app'); // Adjust the path as necessary

describe('GET /', () => {
    it('should return 200 OK', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
    });
});