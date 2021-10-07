const Wallet = require("./");
const TransactionPool = require("./transaction-pool");

describe("Wallet", () => {
  let wallet, transactionPool;

  beforeEach(() => {
    wallet = new Wallet();
    transactionPool = new TransactionPool();
  });

  describe("creating a transaction", () => {
    let transaction, sendAmount, recipient;

    beforeEach(() => {
      sendAmount = 50;
      recipient = "r4nd0m-4ddr355";
      transaction = wallet.createTransaction(recipient, sendAmount, transactionPool);
    });

    describe("and doing the same transaction", () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, transactionPool);
      });

      it("doubles the `sendAmount` subtracted from the wallet balance", () => {
        expect(
          transaction.outputs.find((output) => output.address === wallet.publicKey).amount
        ).toEqual(wallet.balance - sendAmount * 2);
      });

      it("clones the `sendAmount` output for the recipient", () => {
        expect(
          transaction.outputs
            .filter((output) => output.address === recipient)
            .map(({ amount }) => amount)
        ).toEqual([sendAmount, sendAmount]);
      });
    });
  });
});
