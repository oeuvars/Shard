"use client";

import { trpc } from "@/trpc/client";
import React from "react";

type Props = {};

const Client = (props: Props) => {
  const [data] = trpc.hello.useSuspenseQuery({ text: "hello world" });
  return <div>{data.greeting}</div>;
};

export default Client;
