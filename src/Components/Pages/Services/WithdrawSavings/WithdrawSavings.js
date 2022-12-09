import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import auth from "../../../../firebase.init";
import useUser from "../../Hooks/useUser";

const WithdrawSavings = () => {
  const [user] = useAuthState(auth);
  const [mongoUser] = useUser(user);
  const fullDate = new Date().toLocaleDateString();
  const date = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
  });
  const time = new Date().toLocaleTimeString();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const amount = data?.amount;
    toast.loading("Money is being Withdraw.", { id: "withdraw-savings" });
    const withdrawInfo = {
      type: "Transfer Savings",
      email: user?.email,
      name: mongoUser?.name,
      amount: amount,
      fullDate,
      date,
      time,
    };

    fetch("https://shohoj-pay-server.onrender.com/withdraw-savings", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ withdrawInfo }),
    })
      .then((res) => res.json())
      .then((result) => {
        toast.dismiss("withdraw-savings");
        if (result.success) {
          reset();
          toast.success(result.success);
        } else {
          toast.error(result.error);
        }
      });
  };
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="eachServicesContainer md:w-[25rem] lg:w-[30rem] w-[22rem]">
        <h2 className="textColor text-[1.70rem] mb-9 pl-1">Transfer Savings</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("amount", {
              min: {
                value: 20,
                message: "$20 is the minimum Transfer amount.",
              },
              max: {
                value: 1000,
                message: "$1000 is the maximum Transfer amount at a time.",
              },
            })}
            required
            type="number"
            className="h-12 p-2 w-full rounded-lg"
            placeholder="How much to Transfer"
          />
          {errors.amount?.message && (
            <span className="text-[12px] text-red-600">
              {errors.amount?.message}
            </span>
          )}
          <input
            type="submit"
            className="actionButton block mt-11 border-0"
            value="Transfer"
          />
        </form>
      </div>
    </div>
  );
};

export default WithdrawSavings;
