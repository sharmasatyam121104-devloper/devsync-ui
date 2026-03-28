"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Video, Mic, ScreenShare, PhoneOff, ShieldCheck, MicOff, VideoOff, ScreenShareOff } from "lucide-react";
import clientCatchError from '@/lib/clientCatchError';
import httpRequest from '@/lib/http';
import { getSession } from '@/lib/getSession';

// --- INTERFACES ---

interface Session {
  id: string;
  email: string;
  fullname: string;
  role: "USER" | "ADMIN";
}

// Ye interface tere API ke participants aur humare UI state dono ko handle karega
interface Member {
  id: string;
  name: string;
  isSelf: boolean;
  color: string;
  email?: string; // Optional, agar baad mein use karna ho
}

const meetingId = "69c7b22018b8840edc9c7131";

const colors = ['bg-indigo-600', 'bg-orange-500', 'bg-emerald-500', 'bg-pink-500', 'bg-blue-500', 'bg-purple-500'];

const GroupVideoCall = () => {
  const [me, setMe] = useState<Session | null>(null);
  const [allMembers, setAllMembers] = useState<Member[]>([]); // 'any' ki jagah 'Member[]' use kiya
  const [activeId, setActiveId] = useState<string>(''); 

  const [isLocalMuted, setIsLocalMuted] = useState(false);
  // const [isRemoteMicSharing, setIsRemoteMicSharing] = useState(false);
  const [isLocalScreenSharing, setIsLocalScreenSharing] = useState(false);
  // const [isRemoteScreenSharing, setIsRemoteScreenSharing] = useState(false);
  const [isLocalVideoSharing, setisLocalVideoSharing] = useState(false);
  // const [isRemoteVideoSharing, setisRemoteVideoSharing] = useState(false);
  
  const localvideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null)

  // 1. Fetch Session
  useEffect(() => {
    const fetchSession = async () => {
      const data = await getSession();
      setMe(data as Session);
    };
    fetchSession();
  }, []);

  // 2. Fetch Meeting Data
  useEffect(() => {
    const fetchMeeting = async () => {
      if (!me) return;
      try {
        const { data } = await httpRequest(`/meeting/${meetingId}`);
        
        // Data format karte waqt 'Member' interface ke rules follow honge
        const formattedMembers: Member[] = data.participants.map((p: any, index: number) => ({
          id: p._id,
          name: p.fullname,
          isSelf: p._id === me.id,
          color: colors[index % colors.length],
          email: p.email
        }));

        setAllMembers(formattedMembers);
        
        const myMember = formattedMembers.find(m => m.isSelf);
        setActiveId(myMember ? myMember.id : formattedMembers[0]?.id || '');
        
      } catch (error) {
        return clientCatchError(error);
      }
    };
    fetchMeeting();
  }, [me]);

  // Main View Logic
  const mainMember = useMemo(() => 
    allMembers.find(m => m.id === activeId) || allMembers[0], 
    [activeId, allMembers]
  );

  const sideMembers = useMemo(() => 
    allMembers.filter(m => m.id !== activeId), 
    [activeId, allMembers]
  );



  const toggleScreen = async()=>{
    try {
      const localVideo = localvideoRef.current

      if(!localVideo){
        return null
      }

      if(!isLocalScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({video: true})
  
        localVideo.srcObject = stream
        localStreamRef.current = stream
        setIsLocalScreenSharing(true)
      }
      else {
        const localStream = localStreamRef.current
        if(!localStream){
          return null
        }

        localStream.getTracks().forEach((track)=>{
          track.stop()
        })

        localVideo.srcObject = null
        localStreamRef.current = null
        setIsLocalScreenSharing(false)
      }

    } 
    catch (error) {
      return clientCatchError(error)  
    }
  }



  const toggleVideo = async()=>{
    try {
      const localVideo = localvideoRef.current

      if(!localVideo){
        return null
      }

      if (!isLocalVideoSharing) {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true})

        localVideo.srcObject = stream
        localStreamRef.current = stream 
        setisLocalVideoSharing(true)
        setIsLocalMuted(true)
      } 
      else {
        const localStream = localStreamRef.current
        if(!localStream){
          return null
        }

        localStream.getTracks().forEach((track)=>{
          track.stop()
        })
        localVideo.srcObject = null
        localStreamRef.current = null
        setisLocalVideoSharing(false)
        setIsLocalMuted(false)
      }
    } 
    catch (error)
    {
      return clientCatchError(error)  
    }
  }

