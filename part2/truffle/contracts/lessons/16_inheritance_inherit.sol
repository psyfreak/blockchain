
pragma solidity >=0.4.24;

import "./MainContract.sol";

// We have an ContractInterface, that has a function
// sendmoney...but there is no function body
interface ContractInterface {
    function sendMoney (uint amount, address _address) external returns (bool);
}

// no BaseContract => cannot resolved because of same funtions + values

// This shows multiple inheritance

// This will give an error...since baseContract has a constructor that we need to initialize
// contract myContract is baseContract, interfaceContract {

contract InheritanceContract is ContractInterface, MainContract(100) {

    string public contractName;

    //ctors are public anyway
    constructor (string memory _n) {
        contractName = _n;
    }
    function getValue () public view returns (uint) {
        return value;
    }

    //see here https://ethereum.stackexchange.com/questions/65693/how-to-cast-address-to-address-payable-in-solidity-0-5-0
    // https://jeancvllr.medium.com/solidity-tutorial-all-about-addresses-ffcdf7efc4e7
    // Function that allows you to convert an address into a payable address
    /*
    The distinction between address and address payable was introduced in Solidity version 0.5.0. The idea was to make the distinction between addresses that can receive money, and those who can’t (used for other purposes). Simply speaking, an address payable can receive Ether, while a plain address cannot.
    So in Solidity, from the sender perspective:
        You can send Ether to a variable defined as address payable
        You cannot send Ether to a variable defined as address
    You can use the keyword payable before the variable name of an address type to enable it to receive ether.
    As a result, the following methods become available for an address defined as payable in Solidity: .transfer() , .send() , .call() , .delegatecall() and .staticcall()
    */
    function _make_payable(address x) internal pure returns (address payable) {
        return payable(address(x));
    }

    // This function has to be implemented, since it is unimplemented in the interfaceContract
    // use override
    function sendMoney (uint amount, address _address) public override returns (bool) {
        _make_payable(_address).transfer(amount);
    }
}

/*
pragma solidity >=0.4.24;

import "./16_inheritance_main.sol";

// We have an ContractInterface, that has a function
// sendmoney...but there is no function body
interface ContractInterface {
    function sendMoney (uint amount, address _address) external returns (bool);
}

// This is a BaseContract, that has its constructor, and deposit and withdraw functions...
contract BaseContract {

    uint public value;

    // Anytime base contract has a constructor, we will need to initialize this using
    // the derived contracts constructor function

    constructor (uint amount) public {
        value = amount;
    }

    function deposit (uint amount) public {
        value += amount;
    }

    function withdraw (uint amount) public {
        value -= amount;
    }
}

// This shows multiple inheritance

// This will give an error...since baseContract has a constructor that we need to initialize
// contract myContract is baseContract, interfaceContract {

contract InheritanceContract is BaseContract(100), ContractInterface, MainContract(100) {

    string public contractName;

    constructor (string memory _n) public {
        contractName = _n;
    }
    function getValue () public view returns (uint) {
        return value;
    }

    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return address(uint160(x));
    }

    // This function has to be implemented, since it is unimplemented in the interfaceContract
    function sendMoney (uint amount, address _address) public returns (bool) {
        _make_payable(_address).transfer(amount);
    }
}

*/