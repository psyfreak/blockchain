// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8;

// Lesson 3 - 7 Rate Limiting
//using SafeMath for uint256;

//
contract RateLimiting {
    bool public safeWithdrawDone = false;
    uint256 public enabledAt = block.timestamp;


    // timeframe in seconds
    modifier rateLimit(uint timeframe) {
        // check if access is provided // current time > lastTime + timeframe
        // now vs. block.timestamp https://ethereum.stackexchange.com/questions/15747/what-is-the-difference-between-now-and-block-timestamp
        // were aliases but now is obsolete since Solidity 0.7.0 deprecated the now keyword.
        /*
        // first call not working
        uint256 newTime = block.timestamp; // now is in seconds
        require(enabledAt + timeframe <= newTime , "jo");
        enabledAt = newTime;
        */

        require(block.timestamp >= enabledAt, "Access is denied. Rate limit exceeded.");
        
		enabledAt = block.timestamp.add(timeframe)
		//enabledAt = block.timestamp + timeframe;// without safeMath

        _;     
    }
    /**
    check effect interaction pattern
    **/
    function safeWithdraw()
    external
    rateLimit(3)
    {
        safeWithdrawDone = true;
    }
}