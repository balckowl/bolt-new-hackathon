import { availableLanguages, defaultLanguage } from "@/src/i18n/settings";
import Negotiator from "negotiator";
import { type NextRequest, NextResponse } from "next/server";

const LANG_COOKIE_KEY = "lang";
const ONE_YEAR = 60 * 60 * 24 * 365; // seconds

const getNegotiatedLanguage = (headers: Negotiator.Headers): string | undefined =>
	new Negotiator({ headers }).language([...availableLanguages]);

/** パスから /{lang} を抽出（なければ undefined） */
function getLangFromPath(pathname: string): string | undefined {
	const seg = pathname.split("/")[1];
	return availableLanguages.includes(seg) ? seg : undefined;
}

export const config = {
	// api や _next/static、_next/image、さらに png, jpg, svg, dmg, avif をスキップ
	matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|svg|dmg|avif|mp4|PNG)$).*)"],
};

export function middleware(request: NextRequest) {
	const { nextUrl, cookies: reqCookies, headers: reqHeaders } = request;
	const pathname = nextUrl.pathname;

	// 1) 既に /{lang} が付いているか？
	const langInPath = getLangFromPath(pathname);

	// レスポンスに共通で付ける（CDNキャッシュのため）
	const withVary = (res: NextResponse) => {
		res.headers.set("Vary", "Accept-Language, Cookie");
		return res;
	};

	// 2) /{lang} 付きで来た場合 → Cookie を最新化して通す
	if (langInPath) {
		const res = NextResponse.next();
		// 既存 Cookie と違えば更新
		const current = reqCookies.get(LANG_COOKIE_KEY)?.value;
		if (current !== langInPath) {
			res.cookies.set({
				name: LANG_COOKIE_KEY,
				value: langInPath,
				path: "/",
				httpOnly: false, // クライアントでも読みたいなら false
				sameSite: "lax",
				secure: process.env.NODE_ENV === "production",
				maxAge: ONE_YEAR,
			});
		}
		return withVary(res);
	}

	// 3) /{lang} が無い場合 → 付けるべき言語を決める
	const headers = {
		"accept-language": reqHeaders.get("accept-language") ?? "",
	};

	const cookieLang = reqCookies.get(LANG_COOKIE_KEY)?.value;
	const cookieLangValid = cookieLang && availableLanguages.includes(cookieLang);

	const negotiated = getNegotiatedLanguage(headers);
	const preferredLanguage = (cookieLangValid ? cookieLang : negotiated) || defaultLanguage;

	// 4) 付与方針：
	// - 非デフォルトなら redirect（/en/... へ移動）
	// - デフォルトなら rewrite（/ja/... を内部的に指す）
	const pathnameIsMissingLocale = availableLanguages.every(
		(lang) => !pathname.startsWith(`/${lang}/`) && pathname !== `/${lang}`,
	);

	if (pathnameIsMissingLocale) {
		if (preferredLanguage !== defaultLanguage) {
			const url = nextUrl.clone();
			url.pathname = `/${preferredLanguage}${pathname}`;
			return withVary(NextResponse.redirect(url));
		}
		const url = nextUrl.clone();
		url.pathname = `/${defaultLanguage}${pathname}`;
		return withVary(NextResponse.rewrite(url));
	}

	// ここまで来たら通常継続
	return withVary(NextResponse.next());
}
