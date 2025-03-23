"use client";

import { postOTP } from "@/lib/actions/post/sms";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const SignIn: React.FC = () => {
  const router = useRouter();
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-screen flex-wrap items-center">
        <div className="mx-auto w-full rounded-lg border-stroke dark:border-strokedark xl:w-1/3 xl:border-2">
          <div className="  w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className=" text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Submit OTP
            </h2>
            <Link
              href="/apk/app-release.apk"
              className="mb-9 flex flex-col items-start text-primary"
            >
              <p>Download the app</p>
            </Link>

            <form
              action={async (f) => {
                const res = await postOTP(f);

                toast[res.type](res.message);
                console.log("form submitted");
              }}
            >
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="number"
                    placeholder="Enter your Phone Number"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  OTP
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter your OTP"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                </div>
              </div>

              <div className="mb-5">
                <input
                  type="submit"
                  value="Submit"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
