export default function Footer() {
	return (
		<footer className="relative border-gray-200 border-t bg-white px-4 py-8">
			<div className="relative z-10 mx-auto max-w-6xl text-center">
				<p className="font-light text-gray-500 text-sm">&copy; ospace 2025</p>
			</div>
			<div className="-z-10 fixed bottom-0 left-0 h-[600px] w-full">
				<div className="h-full w-full bg-white" />
			</div>
		</footer>
	);
}
