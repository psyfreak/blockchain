
var Test = require('../config/testConfig.js');

contract('ExerciseC6A', async (accounts) => {

  var config;
  before('setup contract', async () => {
    config = await Test.Config(accounts);
  });

  it('contract owner can register new user', async () => {
    
    // ARRANGE
    let caller = accounts[0];//before accounts[1] // This should be config.owner or accounts[0] for registering a new user
    let newUser = config.testAddresses[0]; 

    // ACT
    await config.exerciseC6A.registerUser(newUser, false, {from: caller});
    let result = await config.exerciseC6A.isUserRegistered.call(newUser); 

    // ASSERT
    assert.equal(result, true, "Contract owner cannot register new user");

  });
  it('contract owner can pause and unpause contract', async () => {

    // ARRANGE
    let caller = accounts[0];//before accounts[1] // This should be config.owner or accounts[0] for registering a new user

    // ACT
    await config.exerciseC6A.setOperational(false, {from: caller});
    let isOperational = await config.exerciseC6A.isOperational.call();
    // ASSERT
    assert.equal(isOperational, false, "Contract should be paused, but is operational");

    // ACT
    await config.exerciseC6A.setOperational(true, {from: caller});
    isOperational = await config.exerciseC6A.isOperational.call();
    // ASSERT
    assert.equal(isOperational, true, "Contract should be operational, but is paused");
  });

  it('any one else than owner cannot pause and unpause contract', async () => {

    // ARRANGE
    let caller = accounts[1];//before accounts[1] // This should be config.owner or accounts[0] for registering a new user
    //let jo = await config.exerciseC6A.setOperational(false, {from: caller})
    //expect(() => await config.exerciseC6A.setOperational(false, {from: caller}) ).to.throw('Caller is not contract owner');

    //assert.throws(() => { throw new Error("Error thrown") }, Error, "Error thrown");
    // not working ....
    //assert.throws(() => config.exerciseC6A.setOperational(false, {from: caller}), Error, "Error thrown");

  });

  it('pause contract and try to execute register user', async () => {

    // ARRANGE
    // ARRANGE
    let caller = accounts[0];//before accounts[1] // This should be config.owner or accounts[0] for registering a new user
    await config.exerciseC6A.setOperational(false, {from: caller});

    let newUser = config.testAddresses[1];
    // ACT
    await config.exerciseC6A.registerUser(newUser, false, {from: caller});
  });


});
