import { Card, Col, Empty, message, notification, Row, Tag } from "antd";
import Search from "antd/lib/input/Search";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { voucherServer } from "../config";
import moment from "moment";

export default function DContent() {
  const [loading, setLoading] = useState(false);
  const [currentTicket, setCurrenTicket] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState([]);
  const [mCode, setmCode] = useState("");

  const [success, setSucces] = useState(false);

  async function getVerified() {
    try {
      const nn = await axios.get(voucherServer + "/voucher/group");
      setVerified(nn.data);
    } catch (e) {
      message.error(e.message);
    }
  }

  async function verifyVoucher(code) {
    try {
      await axios.get(voucherServer + "/voucher/verify?code=" + code);
      await getVerified();
      setSucces(true);
    } catch (e) {
      notification.error({
        message: "Something went wrong",
        placement: "bottomRight",
      });
    }
  }

  useEffect(() => {
    getVerified();
  }, []);

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col  py-12 sm:px-6 lg:px-8">
      {success && (
        <div class="fixed z-10 inset-0 overflow-y-auto">
          <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 transition-opacity" aria-hidden="true">
              <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              class="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div>
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    class="h-6 w-6 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    Verification Successful
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Voucher has been verified successfully, press okay to
                      continue.
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6">
                <button
                  onClick={async () => {
                    setSucces(false);
                    setCurrenTicket(null);
                  }}
                  type="button"
                  class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Row gutter={4}>
        <Col sm={16} md={16}>
          <Card
            extra={
              <Search
                size="large"
                value={mCode}
                loading={loading}
                onChange={(t) => {
                  setmCode(t.target.value);
                  setCurrenTicket(null);
                }}
                onSearch={async (v) => {
                  setLoading(true);
                  setmCode("");
                  try {
                    const nn = await axios.get(
                      voucherServer + "/voucher/one?code=" + v
                    );
                    message.success("Voucher found");
                    setCurrenTicket(nn.data);
                    setLoading(false);
                  } catch (e) {
                    setLoading(false);
                    setLoading(false);
                    notification.error({
                      message: "Cannot find Voucher",
                      placement: "bottomRight",
                    });
                  }
                }}
                autoFocus
                placeholder="Scan QR Code"
                enterButton
              />
            }
            title="Place cursor on search bar to search for card"
          >
            {currentTicket ? (
              <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Ticket Voucher Verification
                  </h3>
                  <p class="mt-1 max-w-2xl text-sm text-gray-500"></p>
                </div>
                <div class="border-t border-gray-200">
                  <dl>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">
                        Ticket Type
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {currentTicket && currentTicket.type}
                      </dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt class="text-sm font-medium text-gray-500">
                        Verification
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {currentTicket && currentTicket.verified ? (
                          <Tag color="green">Verified</Tag>
                        ) : (
                          <Tag color="red">Not Verified</Tag>
                        )}
                      </dd>
                    </div>
                    {currentTicket && currentTicket.verified && (
                      <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">
                          Time Verified
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          {moment(currentTicket.dateVerified).calendar()}
                        </dd>
                      </div>
                    )}

                    {currentTicket && !currentTicket.verified && (
                      <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">
                          Verify Ticket
                        </dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">
                            <li class="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                              <div class="w-0 flex-1 flex items-center">
                                <svg
                                  class="flex-shrink-0 h-5 w-5 text-gray-400"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                    clip-rule="evenodd"
                                  />
                                </svg>
                                <span class="ml-2 flex-1 w-0 truncate">
                                  Click on Verify to verify Ticket
                                </span>
                              </div>
                              <div class="ml-4 flex-shrink-0">
                                <button
                                  onClick={async () => {
                                    verifyVoucher(currentTicket.code);
                                  }}
                                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Verify
                                </button>
                              </div>
                            </li>
                          </ul>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            ) : (
              <Empty />
            )}
          </Card>
        </Col>
        <Col sm={8} md={8}>
          <Card
            title="VerifiedCards"
            extra={
              <Tag style={{ borderRadius: 20 }} color="orange">
                0
              </Tag>
            }
          >
            <div>
              <ul class="divide-y divide-gray-200">
                {verified.map((item) => (
                  <li class="py-4">
                    <div class="flex space-x-3">
                      {/* <img class="h-6 w-6 rounded-full" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3&w=256&h=256&q=80" alt="" /> */}
                      <div class="flex-1 space-y-1">
                        <div class="flex items-center justify-between">
                          <h3 class="text-sm font-medium">{item._id}</h3>
                          <p class="text-sm text-gray-500">{item.count}</p>
                        </div>
                        <p class="text-sm text-gray-500">
                          Total verified {item._id} tickets
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
