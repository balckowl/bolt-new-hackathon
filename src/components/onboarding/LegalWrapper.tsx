"use client";

import Footer from "@/src/components/lp/Footer";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LegalWrapper() {
	const [activeTab, setActiveTab] = useState("terms");

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<header className="border-gray-200 border-b bg-white">
				<div className="mx-auto max-w-4xl px-4 py-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="flex h-10 w-10 items-center justify-center rounded-xl">
								<Image src="/logo.png" width={80} height={80} alt="logo" className="rounded-2xl" />
							</div>
							<h1 className="font-bold text-gray-800 text-xl">OSpace</h1>
						</div>
						<Link href="/login">
							<Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Login
							</Button>
						</Link>
					</div>
				</div>
			</header>

			{/* Content */}
			<main className="mx-auto max-w-4xl px-4 py-12">
				<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					{/* Tabs Header */}
					<div className="border-gray-200 border-b bg-gray-50 px-8 py-6">
						<h1 className="mb-4 font-bold text-3xl text-gray-800">Legal Information</h1>
						<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
							<TabsList className="grid w-full grid-cols-2 bg-white">
								<TabsTrigger value="terms" className="font-medium text-sm">
									Terms of Service
								</TabsTrigger>
								<TabsTrigger value="privacy" className="font-medium text-sm">
									Privacy Policy
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					{/* Tabs Content */}
					<div className="p-8 md:p-12">
						<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
							<TabsContent value="terms" className="mt-0">
								<div className="prose prose-gray max-w-none space-y-6">
									<p className="text-gray-600 leading-relaxed">
										<strong>Last updated:</strong> January 2025
									</p>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">
											1. Acceptance of Terms
										</h2>
										<p className="text-gray-600 leading-relaxed">
											By accessing and using OSpace, you accept and agree to be bound by the terms
											and provision of this agreement.
										</p>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">2. Use License</h2>
										<p className="text-gray-600 leading-relaxed">
											Permission is granted to temporarily use OSpace for personal, non-commercial
											transitory viewing only. This is the grant of a license, not a transfer of
											title, and under this license you may not:
										</p>
										<ul className="ml-4 list-inside list-disc space-y-2 text-gray-600 leading-relaxed">
											<li>modify or copy the materials</li>
											<li>
												use the materials for any commercial purpose or for any public display
											</li>
											<li>attempt to reverse engineer any software contained on OSpace</li>
											<li>
												remove any copyright or other proprietary notations from the materials
											</li>
										</ul>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">3. User Content</h2>
										<p className="text-gray-600 leading-relaxed">
											You retain ownership of any content you create, upload, or store using OSpace.
											However, by using our service, you grant us a license to host, store, and
											display your content as necessary to provide the service.
										</p>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">4. Privacy</h2>
										<p className="text-gray-600 leading-relaxed">
											Your privacy is important to us. Please review our Privacy Policy, which also
											governs your use of the service, to understand our practices.
										</p>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">5. Disclaimer</h2>
										<p className="text-gray-600 leading-relaxed">
											The materials on OSpace are provided on an &#39;as is&#39; basis. OSpace makes
											no warranties, expressed or implied, and hereby disclaims and negates all
											other warranties including without limitation, implied warranties or
											conditions of merchantability, fitness for a particular purpose, or
											non-infringement of intellectual property or other violation of rights.
										</p>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">
											6. Contact Information
										</h2>
										<p className="text-gray-600 leading-relaxed">
											If you have any questions about these Terms of Service, please contact us at
											ospace220@gmail.com
										</p>
									</section>
								</div>
							</TabsContent>

							<TabsContent value="privacy" className="mt-0">
								<div className="prose prose-gray max-w-none space-y-6">
									<p className="text-gray-600 leading-relaxed">
										<strong>Last updated:</strong> January 2025
									</p>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">
											1. Information We Collect
										</h2>
										<p className="text-gray-600 leading-relaxed">
											We collect information you provide directly to us, such as when you create an
											account, use our services, or contact us for support. This may include:
										</p>
										<ul className="ml-4 list-inside list-disc space-y-2 text-gray-600 leading-relaxed">
											<li>Account information (email address, profile information)</li>
											<li>Content you create, upload, or store using OSpace</li>
											<li>Usage data and analytics</li>
											<li>Device and browser information</li>
										</ul>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">
											2. How We Use Your Information
										</h2>
										<p className="text-gray-600 leading-relaxed">
											We use the information we collect to:
										</p>
										<ul className="ml-4 list-inside list-disc space-y-2 text-gray-600 leading-relaxed">
											<li>Provide, maintain, and improve our services</li>
											<li>Process transactions and send related information</li>
											<li>Send technical notices and support messages</li>
											<li>Respond to your comments and questions</li>
											<li>Monitor and analyze trends and usage</li>
										</ul>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">
											3. Information Sharing
										</h2>
										<p className="text-gray-600 leading-relaxed">
											We do not sell, trade, or otherwise transfer your personal information to
											third parties without your consent, except as described in this policy. We may
											share your information in the following circumstances:
										</p>
										<ul className="ml-4 list-inside list-disc space-y-2 text-gray-600 leading-relaxed">
											<li>With your consent</li>
											<li>To comply with legal obligations</li>
											<li>To protect our rights and safety</li>
											<li>In connection with a business transfer</li>
										</ul>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">4. Data Security</h2>
										<p className="text-gray-600 leading-relaxed">
											We implement appropriate security measures to protect your personal
											information against unauthorized access, alteration, disclosure, or
											destruction. However, no method of transmission over the internet is 100%
											secure.
										</p>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">5. Your Rights</h2>
										<p className="text-gray-600 leading-relaxed">You have the right to:</p>
										<ul className="ml-4 list-inside list-disc space-y-2 text-gray-600 leading-relaxed">
											<li>Access and update your personal information</li>
											<li>Delete your account and associated data</li>
											<li>Opt out of certain communications</li>
											<li>Request a copy of your data</li>
										</ul>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">
											6. Cookies and Tracking
										</h2>
										<p className="text-gray-600 leading-relaxed">
											We use cookies and similar tracking technologies to collect and use personal
											information about you. You can control cookies through your browser settings.
										</p>
									</section>

									<section>
										<h2 className="mb-4 font-semibold text-gray-800 text-xl">7. Contact Us</h2>
										<p className="text-gray-600 leading-relaxed">
											If you have any questions about this Privacy Policy, please contact us at
											ospace220@gmail.com
										</p>
									</section>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
