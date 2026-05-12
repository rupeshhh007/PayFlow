import { useState } from "react";
import API from "../api/api";

export default function RecurringPayment() {

  const [receiverEmail, setReceiverEmail] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [frequency, setFrequency] =
    useState("MONTHLY");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      const res = await API.post(
        "/recurring/create",
        {
          receiverEmail,
          amount: Number(amount),
          frequency,
        }
      );

      alert(res.data);

      setReceiverEmail("");
      setAmount("");
      setFrequency("MONTHLY");

    } catch (err) {

      console.log(err);

      alert(
        err.response?.data?.error ||
        err.response?.data ||
        "Failed to create recurring payment"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-2xl shadow-lg w-[400px]">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Recurring Payment
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >

          <input
            type="email"
            placeholder="Receiver Email"
            value={receiverEmail}
            onChange={(e) =>
              setReceiverEmail(e.target.value)
            }
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            className="border p-3 rounded-lg"
            required
          />

          <select
            value={frequency}
            onChange={(e) =>
              setFrequency(e.target.value)
            }
            className="border p-3 rounded-lg"
          >

            <option value="DAILY">
              DAILY
            </option>

            <option value="WEEKLY">
              WEEKLY
            </option>

            <option value="MONTHLY">
              MONTHLY
            </option>

          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white p-3 rounded-lg"
          >

            {
              loading
                ? "Creating..."
                : "Create Recurring Payment"
            }

          </button>

        </form>
      </div>
    </div>
  );
}