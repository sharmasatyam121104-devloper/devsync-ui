"use client";

import { useState } from "react";
import Link from "next/link";
import { Form, Input, Button as AntButton, message } from "antd";
import { Mail, Lock, ArrowLeft, KeyRound, ShieldCheck, RotateCcw } from "lucide-react";

// Shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import clientCatchError from "@/lib/clientCatchError";
import { useRouter } from "next/navigation";
import httpRequest from "@/lib/http";

interface handleResetPasswordInterface {
  newPassword: string
  otp: string
}

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  // Phase 1: OTP Send Logic
  const handleSendOTP = async(values: { email: string }) => {
    try {
      setLoading(true);
      await httpRequest.post('/user/forgot-password', values)
      setUserEmail(values.email);
      setStep(2);
      message.success("OTP sent successfully to " + values.email);
    } 
    catch (error) {
      return clientCatchError(error)
    }
    finally {
      setLoading(false)
    }
  };

  // Phase 2: Reset Password Logic
  const handleResetPassword = async(values: handleResetPasswordInterface) => {
   try {
     setLoading(true);
     const payload = {
      email: userEmail,
      otp: values.otp,
      newPassword: values.newPassword
     }
      await httpRequest.post('/user/change-password', payload)
      message.success("Password updated! You can now login.");
      router.push('/login')
   } 
    catch (error) {
      return clientCatchError(error)
    } 
    finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#fafafa] p-4">
      
      {/* Top Navigation */}
      <Link href="/login" className="absolute top-8 left-8">
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Login
        </Button>
      </Link>

      <div className="w-full max-w-105">
        
        {/* Branding */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        <Card className="border shadow-xl shadow-slate-200/60 bg-white">
          
          {step === 1 ? (
            /* --- STEP 1: EMAIL PHASE --- */
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center">
                   <KeyRound className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Forgot Password?</CardTitle>
                <CardDescription className="text-[15px]">
                  No worries! Enter your email and we&apos;ll send you an OTP to reset it.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <Form layout="vertical" onFinish={handleSendOTP} requiredMark={false}>
                  <Form.Item
                    name="email"
                    label={<span className="text-sm font-semibold text-slate-700">Email Address</span>}
                    rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}
                  >
                    <Input 
                      prefix={<Mail className="h-4 w-4 text-slate-400 mr-2" />} 
                      placeholder="name@university.edu"
                      className="h-11 rounded-md focus:border-primary"
                    />
                  </Form.Item>

                  <AntButton 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    loading={loading}
                    className="h-11 font-bold bg-primary hover:bg-primary/90 border-none rounded-md mt-2 shadow-md shadow-primary/20"
                  >
                    Send OTP
                  </AntButton>
                </Form>
              </CardContent>
            </>
          ) : (
            /* --- STEP 2: VERIFICATION PHASE --- */
            <>
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center text-emerald-600">
                   <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Verify OTP</CardTitle>
                <CardDescription className="text-[15px]">
                  Code sent to <span className="font-bold text-slate-900">{userEmail}</span>
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <Form layout="vertical" onFinish={handleResetPassword} requiredMark={false}>
                  
                  {/* OTP Field */}
                  <Form.Item
                    name="otp"
                    label={<span className="text-sm font-semibold text-slate-700">6-Digit Code</span>}
                    rules={[{ required: true, len: 6, message: "Enter the 6-digit OTP!" }]}
                  >
                    <Input 
                      placeholder="000000" 
                      className="h-12 text-center text-xl tracking-[0.4em] font-black rounded-md border-2 focus:border-emerald-500"
                      maxLength={6}
                    />
                  </Form.Item>

                  {/* New Password Field */}
                  <Form.Item
                    name="newPassword"
                    label={<span className="text-sm font-semibold text-slate-700">New Password</span>}
                    rules={[{ required: true, min: 6, message: "Minimum 6 characters required!" }]}
                  >
                    <Input.Password 
                      prefix={<Lock className="h-4 w-4 text-slate-400 mr-2" />} 
                      placeholder="••••••••" 
                      className="h-11 rounded-md"
                    />
                  </Form.Item>

                  <AntButton 
                    type="primary" 
                    htmlType="submit" 
                    block 
                    loading={loading}
                    className="h-11 font-bold bg-emerald-600 hover:bg-emerald-700 border-none rounded-md mt-2"
                  >
                    Reset Password
                  </AntButton>

                  <div className="mt-6 flex flex-col items-center gap-3">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-sm text-slate-500 hover:text-primary flex items-center gap-1.5 transition-colors font-medium"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Use a different email
                    </button>
                  </div>
                </Form>
              </CardContent>
            </>
          )}

          <CardFooter className="bg-slate-50/80 border-t py-4 rounded-b-xl flex justify-center">
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">
              Back to sign in
            </Link>
          </CardFooter>
        </Card>

        {/* Support Text */}
        <p className="mt-8 text-center text-xs text-slate-400">
          If you didn&apos;t receive an email, check your spam folder or contact 
          <span className="text-slate-600 font-medium ml-1">support@devsync.com</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;