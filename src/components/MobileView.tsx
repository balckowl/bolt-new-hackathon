"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import type { z } from "zod";

import { Folder, FolderClosed, Scroll, StickyNote, X } from "lucide-react";

import type { desktopStateSchema } from "../server/models/os.schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type Props = {
	desktop: z.infer<typeof desktopStateSchema>;
};

type DesktopApp = Props["desktop"]["state"]["apps"][number];
type MemoApp = Extract<DesktopApp, { type: "memo" }>;

export default function MobileView({ desktop }: Props) {
	const { apps, folderContents } = desktop.state;
	const nestedAppIds = new Set(Object.values(folderContents).flat());
	const [activeMemo, setActiveMemo] = useState<MemoApp | null>(null);

	const rootMemos = apps.filter(
		(app): app is MemoApp => app.type === "memo" && !nestedAppIds.has(app.id),
	);
	const rootFolders = apps.filter(
		(app): app is Extract<DesktopApp, { type: "folder" }> =>
			app.type === "folder" && !nestedAppIds.has(app.id),
	);
	const rootWebsites = apps.filter(
		(app): app is Extract<DesktopApp, { type: "website" }> =>
			app.type === "website" && !nestedAppIds.has(app.id),
	);

	const findAppById = (id: string) => apps.find((app) => app.id === id);

	const renderMemoAccordion = (memos: DesktopApp[], groupKey: string) => {
		if (!memos.length) return null;

		return (
			<Accordion type="multiple" className="rounded-lg border bg-white">
				{memos.map((memo) => {
					const hasContent = Boolean(memo.content && memo.content.trim().length > 0);
					const displayText = hasContent ? memo.content : "メモの内容はありません。";

					return (
						<AccordionItem key={`${groupKey}-${memo.id}`} value={`${groupKey}-${memo.id}`}>
							<AccordionTrigger>
								<div className="flex items-center gap-2 px-2">
									<StickyNote width={18} height={18} />
									<span className="text-left font-medium">{memo.name}</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								{/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
								<div
									dangerouslySetInnerHTML={{ __html: displayText }}
									className="prose prose-sm m-5 prose-blockquote:m-0 prose-headings:m-0 prose-hr:m-0 prose-ol:m-0 prose-p:m-0 prose-pre:m-0 prose-ul:m-0 text-left prose-li:marker:text-black focus:outline-none"
								/>
							</AccordionContent>
						</AccordionItem>
					);
				})}
			</Accordion>
		);
	};

	const renderWebsiteLinks = (websites: DesktopApp[]): ReactNode => {
		if (!websites.length) return null;

		return (
			<div className="space-y-3">
				{websites.map((site) => (
					<div key={site.id} className="rounded-md border bg-white p-3">
						<p className="font-medium text-gray-800 text-sm">{site.name}</p>
						{site.url ? (
							<Link
								href={site.url}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 text-sm underline"
							>
								{site.url}
							</Link>
						) : (
							<p className="text-gray-500 text-sm">リンクが設定されていません。</p>
						)}
					</div>
				))}
			</div>
		);
	};

	const renderFolderItem = (folder: DesktopApp, visited: Set<string>) => {
		if (visited.has(folder.id)) return null;
		const nextVisited = new Set(visited);
		nextVisited.add(folder.id);

		const childIds = folderContents[folder.id] ?? [];
		const children = childIds
			.map((id) => findAppById(id))
			.filter((child): child is DesktopApp => Boolean(child));
		const childCount = children.length;

		const childMemos = children.filter((child) => child.type === "memo");
		const childWebsites = children.filter((child) => child.type === "website");
		const childFolders = children.filter((child) => child.type === "folder");

		return (
			<AccordionItem key={folder.id} value={folder.id}>
				<AccordionTrigger>
					<div className="flex w-full items-center justify-between gap-3 px-2 text-left font-medium">
						<div className="flex items-center gap-2">
							<FolderClosed width={18} height={18} />
							<span className="truncate">{folder.name}</span>
						</div>
						<span className="font-normal text-gray-500 text-xs">{childCount}</span>
					</div>
				</AccordionTrigger>
				<AccordionContent>
					<div className="space-y-5">
						{childMemos.length > 0 && (
							<div className="space-y-2">
								<p className="font-semibold text-gray-500 text-xs uppercase tracking-wide">Memo</p>
								{renderMemoAccordion(childMemos, `folder-memo-${folder.id}`)}
							</div>
						)}
						{childWebsites.length > 0 && (
							<div className="space-y-2">
								<p className="font-semibold text-gray-500 text-xs uppercase tracking-wide">
									Website
								</p>
								{renderWebsiteLinks(childWebsites)}
							</div>
						)}
						{childFolders.length > 0 && (
							<div className="space-y-2">
								<p className="font-semibold text-gray-500 text-xs uppercase tracking-wide">
									Folder
								</p>
								<Accordion type="multiple" className="rounded-lg border bg-gray-50">
									{childFolders.map((childFolder) => renderFolderItem(childFolder, nextVisited))}
								</Accordion>
							</div>
						)}
						{!children.length && (
							<p className="text-gray-500 text-sm">このフォルダにはコンテンツがありません。</p>
						)}
					</div>
				</AccordionContent>
			</AccordionItem>
		);
	};

	const MemoSection = () => (
		<section className="space-y-3">
			<h2 className="font-semibold text-lg">Memo</h2>
			{renderMemoAccordion(rootMemos, "root-memo") ?? (
				<p className="rounded-md border bg-white p-4 text-gray-500 text-sm">
					表示できるメモはありません。
				</p>
			)}
		</section>
	);

	const FolderSection = ({ withTopMargin = true }: { withTopMargin?: boolean }) => {
		const sectionClassName = withTopMargin ? "space-y-3 mt-8" : "space-y-3";

		return (
			<section className={sectionClassName}>
				<h2 className="font-semibold text-lg">Folder</h2>
				{rootFolders.length > 0 ? (
					<Accordion type="multiple" className="rounded-lg border bg-white">
						{rootFolders.map((folder) => renderFolderItem(folder, new Set()))}
					</Accordion>
				) : (
					<p className="rounded-md border bg-white p-4 text-gray-500 text-sm">
						表示できるフォルダはありません。
					</p>
				)}
			</section>
		);
	};

	const WebsiteSection = ({ withTopMargin = true }: { withTopMargin?: boolean }) => {
		const sectionClassName = withTopMargin ? "space-y-3 mt-8" : "space-y-3";

		return (
			<section className={sectionClassName}>
				<h2 className="font-semibold text-lg">Website</h2>
				{renderWebsiteLinks(rootWebsites) ?? (
					<p className="rounded-md border bg-white p-4 text-gray-500 text-sm">
						表示できるリンクはありません。
					</p>
				)}
			</section>
		);
	};

	return (
		<div className="bg-white">
			<Image
				src="/background/sky.png"
				width={100}
				height={30}
				alt="hero"
				className="h-[120px] w-full object-cover"
			/>

			<div className="min-h-screen w-full px-4 py-6 text-gray-900">
				<Tabs defaultValue="all" className="space-y-6">
					<TabsList className="w-full gap-2 bg-white p-1">
						<TabsTrigger value="all" className="flex-1 text-sm">
							All
						</TabsTrigger>
						<TabsTrigger value="memo" className="flex-1 text-sm">
							Memo
						</TabsTrigger>
						<TabsTrigger value="folder" className="flex-1 text-sm">
							Folder
						</TabsTrigger>
						<TabsTrigger value="website" className="flex-1 text-sm">
							Website
						</TabsTrigger>
					</TabsList>
					<TabsContent value="all" className="mt-4">
						<div className="space-y-8">
							<MemoSection />
							<FolderSection />
							<WebsiteSection />
						</div>
					</TabsContent>
					<TabsContent value="memo" className="mt-4">
						<MemoSection />
					</TabsContent>
					<TabsContent value="folder" className="mt-4">
						<FolderSection withTopMargin={false} />
					</TabsContent>
					<TabsContent value="website" className="mt-4">
						<WebsiteSection withTopMargin={false} />
					</TabsContent>
				</Tabs>
			</div>
			<footer className="flex h-[100px] items-center justify-center">
				<Button size="sm">Create Your ospace</Button>
			</footer>
		</div>
	);
}
