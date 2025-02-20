import ECommerce from "@/components/Dashboard/E-commerce";
import { getStats } from "@/lib/actions/get/stats";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TextFeel Dashboard",
};

export default async function Home() {
  const data = await getStats();
  return (
    <>
      <ECommerce data={data} />
    </>
  );
}
