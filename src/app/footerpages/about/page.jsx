"use client";

import { useState } from 'react';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import Reveal from '../../_components/Reveal';
import useIsMobile from '../../_components/useIsMobile';
import { Users, Heart, Zap, Target, Globe, BookOpen, Car, ShoppingBag, Home, MessageCircle, ArrowRight, Check, Star } from 'lucide-react';

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('story');
  const isMobile = useIsMobile();

  const handleThemeToggle = () => setDarkMode((prev) => !prev);

  const stats = [
    { number: '2,500+', label: 'Active Students', icon: Users },
    { number: '15,000+', label: 'Rides Shared', icon: Car },
    { number: '8,500+', label: 'Items Traded', icon: ShoppingBag },
    { number: '96%', label: 'Satisfaction Rate', icon: Star }
  ];

  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'Every feature we build is designed to bring students together and make campus life more connected.'
    },
    {
      icon: Heart,
      title: 'Built with Care',
      description: 'We understand student struggles because we are students. Every decision is made with genuine care for your experience.'
    },
    {
      icon: Zap,
      title: 'Simple & Fast',
      description: 'No complicated processes or endless forms. Get what you need quickly so you can focus on what matters.'
    },
    {
      icon: Target,
      title: 'Real Solutions',
      description: 'We solve actual problems students face daily - from finding rides to sharing study materials.'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Co-founder & CEO',
      background: 'Computer Science, Stanford',
      story: 'Started UniShare after spending too much on textbooks and missing rides home.'
    },
    {
      name: 'Marcus Johnson',
      role: 'Co-founder & CTO',
      background: 'Engineering, MIT',
      story: 'Believes technology should make life easier, not more complicated.'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Community',
      background: 'Psychology, UC Berkeley',
      story: 'Passionate about creating safe spaces for students to connect and help each other.'
    }
  ];

  const milestones = [
    {
      year: '2022',
      title: 'The Beginning',
      description: 'Started as a simple ride-sharing WhatsApp group at Stanford'
    },
    {
      year: '2023',
      title: 'First Platform',
      description: 'Launched our first web app with 100 beta users'
    },
    {
      year: '2023',
      title: 'Growing Community',
      description: 'Expanded to 10 universities across California'
    },
    {
      year: '2024',
      title: 'National Launch',
      description: 'Now serving 50+ universities with thousands of students'
    }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 text-gray-800"
    }`}>
      <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} />

    {/* Hero Section */}
      <div className="pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
      <Reveal className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            darkMode 
              ? 'bg-yellow-300/20 text-yellow-300 border border-yellow-300/30' 
              : 'bg-blue-100 text-blue-700 border border-blue-200'
      }`}>
            <Heart className="w-4 h-4" />
            About Our Story
      </Reveal>
          
      <Reveal className={`text-4xl md:text-6xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
      }`}>
            Made by students,
            <br />
            <span className={`${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-blue-300' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'}`}>
              for students
            </span>
      </Reveal>
          
      <Reveal delay={100} className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
            We started UniShare because we got tired of overpaying for rides, buying overpriced textbooks, and struggling to find decent housing. Now thousands of students save money and stress every day.
      </Reveal>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
        <Reveal key={index} delay={index * 70} className={`text-center p-6 rounded-2xl transition-all duration-300 hover:transform hover:scale-105 active:scale-95 ${
                darkMode 
                  ? 'bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70' 
                  : 'bg-white/60 border border-gray-200/50 hover:bg-white/80'
              } backdrop-blur-md`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                  darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-600'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`text-2xl md:text-3xl font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {stat.number}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
        </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`flex flex-wrap gap-2 p-2 rounded-2xl ${
            darkMode ? 'bg-gray-800/50' : 'bg-gray-100'
          }`}>
            {[
              { id: 'story', label: 'Our Story' },
              { id: 'values', label: 'Our Values' },
              { id: 'team', label: 'The Team' },
              { id: 'journey', label: 'Our Journey' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-xl font-medium text-sm md:text-base transition-all duration-200 active:scale-95 ${
                  activeTab === tab.id
                    ? darkMode 
                      ? 'bg-yellow-300 text-gray-900 shadow-lg' 
                      : 'bg-blue-600 text-white shadow-lg'
                    : darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'story' && (
            <div className="space-y-8">
              <Reveal className={`p-6 md:p-8 rounded-2xl ${
                darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200'
              }`}>
                <h2 className={`text-2xl md:text-3xl font-bold mb-6 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  How it all started
                </h2>
                <div className="space-y-4 text-base md:text-lg leading-relaxed">
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Back in 2022, Sarah was a broke college student (like most of us) who spent $50 on an Uber to get to the airport because she couldn't find anyone to share the ride with. Marcus had just paid $300 for a used textbook that he could have gotten for $30 from a classmate if he'd known about it.
                  </p>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    We realized that students have everything they need within their community - rides, textbooks, furniture, study notes, even friendship. The problem was connecting people who had stuff with people who needed stuff.
                  </p>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    So we built UniShare. Not as some fancy tech startup trying to disrupt everything, but as a simple tool to help students help each other. Because college is expensive enough without paying full price for everything.
                  </p>
                </div>
              </Reveal>
            </div>
          )}

          {activeTab === 'values' && (
      <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
        <Reveal key={index} delay={index * 80} className={`p-6 rounded-2xl transition-all duration-300 hover:transform hover:scale-105 active:scale-95 ${
                  darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200'
                }`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                    darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <value.icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {value.title}
                  </h3>
                  <p className={`leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {value.description}
                  </p>
        </Reveal>
              ))}
            </div>
          )}

          {activeTab === 'team' && (
      <div className="space-y-6">
              {team.map((member, index) => (
        <Reveal key={index} delay={index * 80} className={`p-6 rounded-2xl ${
                  darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${
                      darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {member.name}
                      </h3>
                      <p className={`font-medium mb-2 ${
                        darkMode ? 'text-yellow-300' : 'text-blue-600'
                      }`}>
                        {member.role}
                      </p>
                      <p className={`text-sm mb-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {member.background}
                      </p>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {member.story}
                      </p>
                    </div>
                  </div>
        </Reveal>
              ))}
            </div>
          )}

          {activeTab === 'journey' && (
      <div className="space-y-6">
              {milestones.map((milestone, index) => (
        <Reveal key={index} delay={index * 70} className={`flex gap-6 ${
                  index < milestones.length - 1 ? 'pb-6 border-b border-gray-300/20' : ''
                }`}>
                  <div className={`w-20 h-20 rounded-xl flex items-center justify-center font-bold ${
                    darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {milestone.year}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className={`text-xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {milestone.title}
                    </h3>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {milestone.description}
                    </p>
                  </div>
        </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}