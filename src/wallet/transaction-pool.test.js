const TransactionPool = require("./transaction-pool");
const Transaction = require("./transaction");
const Wallet = require("./");

describe("TransactionPool", () => {
  let transactionPool, transaction, wallet;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    wallet = new Wallet();
    transaction = Transaction.newTransaction(wallet, "r4nd-4dr355", 30);

    transactionPool.updateOrAddTransaction(transaction);
  });

  it("add a transaction to the pool", () => {
    expect(transactionPool.transactions.find((t) => t.id === transaction.id)).toEqual(transaction);
  });

  it("updates a transaction in the pool", () => {
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, "foo-4ddr355", 40);

    transactionPool.updateOrAddTransaction(newTransaction);

    expect(JSON.stringify(transactionPool.transactions.find((t) => t.id === newTransaction.id))).not.toEqual(
      oldTransaction
    );
  });
});
