'use client'
import React, { useEffect, useState } from "react";
import httpRequest from "@/lib/http";
import clientCatchError from "@/lib/clientCatchError";
import { Skeleton, Result, Button } from "antd";
import { UserCircle2 } from "lucide-react"; 

export interface UserInterface extends Document {
    fullname: string
    email: string
    password: string
    otp?: string
    otpExpireTime?: Date
    verify: boolean
    accessToken?: string
    refreshToken?: string
    refreshTokenExpiry?: Date
    role: "ADMIN" | "USER"
    status: "ACTIVE" | "BLOCK"
    updatedAt: Date
    createdAt: Date
}


const Profile: React.FC = () => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await httpRequest.get("/user/user-profile");
        setUser(response.data);
      } catch (err) {
        return clientCatchError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Skeleton active />;

  if (error)
    return (
      <Result status="error" title="Failed to fetch profile" subTitle={error} />
    );

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center  gap-6 mb-6 w-full">
        <div className="w-40 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden gap-8">
          {/* Placeholder avatar */}
          {user ? (
            <UserCircle2 className="w-16 h-16 text-gray-400 " />
          ) : null}
        </div>
        <div>
          <h2 className="text-2xl font-bold capitalize">{user?.fullname}</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-4 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            user?.verify ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {user?.verify ? "Verified" : "Not Verified"}
        </span>

        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
          {user?.role}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-2 text-gray-700">
        <p>
          <strong>Status:</strong> {user?.status}
        </p>
        <p>
          <strong>Account Created:</strong>{" "}
          {user ? new Date(user.createdAt).toLocaleDateString() : ""}
        </p>
        <p>
          <strong>Last Updated:</strong>{" "}
          {user ? new Date(user.updatedAt).toLocaleDateString() : ""}
        </p>
      </div>

      {/* Edit Button */}
      <div className="mt-6 flex justify-end">
        <Button type="primary">Edit Profile</Button>
      </div>
    </div>
  );
};

export default Profile;