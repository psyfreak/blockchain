// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8;

// Lesson 3 - 7 Reentry
//using SafeMath for uint256;

//
contract ReEntrancyGuard {
    uint256 public safeWithdrawDone = 0;
    uint256 public counter = 1;


    // timeframe in seconds
    modifier entrancyGuard() {
        counter++; 
        uint256 localCounter = counter;
        // proceed
        _;   
        require(counter == localCounter, "Access is denied. Re-Entrancy."); 
 
    }
    /**
    check effect interaction pattern
    **/
    function safeWithdraw()
    public
    entrancyGuard
    {
        // test guard - try to call it two times
        if(counter < 3) {
            safeWithdrawDone++;
            this.safeWithdraw();
        }

    }
}