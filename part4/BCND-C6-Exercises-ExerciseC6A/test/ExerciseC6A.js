
var Test = require('../config/testConfig.js');

async function foo() {throw new Error("Foo");}



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
    await config.exerciseC6A.setOperationalByOwner(false, {from: caller});
    let isOperational = await config.exerciseC6A.isOperational.call();
    // ASSERT
    assert.equal(isOperational, false, "Contract should be paused, but is operational");

    // ACT
    await config.exerciseC6A.setOperationalByOwner(true, {from: caller});
    isOperational = await config.exerciseC6A.isOperational.call();
    // ASSERT
    assert.equal(isOperational, true, "Contract should be operational, but is paused");
  });

  // Test case for checking for errors
  it("`foo` throws an async error (rejected Promise)", () => {
    //return foo().catch(error => expect(error).to.be.an('error').with.property('message', 'F6oo')) // to test if it is working
    return foo().then(result =>  assert.equal(false, true, "no error thrown")).catch(error => expect(error).to.be.an('error'))
    //return foo().catch(error => expect(error).to.be.an('error').with.property('message', 'Foo'))
  });

  it('any one else than owner cannot pause and unpause contract', async () => {

    // ARRANGE
    let caller = accounts[1];//before accounts[1] // This should be config.owner or accounts[0] for registering a new user
    //let jo = await config.exerciseC6A.setOperationalByOwner(false, {from: caller})
    return config.exerciseC6A.setOperationalByOwner(false, {from: caller})
      .then(result =>  {
        assert.equal(false, true, "no error thrown"); //without and setting caller to accounts[0] => this won´t lead to an error
      })
      .catch(error => {
        //expect(error).to.be.an('error').with.property('message', 'VM Exception while processing transaction: revert Caller is not contract owner -- Reason given: Caller is not contract owner.')
        expect(error).to.be.an('error').with.property('reason', 'Caller is not contract owner') // working
      })
    //expect(() => await config.exerciseC6A.setOperational(false, {from: caller}) ).to.throw('Caller is not contract owner');

    //assert.throws(() => { throw new Error("Error thrown") }, Error, "Error thrown");
    // not working ....
    //assert.throws(() => config.exerciseC6A.setOperational(false, {from: caller}), Error, "Error thrown");

  });

  it('pause contract and try to execute register user', async () => {

    // ARRANGE
    // ARRANGE
    let caller = accounts[0];//before accounts[1] // This should be config.owner or accounts[0] for registering a new user
    //await config.exerciseC6A.setOperationalByOwner(false, {from: caller});

    let newUser = config.testAddresses[1];
    // ACT
    //await config.exerciseC6A.registerUser(newUser, false, {from: caller});
  });

  it('function call is made when multi-party threshold is reached', async () => {

    // ARRANGE
    let admin1 = accounts[1];
    let admin2 = accounts[2];
    let admin3 = accounts[3];

    await config.exerciseC6A.registerUser(admin1, true, {from: config.owner});
    await config.exerciseC6A.registerUser(admin2, true, {from: config.owner});
    await config.exerciseC6A.registerUser(admin3, true, {from: config.owner});

    let startStatus = await config.exerciseC6A.isOperational.call();
    let changeStatus = !startStatus;

    // ACT
    await config.exerciseC6A.setOperational(changeStatus, {from: admin1});
    await config.exerciseC6A.setOperational(changeStatus, {from: admin2});

    let newStatus = await config.exerciseC6A.isOperational.call();

    // ASSERT
    assert.equal(changeStatus, newStatus, "Multi-party call failed");

  });


});
