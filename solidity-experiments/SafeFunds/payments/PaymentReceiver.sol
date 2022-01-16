// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8;
//
contract PaymentReceiver {
    mapping(address => uint256) private sales;
    address private contractOwner;                  // Account used to deploy contract
    
    constructor
                (
                )
    {
        contractOwner = msg.sender;
    }

    /**
    check effect interaction pattern
    **/
    function safeWithdraw(uint256 amount)
    external
    payable   
    {
        //e.g. requirements unclear there was not ammount mentioned + the requirement that it is greater/equal of 100 is missing
        // amount is reused although it is a parameter
        
        
        /*
        // Option C
        require(balance[msg.sender] > 0);
        uint256 prev = balance[msg.sender];
        balance[msg.sender] = 0;
        msg.sender.transfer(prev);
        */
        
        // verify call is an EOA
        /*
        https://ethereum.stackexchange.com/questions/39407/how-to-pass-the-external-account-address-to-the-contract-function-when-calling-a?rq=1
        I don't go deeply on what you want to achieve with your smart contracts, but to answer your question you can use tx.origin to know the externally owned account sending the original transaction. msg.sender is always the last caller, EOA or Contract Account.
        */
        require(tx.origin == msg.sender, "Sender is a contract - not allowed");    
        
  
        //verify caller has sufficient funds to withdraw
        require(sales[msg.sender] >= amount, "insufficient funds");
        
        //verify transfer value >= 100
        require(amount >= 100, "funds to withdraw needs to greater or equal 100");

        // reset sales
        uint256 funds = sales[msg.sender];
        sales[msg.sender] = funds - amount;//without safemath funds - amount;
        //transfer sales to caller address
        address payable newOwnerAddressPayable = payable(msg.sender);
        newOwnerAddressPayable.transfer(amount);
    }
}