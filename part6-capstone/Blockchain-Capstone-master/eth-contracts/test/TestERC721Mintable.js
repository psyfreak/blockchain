let ERC721Mintable = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', async (accounts) => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const tokens = [1,2,3];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new("Housetoken", "HT", {from: account_one});
            await this.contract.mint(account_one, 1, {from: account_one});
            await this.contract.mint(account_one, 2, {from: account_one});
            await this.contract.mint(account_two, 3, {from: account_one});
            // TODO: mint multiple tokens
        })

        it('should return total supply', async function () {
            //let result = await config.flightSuretyData.isAirlineFunded.call(config.firstAirline);
            let supply = await this.contract.totalSupply.call();
            assert.equal(supply, tokens.length, "Supply does not match to current minted tokens");
        })

        it('should get token balance', async function () {
            let balance = await this.contract.balanceOf.call(account_one);
            assert.equal(balance, 2, "Token balance does not match");
            balance = await this.contract.balanceOf.call(account_two);
            assert.equal(balance, 1, "Token balance does not match");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 

        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(account_one, account_two, tokens[0], {from: account_one});
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
        })

        it('should return contract owner', async function () { 
            
        })

    });
})