"use client";

import Link from "next/link";
import { Form, Input, Button as AntButton, Checkbox, message } from "antd";
import { Mail, Lock, ArrowLeft } from "lucide-react";

// Shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import Logo from "@/components/logo"; 
import {  useState } from "react";
import clientCatchError from "@/lib/clientCatchError";
import httpRequest from "@/lib/http";
import { useRouter } from "next/navigation";

interface ValuesInterface {
  email: string,
  password: true,
}

const LoginPage = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const router = useRouter()

  const onFinish = async(values: ValuesInterface) => {
    try {
      setLoading(true)
      const payload = {
        email: values.email,
        password: values.password
      }
      const {data} = await httpRequest.post('/user/login', payload)
      message.success(data.message||"Logging in success.!");
      const role = data.role
      console.log(role);
      if(role === "ADMIN"){
        router.replace('/admin')
      }
      else {
        router.replace('/user')
      }

    } catch (error) {
      return clientCatchError(error)
    }
    finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] p-4">
      
      {/* Back to Home Link */}
      <Link href="/" className="absolute top-8 left-8">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </Link>

      <div className="w-full max-w-100 space-y-6">
        
        {/* Centered Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" className="scale-110" />
        </div>

        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your workspace
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Ant Design Form */}
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              className="mt-4"
            >
              <Form.Item
                name="email"
                label={<span className="text-sm font-medium">Email Address</span>}
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Please enter a valid email!" }
                ]}
              >
                <Input 
                  prefix={<Mail className="h-4 w-4 text-muted-foreground mr-2" />} 
                  placeholder="name@university.edu" 
                  className="h-11 rounded-md"
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span className="text-sm font-medium">Password</span>}
                rules={[{ required: true, message: "Please enter your password!" }]}
              >
                <Input.Password 
                  prefix={<Lock className="h-4 w-4 text-muted-foreground mr-2" />} 
                  placeholder="••••••••" 
                  className="h-11 rounded-md"
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-6">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-sm">Remember me</Checkbox>
                </Form.Item>
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Form.Item className="mb-0">
                <AntButton 
                  type="primary" 
                  htmlType="submit" 
                  block 
                  className="h-11 text-md font-semibold bg-primary hover:bg-primary/90 rounded-md border-none"
                  loading={loading}
                  disabled={loading}
                >
                  Sign In
                </AntButton>
              </Form.Item>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-wrap justify-center gap-1 border-t bg-muted/20 py-4 rounded-b-xl">
            <span className="text-sm text-muted-foreground">Don&apos;t have an account?</span>
            <Link href="/signup" className="text-sm font-bold text-primary hover:underline">
              Create an account
            </Link>
          </CardFooter>
        </Card>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground px-8">
          By clicking continue, you agree to our 
          <Link href="#" className="underline underline-offset-4 hover:text-primary mx-1">Terms of Service</Link> 
          and 
          <Link href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;