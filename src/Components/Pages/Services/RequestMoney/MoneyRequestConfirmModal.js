import React from "react";
import toast from "react-hot-toast";
import { sendNotification } from "../../../../App";

const MoneyRequestConfirmModal = ({
  requestInfo,
  setRequestForConfirm,
  fetchRequests,
}) => {
  const email = requestInfo?.from;
  const handleApprove = (request) => {
    toast.loading("Request is being confirmed.", {
      id: "moneyRequestLoadingToast",
    });
    fetch("https://shohoj-pay-server.onrender.com/approveRequestMoney", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ requestMoneyInfo: request }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRequestForConfirm([]);
        fetchRequests();
        if (data?.success) {
          toast.dismiss("moneyRequestLoadingToast");
          sendNotification(email, "requestMoney");
          toast.success(data?.success);
        } else {
          toast.dismiss("moneyRequestLoadingToast");
          toast.error(data?.error);
        }
      });
  };

  return (
    <div>
      <input
        type="checkbox"
        id="MoneyRequestConfirmModal"
        className="modal-toggle"
      />
      <div className="modal">
        <div className="modal-box relative">
          <h3 className="text-lg font-bold">Approve request?</h3>
          <p className="py-4">
            Are you sure to confirm request of ${requestInfo.amount}
          </p>
          <div className="actionButtons mt-4 flex space-x-4">
            <button
              onClick={() => setRequestForConfirm([])}
              className="btn btn-sm btn-outline "
            >
              Cancel
            </button>
            <button
              onClick={() => handleApprove(requestInfo)}
              className="btn btn-sm btn-primary "
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyRequestConfirmModal;
