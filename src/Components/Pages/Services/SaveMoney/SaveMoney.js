import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import auth from "../../../../firebase.init";

const SaveMoney = () => {
  const [user] = useAuthState(auth);
  const fullDate = new Date().toLocaleDateString();
  const date = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
  });
  const time = new Date().toLocaleTimeString();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const amount = data?.amount;
    if (amount.slice(0, 1) === "0") {
      toast.error("Invalid save amount.");
      return;
    }

    toast.loading("Money is being saved.", { id: "saveMoneyLoading" });

    const saveMoneyInfo = {
      type: "Save Money",
      email: user?.email,
      amount: amount,
      fullDate,
      date,
      time,
    };

    fetch("https://shohoj-pay-server.onrender.com/saveMoney", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ saveMoneyInfo }),
    })
      .then((res) => res.json())
      .then((result) => {
        toast.dismiss("saveMoneyLoading");
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
        <h2 className="textColor text-[1.70rem] mb-9 pl-1">Save Money</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            {...register("amount", {
              min: {
                value: 5,
                message: "$5 is the minimum save amount.",
              },
              max: {
                value: 1000,
                message: "$1000 is the maximum save amount at a time.",
              },
            })}
            required
            type="number"
            className="h-12 p-2 w-full rounded-lg"
            placeholder="How much to save?"
          />
          {errors.amount?.message && (
            <span className="text-[12px] text-red-600">
              {errors.amount?.message}
            </span>
          )}
          <div className="flex items-baseline justify-between">
            <input
              type="submit"
              className="actionButton block mt-11 border-0"
              value="Save"
            />
            <button
              className="btn btn-link"
              onClick={() => navigate("/services/withdraw-savings")}
            >
              Transfer Savings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaveMoney;
