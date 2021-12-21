import { Card, Col, Empty, message, notification, Row, Tag } from "antd";
import Search from "antd/lib/input/Search";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { hyperApi, voucherServer } from "../config";
import moment from "moment";
import Button from "../components/Button";
import { toaster } from "evergreen-ui";

export default function DContent() {
  const [loading, setLoading] = useState(false);
  const [currentTicket, setCurrenTicket] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState([]);
  const [mCode, setmCode] = useState("");

  const [nEvent, setEvent] = useState(null);

  async function getEvent() {
    const nEvent = JSON.parse(sessionStorage.getItem("event"));
    // console.log(nEvent);

    setEvent(nEvent);
  }

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
    setVerifying(true);
    try {
      await axios.get(
        hyperApi +
          "/events/ticket/one/verify?id=" +
          code +
          "&verificationCode=" +
          nEvent.verificationCode
      );
      // await getVerified();
      // setSucces(true);
      setCurrenTicket(null);
      toaster.success("Ticket verified successfully");
    } catch (e) {
      notification.error({
        message: "Something went wrong",
        placement: "bottomRight",
      });
    } finally {
      setVerifying(false);
    }
  }

  useEffect(() => {
    // getVerified();
    getEvent();
  }, []);

  return (
    <div
      style={{ height: "83vh" }}
      class="bg-gray-50 flex flex-col  py-12 sm:px-6 lg:px-8"
    >
      <div class="relative bg-white overflow-hidden">
        <div class="hidden lg:block lg:absolute lg:inset-0" aria-hidden="true">
          <svg
            class="absolute top-0 left-1/2 transform translate-x-64 -translate-y-8"
            width="640"
            height="784"
            fill="none"
            viewBox="0 0 640 784"
          >
            <defs>
              <pattern
                id="9ebea6f4-a1f5-4d96-8c4e-4c2abf658047"
                x="118"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x="0"
                  y="0"
                  width="4"
                  height="4"
                  class="text-gray-200"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              y="72"
              width="640"
              height="640"
              class="text-gray-50"
              fill="currentColor"
            />
            <rect
              x="118"
              width="404"
              height="784"
              fill="url(#9ebea6f4-a1f5-4d96-8c4e-4c2abf658047)"
            />
          </svg>
        </div>

        <div class="relative pt-6 pb-16 sm:pb-24 lg:pb-32">
          <main class="mt-16 mx-auto max-w-7xl px-4 sm:mt-24 sm:px-6 lg:mt-32">
            <div class="lg:grid lg:grid-cols-12 lg:gap-8">
              <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <h1>
                  <span class="block text-sm font-semibold uppercase tracking-wide text-gray-500 sm:text-base lg:text-sm xl:text-base">
                    {nEvent?.title}
                  </span>
                  <span class="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                    <span class="block text-gray-900">Scan QR Code </span>
                    <span class="block text-blue-600">to verify</span>
                  </span>
                </h1>
                <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  {nEvent?.about}
                </p>
                <div class="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                  <p class="text-base font-medium text-gray-900">
                    Scan QR code to verify
                  </p>
                  <form
                    onSubmit={async (t) => {
                      t.preventDefault();
                      const v = t.target.referenceCode.value;

                      setLoading(true);
                      setmCode("");
                      try {
                        const nn = await axios.get(
                          hyperApi +
                            "/events/tickets/one?reference=" +
                            v +
                            "&verificationCode=" +
                            nEvent?.verificationCode
                        );
                        console.log(nn?.data);
                        message.success("Valid Ticket found");
                        if (!nn?.data?.verified) {
                          verifyVoucher(nn.data?._id);
                        }
                        setCurrenTicket(nn.data);
                        setLoading(false);
                      } catch (e) {
                        setLoading(false);
                        setLoading(false);
                        toaster.danger("Invalid Ticket Code");
                      }
                    }}
                    class="mt-3 sm:flex"
                  >
                    <input
                      autoFocus
                      value={mCode}
                      onChange={(t) => {
                        setmCode(t.target.value);
                        setCurrenTicket(null);
                      }}
                      name="referenceCode"
                      id="referenceCode"
                      class="py-3 mr-5 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                      placeholder="Scan Code to autofill"
                    />
                    <div>
                      <Button
                        loading={loading || verifying}
                        type="submit"
                        title="Search"
                      />
                    </div>
                  </form>
                </div>
                {currentTicket && (
                  <div class="bg-white mt-10">
                    <div class=" mx-auto ">
                      <div class="divide-y-2 divide-gray-200">
                        <div class="lg:grid lg:grid-cols-3 lg:gap-8">
                          <h2 class="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                            Ticket Details
                          </h2>
                          <div class="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12 lg:mt-0 lg:col-span-2">
                            <div>
                              <h3 class="text-lg leading-6 font-medium text-gray-900">
                                Attendee
                              </h3>
                              <dl class="mt-2 text-base text-gray-500">
                                <div>
                                  <dt class="sr-only">Email</dt>
                                  <dd>{currentTicket?.user?.email}</dd>
                                </div>
                                <div class="mt-1">
                                  <dt class="sr-only">Phone number</dt>
                                  <dd>{currentTicket?.user?.phonenumber}</dd>
                                </div>
                              </dl>
                            </div>
                            <div className="ml-10">
                              <h3 class="text-lg leading-6 font-medium text-gray-900">
                                Verification Status
                              </h3>
                              <dl class="mt-2 text-base text-gray-500">
                                <div>
                                  <dt class="sr-only">Status</dt>
                                  <dd>
                                    {currentTicket?.verified ? "Verified" : "-"}
                                  </dd>
                                </div>
                                <div class="mt-1">
                                  <dt class="sr-only">Date Verified</dt>
                                  <dd>
                                    {currentTicket?.verified
                                      ? moment(
                                          currentTicket?.dateVerified
                                        ).format("MMM, Do YYYY hh:mm A")
                                      : "-"}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div class="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <svg
                  class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 scale-75 origin-top sm:scale-100 lg:hidden"
                  width="640"
                  height="784"
                  fill="none"
                  viewBox="0 0 640 784"
                  aria-hidden="true"
                >
                  <defs>
                    <pattern
                      id="4f4f415c-a0e9-44c2-9601-6ded5a34a13e"
                      x="118"
                      y="0"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect
                        x="0"
                        y="0"
                        width="4"
                        height="4"
                        class="text-gray-200"
                        fill="currentColor"
                      />
                    </pattern>
                  </defs>
                  <rect
                    y="72"
                    width="640"
                    height="640"
                    class="text-gray-50"
                    fill="currentColor"
                  />
                  <rect
                    x="118"
                    width="404"
                    height="784"
                    fill="url(#4f4f415c-a0e9-44c2-9601-6ded5a34a13e)"
                  />
                </svg>
                <div class="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <button
                    type="button"
                    class="relative block w-full bg-white rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <span class="sr-only">Watch our video to learn more</span>
                    <img class="w-full" src={nEvent?.images[0]} alt="" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* <Row gutter={4}>
        <Col sm={16} md={16}>
          <Card
            loading={verifying}
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
                    message.success("Valid Ticket found");
                    if (!nn?.data?.verified) {
                      verifyVoucher(nn.data?.code);
                    }
                    setCurrenTicket(nn.data);
                    setLoading(false);
                  } catch (e) {
                    setLoading(false);
                    setLoading(false);
                    notification.error({
                      message: "Invalid Ticket",
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
                          <Tag color="green">Valid Ticket</Tag>
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
                                  autoFocus
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
      </Row> */}
    </div>
  );
}
