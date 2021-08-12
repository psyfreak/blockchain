const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    // 1. create a Star with different tokenId
    let tokenName = 'StartokenTEST',
      tokenSymbol = 'STT'; // given in deploy_contracts
    let newtoken = await StarNotary.new(tokenName, tokenSymbol); // calls ctor and creates new coin instance
    //let instance = await StarNotary.deployed(tokenName, tokenSymbol); // this uses the already deployed one
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    assert.equal(await newtoken.name.call(), tokenName);
    assert.equal(await newtoken.symbol.call(), tokenSymbol);
});

it('lets 2 users exchange stars', async() => {
    // 1. create 2 Stars with different tokenId
    const star1 = {
        tokenId: 10,
        name: "starOwner1",
        owner: accounts[0]
      },
      star2 = {
          tokenId: 11,
          name: "starOwner2",
          owner: accounts[1]
      };

    let instance = await StarNotary.deployed();
    await instance.createStar(star1.name, star1.tokenId, {from: star1.owner});
    await instance.createStar(star2.name, star2.tokenId, {from: star2.owner});

    // 2. Call the exchangeStars functions implemented in the Smart Contract
    const ownerOfStar1 = await instance.ownerOf.call(star1.tokenId),
      ownerOfStar2 = await instance.ownerOf.call(star2.tokenId);

    assert.equal(star1.owner, ownerOfStar1, "before exchange: user1 owns star1");
    assert.equal(star2.owner, ownerOfStar2, "before exchange: user1 owns star1");

    assert.notEqual(star1.owner, ownerOfStar2, "before exchange: user2 does not own star1");
    assert.notEqual(star2.owner, ownerOfStar1, "before exchange: user1 does not own star2");

    await instance.exchangeStars(star1.tokenId, star2.tokenId, {from: star1.owner}); // owner1 exchange stars with owner2

    // 3. Verify that the owners changed
    const newOwnerOfStar1 = await instance.ownerOf.call(star1.tokenId),
      newOwnerOfStar2 = await instance.ownerOf.call(star2.tokenId);
    assert.equal(star1.owner, newOwnerOfStar2, "after exchange: user1 owns star2");
    assert.equal(star2.owner, newOwnerOfStar1, "after exchange: user2 owns star1");
    assert.notEqual(star1.owner, newOwnerOfStar1, "after exchange: user1 does not own star1 anymore");
    assert.notEqual(star2.owner, newOwnerOfStar2, "after exchange: user2 does not own star2 anymore");
});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    const tokenId = 6,
      starName = 'Transfer Star!',
      user1 = accounts[0],
      user2 = accounts[1];
    let instance = await StarNotary.deployed();
    await instance.createStar(starName, tokenId, {from: user1});
    // 2. use the transferStar function implemented in the Smart Contract
    const ownerOfToken = await instance.ownerOf.call(tokenId);
    assert.equal(user1, ownerOfToken, "before transfer: user1 owns token: " + tokenId);
    assert.notEqual(user2, ownerOfToken, "before transfer: user2 does not own token: "+ tokenId);
    await instance.transferStar(user2, tokenId, {from: user1}); // user1 transfers star to user2
    // 3. Verify the star owner changed.
    const newownerOfToken = await instance.ownerOf.call(tokenId);
    assert.equal(user2, newownerOfToken, "after transfer: user2 owns token: " + tokenId);
    assert.notEqual(user1, newownerOfToken, "after transfer: user1 does not own token: "+ tokenId);
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. create a Star with different tokenId

    const tokenId = 88,
        starName = 'Awesome Star 2!';
    let instance = await StarNotary.deployed();
    await instance.createStar(starName, tokenId, {from: accounts[0]});
    // 2. Call your method lookUptokenIdToStarInfo
    let starNameContract = await instance.lookUptokenIdToStarInfo(tokenId);
    // 3. Verify if you Star name is the same
    assert.equal(starName, starNameContract)
});