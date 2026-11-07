import React, { useState } from 'react';
import { ShieldAlert, X, Eye, FileText, BookOpen, GraduationCap, Calculator } from 'lucide-react';
import { DisguiseType } from '../types';

interface DisguiseOverlayProps {
  isActive: boolean;
  disguiseType: DisguiseType;
  onExit: () => void;
}

export const DisguiseOverlay: React.FC<DisguiseOverlayProps> = ({
  isActive,
  disguiseType,
  onExit
}) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white text-slate-900 select-text overflow-auto font-sans">
      {/* Secret Exit Trigger in corner */}
      <button
        onClick={onExit}
        className="fixed bottom-2 right-2 opacity-10 hover:opacity-100 transition-opacity p-2 rounded bg-slate-900 text-white text-xs z-[10000]"
        title="Resume Gaming"
      >
        Exit Stealth (Or press Panic Key)
      </button>

      {disguiseType === 'google_docs' && (
        <div className="min-h-screen bg-[#f9fbfd] flex flex-col">
          {/* Mock Google Docs toolbar */}
          <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-bold text-xl">≡ Docs</span>
              <div>
                <div className="text-sm font-semibold text-slate-800">
                  AP World History - Post-Classical Trade Networks Research Paper.docx
                </div>
                <div className="text-[11px] text-slate-500 flex gap-3">
                  <span>File</span>
                  <span>Edit</span>
                  <span>View</span>
                  <span>Insert</span>
                  <span>Format</span>
                  <span>Tools</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Last edit was 2 minutes ago
            </div>
          </div>

          {/* Paper Canvas */}
          <div className="flex-1 flex justify-center p-8">
            <div className="w-full max-w-3xl bg-white shadow-md border border-slate-200 p-12 min-h-[900px] text-slate-800 text-sm leading-relaxed space-y-4 font-serif">
              <h1 className="text-2xl font-bold text-center mb-6">
                The Economic Impact of the Trans-Saharan and Maritime Silk Road Exchanges
              </h1>
              <p className="text-justify indent-8">
                Between the years 1200 and 1450 CE, hemispheric trade across Afro-Eurasia underwent an unprecedented period of intensification. Nomadic pastoralists and merchant guilds facilitated the exchange of both high-value luxury goods and cultural knowledge. Through caravanserais, oasis hubs along the Taklamakan, and monsoon-navigated dhows across the Indian Ocean basin, commercial connections flourished.
              </p>
              <p className="text-justify indent-8">
                In West Africa, the Mali Empire established regional hegemony under Sundiata and later Mansa Musa. Gold reserves from the Bambuk and Bure goldfields entered Mediterranean markets in exchange for Saharan rock salt, textiles, and Andalusian jurisprudence manuscripts.
              </p>
              <p className="text-justify indent-8">
                Simultaneously, the development of maritime technologies including the magnetic compass, sternpost rudders, and astronomical astrolabes allowed merchant sailors from Guangzhou to Calicut and Kilwa to coordinate departures with seasonal monsoon wind shifts.
              </p>
            </div>
          </div>
        </div>
      )}

      {disguiseType === 'canvas_lms' && (
        <div className="min-h-screen bg-[#f5f5f5] flex">
          {/* Canvas Sidebar */}
          <div className="w-16 bg-[#2d3b45] text-white flex flex-col items-center py-4 gap-6 shrink-0">
            <GraduationCap className="w-8 h-8 text-white" />
            <span className="text-[10px] font-bold">Dashboard</span>
            <span className="text-[10px]">Courses</span>
            <span className="text-[10px]">Calendar</span>
            <span className="text-[10px]">Inbox</span>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            <div className="max-w-4xl bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <div className="border-b border-slate-200 pb-4 mb-4">
                <span className="text-xs text-slate-500 uppercase tracking-wider">Physics Honors · Module 4</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">Assignment: Gravitational Potential & Kinetic Energy Equilibrium</h2>
                <p className="text-xs text-slate-500 mt-1">Due Oct 28 at 11:59pm · 50 Points Possible</p>
              </div>

              <div className="text-sm text-slate-700 space-y-3">
                <p>
                  <strong>Instructions:</strong> Complete questions 1 through 12 using standard gravitational acceleration g = 9.81 m/s². Clearly indicate all step-by-step vector decompositions.
                </p>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs font-mono">
                  Equation 1: E_total = (1/2) * m * v² + m * g * h
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {disguiseType === 'wikipedia' && (
        <div className="min-h-screen bg-white p-8 max-w-4xl mx-auto font-sans text-slate-900">
          <div className="border-b border-slate-300 pb-2 mb-4">
            <h1 className="text-3xl font-serif">Antarctic Treaty System</h1>
            <p className="text-xs text-slate-500">From Wikipedia, the free encyclopedia</p>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            The <strong>Antarctic Treaty</strong> and related agreements, collectively known as the <em>Antarctic Treaty System</em> (ATS), regulate international relations with respect to Antarctica, Earth's only continent without a native human population. For the purposes of the treaty system, Antarctica is defined as all of the land and ice shelves south of 60°S latitude.
          </p>
        </div>
      )}

      {disguiseType === 'google_search' && (
        <div className="min-h-screen bg-white text-[#202124] flex flex-col justify-between font-sans">
          {/* Google Top Bar */}
          <div className="flex items-center justify-between p-4 px-6 text-sm">
            <div className="flex items-center gap-4 text-slate-600 text-xs">
              <span className="hover:underline cursor-pointer">About</span>
              <span className="hover:underline cursor-pointer">Store</span>
            </div>
            <div className="flex items-center gap-4 text-slate-700 text-xs">
              <span className="hover:underline cursor-pointer">Gmail</span>
              <span className="hover:underline cursor-pointer">Images</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 cursor-pointer">
                <div className="grid grid-cols-3 gap-0.5 w-4 h-4">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1 h-1 bg-slate-600 rounded-full" />
                  ))}
                </div>
              </div>
              <button className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-medium rounded text-xs transition-colors cursor-pointer">
                Sign in
              </button>
            </div>
          </div>

          {/* Google Main Search Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full -mt-16">
            <div className="text-7xl sm:text-8xl font-bold tracking-tight mb-7 select-none font-display">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem('q') as HTMLInputElement;
                if (input && input.value.trim()) {
                  window.open(`https://www.google.com/search?q=${encodeURIComponent(input.value.trim())}`, '_blank');
                }
              }}
              className="w-full"
            >
              <div className="relative flex items-center w-full shadow-md hover:shadow-lg focus-within:shadow-lg rounded-full border border-slate-200 hover:border-slate-300 transition-all">
                <div className="pl-4 text-slate-400">
                  <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  name="q"
                  placeholder="Search Google or type a URL"
                  defaultValue="AP World History study guide"
                  className="w-full py-3 pl-3 pr-12 text-sm text-slate-800 placeholder:text-slate-400 rounded-full focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#f8f9fa] hover:border-[#dadce0] rounded text-xs text-slate-800 font-medium transition-all"
                >
                  Google Search
                </button>
                <button
                  type="button"
                  onClick={() => window.open('https://www.google.com/search?btnI=1&q=AP+World+History+notes', '_blank')}
                  className="px-4 py-2 bg-[#f8f9fa] hover:bg-[#f1f3f4] border border-[#f8f9fa] hover:border-[#dadce0] rounded text-xs text-slate-800 font-medium transition-all"
                >
                  I'm Feeling Lucky
                </button>
              </div>
            </form>

            <div className="text-xs text-slate-600 mt-6">
              Google offered in: <span className="text-[#1a0dab] hover:underline cursor-pointer">Español</span>{' '}
              <span className="text-[#1a0dab] hover:underline cursor-pointer">Français</span>{' '}
              <span className="text-[#1a0dab] hover:underline cursor-pointer">Deutsch</span>
            </div>
          </div>

          {/* Google Footer */}
          <div className="bg-[#f2f2f2] text-[#70757a] text-xs">
            <div className="px-6 py-3 border-b border-[#dadce0]">
              United States
            </div>
            <div className="px-6 py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-6">
                <span className="hover:underline cursor-pointer">About</span>
                <span className="hover:underline cursor-pointer">Advertising</span>
                <span className="hover:underline cursor-pointer">Business</span>
                <span className="hover:underline cursor-pointer">How Search works</span>
              </div>
              <div className="flex gap-6">
                <span className="hover:underline cursor-pointer">Privacy</span>
                <span className="hover:underline cursor-pointer">Terms</span>
                <span className="hover:underline cursor-pointer">Settings</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
