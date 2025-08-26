"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import Reveal from "../../_components/Reveal";
import useIsMobile from "../../_components/useIsMobile";
import {
	Target,
	Heart,
	Users,
	Car,
	BookOpen,
	Home as HomeIcon,
	MessageCircle,
	ChevronRight,
	ArrowLeft,
	ArrowRight,
	TrendingUp,
	CheckCircle,
	Calendar,
	Shield,
	Globe,
	Lightbulb,
	Rocket,
} from "lucide-react";

export default function MissionPage() {
	const [darkMode, setDarkMode] = useState(true);
		const [activeGoal, setActiveGoal] = useState(0);
		const isMobile = useIsMobile();
	const router = useRouter();

	const handleThemeToggle = () => setDarkMode((v) => !v);

	const values = [
		{
			icon: Heart,
			title: "Student First",
			description:
				"Every decision centers on real student needs, not trends or buzzwords.",
			color: "from-red-500 to-pink-500",
		},
		{
			icon: Users,
			title: "Community",
			description:
				"Stronger together — we connect students to help each other succeed.",
			color: "from-blue-500 to-cyan-500",
		},
		{
			icon: BookOpen,
			title: "Access",
			description:
				"Make study materials and knowledge more reachable and affordable.",
			color: "from-purple-500 to-violet-500",
		},
		{
			icon: Shield,
			title: "Safety",
			description:
				"Build trust with verification and clear, student-friendly safeguards.",
			color: "from-emerald-500 to-green-500",
		},
	];

	const goals = [
		{
			icon: Car,
			title: "Share Rides, Cut Costs",
			goal: "Help 100k students save on transportation",
			progress: 24,
			current: "$12M saved",
			chips: ["Lower costs", "Greener travel", "Safer trips"],
		},
		{
			icon: BookOpen,
			title: "Open Learning",
			goal: "Free or shared study resources on every campus",
			progress: 45,
			current: "50k+ resources shared",
			chips: ["Free notes", "Study groups", "Textbook swaps"],
		},
		{
			icon: HomeIcon,
			title: "Better Housing",
			goal: "Match students to safe, affordable rooms",
			progress: 33,
			current: "2k+ matches",
			chips: ["Fair rent", "Good fit", "Verified listings"],
		},
		{
			icon: MessageCircle,
			title: "Stronger Bonds",
			goal: "Reduce isolation by sparking real connections",
			progress: 67,
			current: "10k+ connections",
			chips: ["Meet peers", "Find partners", "Campus events"],
		},
	];

	const timeline = [
		{
			year: "2022",
			status: "completed",
			title: "Started with a simple idea",
			text: "Students helping students with everyday needs.",
		},
		{
			year: "2023",
			status: "completed",
			title: "First 1,000 students",
			text: "Validated the need across multiple campuses.",
		},
		{
			year: "2024",
			status: "completed",
			title: "50+ universities",
			text: "Scaled responsibly with a focus on safety and trust.",
		},
		{
			year: "2025",
			status: "in-progress",
			title: "100,000 active students",
			text: "Growing the most helpful student network.",
		},
	];

	const future = [
		{ icon: Globe, title: "Global Network", text: "Cross-campus and cross-country student links." },
		{ icon: Lightbulb, title: "Smart Matching", text: "Find the right ride, room, or study partner faster." },
		{ icon: Shield, title: "Safer By Design", text: "Verification and guidance at every key step." },
		{ icon: Rocket, title: "Career Bridge", text: "Connect students to mentors and internships." },
	];

	return (
		<div
			className={`min-h-screen transition-all duration-500 ${
				darkMode
					? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100"
					: "bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 text-gray-800"
			}`}
		>
			<Header darkMode={darkMode} onThemeToggle={handleThemeToggle} />

			{/* Breadcrumb */}
			<div className="max-w-6xl mx-auto px-4 pt-8">
				<div className="flex items-center gap-2 text-sm mb-8">
					<button
						onClick={() => router.push("/")}
						className={`${
							darkMode
								? "text-gray-400 hover:text-yellow-300"
								: "text-gray-500 hover:text-blue-600"
						} flex items-center gap-2`}
					>
						<ArrowLeft className="w-4 h-4" /> Home
					</button>
					<ChevronRight className="w-4 h-4 text-gray-400" />
					<span className={darkMode ? "text-yellow-300" : "text-blue-600"}>
						Our Mission
					</span>
				</div>
			</div>

			{/* Hero */}
			  <section className="pt-4 pb-12 px-4">
				<div className="max-w-4xl mx-auto text-center">
				  <Reveal
						className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
							darkMode
								? "bg-blue-300/20 text-blue-300 border border-blue-300/30"
								: "bg-blue-100 text-blue-700 border border-blue-200"
						}`}
					>
						<Target className="w-4 h-4" /> Our Mission
				  </Reveal>
				  <Reveal
						className={`text-4xl md:text-6xl font-bold mb-6 ${
							darkMode ? "text-white" : "text-gray-900"
						}`}
					>
						Make college life
						<br />
						<span
							className={`text-transparent bg-clip-text ${
								darkMode
									? "bg-gradient-to-r from-yellow-300 to-blue-300"
									: "bg-gradient-to-r from-blue-600 to-purple-600"
							}`}
						>
							less stressful
						</span>
					  </Reveal>
					  <Reveal delay={100} className={darkMode ? "text-gray-300" : "text-gray-600"}>
						We believe every student deserves affordable rides, fair housing, open
						learning, and a strong community. That&apos;s the promise we work on
						every day.
					  </Reveal>
					<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={() => router.push("/")}
							className={`${
								darkMode
									? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
									: "bg-blue-600 text-white hover:bg-blue-700"
							} px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105`}
						>
							Join Our Mission
						</button>
						<button
							onClick={() => router.push("/footerpages/about")}
							className={`${
								darkMode
									? "border-gray-600 text-gray-300 hover:bg-gray-800"
									: "border-gray-300 text-gray-700 hover:bg-white"
							} px-8 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105`}
						>
							Learn More
						</button>
					</div>
				</div>
			</section>

			{/* Values */}
					<section className="py-12 px-4">
				<div className="max-w-6xl mx-auto">
							<div className="text-center mb-10">
								<Reveal
							className={`text-3xl md:text-4xl font-bold ${
								darkMode ? "text-white" : "text-gray-900"
							}`}
						>
							What guides us
								</Reveal>
								<Reveal delay={80} className={darkMode ? "text-gray-300" : "text-gray-600"}>
							Clear principles that shape every feature and decision.
								</Reveal>
					</div>
							<div className="grid md:grid-cols-2 gap-6">
						{values.map((v, i) => (
									<Reveal
								key={i}
								className={`p-8 rounded-2xl transition-all duration-300 hover:scale-105 ${
									darkMode
										? "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70"
										: "bg-white border border-gray-200 hover:shadow-xl"
								}`}
							>
								<div
									className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 text-white bg-gradient-to-br ${v.color}`}
								>
									<v.icon className="w-8 h-8" />
								</div>
								<h3 className={darkMode ? "text-white text-2xl font-bold" : "text-gray-900 text-2xl font-bold"}>
									{v.title}
								</h3>
								<p className={`mt-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
									{v.description}
								</p>
									</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* Goals */}
			<section className="py-12 px-4">
				<div className="max-w-6xl mx-auto">
								<div className="text-center mb-10">
									<Reveal
							className={`text-3xl md:text-4xl font-bold ${
								darkMode ? "text-white" : "text-gray-900"
							}`}
						>
							Where we&apos;re heading
									</Reveal>
									<Reveal delay={80} className={darkMode ? "text-gray-300" : "text-gray-600"}>
							Measurable targets to keep the impact real.
									</Reveal>
					</div>
					<div className="space-y-6">
						{goals.map((g, idx) => (
										<Reveal as={"button"}
								key={idx}
								onClick={() => setActiveGoal(idx)}
								className={`w-full text-left p-6 md:p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
									activeGoal === idx
										? darkMode
											? "bg-gray-800/80 border-2 border-yellow-300/50"
											: "bg-white border-2 border-blue-500/50 shadow-xl"
										: darkMode
											? "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70"
											: "bg-white border border-gray-200 hover:shadow-lg"
								}`}
							>
								<div className="flex flex-col lg:flex-row gap-6">
									<div
										className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
											darkMode ? "bg-yellow-300/20 text-yellow-300" : "bg-blue-100 text-blue-600"
										}`}
									>
										<g.icon className="w-8 h-8" />
									</div>
									<div className="flex-1">
										<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-2">
											<h3 className={darkMode ? "text-white text-xl md:text-2xl font-bold" : "text-gray-900 text-xl md:text-2xl font-bold"}>
												{g.title}
											</h3>
											<span className={`text-xs px-3 py-1 rounded-full ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
												{g.goal}
											</span>
										</div>
										<div className="flex items-center gap-4 mb-3">
											<span className={darkMode ? "text-green-400 text-sm font-medium" : "text-green-600 text-sm font-medium"}>
												{g.current}
											</span>
											<div className={darkMode ? "flex-1 h-2 rounded-full bg-gray-700" : "flex-1 h-2 rounded-full bg-gray-200"}>
												<div
													className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
													style={{ width: `${g.progress}%` }}
												/>
											</div>
											<span className={darkMode ? "text-green-400 text-sm font-bold" : "text-green-600 text-sm font-bold"}>
												{g.progress}%
											</span>
										</div>
										<div className="flex flex-wrap gap-2 mt-2">
											{g.chips.map((c, i) => (
												<span key={i} className={darkMode ? "px-3 py-1 rounded-full text-sm bg-gray-700 text-gray-300" : "px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"}>
													{c}
												</span>
											))}
										</div>
									</div>
								</div>
							  </Reveal>
						))}
					</div>
				</div>
			</section>

			{/* Timeline */}
			<section className="py-12 px-4">
				<div className="max-w-6xl mx-auto">
								<div className="text-center mb-10">
									<Reveal className={darkMode ? "text-white text-3xl md:text-4xl font-bold" : "text-gray-900 text-3xl md:text-4xl font-bold"}>
										Our journey
									</Reveal>
									<Reveal delay={80} className={darkMode ? "text-gray-300" : "text-gray-600"}>
										Iterating with students, for students.
									</Reveal>
					</div>
					<div className="space-y-6">
						{timeline.map((m, i) => (
										<Reveal
								key={i}
								className={`flex gap-6 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.01] ${
									darkMode
										? "bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70"
										: "bg-white border border-gray-200 hover:shadow-md"
								}`}
							>
								<div className="flex flex-col items-center">
									<div
										className={`w-12 h-12 rounded-full flex items-center justify-center ${
											m.status === "completed"
												? "bg-green-500 text-white"
												: "bg-yellow-400 text-gray-900"
										}`}
									>
										{m.status === "completed" ? (
											<CheckCircle className="w-6 h-6" />
										) : (
											<TrendingUp className="w-6 h-6" />
										)}
									</div>
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-1">
										<span className={darkMode ? "text-yellow-300 font-bold text-xl" : "text-blue-600 font-bold text-xl"}>
											{m.year}
										</span>
										<span className={`text-xs px-2 py-1 rounded-full capitalize ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
											{m.status.replace("-", " ")}
										</span>
									</div>
									<h3 className={darkMode ? "text-white text-lg font-bold" : "text-gray-900 text-lg font-bold"}>{m.title}</h3>
									<p className={darkMode ? "text-gray-300" : "text-gray-600"}>{m.text}</p>
								</div>
							  </Reveal>
						))}
					</div>
				</div>
			</section>

			{/* Future */}
			<section className="py-12 px-4">
				<div className="max-w-6xl mx-auto">
								<div className="text-center mb-10">
									<Reveal className={darkMode ? "text-white text-3xl md:text-4xl font-bold" : "text-gray-900 text-3xl md:text-4xl font-bold"}>
										The future we&apos;re building
									</Reveal>
									<Reveal delay={80} className={darkMode ? "text-gray-300" : "text-gray-600"}>
										Practical improvements that raise student quality of life.
									</Reveal>
					</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{future.map((f, i) => (
										<Reveal
								key={i}
								className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
									darkMode
										? "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70"
										: "bg-white border border-gray-200 hover:shadow-md"
								}`}
							>
								<div className={darkMode ? "w-12 h-12 rounded-xl flex items-center justify-center bg-purple-300/20 text-purple-300 mb-3" : "w-12 h-12 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600 mb-3"}>
									<f.icon className="w-6 h-6" />
								</div>
								<h3 className={darkMode ? "text-white font-semibold" : "text-gray-900 font-semibold"}>{f.title}</h3>
								<p className={darkMode ? "text-gray-300 text-sm mt-1" : "text-gray-600 text-sm mt-1"}>{f.text}</p>
							  </Reveal>
						))}
					</div>
				</div>
			</section>

			{/* CTA */}
			<section
				className={
					darkMode
						? "py-16 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
						: "py-16 px-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800"
				}
			>
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						Join us in building something better
					</h2>
					<p className="text-blue-100 mb-8">
						Every new student strengthens the network and unlocks more value for
						the entire campus.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={() => router.push("/")}
							className="group px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3"
						>
							<span>Get started</span>
							<ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
						</button>
						<button
							onClick={() => router.push("/footerpages/about")}
							className="group px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-blue-700"
						>
							<span>Learn our story</span>
						</button>
					</div>
				</div>
			</section>

			<Footer darkMode={darkMode} />
		</div>
	);
}

