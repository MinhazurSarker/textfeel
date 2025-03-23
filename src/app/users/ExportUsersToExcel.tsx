"use client";
import { getAllUsers } from "@/lib/actions/get/user";
import { IUser } from "@/lib/models/User";
import { saveAs } from "file-saver";
import moment from "moment";
import { useState } from "react";
import * as XLSX from "xlsx";

function ExportUsersToExcel() {
  const [loading, setLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // Replace with your API endpoint
      const users = await getAllUsers();
      const list = users.flatMap((item: IUser) => [
        item.simslot1,
        item.simslot2,
      ]);

      generateExcel(list);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };
  const generateExcel = (
    users: {
      number: string;
      email: string;
      name: string;
      webFileNumber: string;
      ivac: string;
      mission: string;
      visaType: string;
      familyNumbers: {
        fullName: string;
        webFileNumber: string;
      }[];
      ivacLogin: string;
      ivacPass: string;
    }[],
  ) => {
    console.log(users);
    if (!users || users?.length === 0) return;

    // Find the max number of family members for dynamic headers
    const maxFamilyMembers = Math.max(
      ...users.map((user) => user.familyNumbers.length),
    );

    // Define the headers
    const headers = [
      "NAME",
      "PHONE",
      "EMAIL",
      "MISSION",
      "IVAC",
      "IVAC LOGIN",
      "IVAC PASS",
      "VISA TYPE",
      "WEB FILE NUMBER",
      "NUMBER OF FAMILY MEMBERS",
      ...Array.from({ length: maxFamilyMembers }, (_, i) => [
        `FAMILY MEMBER ${i + 1} FULL NAME`,
        `FAMILY MEMBER ${i + 1} WEB FILE NUMBER`,
      ]).flat(),
    ];

    // Format the data
    const data = users.map((user) => {
      const familyData = user.familyNumbers || [];
      const row = [
        user.name,
        user.number,
        user.email,
        user.mission,
        user.ivac,
        user.ivacLogin,
        user.ivacPass,
        user.visaType,
        user.webFileNumber,
        familyData.length,
        ...familyData.flatMap(
          (member: { fullName: string; webFileNumber: string }) => [
            member.fullName,
            member.webFileNumber,
          ],
        ),
      ];

      // Fill empty spaces if the user has fewer family members than max
      while (row.length < headers.length) {
        row.push("");
      }

      return row;
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Create a Blob and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `users_data_${moment().format("DD_MMM_YYYY_hh_mm_a")}.xlsx`);
  };
  return (
    <button
      onClick={fetchUserData}
      disabled={loading}
      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
    >
      {loading ? "Generating..." : "Download Excel"}
    </button>
  );
}

export default ExportUsersToExcel;
