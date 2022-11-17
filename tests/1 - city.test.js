const City = require('../src/api/models/city.model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/index');
const populate = require('../src/populate');
chai.should();
chai.use(chaiHttp);

// before(done => {
//     City.deleteMany({}, err => {
//         if (err) {
//             console.log(err);
//         }
//     });
//     populate()
//     done;
// })


/*
    * Test the SUGGESTIONS route
*/

describe('/GET /api/v1/city/suggest', () => {
    it('it should GET all the suggestions', done => {
        chai.request(server)
            .get('/api/v1/city/suggest?city=del')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('data');
                res.body.data.should.be.a('array');
                res.body.data.length.should.be.eql(2);
            done();
            });
    });
});

describe('/GET /api/v1/city/data', () => {
    it ('it should GET all the data', done => {
        chai.request(server)
            .get('/api/v1/city/data?city=Mumbai')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                res.body.should.have.property('success');
                res.body.should.have.property('data');
                res.body.data.should.be.a('object');
                res.body.data.should.have.property('name');
                res.body.data.should.have.property('tag');
                res.body.data.should.have.property('state');
                res.body.data.should.have.property('country');
                res.body.data.should.have.property('places');
                res.body.data.should.have.property('image');
                res.body.data.should.have.property('packages');
                res.body.data.should.have.property('hotels');
                res.body.data.hotels.should.be.a('array');
                res.body.data.places.should.be.a('array');
                res.body.data.packages.should.be.a('array');
            done();
            });
    });
})