import { getProfile } from "@/lib/actions/get/user";
import PageComp from "./PageComp";

const page = async ({}: {}) => {
  const { user } = await getProfile();
  return <PageComp user={user} />;
};

export default page;
