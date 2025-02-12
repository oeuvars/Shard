import { HydrateClient, trpc } from "@/trpc/server";
import React, { Suspense } from "react";
import Client from "./client";

type Props = {};

const Page = async (props: Props) => {
  void trpc.hello.prefetch({ text: "hello world" });

  return (
    <HydrateClient>
      <Suspense fallback={<div>Loading...</div>}>
        <Client />
      </Suspense>
    </HydrateClient>
  );
};

export default Page;
