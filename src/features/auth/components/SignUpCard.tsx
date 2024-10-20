import DottedSeparator from "@/components/dotted";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

const SignUpCard = () => {
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up!</CardTitle>
        <CardDescription>
          By signin up you agree to our <br />
          <Link href={"/"}>
            <span className="text-blue-700">Privacy policy </span>
          </Link>
          and{" "}
          <Link href={"/"}>
            <span className="text-blue-700">Terms of service</span>
          </Link>
        </CardDescription>
      </CardHeader>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        <form className="space-y-4">
          <Input
            required
            type="text"
            placeholder="Enter name"
            disabled={false}
            value={""}
            onChange={() => {}}
          />

          <Input
            required
            type="email"
            placeholder="Enter email address"
            disabled={false}
            value={""}
            onChange={() => {}}
          />

          <Input
            required
            type="password"
            placeholder="Enter password"
            max={256}
            min={8}
            disabled={false}
            value={""}
            onChange={() => {}}
          />

          <Button size={"lg"} disabled={false} className="w-full">
            Sign Up
          </Button>
        </form>
      </CardContent>

      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          variant={"secondary"}
          size={"lg"}
          className="w-full"
          disabled={false}
        >
          <FcGoogle className="mr-2 size-5" />
          Login with Google
        </Button>

        <Button
          variant={"secondary"}
          size={"lg"}
          className="w-full"
          disabled={false}
        >
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardContent>
    </Card>
  );
};

export default SignUpCard;
