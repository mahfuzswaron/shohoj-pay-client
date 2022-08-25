import React from "react";
import toast from "react-hot-toast";

const MoneyRequestConfirmModal = ({
  requestInfo,
  setRequestForConfirm,
  fetchRequests,
}) => {
  const handleApprove = (request) => {
    toast.loading("Request is being confirmed.", {
      id: "moneyRequestLoadingToast",
    });
    fetch("http://localhost:5000/approveRequestMoney", {
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
