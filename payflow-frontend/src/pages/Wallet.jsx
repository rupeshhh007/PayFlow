import { useEffect, useState } from "react";
import BalanceCard from "../components/BalanceCard";
import DepositModal from "../components/DepositModal";
import SendMoneyModal from "../components/SendMoneyModal";
import { getBalance } from "../api/walletApi";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showSend, setShowSend] = useState(false);

  const loadBalance = async () => {
    const res = await getBalance();
    setBalance(res.data.balance);
  };

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <div className="relative z-10">

      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">
          Wallet
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your balance and transfers
        </p>
      </div>

      {/* Balance */}
      <BalanceCard balance={balance} />

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setShowDeposit(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
        >
          Add Funds
        </button>

        <button
          onClick={() => setShowSend(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          Send Money
        </button>
      </div>

      {/* Modals */}
      {showDeposit && (
        <DepositModal
          onClose={() => setShowDeposit(false)}
          onSuccess={loadBalance}
        />
      )}

      {showSend && (
        <SendMoneyModal
          onClose={() => setShowSend(false)}
          onSuccess={loadBalance}
        />
      )}

    </div>
  );
};

export default Wallet;