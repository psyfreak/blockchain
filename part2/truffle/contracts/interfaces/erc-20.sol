pragma solidity >=0.4.24;

contract ERC20Interface {

    string public constant name = "Udacity Token";
    string public constant symbol = "UDC";
    uint8 public constant decimals = 18;  // 18 is the most common number of decimal places

    // is trigger in transfer and transferFrom
    // indexed means that you can search for these events in the log.
    event Transfer(address indexed from, address indexed to, uint tokens);
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);

    // normally mint and burn  / you can also make tokens unavailable by sending them to adress 0x0
    function totalSupply() public constant returns (uint);
    function balanceOf(address tokenOwner) public constant returns (uint balance);
    // if you transfer to unidentified address tokens are destroyed.
    // owner sends directly to destination
    function transfer(address to, uint tokens) public returns (bool success);
    // send tokens on behalf of the owner. Means address from is e.g. the bank. For this approve function has to be used.
    function transferFrom(address from, address to, uint tokens) public returns (bool success);

    // An owner can define an address: spender to spend an defined amount of tokens on your behalf.
    function approve(address spender, uint tokens) public returns (bool success);

    // returns the allowed residual tokens, which can be spent by spender allowed by tokenOwner
    function allowance(address tokenOwner, address spender) public constant returns (uint remaining);

}

// two step process
//1. Tokenholder uses approve a 3rd party to spend x tokens
//2. 3rd party can use transferFrom to spend at max x tokens / also in multiple calls but at max the allocated tokens.

//  => Token owner can set the tokens to 0 for a 3rd party.