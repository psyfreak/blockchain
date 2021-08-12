// Importing the StartNotary Smart Contract ABI (JSON representation of the Smart Contract)
const StarNotary = artifacts.require("StarNotary");

let accounts; // List of development accounts provided by Truffle
let owner; // Global variable use it in the tests cases
let instance;

//web 3 is automatically included in test files

// This called the StartNotary Smart contract and initialize it
// before each block not needed contract does it for you.
contract('StarNotary', (accs) => {
  accounts = accs; // Assigning test accounts
  owner = accounts[0]; // Assigning the owner test account
});

// Example test case, it will test if the contract is able to return the starName property
// initialized in the contract constructor
it('has correct name', async () => {
  instance = await StarNotary.deployed(); // Making sure the Smart Contract is deployed and getting the instance.
  let starName = await instance.starName.call(); // Calling the starName property
  assert.equal(starName, "Awesome Udacity Star"); // Assert if the starName property was initialized correctly
});

// Example test case, it will test is the Smart Contract function claimStar assigned the Star to the owner address
it('can be claimed', async () => {
  let instance = await StarNotary.deployed(); // Making sure the Smart Contract is deployed and getting the instance.
  await instance.claimStar({from: owner}); // Calling the Smart Contract function claimStar
  let starOwner = await instance.starOwner.call(); // Getting the owner address
  assert.equal(starOwner, owner); // Verifying if the owner address match with owner of the address
});

// Example test case, it will test is the Smart Contract function claimStar assigned the Star to the owner address and it can be changed
it('can change owners', async () => {
  let instance = await StarNotary.deployed();
  let secondUser = accounts[1];
  await instance.claimStar({from: owner});
  let starOwner = await instance.starOwner.call();
  assert.equal(starOwner, owner);
  await instance.claimStar({from: secondUser});
  let secondOwner = await instance.starOwner.call();
  assert.equal(secondOwner, secondUser);
});

// Example test case, it will test is the Smart Contract function changeName function.
it('can change star name', async () => {
  let instance = await StarNotary.deployed();
  let oldStarName = await instance.starName.call();
  await instance.changeName(oldStarName + "new");
  let newStarName = await instance.starName.call();
  assert.equal(newStarName, oldStarName + "new");
});

/*
// udacity solution
it('can change names', async () => {
  await instance.claimStar({from: owner});
  await instance.changeName('New Name', {from: owner});
  assert.equal(await instance.starName.call(), 'New Name');
})
*/

/*
const TestStarNotary = artifacts.require("MetaCoin");

contract("MetaCoin", accounts => {
  it("should put 10000 MetaCoin in the first account", async () => {
    const instance = await TestStarNotary.deployed();
    const balance = await instance.getBalance.call(accounts[0]);
    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  });

  it("should call a function that depends on a linked library", async () => {
    const instance = await TestStarNotary.deployed();
    const metaCoinBalance = await instance.getBalance.call(accounts[0]);
    const metaCoinBalanceInEth = await instance.getBalanceInEth.call(
      accounts[0],
    );

    const expected = 2 * metaCoinBalance.toNumber();

    assert.equal(
      metaCoinBalanceInEth.toNumber(),
      expected,
      "Library function returned unexpeced function, linkage may be broken",
    );
  });

  it("should send coin correctly", async () => {
    const instance = await TestStarNotary.deployed();

    const account1 = accounts[0];
    const account2 = accounts[1];

    // get initial balances
    const initBalance1 = await instance.getBalance.call(account1);
    const initBalance2 = await instance.getBalance.call(account2);

    // send coins from account 1 to 2
    const amount = 10;
    await instance.sendCoin(account2, amount, { from: account1 });

    // get final balances
    const finalBalance1 = await instance.getBalance.call(account1);
    const finalBalance2 = await instance.getBalance.call(account2);

    assert.equal(
      finalBalance1.toNumber(),
      initBalance1.toNumber() - amount,
      "Amount wasn't correctly taken from the sender",
    );
    assert.equal(
      finalBalance2.toNumber(),
      initBalance2.toNumber() + amount,
      "Amount wasn't correctly sent to the receiver",
    );
  });
});
*/
