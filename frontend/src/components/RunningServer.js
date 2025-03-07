"use client"
import React from 'react'
import { IoServerOutline } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";

const RunningServer = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center min-h-screen z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <IoServerOutline className="w-16 h-16 text-indigo-600 animate-pulse" />
          <div className="absolute -bottom-2 -right-2">
            <BiLoaderAlt className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-semibold text-gray-800">Please Wait...</h2>
          <p className="text-gray-500">Waking up the server</p>
        </div>

        <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-indigo-600 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0; }
          50% { width: 100%; margin-left: 0; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}

export default RunningServer