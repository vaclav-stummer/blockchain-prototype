const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./");
const Blockchain = require("../blockchain");

describe("TransactionPool", () => {
  let transactionPool, transaction, wallet, blockchain;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    wallet = new Wallet();
    blockchain = new Blockchain();
    transaction = wallet.createTransaction("r4nd-4dr355", 30, blockchain, transactionPool);
  });

  it("add a transaction to the pool", () => {
    expect(transactionPool.transactions.find((t) => t.id === transaction.id)).toEqual(transaction);
  });

  it("updates a transaction in the pool", () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, "foo-4ddr355", 40);

    transactionPool.updateOrAddTransaction(newTransaction);

    expect(
      JSON.stringify(transactionPool.transactions.find((t) => t.id === newTransaction.id))
    ).not.toEqual(oldTransaction);
  });

  it("clears transactions", () => {
    transactionPool.clear();
    expect(transactionPool.transactions).toEqual([]);
  });

  describe("mixing valid and corrupt transactions", () => {
    let validTransactions;

    beforeEach(() => {
      validTransactions = [...transactionPool.transactions];

      for (let i = 0; i < 6; i++) {
        wallet = new Wallet();
        transaction = wallet.createTransaction("foo-4ddr355", 30, blockchain, transactionPool);

        if (i % 2 === 0) {
          transaction.input.amount = 99999;
        } else {
          validTransactions.push(transaction);
        }
      }
    });

    it("shows a difference between valid and corrupt transactions", () => {
      expect(JSON.stringify(transactionPool)).not.toEqual(JSON.stringify(validTransactions));
    });

    it("grabs valid transactions", () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });
  });
});
