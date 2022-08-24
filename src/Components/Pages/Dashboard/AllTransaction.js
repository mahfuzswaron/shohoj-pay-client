import { signOut } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllTransaction } from "../../../app/features/transAction/transactionSlice";
import auth from "../../../firebase.init";
import Spinner from "../../Shared/Spinner/Spinner";
import "./AllTransaction.css";
import Pagination from "../../Shared/Pagination/Pagination";

const AllTransaction = () => {
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const todayDate = new Date().toLocaleDateString();
  // REVERSE TRANSACTION DATA
  const reverseData = [...filterData].reverse();
  const dispatch = useDispatch();
  const { isLoading, allTransactionData, error } = useSelector(
    (state) => state.allTransaction
  );
  useEffect(() => {
    dispatch(fetchAllTransaction(user));
  }, [dispatch, user]);
  const transactionData = allTransactionData;
  console.log(transactionData);
  useEffect(() => {
    setFilterData(allTransactionData);
    if (shareLinkCopied) {
      toast.success("Copied Transaction Information");
    }
  }, [shareLinkCopied, allTransactionData]);
  // PAGINATION
  let PageSize = 10;
  const currentTrxData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return reverseData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, reverseData]);
  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    localStorage.removeItem("accessToken");
    signOut(auth);
    toast.error(error?.message);
    navigate("/");
  }

  // FILTER TRANSACTION DATA
  const handleFilterMonth = (e) => {
    const getMonth = transactionData.filter((data) =>
      data.date.includes(e.target.value)
    );
    setFilterData(getMonth);
  };
  const getFilterDate = (e) => {
    const date = e.target.value;
    const [year, month, day] = date.substring(0, 10).split("-");
    let fullMonth;
    if (month) {
      const [none, value] = month.split("");
      if (none == 0) {
        fullMonth = value;
      } else {
        fullMonth = month;
      }
    }
    const getdate = fullMonth + "/" + day + "/" + year;
    const getMonth = transactionData.filter((data) =>
      data.fullDate.includes(getdate)
    );
    setFilterData(getMonth);
  };
  // GET FULL YEAR
  const getYear = new Date().toLocaleDateString("en-us", {
    year: "numeric",
  });

  //   COPY TRANSACTION DATA FUNCTION
  const onShare = (data) => {
    navigator.clipboard.writeText(`
    Amount: ${data.amount}$
    Email: ${data.email}
    Name: ${data.userName ? data.userName : data.name}
    TRX ID: ${
      data.transactionId ? data.transactionId : "Transaction Id Not Available"
    }
    Date: ${data.fullDate}
    Time: ${data.time}
    Type: ${data.type}
    `);
    setShareLinkCopied(true);
    setTimeout(() => {
      setShareLinkCopied(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto lg:mt-24 lg:px-10 py-10 mt-10">
      <div className=" px-2 lg:w-8/12 mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2
              data-testid="transaction-heading"
              className="font-bold text-xl border-b-4 border-black pb-2 w-48 mb-3"
            >
              All Transaction
            </h2>
            <label htmlFor="input-date" className="text-lg font-bold">
              Select Date:
            </label>
            <input
              type="date"
              name=""
              id="input-date"
              onChange={getFilterDate}
              className="bg-transparent	ml-3"
            />
          </div>
          <select
            onChange={handleFilterMonth}
            name="option"
            className="select select-ghost max-w-xs mb-50 text-lg"
          >
            <option value="">Select Month</option>
            <option value={`Jan ${getYear}`}>January {getYear}</option>
            <option value={`Feb ${getYear}`}>February {getYear}</option>
            <option value={`Mar ${getYear}`}>March {getYear}</option>
            <option value={`Apr ${getYear}`}>April {getYear}</option>
            <option value={`may ${getYear}`}>May {getYear}</option>
            <option value={`Jun ${getYear}`}>June {getYear}</option>
            <option value={`jul ${getYear}`}>July {getYear}</option>
            <option value={`Aug ${getYear}`}>August {getYear}</option>
            <option value={`Sep ${getYear}`}>September {getYear}</option>
            <option value={`Oct ${getYear}`}>October {getYear}</option>
            <option value={`Nov ${getYear}`}>November {getYear}</option>
            <option value={`Dec ${getYear}`}>December {getYear}</option>
          </select>
        </div>
        <div className="mt-8">
          <ul>
            {currentTrxData.map((transAction) => (
              <li
                className={`flex items-center my-4 p-3 rounded-lg w-full shadow`}
                key={transAction._id}
              >
                <div className="lg:mr-8 w-36">
                  <h5 className="gray text-sm mb-1 md-responsive">
                    {transAction.fullDate === todayDate
                      ? "Today"
                      : transAction.fullDate}
                  </h5>
                  <h6 className="gray md-responsive">{transAction.time}</h6>
                </div>
                <div className="avatar">
                  <div className="w-14 md-img-responsive rounded-full ">
                    <img
                      src="https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"
                      alt="User Image"
                    />
                  </div>
                </div>
                <div className="ml-5 flex items-center justify-between w-full">
                  <div>
                    <h5 className="font-bold text-lg md-type-responsive ">
                      {transAction?.type}
                    </h5>
                    <h6 className="gray md-responsive">
                      {transAction?.userName}
                    </h6>
                    {transAction?.transactionId && (
                      <h6 className="gray md-trx-responsive">
                        {transAction.transactionId}
                      </h6>
                    )}
                  </div>
                  <div className="flex align-items-center ">
                    <div className="" onClick={() => onShare(transAction)}>
                      <i className="fa-solid fa-copy cursor-pointer"></i>
                    </div>
                    <h3
                      className={`text-2xl amount-style font-medium  text-right md-amount-responsive ${
                        transAction.type === "Add Money" ||
                        transAction.type === "Receive Money"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transAction.type === "Add Money" ||
                      transAction.type === "Receive Money"
                        ? "+" + transAction.amount
                        : "-" + transAction.amount}
                      $
                    </h3>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className={`mt-12 ${allTransactionData.length < 10 && "hidden"}`}>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={filterData.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};
export default AllTransaction;
