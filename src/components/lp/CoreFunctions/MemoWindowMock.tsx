export default function MemoWindowMock() {
	return (
		<div className="relative w-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
			<div className="window-header flex flex-shrink-0 cursor-grab items-center justify-between border-gray-200 border-b bg-gray-50 px-4 py-2">
				<div className="flex items-center space-x-2">
					<div className="flex space-x-2">
						<button
							className="h-3 w-3 rounded-full bg-red-500 transition-colors hover:bg-red-600"
							type="button"
						/>
						<button
							className="h-3 w-3 rounded-full bg-yellow-500 transition-colors hover:bg-yellow-600"
							type="button"
						/>
						<button
							className="h-3 w-3 rounded-full bg-green-500 transition-colors hover:bg-green-600"
							type="button"
						/>
					</div>
					<span className="ml-4 font-medium text-gray-700 text-sm">notes</span>
				</div>
			</div>

			<div className="min-h-[300px] flex-1">
				<video
					loop
					muted
					controls
					autoPlay
					className="block h-[250px] w-full overflow-hidden rounded-lg object-cover object-top"
				>
					<source src="/markdown.mp4" type="video/mp4" />
					<track kind="captions" src="captions_en.vtt" label="English" default />
					お使いのブラウザは video タグに対応していません。
				</video>
			</div>

			<div className="absolute right-0 bottom-0 h-4 w-4 cursor-se-resize">
				<div className="absolute right-1 bottom-1 h-2 w-2 border-gray-400 border-r-2 border-b-2" />
			</div>
		</div>
	);
}
