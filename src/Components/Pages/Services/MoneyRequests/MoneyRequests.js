import React, { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../../../../firebase.init";
import Spinner from "../../../Shared/Spinner/Spinner";
import RequestDetailsModal from "./RequestDetailsModal";
import { useSelector } from "react-redux";
import Pagination from "../../../Shared/Pagination/Pagination";

const MoneyRequests = ({ setRequestForConfirm }) => {
  const [user] = useAuthState(auth);
  const email = user?.user?.email || user?.email;

  const [requestLoading, setRequestLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [type, setType] = useState("incoming");

  const { isLoading, unseenNotifications, error } = useSelector(
    (state) => state.allNotification
  );

  const fetchRequests = () => {
    setRequestLoading(true);
    fetch("https://shohoj-pay-server.onrender.com/getRequests", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        email: email,
        type: type,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const mData = data?.reverse();
        setRequests(mData);
        setRequestLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, [user, type, unseenNotifications]);

  // START PAGINATION
  let PageSize = 10;
  const requestData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return requests.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, requests, PageSize]);

  return (
    <div className="min-h-screen">
      <h2 className="mt-24 text-[1.70rem] text-center textColor">
        Money Requests
      </h2>
      <div className="requests max-w-7xl mx-auto">
        <div className="overflow-x-auto md:max-w-6xl max-w-[95%] mx-auto">
          <div className="btn-group mt-8 mb-4">
            <button
              onClick={() => setType("incoming")}
              className={`btn btn-primary btn-outline btn-sm ${type === "incoming" && "btn-active"
                }`}
            >
              Incoming
            </button>
            <button
              onClick={() => setType("outgoing")}
              className={`btn btn-primary btn-outline btn-sm ${type !== "incoming" && "btn-active"
                }`}
            >
              Outgoing
            </button>
          </div>
          {/* Spinner here */}
          {requestLoading && <Spinner />}
          {/* Not request mess */}
          {!requestLoading && requestData.length === 0 && (
            <div className="min-h-[60vh] flex justify-center items-center">
              <h2 className="text-2xl">
                You have no {`${type === "incoming" ? "incoming" : "outgoing"}`}{" "}
                requests ;(
              </h2>
            </div>
          )}
          {/* Table here */}
          {!requestLoading && requestData.length !== 0 && (
            <table className="table w-full">
              {/* <!-- head --> */}
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Time</th>
                  {type === "outgoing" && <th>Status</th>}
                  {type === "incoming" && <th>Action</th>}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {/* Each request */}
                {requestData?.map((request, index) => (
                  <tr key={index}>
                    <td>
                      {type === "incoming"
                        ? request?.requesterName
                        : request?.donorName}
                    </td>
                    <td>{type === "incoming" ? request?.from : request?.to}</td>
                    <td>${request?.amount}</td>
                    <td>{request?.date}</td>
                    <td>{request?.time}</td>
                    {type === "outgoing" && (
                      <>
                        <td title={request.status}>
                          {request.status === "Approved" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6 fill-primary"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm3.059 8.062a.75.75 0 10-.993-1.124 12.785 12.785 0 00-3.209 4.358L9.53 12.22a.75.75 0 00-1.06 1.06l2.135 2.136a.75.75 0 001.24-.289 11.264 11.264 0 013.214-4.815z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 stroke-primary"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </td>
                        <td>
                          <label
                            htmlFor="request-details-modal"
                            onClick={() => setRequest(request)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </label>
                        </td>
                      </>
                    )}
                    {type === "incoming" && (
                      <>
                        <td>
                          <label
                            htmlFor="MoneyRequestConfirmModal"
                            // onClick={() => handleApprove(request)}
                            onClick={() =>
                              setRequestForConfirm([request, fetchRequests])
                            }
                            className={`btn btn-xs btn-primary ${request.status === "Approved" && "btn-disabled"
                              }`}
                          >
                            Approve{request.status === "Approved" && "d"}
                          </label>
                        </td>
                        <td>
                          <label
                            htmlFor="request-details-modal"
                            onClick={() => setRequest(request)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6 cursor-pointer"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </label>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div className={`mt-12 ${requests.length < 10 && "hidden"}`}>
        {/* START PAGINATION */}
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          totalCount={requests.length}
          pageSize={PageSize}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
      <RequestDetailsModal request={request} />
    </div>
  );
};

export default MoneyRequests;
