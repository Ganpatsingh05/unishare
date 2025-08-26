"use client";

import { useState } from 'react';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import { Code, Users, Heart, Coffee, MapPin, Clock, DollarSign, Laptop, BookOpen, Zap, ArrowRight, CheckCircle } from 'lucide-react';

export default function CareersPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const handleThemeToggle = () => setDarkMode((prev) => !prev);

  const perks = [
    {
      icon: Coffee,
      title: 'Unlimited Coffee & Snacks',
      description: 'Fuel your creativity with our fully stocked kitchen'
    },
    {
      icon: Laptop,
      title: 'Top-tier Equipment',
      description: 'MacBook Pro, external monitors, whatever you need to do your best work'
    },
    {
      icon: Clock,
      title: 'Flexible Hours',
      description: 'Work when you\'re most productive, not when a clock tells you to'
    },
    {
      icon: BookOpen,
      title: 'Learning Budget',
      description: '$2,000 yearly for courses, conferences, and books'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Full health coverage, gym membership, mental health support'
    },
    {
      icon: Users,
      title: 'Remote-First',
      description: 'Work from anywhere, with quarterly team meetups'
    }
  ];

  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      department: 'engineering',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      experience: 'Mid-level (2-4 years)',
      description: 'Build beautiful, responsive interfaces that students actually want to use. Work with React, Next.js, and Tailwind CSS.',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Mobile-first design'],
      salary: '$90k - $130k'
    },
    {
      id: 2,
      title: 'Backend Engineer',
      department: 'engineering',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      experience: 'Senior level (4+ years)',
      description: 'Build scalable systems that connect millions of students. Work with Node.js, PostgreSQL, and AWS.',
      skills: ['Node.js', 'PostgreSQL', 'AWS', 'API design', 'System architecture'],
      salary: '$120k - $160k'
    },
    {
      id: 3,
      title: 'Community Manager',
      department: 'community',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Entry to Mid-level (1-3 years)',
      description: 'Help build and nurture our student communities. Create content, moderate discussions, and gather feedback.',
      skills: ['Social media', 'Content creation', 'Community building', 'Student engagement'],
      salary: '$60k - $85k'
    },
    {
      id: 4,
      title: 'Product Designer',
      department: 'design',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      experience: 'Mid-level (3-5 years)',
      description: 'Design intuitive experiences that solve real student problems. Work closely with engineering and user research.',
      skills: ['Figma', 'User research', 'Prototyping', 'Mobile design', 'Design systems'],
      salary: '$95k - $135k'
    },
    {
      id: 5,
      title: 'Growth Marketing Intern',
      department: 'marketing',
      location: 'Remote',
      type: 'Internship',
      experience: 'Student / Recent grad',
      description: 'Help us reach more students on campuses across the country. Learn growth marketing, analytics, and campaign management.',
      skills: ['Digital marketing', 'Analytics', 'Social media', 'Content creation'],
      salary: '$20/hour + potential full-time offer'
    }
  ];

  const departments = [
    { id: 'all', name: 'All Departments', count: jobs.length },
    { id: 'engineering', name: 'Engineering', count: jobs.filter(j => j.department === 'engineering').length },
    { id: 'design', name: 'Design', count: jobs.filter(j => j.department === 'design').length },
    { id: 'community', name: 'Community', count: jobs.filter(j => j.department === 'community').length },
    { id: 'marketing', name: 'Marketing', count: jobs.filter(j => j.department === 'marketing').length }
  ];

  const filteredJobs = selectedDepartment === 'all' 
    ? jobs 
    : jobs.filter(job => job.department === selectedDepartment);

  const values = [
    {
      title: 'Student-first mindset',
      description: 'Every decision should make student life better, not just our metrics prettier.'
    },
    {
      title: 'Bias toward action',
      description: 'Perfect is the enemy of good. Ship fast, learn faster, iterate constantly.'
    },
    {
      title: 'Radical transparency',
      description: 'Share context, admit mistakes, celebrate failures that teach us something.'
    },
    {
      title: 'Diverse perspectives',
      description: 'The best solutions come from teams that think differently about problems.'
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
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            darkMode 
              ? 'bg-green-300/20 text-green-300 border border-green-300/30' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            <Zap className="w-4 h-4" />
            We're Hiring
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-bold mb-8 leading-tight ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Build the future
            <br />
            <span className={`${darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-blue-300' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600'}`}>
              of student life
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Join a team that's making college more affordable, connected, and fun for millions of students. Remote-first, impact-driven, and actually profitable.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[
              '🌎 Remote-first culture',
              '💰 Competitive pay + equity',
              '🎯 Real impact on student life',
              '🚀 Backed by top investors'
            ].map((item, index) => (
              <div key={index} className={`px-4 py-2 rounded-full ${
                darkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-white/80 text-gray-700'
              }`}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Work Here */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why students (and their parents) love what we do
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Work on something that actually matters. Every feature you build helps real students save money and make friends.
            </p>
          </div>

          {/* Values */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {values.map((value, index) => (
              <div key={index} className={`p-6 rounded-2xl ${
                darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200'
              }`}>
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
              </div>
            ))}
          </div>

          {/* Perks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, index) => (
              <div key={index} className={`p-6 rounded-2xl transition-all duration-300 hover:transform hover:scale-105 ${
                darkMode ? 'bg-gray-800/50 border border-gray-700/50' : 'bg-white border border-gray-200'
              }`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                  darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-600'
                }`}>
                  <perk.icon className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {perk.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {perk.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Open positions
            </h2>
            <p className={`text-lg ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We're growing fast and looking for people who want to build something meaningful.
            </p>
          </div>

          {/* Department Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
                  selectedDepartment === dept.id
                    ? darkMode 
                      ? 'bg-yellow-300 text-gray-900' 
                      : 'bg-blue-600 text-white'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {dept.name} ({dept.count})
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className={`p-6 md:p-8 rounded-2xl transition-all duration-300 hover:transform hover:scale-[1.02] ${
                darkMode ? 'bg-gray-800/50 border border-gray-700/50 hover:border-gray-600' : 'bg-white border border-gray-200 hover:shadow-lg'
              }`}>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <h3 className={`text-xl md:text-2xl font-bold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {job.title}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        job.type === 'Internship'
                          ? darkMode ? 'bg-green-300/20 text-green-300' : 'bg-green-100 text-green-700'
                          : darkMode ? 'bg-blue-300/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {job.type}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 opacity-60" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {job.location}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 opacity-60" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {job.experience}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 opacity-60" />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                          {job.salary}
                        </span>
                      </div>
                    </div>

                    <p className={`text-base mb-6 leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-xs ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <button className={`group px-6 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 flex items-center gap-3 ${
                      darkMode 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 hover:from-yellow-300 hover:to-yellow-200' 
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                    }`}>
                      <span>Apply Now</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No positions available in this department right now.
              </p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                But we're always looking for exceptional people! Send us your resume anyway.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application Process */}
      <div className={`py-16 px-4 ${
        darkMode ? 'bg-gray-900/50' : 'bg-gray-50'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Our hiring process
            </h2>
            <p className={`text-lg ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              We keep it simple and respect your time. No take-home projects that take 20 hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Apply',
                description: 'Submit your resume and a quick note about why you want to work with us.'
              },
              {
                step: '2', 
                title: 'Chat',
                description: '30-minute conversation with the hiring manager. No trick questions, just getting to know you.'
              },
              {
                step: '3',
                title: 'Final Interview',
                description: 'Meet the team, discuss your experience, and do a short technical/portfolio review.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl font-bold text-2xl mb-6 ${
                  darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-600'
                }`}>
                  {step.step}
                </div>
                <h3 className={`text-xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {step.title}
                </h3>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={`py-20 px-4 ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800'
      }`}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Don't see the right role?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            We're always looking for exceptional people. Send us your resume and tell us how you'd like to contribute.
          </p>

          <button className="group px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 mx-auto">
            <span>Get in touch</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          <div className="mt-8 text-blue-200">
            <p>📧 careers@unishare.com</p>
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}