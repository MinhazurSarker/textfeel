import { getUser } from "@/lib/actions/get/user";
import PageComp from "./PageComp";

const page = async ({ params }: { params: { id: string } }) => {
  const { user } = await getUser(params.id);
  return <PageComp user={user} />;
};

export default page;
