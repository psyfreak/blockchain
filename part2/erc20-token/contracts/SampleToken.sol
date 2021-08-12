// contracts/SampleToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
/*
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
*/
import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract SampleToken is ERC20 {

    //string public name = "SampleToken";
    //string public symbol = "EGT";
    //string public decimals = 18; // not needed default is 18 anyway
    //string public INITIAL_SUPPLY = 10000 * (10** decimals);

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        require(initialSupply > 0, "INITIAL_SUPPLY has to be greater than 0");
        _mint(msg.sender, initialSupply);
    }
    /*
    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint _initialSupply)
    // , _decimals is per default 18
    ERC20(_name, _symbol) public {
        require(_initialSupply > 0, "INITIAL_SUPPLY has to be greater than 0");
        _mint(msg.sender, _initialSupply);
    }

    constructor() public {
        _totalSupply = INITIAL_SUPPLY;
        _balances[msg.sender]
    }
    */
}