const toggleMic = async () => {
  try {
    const localStream = localStreamRef.current;

    if (!localStream) return;

    const audioTracks = localStream.getAudioTracks();

    if (audioTracks.length === 0) return;

    audioTracks.forEach(track => {
      track.enabled = !track.enabled; 
    });

    setIsLocalMuted(prev=>!prev)

  } catch (error) {
    return clientCatchError(error);
  }
};



  if (allMembers.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold animate-pulse">
        Connecting to Meeting...
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden text-gray-800 font-sans">
      
      {/* Header */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-indigo-600" size={18} />
          <h2 className="font-bold text-sm tracking-tight italic">
            {mainMember?.name}&#39;s Session
          </h2>
        </div>
        <div className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
          ● LIVE
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
        
        {/* Stage Area */}
        <div className="flex-[0.7] h-full">
          <div className="w-full h-full bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden relative transition-all duration-500">
            {  mainMember?.id === me?.id ? (
                <video ref={localvideoRef} autoPlay playsInline  className="w-full h-full object-cover bg-black" />
            ) : (
                <div className={`w-full h-full ${mainMember?.color} flex items-center justify-center`}>
                    <div className="text-center">
                        <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full mx-auto flex items-center justify-center text-5xl font-bold text-white mb-4 shadow-inner">
                            {mainMember?.name?.charAt(0)}
                        </div>
                        <p className="font-bold text-white text-2xl tracking-tight">{mainMember?.name}</p>
                    </div>
                </div>
            )}
            <div className="absolute bottom-6 left-6 bg-black/30 backdrop-blur-md px-5 py-2 rounded-2xl text-white text-xs font-semibold border border-white/10">
              {mainMember?.name} {mainMember?.id === me?.id ? "(You)" : ""}
            </div>
          </div>
        </div>

        {/* Sidebar Grid */}
        <div className="flex-[0.3] h-full overflow-y-auto pr-1">
          <div className="flex flex-col gap-4 pb-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
              In Call ({allMembers.length})
            </p>
            
            {sideMembers.map((member) => (
              <div 
                key={member.id} 
                onClick={() => setActiveId(member.id)}
                className="aspect-video bg-white rounded-3xl border border-gray-100 overflow-hidden relative group cursor-pointer hover:border-indigo-400 transition-all duration-300 shadow-sm"
              >
                { member.id === me?.id ? (
                    <video ref={localvideoRef} autoPlay playsInline muted className="w-full h-full object-cover bg-black" />
                ) : (
                    <div className={`w-full h-full ${member.color} flex items-center justify-center opacity-90 group-hover:opacity-100`}>
                        <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold text-white">
                            {member?.name?.charAt(0)}
                        </div>
                    </div>
                )}
                <div className="absolute bottom-3 left-3 bg-white/90 text-gray-800 text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-sm">
                  {member.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Control Bar */}
      <div className="h-24 bg-white border-t border-gray-100 flex items-center justify-center px-8 shrink-0 gap-6">
          <button 
            onClick={toggleMic}
            className={`p-4 rounded-3xl transition-all ${!isLocalMuted ? 'bg-red-50 text-red-500 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {!isLocalMuted ? <MicOff size={22}/> : <Mic size={22} />}
          </button>

          <button 
            onClick={toggleVideo}
            className={`p-4 rounded-3xl transition-all ${!isLocalVideoSharing ? 'bg-red-50 text-red-500 shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {!isLocalVideoSharing ? <VideoOff size={22}/> : <Video size={22} />}
          </button>
          
          <button className="px-12 py-4 bg-red-600 hover:bg-red-700 text-white rounded-[1.5rem] transition-all flex items-center gap-3 shadow-xl shadow-red-100 active:scale-95">
            <PhoneOff size={20} fill="currentColor" />
            <span className="font-black text-xs uppercase tracking-tighter">End Call</span>
          </button>

          <button 
            onClick={toggleScreen}
            className={`p-4 rounded-3xl transition-all ${isLocalScreenSharing ? 'bg-green-500 text-white shadow-lg' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}>
            {isLocalScreenSharing ? <ScreenShare size={22} /> : <ScreenShareOff size={22} color='red'/>}
          </button>
      </div>

    </div>
  );
};

export default GroupVideoCall;