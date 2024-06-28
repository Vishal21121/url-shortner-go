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

const Sigin = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const { login } = useUserContext();

  const googleSignin = async () => {
    try {
      window.open(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/users/google`,
        "_self"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const githubSignin = async () => {
    try {
      window.open(
        `${import.meta.env.VITE_SERVER_URI}/api/v1/users/github`,
        "_self"
      );
    } catch (error) {
      console.log(error);
    }
  };

  const formSchema = z.object({
    email: z.string().email(2, { message: "Please enter proper email id" }),
    password: z
      .string()
      .min(8, { message: "Password should be of minimum 8 characters" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
          <TabsTrigger value="password" className="w-1/2">
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="password" className="p-2">
          <div className="flex flex-col mb-4">
            <p className="text-3xl font-bold">Signup</p>
            <p className="text-base text-gray-500">
              Create an account if you haven't already
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sigin;
