"use client";

import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { authClient } from "@/src/lib/auth-client";
import { AlertCircle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginWrapper() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [showError, setShowError] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!acceptTerms) {
			setShowError(true);
			return;
		}

		setIsSubmitting(true);
		setShowError(false);

		try {
			await authClient.signIn.social({
				provider: "google",
				callbackURL: "/enter/callback/welcome",
			});
		} catch (error) {
			console.error("Login error:", error);
			setIsSubmitting(false);
		}
	};

	const handleCheckboxChange = (checked: boolean) => {
		setAcceptTerms(checked);
		if (checked) {
			setShowError(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-400 via-blue-600 to-purple-800 px-4">
			<div className="w-full max-w-md">
				{/* Login Card with Icon Extending Beyond */}
				<div className="relative">
					{/* Extended Icon Holder */}
					<div className="-top-8 -translate-x-1/2 absolute left-1/2 z-10 transform">
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-gray-100 bg-white text-4xl">
							🚪
						</div>
					</div>

					{/* Login Card */}
					<div className="rounded-2xl border border-gray-100 bg-white p-8 pt-16 shadow-2xl">
						{/* Header */}
						<div className="mb-8 text-center">
							<h1 className="mb-2 font-bold text-2xl text-gray-800">Sign in to OSpace</h1>
							<p className="text-gray-600">Create your very own web‑based OS.</p>
						</div>

						{/* Login Form */}
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* Google Sign In Button */}
							<Button
								type="submit"
								size="lg"
								disabled={!acceptTerms || isSubmitting}
								className="flex w-full items-center justify-center space-x-3 rounded-lg bg-blue-600 py-3 font-medium text-lg text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
							>
								{isSubmitting ? (
									<>
										<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
										<span>Signing in...</span>
									</>
								) : (
									<>
										<svg className="h-5 w-5" viewBox="0 0 24 24">
											<title>Google Logo</title>
											<path
												fill="currentColor"
												d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											/>
											<path
												fill="currentColor"
												d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											/>
											<path
												fill="currentColor"
												d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											/>
											<path
												fill="currentColor"
												d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											/>
										</svg>
										<span>Sign in with Google</span>
									</>
								)}
							</Button>

							{/* Terms and Privacy Checkbox */}
							<div className="space-y-3">
								<div className="flex items-start space-x-3">
									<Checkbox
										checked={acceptTerms}
										onCheckedChange={handleCheckboxChange}
										className="mt-1 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
									/>
									<div className="text-gray-600 text-sm leading-relaxed">
										I agree to the{" "}
										<Link
											href="/legal"
											className="font-medium text-blue-600 underline hover:text-blue-700"
											target="_blank"
											rel="noopener noreferrer"
										>
											Terms of Service and Privacy Policy.
										</Link>
									</div>
								</div>

								{/* Error Message */}
								{showError && (
									<div className="flex items-center space-x-2 text-red-600">
										<AlertCircle className="h-4 w-4 flex-shrink-0" />
										<span className="text-sm">
											You must accept the Terms of Service and Privacy Policy to continue
										</span>
									</div>
								)}
							</div>

							{/* Additional Info */}
							<div className="text-center text-gray-500 text-xs leading-relaxed">
								By signing in, you&#39;ll be able to create and organize folders, apps, and notes in
								your personal web OS. Continue with Google
							</div>
						</form>
					</div>
				</div>

				{/* Back to Home Link */}
				<div className="mt-6 text-center">
					<Link
						href="/"
						className="group flex items-center justify-center space-x-2 font-medium text-sm text-white/80 transition-colors duration-200 hover:text-white"
					>
						<ChevronLeft className="group-hover:-translate-x-1 h-4 w-4 transition-transform duration-200" />
						<span>Back Home</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
