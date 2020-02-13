const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('chai').assert;
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ttt1', {useNewUrlParser: true, useUnifiedTopology: true});

const app = require('../app');
const UserModel = require('../models/Users');

chai.use(chaiHttp);

describe('Users', function() {
  before(async function() {
    // runs before all tests in this block
    await UserModel.remove({});
  });
0
  it('Users db should be empty', async function() {
    try {
      const response = await chai.request(app).get('/api/users');
      assert.equal(response.body.length == 0, true, 'Results should be empty');
    } catch (err) {
      throw err;
    }
  });

  it('Create a new user', async function() {
    try {
      const newUser = {
        name: 'Thi Nguyen',
        grade: 11,
      }

      const response = await chai
                              .request(app)
                              .post('/api/users')
                              .send(newUser);
      assert.equal(response.status, 201, 'Results should be empty');
      assert.ownInclude(response.body, newUser);
    } catch (err) {
      throw err;
    }
  });

  it('Users db should not be empty', async function() {
    try {
      const response = await chai.request(app).get('/api/users');
      assert.equal(response.body.length > 0, true, 'Results should not be empty');
    } catch (err) {
      throw err;
    }
  });
});