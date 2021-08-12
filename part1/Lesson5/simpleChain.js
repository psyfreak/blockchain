const SHA256 = require("crypto-js/sha256");
/**
 * Block
 */
class Block {
  constructor(data) {
    this.hash = SHA256(JSON.stringify(data)).toString();
    this.height = 0;
    this.body = data;
    this.time = new Date().getTime().toString().slice(0,-3);// new Date().toISOString().slice(0,-5);
    this.previousblockhash = "";
  }
}

/**
 *
 */
class Blockchain {
  constructor() {
    this.chain = [];
    this.createGenesisBlock();
    //this.addBlock(new Block("firstBlock"))
  }

  createGenesisBlock() {
    let genBlock = new Block("gensis");
    this.addBlock(genBlock);
  }


  addBlock(newBlock) {
    /*
    newBlock.hash = SHA256(JSON.string(newBlock)).toString();
    if (this.chain.length > 0) {
      newBlock.previousblockhash = this.chain[this.chain.length-1].hash
    }
    */
    let block = this.getLatestBlock();
    //console.log("addBlock", block)
    newBlock.height = this.chain.length;
    //newBlock.time = new Date().getTime().toString().slice(0,-3);// new Date().toISOString().slice(0,-5); //added when added to block
    if(block) {
      newBlock.previousblockhash = this.getLatestBlock().hash;
      //newBlock.height = this.getLatestBlock().height+1;
    }
    this.chain.push(newBlock);
  }

  getBlockChainHeight()  {
    return;
  }

  getBlock(height) {
    if(height < 0) {
      height = 0;
    }
    return this.chain[height];
  }

  getLatestBlock() {
    let lastBlockIndex = this.chain.length - 1;
    if(lastBlockIndex<0) {
      return null;
    }
    return this.chain[lastBlockIndex];
  }

  getLastBlockHex() {
    let lastBlockIndex = this.chain.length - 1;
    if(lastBlockIndex<0) {
      lastBlockIndex = 0;
    }
    return this.chain[lastBlockIndex].hash;
  }

  validateChain() {
    // iterate overall block but backwards
  }

  validateBlock() {

  }
}

let b = new Block("jo");
let c = new Block([1,2,3]);

let chain = new Blockchain(b);
chain.addBlock(b);
chain.addBlock(c)
console.log("chain",chain)
