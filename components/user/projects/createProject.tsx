'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Users, Bug, Calendar, ShieldCheck } from "lucide-react"
import clientCatchError from '@/lib/clientCatchError'
import { Form, Input, Modal, Button as AntBtn, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import httpRequest from '@/lib/http'
import { mutate } from 'swr'
import { useRouter } from 'next/navigation'

interface OnValueInterface {
  projectName: string
  description: string
}

const CreateProject = () => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()
  const router = useRouter()

  const handleCloseModal = ()=>{
    form.resetFields()
    setOpen(false)
  }

  const handleCraeteProject = async(value: OnValueInterface)=>{
    try {
      setLoading(true)
      await httpRequest.post('/project', value)
      mutate('/project')
      message.success("Congratulation, Project created successfully.")
      router.push('/user/projects')
      handleCloseModal()
    } 
    catch (error) {
      return clientCatchError(error)
    }
    finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">

      {/* Main Card */}
      <Card className="max-w-2xl w-full text-center p-6 shadow-lg rounded-2xl">
        <CardContent className="space-y-6">

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Create Your First Project 🚀
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Start collaborating with your team and manage everything in one place.
            </p>
          </div>

          {/* Button */}
          <Button onClick={()=>setOpen(true)} className="w-full h-11 text-sm font-semibold flex items-center justify-center gap-2">
            <Plus size={16} />
            Click here to Create Project
          </Button>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">

            <div className="flex items-start gap-3">
              <Users size={18} className="text-indigo-500 mt-1" />
              <p className="text-sm text-gray-600">
                Add and manage team members easily
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Bug size={18} className="text-red-500 mt-1" />
              <p className="text-sm text-gray-600">
                Create and track issues in your project
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={18} className="text-green-500 mt-1" />
              <p className="text-sm text-gray-600">
                Schedule and manage team meetings
              </p>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="text-yellow-500 mt-1" />
              <p className="text-sm text-gray-600">
                Manage roles (LEAD / MEMBER) securely
              </p>
            </div>

          </div>

        </CardContent>
      </Card>
    <Modal 
      open={open}
      footer={null}
      onCancel={handleCloseModal}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCraeteProject}
      >

        {/* Project Name */}
        <Form.Item
          label="Project Name"
          name="projectName"
          rules={[
            { required: true, message: "Please enter project name" },
            { min: 3, message: "Minimum 3 characters required" }
          ]}
        >
          <Input placeholder="Enter project name" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter description" },
            { min: 5, message: "Minimum 5 characters required" }
          ]}
        >
          <TextArea rows={4} placeholder="Enter project description" />
        </Form.Item>

        {/* Submit */}
        <Form.Item>
          <AntBtn
            loading={loading}
            disabled={loading}
            type="primary"
            htmlType="submit"
            className="w-full"
          >
            Create Project
          </AntBtn>
        </Form.Item>

      </Form>
    </Modal>
    </div>
  )
}

export default CreateProject