pragma solidity >=0.4.24;

contract stringsContract {

    // get element at index from string text
    function  getElementAt(string text, uint index) public view returns(byte) {
        // Convert string to bytes
        bytes  memory bytesData = bytes(text);
        // Get the element at the specified index
        byte   element = bytesData[index];
        return element;
    }
}