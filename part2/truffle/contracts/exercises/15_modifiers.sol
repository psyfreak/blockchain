// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.24;

contract Modifiers {
    uint public highest_bid;
    // get element at index from string text
    // Ensures that bid can be received i.e, auction not ended
    modifier isHigherTest(uint currentBid){
        // bidding is higher than current highest bid
        //if(msg.value > highest_bid){
        if(currentBid > highest_bid) {
            _;
        } else {
            /**throw an exception */
            revert("Bidding is not higher than current highest bid");
        }
        //    require(contractTypes[target] == contractType);
        //_;
    }



    // Payable since ether should be coming along
    // Timed, we need to end this bidding in 5 days
    function bidTest(uint currentBid) public payable isHigherTest(currentBid) {
        highest_bid = currentBid;
    }

    // get element at index from string text
    // Ensures that bid can be received i.e, auction not ended
    modifier isHigher {
        // bidding is higher than current highest bid
        if(msg.value > highest_bid){
            _;
        } else {
            /**throw an exception */
            revert("Bidding is not higher than current highest bid");
        }
        // These two lines are the better alternative
        //    require(contractTypes[target] == contractType);
        //_;
    }


    // Payable since ether should be coming along
    // Timed, we need to end this bidding in 5 days
    function bid() public payable isHigher {
        highest_bid = msg.value;
    }

}


/*
// solution from udacity => ERROR msg.value >= minimumOffer
pragma solidity ^0.4.25;

contract Modifiers {

    uint  public  minimumOffer = 100;

    modifier  minimumAmount(){
        if(msg.value >= minimumOffer){
            _;
        } else {
            //
            revert();
        }
    }

    function  bid() payable public minimumAmount returns(bool)  {
        // Code the adding a new bid
        return true;
    }
}
*/
