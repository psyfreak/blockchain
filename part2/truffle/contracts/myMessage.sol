pragma solidity >=0.4.22 <0.9.0;
// added memory to params and return
contract Message {
    string myMessage;

    function setMessage(string memory x) public {
        myMessage = x;
    }

    function getMessage() public view returns (string memory) {
        return myMessage;
    }
}