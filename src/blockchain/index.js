const Block = require("../block");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(lastBlock, data);

    this.chain.push(block);

    return block;
  }

  isValidChain(chain) {
    const isFirstBlockValid = JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis());

    if (isFirstBlockValid) return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];
      const isHashValid =
        block.lastHash !== lastBlock.hash || block.hash !== Block.blockHash(block);

      if (isHashValid) {
        return false;
      }
    }

    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.info("Received chain is not longer than the current chain.");

      return;
    } else if (!this.isValidChain(newChain)) {
      console.info("The received chain is not valid.");

      return;
    }

    console.info("Replacing blockchain with the new chain.");
    this.chain = newChain;
  }
}

module.exports = Blockchain;
