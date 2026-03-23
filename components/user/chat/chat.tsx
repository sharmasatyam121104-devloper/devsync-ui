'use client'

import React from 'react';
import useSWR from 'swr';
import { Skeleton, Button, Result } from 'antd';
import fetcher from '@/lib/fetcher';
import { useRouter } from 'next/navigation';

// Project & Member Interfaces
interface IUser {
  _id: string;
  fullname: string;
  email: string;
}

interface IMember {
  userId: IUser;
  role: string;
}

export interface IProject {
  _id: string;
  projectName: string;
  description: string;
  createdBy: string;
  members: IMember[];
  status: string;
  createdAt: string;
  updatedAt: string;
}


const Chat: React.FC = () => {
  const { data, isLoading, error } = useSWR<IProject[]>('/project', fetcher);
  const router = useRouter()

  const handleStartChat = (projectId: string) => {
    // Navigate to dynamic chat page
    router.push(`/user/chat/${projectId}`);
  };

  if(isLoading){
    return <Skeleton active/>
  }

  if(error){
     return <Result status="error" title="Failed to fetch projects." subTitle={error.message} />;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {data?.map(project => (
        <div
          key={project._id}
          className="bg-white p-5 rounded-xl shadow-md border border-gray-100"
        >
          <h2 className="text-xl font-bold mb-2 capitalize">{project?.projectName}</h2>
          <p className="text-gray-700 mb-2">{project?.description}</p>
          <p className="text-sm text-gray-500 mb-2">
            <strong>Lead:</strong> {project?.members[0]?.userId?.fullname}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            <strong>Status:</strong> {project?.status}
          </p>
          <Button type="primary" onClick={() => handleStartChat(project?._id)}>
            Start Chat
          </Button>
        </div>
      ))}
    </div>
  );
};

export default Chat;