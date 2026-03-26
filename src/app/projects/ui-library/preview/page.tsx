import { headers } from "next/headers";
import { notFound } from "next/navigation";
import PreviewContent from "./PreviewContent";

const PreviewPage = async () => {
   const headersList = await headers();
   const host = headersList.get("host") ?? "";

   const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1");
   if (!isLocal) {
      notFound();
   }

   return <PreviewContent />;
};

export default PreviewPage;
