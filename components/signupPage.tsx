"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Form, Input, Button as AntButton, message, Checkbox } from "antd";
import { Mail, Lock, User, ArrowLeft, ShieldCheck, Rocket } from "lucide-react";

// Shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

interface onRegisterInterface {
  email: string
  fullname: string
  password: string
  terms: true | false
}

const SignupPage = () => {
  const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Phase 1: Register Account
  const onRegister = (values: onRegisterInterface) => {
    setLoading(true);
    // Simulation: API call to register and send OTP
    setTimeout(() => {
      console.log(values);
      setFormData({ name: values.fullname, email: values.email });
      setStep(2);
      setLoading(false);
      message.success("Account created! Please verify your email.");
    }, 1500);
  };

  // Phase 2: Verify OTP
  const onVerifyOTP = (values: { otp: string }) => {
    setLoading(true);
    // Simulation: Verify OTP logic
    setTimeout(() => {
      console.log("Verified for:", formData.email, "OTP:", values.otp);
      setLoading(false);
      message.success("Email verified! Welcome to DevSync.");
      // router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] p-4">
      
      {/* Back to Home */}
      <Link href="/" className="absolute top-8 left-8">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </Link>

      <div className="w-full max-w-112.5">
        
        {/* Branding */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <Card className="border shadow-xl shadow-slate-200/60 bg-white overflow-hidden">
          
          {step === 1 ? (
            /* --- STEP 1: REGISTRATION FORM --- */
            <>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Create an account</CardTitle>
                <CardDescription className="text-[15px]">
                  Join 500+ student developers on DevSync
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <Form layout="vertical" onFinish={onRegister} requiredMark={false} scrollToFirstError>
                  
                  {/* Full Name */}
                  <Form.Item
                    name="fullname"
                    label={<span className="text-sm font-semibold text-slate-700">Full Name</span>}
                    rules={[{ required: true, message: "What's your name?" }]}
                  >
                    <Input 
                      prefix={<User className="h-4 w-4 text-slate-400 mr-2" />} 
                      placeholder="John Doe" 
                      className="h-11 rounded-md"
                    />
                  </Form.Item>

                  {/* Email */}
                  <Form.Item
                    name="email"
                    label={<span className="text-sm font-semibold text-slate-700">Email Address</span>}
                    rules={[
                      { required: true, message: "Email is required!" },
                      { type: "email", message: "Enter a valid email!" }
                    ]}
                  >
                    <Input 
                      prefix={<Mail className="h-4 w-4 text-slate-400 mr-2" />} 
                      placeholder="john@university.edu" 
                      className="h-11 rounded-md"
                    />
                  </Form.Item>

                  {/* Password */}
                  <Form.Item
                    name="password"
                    label={<span className="text-sm font-semibold text-slate-700">Password</span>}
                    rules={[
                      { required: true, message: "Create a password!" },
                      { min: 6, message: "Password must be at least 6 characters!" }
                    ]}
                  >
                    <Input.Password 
                      prefix={<Lock className="h-4 w-4 text-slate-400 mr-2" />} 
                      placeholder="••••••••" 
                      className="h-11 rounded-md"
                    />
                  </Form.Item>

                  <Form.Item name="terms" valuePropName="checked" rules={[
                    { validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Accept terms to continue')) },
                  ]}>
                    <Checkbox className="text-xs text-slate-500">
                      I agree to the <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
                    </Checkbox>
                  </Form.Item>

                  <AntButton 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    loading={loading}
                    className="h-11 font-bold bg-primary hover:bg-primary/90 border-none rounded-md mt-2"
                  >
                    <Rocket className="h-4 w-4 mr-2" /> Create Account
                  </AntButton>
                </Form>
              </CardContent>
            </>
          ) : (
            /* --- STEP 2: OTP VERIFICATION --- */
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary">
                   <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Verify your email</CardTitle>
                <CardDescription className="text-[15px]">
                  Hi <span className="font-bold text-slate-900">{formData.name}</span>, we&apos;ve sent a 6-digit code to <br/>
                  <span className="font-medium text-primary">{formData.email}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <Form layout="vertical" onFinish={onVerifyOTP} requiredMark={false}>
                  
                  <Form.Item
                    name="otp"
                    label={<span className="text-sm font-semibold text-slate-700 block text-center">Verification Code</span>}
                    rules={[{ required: true, len: 6, message: "Enter 6-digit OTP!" }]}
                  >
                    <Input 
                      placeholder="000000" 
                      className="h-12 text-center text-xl tracking-[0.4em] font-black rounded-md border-2 focus:border-primary"
                      maxLength={6}
                    />
                  </Form.Item>

                  <AntButton 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    loading={loading}
                    className="h-11 font-bold bg-primary border-none rounded-md mt-2"
                  >
                    Verify & Complete
                  </AntButton>

                  <div className="mt-6 text-center text-sm text-slate-500">
                    Didn&apos;t receive the code? 
                    <button type="button" className="ml-1 text-primary font-bold hover:underline">Resend OTP</button>
                  </div>
                </Form>
              </CardContent>
            </>
          )}

          <CardFooter className="bg-slate-50/80 border-t py-4 rounded-b-xl flex justify-center">
            <p className="text-sm text-slate-500">
              Already have an account? 
              <Link href="/login" className="ml-1 font-bold text-primary hover:underline">Sign In</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;