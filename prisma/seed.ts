import { prisma } from "@/src/lib/prisma";

async function seeding() {
	const user = await prisma.user.create({
		data: {
			id: "user-0001",
			email: "user1@example.com",
			name: "Test User 1",
			emailVerified: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});

	await prisma.account.create({
		data: {
			id: "account-0001",
			accountId: "google-sub-12345",
			providerId: "google",
			userId: user.id,
			accessToken: "dummy-access-token",
			refreshToken: "dummy-refresh-token",
			idToken: "dummy-id-token",
			accessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
			refreshTokenExpiresAt: new Date(Date.now() + 3600 * 1000 * 24),
			scope: "openid profile email",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});

	await prisma.session.create({
		data: {
			id: "session-0001",
			expiresAt: new Date(Date.now() + 3600 * 1000),
			token: "dummy-session-token",
			createdAt: new Date(),
			updatedAt: new Date(),
			ipAddress: "127.0.0.1",
			userAgent: "seed-script",
			userId: user.id,
		},
	});

	await prisma.verification.create({
		data: {
			id: "verification-0001",
			identifier: "user1@example.com",
			value: "dummy-verification-code",
			expiresAt: new Date(Date.now() + 15 * 60 * 1000),
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});

	await prisma.user.update({
		where: { id: "user-0001" },
		data: {
			osName: "dummy",
			desktop: {
				create: {
					state: {
						apps: [
							{
								id: "app-1",
								name: "Intro",
								iconKey: "StickyNote",
								color: "#FFEB3B",
								type: "memo",
								content:
									"<p>Thank you for using this site! 🎉✨<br>You can find instructions on how to use it under <strong>Instructions</strong> in the menu bar.</p>",
							},
						],
						appPositions: {
							"app-1": {
								row: 0,
								col: 0,
							},
						},
					},
				},
			},
		},
	});
}

seeding();
