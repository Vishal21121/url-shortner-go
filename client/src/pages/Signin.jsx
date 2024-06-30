import React, { useState } from "react";
import { useUserContext } from "../context/userContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Loader2 } from "lucide-react";

const Sigin = () => {
  const { login, registerUser, isLoginLoading, isRegisterLoading } =
    useUserContext();

  const loginFormSchema = z.object({
    email: z
      .string({ required_error: "Please provide email" })
      .email(2, { message: "Please enter proper email id" }),
    password: z.string({ required_error: "Please provide password" }),
  });

  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
  });

  const signupFormSchema = z.object({
    username: z
      .string({ required_error: "Username is required" })
      .min(3, { message: "Username should be within 3 to 8 characters" })
      .max(8, { message: "Username should be within 3 to 8 characters" }),
    email: z
      .string({ required_error: "Please provide email id" })
      .email({ message: "Please provide proper email id" }),
    password: z
      .string({ required_error: "Please provide password" })
      .min(8, { message: "Password should be within 8 to 13 characters" })
      .max(13, { message: "Password should be within 8 to 13 characters" }),
  });

  const signupForm = useForm({
    resolver: zodResolver(signupFormSchema),
  });

  function handleLoginSubmit(values) {
    login(values);
  }

  function handleRegisterSubmit(values) {
    registerUser(values);
  }

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Tabs
        defaultValue="login"
        className="w-[400px] ring-2 ring-gray-300 rounded-md p-4 mx-auto my-10"
      >
        <TabsList className="w-full flex">
          <TabsTrigger value="login" className="w-1/2">
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className="w-1/2">
            Signup
          </TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="p-2">
          <div className="flex flex-col mb-4">
            <p className="text-3xl font-bold">Login</p>
            <p className="text-base text-gray-500">
              to your account if you already have one
            </p>
          </div>
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isLoginLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="signup" className="p-2">
          <div className="flex flex-col mb-4">
            <p className="text-3xl font-bold">Signup</p>
            <p className="text-base text-gray-500">
              Create an account if you haven't already
            </p>
          </div>
          <Form {...signupForm}>
            <form
              onSubmit={signupForm.handleSubmit(handleRegisterSubmit)}
              className="space-y-4"
            >
              <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signupForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isRegisterLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button type="submit" isLoading>
                  Submit
                </Button>
              )}
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sigin;
