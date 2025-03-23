"use client";

import { updateProfile } from "@/lib/actions/post/user";
import { ivacs, missions, visaTypes } from "@/lib/models/User";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function PageComp({ user }: { user: User }) {
  const [userData, setUserData] = useState<User>(user);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/users");
    }
    setUserData(user);
    return () => {};
  }, [user]);

  const addFamilyNumber = () => {
    setUserData({
      ...userData,
      familyNumbers: [
        ...userData.familyNumbers,
        { fullName: "", webFileNumber: "" },
      ],
    });
  };
  const removeFamilyNumber = (index: number) => {
    setUserData({
      ...userData,
      familyNumbers: userData.familyNumbers.filter((_, i) => i !== index),
    });
  };
  const updateFamilyNumber = (index: number, field: string, value: any) => {
    setUserData({
      ...userData,
      familyNumbers: userData.familyNumbers.map((familyNumber, i) =>
        i === index ? { ...familyNumber, [field]: value } : familyNumber,
      ),
    });
  };
  const update = async (e: any) => {
    e.preventDefault();
    const res = await updateProfile(userData);
    toast[res.type](res.message);
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 ">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Edit User Information
              </h3>
            </div>
            <div className="p-7">
              <div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phoneNumber"
                    >
                      Slot 1 Number
                    </label>
                    <input
                      value={userData.simslot1}
                      onChange={(e) => {
                        setUserData({ ...userData, simslot1: e.target.value });
                      }}
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      placeholder="+990 3343 7865"
                    />
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phoneNumber"
                    >
                      Slot 2 Number
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      value={userData.simslot2}
                      onChange={(e) => {
                        setUserData({ ...userData, simslot2: e.target.value });
                      }}
                      placeholder="+990 3343 7865"
                    />
                  </div>
                </div>
                <div className="mb-5.5 w-full">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <svg
                        className="fill-current"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.8">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                            fill=""
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      value={userData.name}
                      onChange={(e) => {
                        setUserData({ ...userData, name: e.target.value });
                      }}
                      placeholder="Devid Jhon"
                    />
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Username
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={userData.username}
                    onChange={(e) => {
                      setUserData({ ...userData, username: e.target.value });
                    }}
                    placeholder="devidjhon24"
                  />
                </div>

                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Password
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="password"
                    value={userData.password}
                    onChange={(e) => {
                      setUserData({ ...userData, password: e.target.value });
                    }}
                    placeholder="devidjhon24"
                  />
                </div>
                <hr />
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Email
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={userData.email}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        email: e.target.value,
                      });
                    }}
                    placeholder="Email"
                  />
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Web File Number
                  </label>
                  <input
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={userData.webFileNumber}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        webFileNumber: e.target.value,
                      });
                    }}
                    placeholder="Web file number"
                  />
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    IVAC
                  </label>
                  <select
                    value={userData.ivac}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        ivac: e.target.value,
                      });
                    }}
                    name="role"
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  >
                    {ivacs.map((ivac, index) => (
                      <option key={index} value={ivac}>
                        {ivac}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Mission
                  </label>
                  <select
                    value={userData.mission}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        mission: e.target.value,
                      });
                    }}
                    name="role"
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  >
                    {missions.map((mission, index) => (
                      <option key={index} value={mission}>
                        {mission}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Visa type
                  </label>
                  <select
                    value={userData.visaType}
                    onChange={(e) => {
                      setUserData({
                        ...userData,
                        visaType: e.target.value,
                      });
                    }}
                    name="role"
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  >
                    {visaTypes.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-5.5">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    Family Numbers
                  </label>
                  <div className="flex flex-col gap-4">
                    {userData.familyNumbers.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 gap-4 rounded-md border-2 border-stroke p-4 lg:grid-cols-9"
                      >
                        <div className="col-span-1 lg:col-span-4">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="Username"
                          >
                            Full name
                          </label>
                          <input
                            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            value={item.fullName}
                            onChange={(e) => {
                              updateFamilyNumber(
                                index,
                                "fullName",
                                e.target.value,
                              );
                            }}
                            placeholder="Full name"
                          />
                        </div>
                        <div className="col-span-1 lg:col-span-4">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="Username"
                          >
                            Web File Number
                          </label>
                          <input
                            className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            value={item.webFileNumber}
                            onChange={(e) => {
                              updateFamilyNumber(
                                index,
                                "webFileNumber",
                                e.target.value,
                              );
                            }}
                            placeholder="Web file number"
                          />
                        </div>
                        <div className="col-span-1 ">
                          <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="Username"
                          >
                            Delete
                          </label>
                          <button
                            onClick={(e) => removeFamilyNumber(index)}
                            className="flex justify-center rounded bg-danger px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={(e) => addFamilyNumber()}
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    >
                      Add Family Number
                    </button>
                  </div>
                </div>

                <div className="flex justify-between gap-4.5">
                  <button
                    onClick={(e) => update(e)}
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageComp;
