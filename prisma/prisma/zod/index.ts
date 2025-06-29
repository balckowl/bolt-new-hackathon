import { z } from "zod";
import { Prisma } from "../../../src/generated/prisma";

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput =
	| Prisma.JsonValue
	| null
	| "JsonNull"
	| "DbNull"
	| Prisma.NullTypes.DbNull
	| Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
	if (!v || v === "DbNull") return Prisma.DbNull;
	if (v === "JsonNull") return Prisma.JsonNull;
	return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.literal(null),
		z.record(z.lazy(() => JsonValueSchema.optional())),
		z.array(z.lazy(() => JsonValueSchema)),
	]),
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
	.union([JsonValueSchema, z.literal("DbNull"), z.literal("JsonNull")])
	.nullable()
	.transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
		z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
		z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
	]),
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
	"ReadUncommitted",
	"ReadCommitted",
	"RepeatableRead",
	"Serializable",
]);

export const UserScalarFieldEnumSchema = z.enum([
	"id",
	"name",
	"email",
	"emailVerified",
	"image",
	"createdAt",
	"updatedAt",
	"osName",
]);

export const DesktopScalarFieldEnumSchema = z.enum([
	"id",
	"userId",
	"state",
	"isPublic",
	"background",
	"createdAt",
	"updatedAt",
]);

export const SessionScalarFieldEnumSchema = z.enum([
	"id",
	"expiresAt",
	"token",
	"createdAt",
	"updatedAt",
	"ipAddress",
	"userAgent",
	"userId",
]);

export const AccountScalarFieldEnumSchema = z.enum([
	"id",
	"accountId",
	"providerId",
	"userId",
	"accessToken",
	"refreshToken",
	"idToken",
	"accessTokenExpiresAt",
	"refreshTokenExpiresAt",
	"scope",
	"password",
	"createdAt",
	"updatedAt",
]);

export const VerificationScalarFieldEnumSchema = z.enum([
	"id",
	"identifier",
	"value",
	"expiresAt",
	"createdAt",
	"updatedAt",
]);

export const SortOrderSchema = z.enum(["asc", "desc"]);

export const JsonNullValueInputSchema = z
	.enum(["JsonNull"])
	.transform((value) => (value === "JsonNull" ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(["default", "insensitive"]);

export const NullsOrderSchema = z.enum(["first", "last"]);

export const JsonNullValueFilterSchema = z
	.enum(["DbNull", "JsonNull", "AnyNull"])
	.transform((value) =>
		value === "JsonNull"
			? Prisma.JsonNull
			: value === "DbNull"
				? Prisma.JsonNull
				: value === "AnyNull"
					? Prisma.AnyNull
					: value,
	);

export const BackgroundOptionSchema = z.enum([
	"DEFAULT",
	"WARM",
	"GREEN",
	"BLACK",
	"SUNSET",
	"STATION",
	"OCEAN",
	"SAKURA",
	"MOUNTAIN",
]);

export type BackgroundOptionType = `${z.infer<typeof BackgroundOptionSchema>}`;

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	emailVerified: z.boolean(),
	image: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	osName: z
		.string()
		.min(2, { message: "OS 名は2文字以上で入力してください。" })
		.max(10, { message: "OS 名は10文字以下で入力してください。" })
		.nullable(),
});

export type User = z.infer<typeof UserSchema>;

/////////////////////////////////////////
// DESKTOP SCHEMA
/////////////////////////////////////////

export const DesktopSchema = z.object({
	background: BackgroundOptionSchema,
	id: z.string().uuid(),
	userId: z.string(),
	state: JsonValueSchema,
	isPublic: z.boolean(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Desktop = z.infer<typeof DesktopSchema>;

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
	id: z.string(),
	expiresAt: z.coerce.date(),
	token: z.string(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	ipAddress: z.string().nullable(),
	userAgent: z.string().nullable(),
	userId: z.string(),
});

export type Session = z.infer<typeof SessionSchema>;

/////////////////////////////////////////
// ACCOUNT SCHEMA
/////////////////////////////////////////

export const AccountSchema = z.object({
	id: z.string(),
	accountId: z.string(),
	providerId: z.string(),
	userId: z.string(),
	accessToken: z.string().nullable(),
	refreshToken: z.string().nullable(),
	idToken: z.string().nullable(),
	accessTokenExpiresAt: z.coerce.date().nullable(),
	refreshTokenExpiresAt: z.coerce.date().nullable(),
	scope: z.string().nullable(),
	password: z.string().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export type Account = z.infer<typeof AccountSchema>;

/////////////////////////////////////////
// VERIFICATION SCHEMA
/////////////////////////////////////////

export const VerificationSchema = z.object({
	id: z.string(),
	identifier: z.string(),
	value: z.string(),
	expiresAt: z.coerce.date(),
	createdAt: z.coerce.date().nullable(),
	updatedAt: z.coerce.date().nullable(),
});

export type Verification = z.infer<typeof VerificationSchema>;

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z
	.object({
		sessions: z.union([z.boolean(), z.lazy(() => SessionFindManyArgsSchema)]).optional(),
		accounts: z.union([z.boolean(), z.lazy(() => AccountFindManyArgsSchema)]).optional(),
		desktop: z.union([z.boolean(), z.lazy(() => DesktopArgsSchema)]).optional(),
		_count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
	})
	.strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z
	.object({
		select: z.lazy(() => UserSelectSchema).optional(),
		include: z.lazy(() => UserIncludeSchema).optional(),
	})
	.strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z
	.object({
		select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
	})
	.strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z
	.object({
		sessions: z.boolean().optional(),
		accounts: z.boolean().optional(),
	})
	.strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z
	.object({
		id: z.boolean().optional(),
		name: z.boolean().optional(),
		email: z.boolean().optional(),
		emailVerified: z.boolean().optional(),
		image: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		osName: z.boolean().optional(),
		sessions: z.union([z.boolean(), z.lazy(() => SessionFindManyArgsSchema)]).optional(),
		accounts: z.union([z.boolean(), z.lazy(() => AccountFindManyArgsSchema)]).optional(),
		desktop: z.union([z.boolean(), z.lazy(() => DesktopArgsSchema)]).optional(),
		_count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
	})
	.strict();

// DESKTOP
//------------------------------------------------------

export const DesktopIncludeSchema: z.ZodType<Prisma.DesktopInclude> = z
	.object({
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
	})
	.strict();

export const DesktopArgsSchema: z.ZodType<Prisma.DesktopDefaultArgs> = z
	.object({
		select: z.lazy(() => DesktopSelectSchema).optional(),
		include: z.lazy(() => DesktopIncludeSchema).optional(),
	})
	.strict();

export const DesktopSelectSchema: z.ZodType<Prisma.DesktopSelect> = z
	.object({
		id: z.boolean().optional(),
		userId: z.boolean().optional(),
		state: z.boolean().optional(),
		isPublic: z.boolean().optional(),
		background: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
	})
	.strict();

// SESSION
//------------------------------------------------------

export const SessionIncludeSchema: z.ZodType<Prisma.SessionInclude> = z
	.object({
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
	})
	.strict();

export const SessionArgsSchema: z.ZodType<Prisma.SessionDefaultArgs> = z
	.object({
		select: z.lazy(() => SessionSelectSchema).optional(),
		include: z.lazy(() => SessionIncludeSchema).optional(),
	})
	.strict();

export const SessionSelectSchema: z.ZodType<Prisma.SessionSelect> = z
	.object({
		id: z.boolean().optional(),
		expiresAt: z.boolean().optional(),
		token: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		ipAddress: z.boolean().optional(),
		userAgent: z.boolean().optional(),
		userId: z.boolean().optional(),
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
	})
	.strict();

// ACCOUNT
//------------------------------------------------------

export const AccountIncludeSchema: z.ZodType<Prisma.AccountInclude> = z
	.object({
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
	})
	.strict();

export const AccountArgsSchema: z.ZodType<Prisma.AccountDefaultArgs> = z
	.object({
		select: z.lazy(() => AccountSelectSchema).optional(),
		include: z.lazy(() => AccountIncludeSchema).optional(),
	})
	.strict();

export const AccountSelectSchema: z.ZodType<Prisma.AccountSelect> = z
	.object({
		id: z.boolean().optional(),
		accountId: z.boolean().optional(),
		providerId: z.boolean().optional(),
		userId: z.boolean().optional(),
		accessToken: z.boolean().optional(),
		refreshToken: z.boolean().optional(),
		idToken: z.boolean().optional(),
		accessTokenExpiresAt: z.boolean().optional(),
		refreshTokenExpiresAt: z.boolean().optional(),
		scope: z.boolean().optional(),
		password: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
		user: z.union([z.boolean(), z.lazy(() => UserArgsSchema)]).optional(),
	})
	.strict();

// VERIFICATION
//------------------------------------------------------

export const VerificationSelectSchema: z.ZodType<Prisma.VerificationSelect> = z
	.object({
		id: z.boolean().optional(),
		identifier: z.boolean().optional(),
		value: z.boolean().optional(),
		expiresAt: z.boolean().optional(),
		createdAt: z.boolean().optional(),
		updatedAt: z.boolean().optional(),
	})
	.strict();

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z
	.object({
		AND: z
			.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
			.optional(),
		OR: z
			.lazy(() => UserWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		email: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		emailVerified: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
		image: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		osName: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
		accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
		desktop: z
			.union([
				z.lazy(() => DesktopNullableScalarRelationFilterSchema),
				z.lazy(() => DesktopWhereInputSchema),
			])
			.optional()
			.nullable(),
	})
	.strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		emailVerified: z.lazy(() => SortOrderSchema).optional(),
		image: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		osName: z.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)]).optional(),
		sessions: z.lazy(() => SessionOrderByRelationAggregateInputSchema).optional(),
		accounts: z.lazy(() => AccountOrderByRelationAggregateInputSchema).optional(),
		desktop: z.lazy(() => DesktopOrderByWithRelationInputSchema).optional(),
	})
	.strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z
	.union([
		z.object({
			id: z.string(),
			osName: z
				.string()
				.min(2, { message: "OS 名は2文字以上で入力してください。" })
				.max(10, { message: "OS 名は10文字以下で入力してください。" }),
			email: z.string(),
		}),
		z.object({
			id: z.string(),
			osName: z
				.string()
				.min(2, { message: "OS 名は2文字以上で入力してください。" })
				.max(10, { message: "OS 名は10文字以下で入力してください。" }),
		}),
		z.object({
			id: z.string(),
			email: z.string(),
		}),
		z.object({
			id: z.string(),
		}),
		z.object({
			osName: z
				.string()
				.min(2, { message: "OS 名は2文字以上で入力してください。" })
				.max(10, { message: "OS 名は10文字以下で入力してください。" }),
			email: z.string(),
		}),
		z.object({
			osName: z
				.string()
				.min(2, { message: "OS 名は2文字以上で入力してください。" })
				.max(10, { message: "OS 名は10文字以下で入力してください。" }),
		}),
		z.object({
			email: z.string(),
		}),
	])
	.and(
		z
			.object({
				id: z.string().optional(),
				email: z.string().optional(),
				osName: z
					.string()
					.min(2, { message: "OS 名は2文字以上で入力してください。" })
					.max(10, { message: "OS 名は10文字以下で入力してください。" })
					.optional(),
				AND: z
					.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
					.optional(),
				OR: z
					.lazy(() => UserWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array()])
					.optional(),
				name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
				emailVerified: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
				image: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
				updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
				sessions: z.lazy(() => SessionListRelationFilterSchema).optional(),
				accounts: z.lazy(() => AccountListRelationFilterSchema).optional(),
				desktop: z
					.union([
						z.lazy(() => DesktopNullableScalarRelationFilterSchema),
						z.lazy(() => DesktopWhereInputSchema),
					])
					.optional()
					.nullable(),
			})
			.strict(),
	);

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			name: z.lazy(() => SortOrderSchema).optional(),
			email: z.lazy(() => SortOrderSchema).optional(),
			emailVerified: z.lazy(() => SortOrderSchema).optional(),
			image: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			osName: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			_count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
			_max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
			_min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
		})
		.strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> =
	z
		.object({
			AND: z
				.union([
					z.lazy(() => UserScalarWhereWithAggregatesInputSchema),
					z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => UserScalarWhereWithAggregatesInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => UserScalarWhereWithAggregatesInputSchema),
					z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			name: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			email: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			emailVerified: z
				.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()])
				.optional(),
			image: z
				.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
			updatedAt: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
			osName: z
				.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
				.optional()
				.nullable(),
		})
		.strict();

export const DesktopWhereInputSchema: z.ZodType<Prisma.DesktopWhereInput> = z
	.object({
		AND: z
			.union([z.lazy(() => DesktopWhereInputSchema), z.lazy(() => DesktopWhereInputSchema).array()])
			.optional(),
		OR: z
			.lazy(() => DesktopWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([z.lazy(() => DesktopWhereInputSchema), z.lazy(() => DesktopWhereInputSchema).array()])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		state: z.lazy(() => JsonFilterSchema).optional(),
		isPublic: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
		background: z
			.union([z.lazy(() => EnumBackgroundOptionFilterSchema), z.lazy(() => BackgroundOptionSchema)])
			.optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		user: z
			.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
			.optional(),
	})
	.strict();

export const DesktopOrderByWithRelationInputSchema: z.ZodType<Prisma.DesktopOrderByWithRelationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			state: z.lazy(() => SortOrderSchema).optional(),
			isPublic: z.lazy(() => SortOrderSchema).optional(),
			background: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
		})
		.strict();

export const DesktopWhereUniqueInputSchema: z.ZodType<Prisma.DesktopWhereUniqueInput> = z
	.union([
		z.object({
			id: z.string().uuid(),
			userId: z.string(),
		}),
		z.object({
			id: z.string().uuid(),
		}),
		z.object({
			userId: z.string(),
		}),
	])
	.and(
		z
			.object({
				id: z.string().uuid().optional(),
				userId: z.string().optional(),
				AND: z
					.union([
						z.lazy(() => DesktopWhereInputSchema),
						z.lazy(() => DesktopWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => DesktopWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => DesktopWhereInputSchema),
						z.lazy(() => DesktopWhereInputSchema).array(),
					])
					.optional(),
				state: z.lazy(() => JsonFilterSchema).optional(),
				isPublic: z.union([z.lazy(() => BoolFilterSchema), z.boolean()]).optional(),
				background: z
					.union([
						z.lazy(() => EnumBackgroundOptionFilterSchema),
						z.lazy(() => BackgroundOptionSchema),
					])
					.optional(),
				createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
				updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
				user: z
					.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
					.optional(),
			})
			.strict(),
	);

export const DesktopOrderByWithAggregationInputSchema: z.ZodType<Prisma.DesktopOrderByWithAggregationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			state: z.lazy(() => SortOrderSchema).optional(),
			isPublic: z.lazy(() => SortOrderSchema).optional(),
			background: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			_count: z.lazy(() => DesktopCountOrderByAggregateInputSchema).optional(),
			_max: z.lazy(() => DesktopMaxOrderByAggregateInputSchema).optional(),
			_min: z.lazy(() => DesktopMinOrderByAggregateInputSchema).optional(),
		})
		.strict();

export const DesktopScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DesktopScalarWhereWithAggregatesInput> =
	z
		.object({
			AND: z
				.union([
					z.lazy(() => DesktopScalarWhereWithAggregatesInputSchema),
					z.lazy(() => DesktopScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => DesktopScalarWhereWithAggregatesInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => DesktopScalarWhereWithAggregatesInputSchema),
					z.lazy(() => DesktopScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			state: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
			isPublic: z.union([z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean()]).optional(),
			background: z
				.union([
					z.lazy(() => EnumBackgroundOptionWithAggregatesFilterSchema),
					z.lazy(() => BackgroundOptionSchema),
				])
				.optional(),
			createdAt: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
			updatedAt: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
		})
		.strict();

export const SessionWhereInputSchema: z.ZodType<Prisma.SessionWhereInput> = z
	.object({
		AND: z
			.union([z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array()])
			.optional(),
		OR: z
			.lazy(() => SessionWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([z.lazy(() => SessionWhereInputSchema), z.lazy(() => SessionWhereInputSchema).array()])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		expiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		token: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		ipAddress: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		user: z
			.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
			.optional(),
	})
	.strict();

export const SessionOrderByWithRelationInputSchema: z.ZodType<Prisma.SessionOrderByWithRelationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			expiresAt: z.lazy(() => SortOrderSchema).optional(),
			token: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			ipAddress: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			userAgent: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
		})
		.strict();

export const SessionWhereUniqueInputSchema: z.ZodType<Prisma.SessionWhereUniqueInput> = z
	.union([
		z.object({
			id: z.string(),
			token: z.string(),
		}),
		z.object({
			id: z.string(),
		}),
		z.object({
			token: z.string(),
		}),
	])
	.and(
		z
			.object({
				id: z.string().optional(),
				token: z.string().optional(),
				AND: z
					.union([
						z.lazy(() => SessionWhereInputSchema),
						z.lazy(() => SessionWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => SessionWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => SessionWhereInputSchema),
						z.lazy(() => SessionWhereInputSchema).array(),
					])
					.optional(),
				expiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
				createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
				updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
				ipAddress: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				userAgent: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
				user: z
					.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
					.optional(),
			})
			.strict(),
	);

export const SessionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SessionOrderByWithAggregationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			expiresAt: z.lazy(() => SortOrderSchema).optional(),
			token: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			ipAddress: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			userAgent: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			_count: z.lazy(() => SessionCountOrderByAggregateInputSchema).optional(),
			_max: z.lazy(() => SessionMaxOrderByAggregateInputSchema).optional(),
			_min: z.lazy(() => SessionMinOrderByAggregateInputSchema).optional(),
		})
		.strict();

export const SessionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SessionScalarWhereWithAggregatesInput> =
	z
		.object({
			AND: z
				.union([
					z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),
					z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => SessionScalarWhereWithAggregatesInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => SessionScalarWhereWithAggregatesInputSchema),
					z.lazy(() => SessionScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			expiresAt: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
			token: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			createdAt: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
			updatedAt: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
			ipAddress: z
				.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
				.optional()
				.nullable(),
			userAgent: z
				.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
				.optional()
				.nullable(),
			userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
		})
		.strict();

export const AccountWhereInputSchema: z.ZodType<Prisma.AccountWhereInput> = z
	.object({
		AND: z
			.union([z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array()])
			.optional(),
		OR: z
			.lazy(() => AccountWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([z.lazy(() => AccountWhereInputSchema), z.lazy(() => AccountWhereInputSchema).array()])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		accountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		providerId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		accessToken: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		idToken: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		scope: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		password: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		user: z
			.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
			.optional(),
	})
	.strict();

export const AccountOrderByWithRelationInputSchema: z.ZodType<Prisma.AccountOrderByWithRelationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			accountId: z.lazy(() => SortOrderSchema).optional(),
			providerId: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			accessToken: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			refreshToken: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			idToken: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			accessTokenExpiresAt: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			refreshTokenExpiresAt: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			scope: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			password: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
		})
		.strict();

export const AccountWhereUniqueInputSchema: z.ZodType<Prisma.AccountWhereUniqueInput> = z
	.object({
		id: z.string(),
	})
	.and(
		z
			.object({
				id: z.string().optional(),
				AND: z
					.union([
						z.lazy(() => AccountWhereInputSchema),
						z.lazy(() => AccountWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => AccountWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => AccountWhereInputSchema),
						z.lazy(() => AccountWhereInputSchema).array(),
					])
					.optional(),
				accountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
				providerId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
				userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
				accessToken: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				refreshToken: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				idToken: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				accessTokenExpiresAt: z
					.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
					.optional()
					.nullable(),
				refreshTokenExpiresAt: z
					.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
					.optional()
					.nullable(),
				scope: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				password: z
					.union([z.lazy(() => StringNullableFilterSchema), z.string()])
					.optional()
					.nullable(),
				createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
				updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
				user: z
					.union([z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema)])
					.optional(),
			})
			.strict(),
	);

export const AccountOrderByWithAggregationInputSchema: z.ZodType<Prisma.AccountOrderByWithAggregationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			accountId: z.lazy(() => SortOrderSchema).optional(),
			providerId: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			accessToken: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			refreshToken: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			idToken: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			accessTokenExpiresAt: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			refreshTokenExpiresAt: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			scope: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			password: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			_count: z.lazy(() => AccountCountOrderByAggregateInputSchema).optional(),
			_max: z.lazy(() => AccountMaxOrderByAggregateInputSchema).optional(),
			_min: z.lazy(() => AccountMinOrderByAggregateInputSchema).optional(),
		})
		.strict();

export const AccountScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AccountScalarWhereWithAggregatesInput> =
	z
		.object({
			AND: z
				.union([
					z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),
					z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => AccountScalarWhereWithAggregatesInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => AccountScalarWhereWithAggregatesInputSchema),
					z.lazy(() => AccountScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			accountId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			providerId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			userId: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			accessToken: z
				.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
				.optional()
				.nullable(),
			refreshToken: z
				.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
				.optional()
				.nullable(),
			idToken: z
				.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
				.optional()
				.nullable(),
			accessTokenExpiresAt: z
				.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
				.optional()
				.nullable(),
			refreshTokenExpiresAt: z
				.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
				.optional()
				.nullable(),
			scope: z
				.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
				.optional()
				.nullable(),
			password: z
				.union([z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string()])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
			updatedAt: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
		})
		.strict();

export const VerificationWhereInputSchema: z.ZodType<Prisma.VerificationWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => VerificationWhereInputSchema),
				z.lazy(() => VerificationWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => VerificationWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => VerificationWhereInputSchema),
				z.lazy(() => VerificationWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		identifier: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		value: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		expiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		createdAt: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		updatedAt: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
	})
	.strict();

export const VerificationOrderByWithRelationInputSchema: z.ZodType<Prisma.VerificationOrderByWithRelationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			identifier: z.lazy(() => SortOrderSchema).optional(),
			value: z.lazy(() => SortOrderSchema).optional(),
			expiresAt: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
		})
		.strict();

export const VerificationWhereUniqueInputSchema: z.ZodType<Prisma.VerificationWhereUniqueInput> = z
	.object({
		id: z.string(),
	})
	.and(
		z
			.object({
				id: z.string().optional(),
				AND: z
					.union([
						z.lazy(() => VerificationWhereInputSchema),
						z.lazy(() => VerificationWhereInputSchema).array(),
					])
					.optional(),
				OR: z
					.lazy(() => VerificationWhereInputSchema)
					.array()
					.optional(),
				NOT: z
					.union([
						z.lazy(() => VerificationWhereInputSchema),
						z.lazy(() => VerificationWhereInputSchema).array(),
					])
					.optional(),
				identifier: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
				value: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
				expiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
				createdAt: z
					.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
					.optional()
					.nullable(),
				updatedAt: z
					.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
					.optional()
					.nullable(),
			})
			.strict(),
	);

export const VerificationOrderByWithAggregationInputSchema: z.ZodType<Prisma.VerificationOrderByWithAggregationInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			identifier: z.lazy(() => SortOrderSchema).optional(),
			value: z.lazy(() => SortOrderSchema).optional(),
			expiresAt: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema)])
				.optional(),
			_count: z.lazy(() => VerificationCountOrderByAggregateInputSchema).optional(),
			_max: z.lazy(() => VerificationMaxOrderByAggregateInputSchema).optional(),
			_min: z.lazy(() => VerificationMinOrderByAggregateInputSchema).optional(),
		})
		.strict();

export const VerificationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VerificationScalarWhereWithAggregatesInput> =
	z
		.object({
			AND: z
				.union([
					z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema),
					z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			OR: z
				.lazy(() => VerificationScalarWhereWithAggregatesInputSchema)
				.array()
				.optional(),
			NOT: z
				.union([
					z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema),
					z.lazy(() => VerificationScalarWhereWithAggregatesInputSchema).array(),
				])
				.optional(),
			id: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			identifier: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			value: z.union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()]).optional(),
			expiresAt: z
				.union([z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date()])
				.optional(),
			createdAt: z
				.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
				.optional()
				.nullable(),
			updatedAt: z
				.union([z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date()])
				.optional()
				.nullable(),
		})
		.strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z
	.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		emailVerified: z.boolean(),
		image: z.string().optional().nullable(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		osName: z
			.string()
			.min(2, { message: "OS 名は2文字以上で入力してください。" })
			.max(10, { message: "OS 名は10文字以下で入力してください。" })
			.optional()
			.nullable(),
		sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
		accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
		desktop: z.lazy(() => DesktopCreateNestedOneWithoutUserInputSchema).optional(),
	})
	.strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z
	.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		emailVerified: z.boolean(),
		image: z.string().optional().nullable(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		osName: z
			.string()
			.min(2, { message: "OS 名は2文字以上で入力してください。" })
			.max(10, { message: "OS 名は10文字以下で入力してください。" })
			.optional()
			.nullable(),
		sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
		accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
		desktop: z.lazy(() => DesktopUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
	})
	.strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z
	.object({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		osName: z
			.union([
				z
					.string()
					.min(2, { message: "OS 名は2文字以上で入力してください。" })
					.max(10, { message: "OS 名は10文字以下で入力してください。" }),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
		accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
		desktop: z.lazy(() => DesktopUpdateOneWithoutUserNestedInputSchema).optional(),
	})
	.strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z
	.object({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		osName: z
			.union([
				z
					.string()
					.min(2, { message: "OS 名は2文字以上で入力してください。" })
					.max(10, { message: "OS 名は10文字以下で入力してください。" }),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
		sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
		accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
		desktop: z.lazy(() => DesktopUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
	})
	.strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z
	.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		emailVerified: z.boolean(),
		image: z.string().optional().nullable(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		osName: z
			.string()
			.min(2, { message: "OS 名は2文字以上で入力してください。" })
			.max(10, { message: "OS 名は10文字以下で入力してください。" })
			.optional()
			.nullable(),
	})
	.strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z
	.object({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		osName: z
			.union([
				z
					.string()
					.min(2, { message: "OS 名は2文字以上で入力してください。" })
					.max(10, { message: "OS 名は10文字以下で入力してください。" }),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
	})
	.strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z
	.object({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		emailVerified: z
			.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
			.optional(),
		image: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		osName: z
			.union([
				z
					.string()
					.min(2, { message: "OS 名は2文字以上で入力してください。" })
					.max(10, { message: "OS 名は10文字以下で入力してください。" }),
				z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
			])
			.optional()
			.nullable(),
	})
	.strict();

export const DesktopCreateInputSchema: z.ZodType<Prisma.DesktopCreateInput> = z
	.object({
		id: z.string().uuid().optional(),
		state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
		isPublic: z.boolean().optional(),
		background: z.lazy(() => BackgroundOptionSchema).optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
		user: z.lazy(() => UserCreateNestedOneWithoutDesktopInputSchema),
	})
	.strict();

export const DesktopUncheckedCreateInputSchema: z.ZodType<Prisma.DesktopUncheckedCreateInput> = z
	.object({
		id: z.string().uuid().optional(),
		userId: z.string(),
		state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
		isPublic: z.boolean().optional(),
		background: z.lazy(() => BackgroundOptionSchema).optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.strict();

export const DesktopUpdateInputSchema: z.ZodType<Prisma.DesktopUpdateInput> = z
	.object({
		id: z
			.union([z.string().uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
		isPublic: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
		background: z
			.union([
				z.lazy(() => BackgroundOptionSchema),
				z.lazy(() => EnumBackgroundOptionFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutDesktopNestedInputSchema).optional(),
	})
	.strict();

export const DesktopUncheckedUpdateInputSchema: z.ZodType<Prisma.DesktopUncheckedUpdateInput> = z
	.object({
		id: z
			.union([z.string().uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
		isPublic: z.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)]).optional(),
		background: z
			.union([
				z.lazy(() => BackgroundOptionSchema),
				z.lazy(() => EnumBackgroundOptionFieldUpdateOperationsInputSchema),
			])
			.optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})
	.strict();

export const DesktopCreateManyInputSchema: z.ZodType<Prisma.DesktopCreateManyInput> = z
	.object({
		id: z.string().uuid().optional(),
		userId: z.string(),
		state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
		isPublic: z.boolean().optional(),
		background: z.lazy(() => BackgroundOptionSchema).optional(),
		createdAt: z.coerce.date().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.strict();

export const DesktopUpdateManyMutationInputSchema: z.ZodType<Prisma.DesktopUpdateManyMutationInput> =
	z
		.object({
			id: z
				.union([z.string().uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
			isPublic: z
				.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
				.optional(),
			background: z
				.union([
					z.lazy(() => BackgroundOptionSchema),
					z.lazy(() => EnumBackgroundOptionFieldUpdateOperationsInputSchema),
				])
				.optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
		})
		.strict();

export const DesktopUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DesktopUncheckedUpdateManyInput> =
	z
		.object({
			id: z
				.union([z.string().uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			userId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
			isPublic: z
				.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
				.optional(),
			background: z
				.union([
					z.lazy(() => BackgroundOptionSchema),
					z.lazy(() => EnumBackgroundOptionFieldUpdateOperationsInputSchema),
				])
				.optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
		})
		.strict();

export const SessionCreateInputSchema: z.ZodType<Prisma.SessionCreateInput> = z
	.object({
		id: z.string(),
		expiresAt: z.coerce.date(),
		token: z.string(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		ipAddress: z.string().optional().nullable(),
		userAgent: z.string().optional().nullable(),
		user: z.lazy(() => UserCreateNestedOneWithoutSessionsInputSchema),
	})
	.strict();

export const SessionUncheckedCreateInputSchema: z.ZodType<Prisma.SessionUncheckedCreateInput> = z
	.object({
		id: z.string(),
		expiresAt: z.coerce.date(),
		token: z.string(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		ipAddress: z.string().optional().nullable(),
		userAgent: z.string().optional().nullable(),
		userId: z.string(),
	})
	.strict();

export const SessionUpdateInputSchema: z.ZodType<Prisma.SessionUpdateInput> = z
	.object({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		ipAddress: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutSessionsNestedInputSchema).optional(),
	})
	.strict();

export const SessionUncheckedUpdateInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateInput> = z
	.object({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		ipAddress: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
	})
	.strict();

export const SessionCreateManyInputSchema: z.ZodType<Prisma.SessionCreateManyInput> = z
	.object({
		id: z.string(),
		expiresAt: z.coerce.date(),
		token: z.string(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		ipAddress: z.string().optional().nullable(),
		userAgent: z.string().optional().nullable(),
		userId: z.string(),
	})
	.strict();

export const SessionUpdateManyMutationInputSchema: z.ZodType<Prisma.SessionUpdateManyMutationInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			expiresAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			ipAddress: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			userAgent: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
		})
		.strict();

export const SessionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			expiresAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			ipAddress: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			userAgent: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			userId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
		})
		.strict();

export const AccountCreateInputSchema: z.ZodType<Prisma.AccountCreateInput> = z
	.object({
		id: z.string(),
		accountId: z.string(),
		providerId: z.string(),
		accessToken: z.string().optional().nullable(),
		refreshToken: z.string().optional().nullable(),
		idToken: z.string().optional().nullable(),
		accessTokenExpiresAt: z.coerce.date().optional().nullable(),
		refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
		scope: z.string().optional().nullable(),
		password: z.string().optional().nullable(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		user: z.lazy(() => UserCreateNestedOneWithoutAccountsInputSchema),
	})
	.strict();

export const AccountUncheckedCreateInputSchema: z.ZodType<Prisma.AccountUncheckedCreateInput> = z
	.object({
		id: z.string(),
		accountId: z.string(),
		providerId: z.string(),
		userId: z.string(),
		accessToken: z.string().optional().nullable(),
		refreshToken: z.string().optional().nullable(),
		idToken: z.string().optional().nullable(),
		accessTokenExpiresAt: z.coerce.date().optional().nullable(),
		refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
		scope: z.string().optional().nullable(),
		password: z.string().optional().nullable(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
	})
	.strict();

export const AccountUpdateInputSchema: z.ZodType<Prisma.AccountUpdateInput> = z
	.object({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		accountId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		providerId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		accessToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		idToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		scope: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		password: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		user: z.lazy(() => UserUpdateOneRequiredWithoutAccountsNestedInputSchema).optional(),
	})
	.strict();

export const AccountUncheckedUpdateInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateInput> = z
	.object({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		accountId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		providerId: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		userId: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		accessToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		idToken: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		scope: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		password: z
			.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
	})
	.strict();

export const AccountCreateManyInputSchema: z.ZodType<Prisma.AccountCreateManyInput> = z
	.object({
		id: z.string(),
		accountId: z.string(),
		providerId: z.string(),
		userId: z.string(),
		accessToken: z.string().optional().nullable(),
		refreshToken: z.string().optional().nullable(),
		idToken: z.string().optional().nullable(),
		accessTokenExpiresAt: z.coerce.date().optional().nullable(),
		refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
		scope: z.string().optional().nullable(),
		password: z.string().optional().nullable(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
	})
	.strict();

export const AccountUpdateManyMutationInputSchema: z.ZodType<Prisma.AccountUpdateManyMutationInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			accountId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			providerId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			accessToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			refreshToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			idToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			accessTokenExpiresAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			refreshTokenExpiresAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			scope: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			password: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
		})
		.strict();

export const AccountUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			accountId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			providerId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			userId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			accessToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			refreshToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			idToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			accessTokenExpiresAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			refreshTokenExpiresAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			scope: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			password: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
		})
		.strict();

export const VerificationCreateInputSchema: z.ZodType<Prisma.VerificationCreateInput> = z
	.object({
		id: z.string(),
		identifier: z.string(),
		value: z.string(),
		expiresAt: z.coerce.date(),
		createdAt: z.coerce.date().optional().nullable(),
		updatedAt: z.coerce.date().optional().nullable(),
	})
	.strict();

export const VerificationUncheckedCreateInputSchema: z.ZodType<Prisma.VerificationUncheckedCreateInput> =
	z
		.object({
			id: z.string(),
			identifier: z.string(),
			value: z.string(),
			expiresAt: z.coerce.date(),
			createdAt: z.coerce.date().optional().nullable(),
			updatedAt: z.coerce.date().optional().nullable(),
		})
		.strict();

export const VerificationUpdateInputSchema: z.ZodType<Prisma.VerificationUpdateInput> = z
	.object({
		id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		identifier: z
			.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
			.optional(),
		value: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
		expiresAt: z
			.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
			.optional(),
		createdAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
		updatedAt: z
			.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const VerificationUncheckedUpdateInputSchema: z.ZodType<Prisma.VerificationUncheckedUpdateInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			identifier: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			value: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			expiresAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
		})
		.strict();

export const VerificationCreateManyInputSchema: z.ZodType<Prisma.VerificationCreateManyInput> = z
	.object({
		id: z.string(),
		identifier: z.string(),
		value: z.string(),
		expiresAt: z.coerce.date(),
		createdAt: z.coerce.date().optional().nullable(),
		updatedAt: z.coerce.date().optional().nullable(),
	})
	.strict();

export const VerificationUpdateManyMutationInputSchema: z.ZodType<Prisma.VerificationUpdateManyMutationInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			identifier: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			value: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			expiresAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
		})
		.strict();

export const VerificationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VerificationUncheckedUpdateManyInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			identifier: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			value: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			expiresAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
		})
		.strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z
	.object({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
	})
	.strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z
	.object({
		equals: z.boolean().optional(),
		not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional(),
	})
	.strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z
	.object({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z
	.object({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
	})
	.strict();

export const SessionListRelationFilterSchema: z.ZodType<Prisma.SessionListRelationFilter> = z
	.object({
		every: z.lazy(() => SessionWhereInputSchema).optional(),
		some: z.lazy(() => SessionWhereInputSchema).optional(),
		none: z.lazy(() => SessionWhereInputSchema).optional(),
	})
	.strict();

export const AccountListRelationFilterSchema: z.ZodType<Prisma.AccountListRelationFilter> = z
	.object({
		every: z.lazy(() => AccountWhereInputSchema).optional(),
		some: z.lazy(() => AccountWhereInputSchema).optional(),
		none: z.lazy(() => AccountWhereInputSchema).optional(),
	})
	.strict();

export const DesktopNullableScalarRelationFilterSchema: z.ZodType<Prisma.DesktopNullableScalarRelationFilter> =
	z
		.object({
			is: z
				.lazy(() => DesktopWhereInputSchema)
				.optional()
				.nullable(),
			isNot: z
				.lazy(() => DesktopWhereInputSchema)
				.optional()
				.nullable(),
		})
		.strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z
	.object({
		sort: z.lazy(() => SortOrderSchema),
		nulls: z.lazy(() => NullsOrderSchema).optional(),
	})
	.strict();

export const SessionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SessionOrderByRelationAggregateInput> =
	z
		.object({
			_count: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const AccountOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AccountOrderByRelationAggregateInput> =
	z
		.object({
			_count: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			name: z.lazy(() => SortOrderSchema).optional(),
			email: z.lazy(() => SortOrderSchema).optional(),
			emailVerified: z.lazy(() => SortOrderSchema).optional(),
			image: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			osName: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		emailVerified: z.lazy(() => SortOrderSchema).optional(),
		image: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		osName: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z
	.object({
		id: z.lazy(() => SortOrderSchema).optional(),
		name: z.lazy(() => SortOrderSchema).optional(),
		email: z.lazy(() => SortOrderSchema).optional(),
		emailVerified: z.lazy(() => SortOrderSchema).optional(),
		image: z.lazy(() => SortOrderSchema).optional(),
		createdAt: z.lazy(() => SortOrderSchema).optional(),
		updatedAt: z.lazy(() => SortOrderSchema).optional(),
		osName: z.lazy(() => SortOrderSchema).optional(),
	})
	.strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z
	.object({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedStringFilterSchema).optional(),
		_max: z.lazy(() => NestedStringFilterSchema).optional(),
	})
	.strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z
	.object({
		equals: z.boolean().optional(),
		not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)]).optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedBoolFilterSchema).optional(),
		_max: z.lazy(() => NestedBoolFilterSchema).optional(),
	})
	.strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> =
	z
		.object({
			equals: z.string().optional().nullable(),
			in: z.string().array().optional().nullable(),
			notIn: z.string().array().optional().nullable(),
			lt: z.string().optional(),
			lte: z.string().optional(),
			gt: z.string().optional(),
			gte: z.string().optional(),
			contains: z.string().optional(),
			startsWith: z.string().optional(),
			endsWith: z.string().optional(),
			mode: z.lazy(() => QueryModeSchema).optional(),
			not: z
				.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)])
				.optional()
				.nullable(),
			_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
			_min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
			_max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
		})
		.strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z
	.object({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)])
			.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
		_max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
	})
	.strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z
	.object({
		equals: InputJsonValueSchema.optional(),
		path: z.string().array().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		string_contains: z.string().optional(),
		string_starts_with: z.string().optional(),
		string_ends_with: z.string().optional(),
		array_starts_with: InputJsonValueSchema.optional().nullable(),
		array_ends_with: InputJsonValueSchema.optional().nullable(),
		array_contains: InputJsonValueSchema.optional().nullable(),
		lt: InputJsonValueSchema.optional(),
		lte: InputJsonValueSchema.optional(),
		gt: InputJsonValueSchema.optional(),
		gte: InputJsonValueSchema.optional(),
		not: InputJsonValueSchema.optional(),
	})
	.strict();

export const EnumBackgroundOptionFilterSchema: z.ZodType<Prisma.EnumBackgroundOptionFilter> = z
	.object({
		equals: z.lazy(() => BackgroundOptionSchema).optional(),
		in: z
			.lazy(() => BackgroundOptionSchema)
			.array()
			.optional(),
		notIn: z
			.lazy(() => BackgroundOptionSchema)
			.array()
			.optional(),
		not: z
			.union([
				z.lazy(() => BackgroundOptionSchema),
				z.lazy(() => NestedEnumBackgroundOptionFilterSchema),
			])
			.optional(),
	})
	.strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z
	.object({
		is: z.lazy(() => UserWhereInputSchema).optional(),
		isNot: z.lazy(() => UserWhereInputSchema).optional(),
	})
	.strict();

export const DesktopCountOrderByAggregateInputSchema: z.ZodType<Prisma.DesktopCountOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			state: z.lazy(() => SortOrderSchema).optional(),
			isPublic: z.lazy(() => SortOrderSchema).optional(),
			background: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const DesktopMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DesktopMaxOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			isPublic: z.lazy(() => SortOrderSchema).optional(),
			background: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const DesktopMinOrderByAggregateInputSchema: z.ZodType<Prisma.DesktopMinOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			isPublic: z.lazy(() => SortOrderSchema).optional(),
			background: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z
	.object({
		equals: InputJsonValueSchema.optional(),
		path: z.string().array().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		string_contains: z.string().optional(),
		string_starts_with: z.string().optional(),
		string_ends_with: z.string().optional(),
		array_starts_with: InputJsonValueSchema.optional().nullable(),
		array_ends_with: InputJsonValueSchema.optional().nullable(),
		array_contains: InputJsonValueSchema.optional().nullable(),
		lt: InputJsonValueSchema.optional(),
		lte: InputJsonValueSchema.optional(),
		gt: InputJsonValueSchema.optional(),
		gte: InputJsonValueSchema.optional(),
		not: InputJsonValueSchema.optional(),
		_count: z.lazy(() => NestedIntFilterSchema).optional(),
		_min: z.lazy(() => NestedJsonFilterSchema).optional(),
		_max: z.lazy(() => NestedJsonFilterSchema).optional(),
	})
	.strict();

export const EnumBackgroundOptionWithAggregatesFilterSchema: z.ZodType<Prisma.EnumBackgroundOptionWithAggregatesFilter> =
	z
		.object({
			equals: z.lazy(() => BackgroundOptionSchema).optional(),
			in: z
				.lazy(() => BackgroundOptionSchema)
				.array()
				.optional(),
			notIn: z
				.lazy(() => BackgroundOptionSchema)
				.array()
				.optional(),
			not: z
				.union([
					z.lazy(() => BackgroundOptionSchema),
					z.lazy(() => NestedEnumBackgroundOptionWithAggregatesFilterSchema),
				])
				.optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedEnumBackgroundOptionFilterSchema).optional(),
			_max: z.lazy(() => NestedEnumBackgroundOptionFilterSchema).optional(),
		})
		.strict();

export const SessionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SessionCountOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			expiresAt: z.lazy(() => SortOrderSchema).optional(),
			token: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			ipAddress: z.lazy(() => SortOrderSchema).optional(),
			userAgent: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const SessionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMaxOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			expiresAt: z.lazy(() => SortOrderSchema).optional(),
			token: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			ipAddress: z.lazy(() => SortOrderSchema).optional(),
			userAgent: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const SessionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SessionMinOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			expiresAt: z.lazy(() => SortOrderSchema).optional(),
			token: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
			ipAddress: z.lazy(() => SortOrderSchema).optional(),
			userAgent: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z
	.object({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const AccountCountOrderByAggregateInputSchema: z.ZodType<Prisma.AccountCountOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			accountId: z.lazy(() => SortOrderSchema).optional(),
			providerId: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			accessToken: z.lazy(() => SortOrderSchema).optional(),
			refreshToken: z.lazy(() => SortOrderSchema).optional(),
			idToken: z.lazy(() => SortOrderSchema).optional(),
			accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
			refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
			scope: z.lazy(() => SortOrderSchema).optional(),
			password: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const AccountMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMaxOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			accountId: z.lazy(() => SortOrderSchema).optional(),
			providerId: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			accessToken: z.lazy(() => SortOrderSchema).optional(),
			refreshToken: z.lazy(() => SortOrderSchema).optional(),
			idToken: z.lazy(() => SortOrderSchema).optional(),
			accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
			refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
			scope: z.lazy(() => SortOrderSchema).optional(),
			password: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const AccountMinOrderByAggregateInputSchema: z.ZodType<Prisma.AccountMinOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			accountId: z.lazy(() => SortOrderSchema).optional(),
			providerId: z.lazy(() => SortOrderSchema).optional(),
			userId: z.lazy(() => SortOrderSchema).optional(),
			accessToken: z.lazy(() => SortOrderSchema).optional(),
			refreshToken: z.lazy(() => SortOrderSchema).optional(),
			idToken: z.lazy(() => SortOrderSchema).optional(),
			accessTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
			refreshTokenExpiresAt: z.lazy(() => SortOrderSchema).optional(),
			scope: z.lazy(() => SortOrderSchema).optional(),
			password: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> =
	z
		.object({
			equals: z.coerce.date().optional().nullable(),
			in: z.coerce.date().array().optional().nullable(),
			notIn: z.coerce.date().array().optional().nullable(),
			lt: z.coerce.date().optional(),
			lte: z.coerce.date().optional(),
			gt: z.coerce.date().optional(),
			gte: z.coerce.date().optional(),
			not: z
				.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema)])
				.optional()
				.nullable(),
			_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
			_min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
			_max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
		})
		.strict();

export const VerificationCountOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationCountOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			identifier: z.lazy(() => SortOrderSchema).optional(),
			value: z.lazy(() => SortOrderSchema).optional(),
			expiresAt: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const VerificationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationMaxOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			identifier: z.lazy(() => SortOrderSchema).optional(),
			value: z.lazy(() => SortOrderSchema).optional(),
			expiresAt: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const VerificationMinOrderByAggregateInputSchema: z.ZodType<Prisma.VerificationMinOrderByAggregateInput> =
	z
		.object({
			id: z.lazy(() => SortOrderSchema).optional(),
			identifier: z.lazy(() => SortOrderSchema).optional(),
			value: z.lazy(() => SortOrderSchema).optional(),
			expiresAt: z.lazy(() => SortOrderSchema).optional(),
			createdAt: z.lazy(() => SortOrderSchema).optional(),
			updatedAt: z.lazy(() => SortOrderSchema).optional(),
		})
		.strict();

export const SessionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateNestedManyWithoutUserInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => SessionCreateWithoutUserInputSchema),
					z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
					z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
					z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
				])
				.optional(),
			connectOrCreate: z
				.union([
					z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
					z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
				])
				.optional(),
			createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
			connect: z
				.union([
					z.lazy(() => SessionWhereUniqueInputSchema),
					z.lazy(() => SessionWhereUniqueInputSchema).array(),
				])
				.optional(),
		})
		.strict();

export const AccountCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateNestedManyWithoutUserInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => AccountCreateWithoutUserInputSchema),
					z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
					z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
					z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
				])
				.optional(),
			connectOrCreate: z
				.union([
					z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
					z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
				])
				.optional(),
			createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
			connect: z
				.union([
					z.lazy(() => AccountWhereUniqueInputSchema),
					z.lazy(() => AccountWhereUniqueInputSchema).array(),
				])
				.optional(),
		})
		.strict();

export const DesktopCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.DesktopCreateNestedOneWithoutUserInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => DesktopCreateWithoutUserInputSchema),
					z.lazy(() => DesktopUncheckedCreateWithoutUserInputSchema),
				])
				.optional(),
			connectOrCreate: z.lazy(() => DesktopCreateOrConnectWithoutUserInputSchema).optional(),
			connect: z.lazy(() => DesktopWhereUniqueInputSchema).optional(),
		})
		.strict();

export const SessionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateNestedManyWithoutUserInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => SessionCreateWithoutUserInputSchema),
					z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
					z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
					z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
				])
				.optional(),
			connectOrCreate: z
				.union([
					z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
					z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
				])
				.optional(),
			createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
			connect: z
				.union([
					z.lazy(() => SessionWhereUniqueInputSchema),
					z.lazy(() => SessionWhereUniqueInputSchema).array(),
				])
				.optional(),
		})
		.strict();

export const AccountUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateNestedManyWithoutUserInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => AccountCreateWithoutUserInputSchema),
					z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
					z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
					z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
				])
				.optional(),
			connectOrCreate: z
				.union([
					z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
					z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
				])
				.optional(),
			createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
			connect: z
				.union([
					z.lazy(() => AccountWhereUniqueInputSchema),
					z.lazy(() => AccountWhereUniqueInputSchema).array(),
				])
				.optional(),
		})
		.strict();

export const DesktopUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.DesktopUncheckedCreateNestedOneWithoutUserInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => DesktopCreateWithoutUserInputSchema),
					z.lazy(() => DesktopUncheckedCreateWithoutUserInputSchema),
				])
				.optional(),
			connectOrCreate: z.lazy(() => DesktopCreateOrConnectWithoutUserInputSchema).optional(),
			connect: z.lazy(() => DesktopWhereUniqueInputSchema).optional(),
		})
		.strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
	z
		.object({
			set: z.string().optional(),
		})
		.strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> =
	z
		.object({
			set: z.boolean().optional(),
		})
		.strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> =
	z
		.object({
			set: z.string().optional().nullable(),
		})
		.strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> =
	z
		.object({
			set: z.coerce.date().optional(),
		})
		.strict();

export const SessionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUpdateManyWithoutUserNestedInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => SessionCreateWithoutUserInputSchema),
					z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
					z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
					z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
				])
				.optional(),
			connectOrCreate: z
				.union([
					z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
					z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
				])
				.optional(),
			upsert: z
				.union([
					z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),
					z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array(),
				])
				.optional(),
			createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
			set: z
				.union([
					z.lazy(() => SessionWhereUniqueInputSchema),
					z.lazy(() => SessionWhereUniqueInputSchema).array(),
				])
				.optional(),
			disconnect: z
				.union([
					z.lazy(() => SessionWhereUniqueInputSchema),
					z.lazy(() => SessionWhereUniqueInputSchema).array(),
				])
				.optional(),
			delete: z
				.union([
					z.lazy(() => SessionWhereUniqueInputSchema),
					z.lazy(() => SessionWhereUniqueInputSchema).array(),
				])
				.optional(),
			connect: z
				.union([
					z.lazy(() => SessionWhereUniqueInputSchema),
					z.lazy(() => SessionWhereUniqueInputSchema).array(),
				])
				.optional(),
			update: z
				.union([
					z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),
					z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array(),
				])
				.optional(),
			updateMany: z
				.union([
					z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),
					z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array(),
				])
				.optional(),
			deleteMany: z
				.union([
					z.lazy(() => SessionScalarWhereInputSchema),
					z.lazy(() => SessionScalarWhereInputSchema).array(),
				])
				.optional(),
		})
		.strict();

export const AccountUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUpdateManyWithoutUserNestedInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => AccountCreateWithoutUserInputSchema),
					z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
					z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
					z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
				])
				.optional(),
			connectOrCreate: z
				.union([
					z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
					z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
				])
				.optional(),
			upsert: z
				.union([
					z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),
					z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array(),
				])
				.optional(),
			createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
			set: z
				.union([
					z.lazy(() => AccountWhereUniqueInputSchema),
					z.lazy(() => AccountWhereUniqueInputSchema).array(),
				])
				.optional(),
			disconnect: z
				.union([
					z.lazy(() => AccountWhereUniqueInputSchema),
					z.lazy(() => AccountWhereUniqueInputSchema).array(),
				])
				.optional(),
			delete: z
				.union([
					z.lazy(() => AccountWhereUniqueInputSchema),
					z.lazy(() => AccountWhereUniqueInputSchema).array(),
				])
				.optional(),
			connect: z
				.union([
					z.lazy(() => AccountWhereUniqueInputSchema),
					z.lazy(() => AccountWhereUniqueInputSchema).array(),
				])
				.optional(),
			update: z
				.union([
					z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),
					z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array(),
				])
				.optional(),
			updateMany: z
				.union([
					z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),
					z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array(),
				])
				.optional(),
			deleteMany: z
				.union([
					z.lazy(() => AccountScalarWhereInputSchema),
					z.lazy(() => AccountScalarWhereInputSchema).array(),
				])
				.optional(),
		})
		.strict();

export const DesktopUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.DesktopUpdateOneWithoutUserNestedInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => DesktopCreateWithoutUserInputSchema),
					z.lazy(() => DesktopUncheckedCreateWithoutUserInputSchema),
				])
				.optional(),
			connectOrCreate: z.lazy(() => DesktopCreateOrConnectWithoutUserInputSchema).optional(),
			upsert: z.lazy(() => DesktopUpsertWithoutUserInputSchema).optional(),
			disconnect: z.union([z.boolean(), z.lazy(() => DesktopWhereInputSchema)]).optional(),
			delete: z.union([z.boolean(), z.lazy(() => DesktopWhereInputSchema)]).optional(),
			connect: z.lazy(() => DesktopWhereUniqueInputSchema).optional(),
			update: z
				.union([
					z.lazy(() => DesktopUpdateToOneWithWhereWithoutUserInputSchema),
					z.lazy(() => DesktopUpdateWithoutUserInputSchema),
					z.lazy(() => DesktopUncheckedUpdateWithoutUserInputSchema),
				])
				.optional(),
		})
		.strict();

export const SessionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => SessionCreateWithoutUserInputSchema),
					z.lazy(() => SessionCreateWithoutUserInputSchema).array(),
					z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
					z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema).array(),
				])
				.optional(),
			connectOrCreate: z
				.union([
					z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema),
					z.lazy(() => SessionCreateOrConnectWithoutUserInputSchema).array(),
				])
				.optional(),
			upsert: z
				.union([
					z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema),
					z.lazy(() => SessionUpsertWithWhereUniqueWithoutUserInputSchema).array(),
				])
				.optional(),
			createMany: z.lazy(() => SessionCreateManyUserInputEnvelopeSchema).optional(),
			set: z
				.union([
					z.lazy(() => SessionWhereUniqueInputSchema),
					z.lazy(() => SessionWhereUniqueInputSchema).array(),
				])
				.optional(),
			disconnect: z
				.union([
					z.lazy(() => SessionWhereUniqueInputSchema),
					z.lazy(() => SessionWhereUniqueInputSchema).array(),
				])
				.optional(),
			delete: z
				.union([
					z.lazy(() => SessionWhereUniqueInputSchema),
					z.lazy(() => SessionWhereUniqueInputSchema).array(),
				])
				.optional(),
			connect: z
				.union([
					z.lazy(() => SessionWhereUniqueInputSchema),
					z.lazy(() => SessionWhereUniqueInputSchema).array(),
				])
				.optional(),
			update: z
				.union([
					z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema),
					z.lazy(() => SessionUpdateWithWhereUniqueWithoutUserInputSchema).array(),
				])
				.optional(),
			updateMany: z
				.union([
					z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema),
					z.lazy(() => SessionUpdateManyWithWhereWithoutUserInputSchema).array(),
				])
				.optional(),
			deleteMany: z
				.union([
					z.lazy(() => SessionScalarWhereInputSchema),
					z.lazy(() => SessionScalarWhereInputSchema).array(),
				])
				.optional(),
		})
		.strict();

export const AccountUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserNestedInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => AccountCreateWithoutUserInputSchema),
					z.lazy(() => AccountCreateWithoutUserInputSchema).array(),
					z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
					z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema).array(),
				])
				.optional(),
			connectOrCreate: z
				.union([
					z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema),
					z.lazy(() => AccountCreateOrConnectWithoutUserInputSchema).array(),
				])
				.optional(),
			upsert: z
				.union([
					z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema),
					z.lazy(() => AccountUpsertWithWhereUniqueWithoutUserInputSchema).array(),
				])
				.optional(),
			createMany: z.lazy(() => AccountCreateManyUserInputEnvelopeSchema).optional(),
			set: z
				.union([
					z.lazy(() => AccountWhereUniqueInputSchema),
					z.lazy(() => AccountWhereUniqueInputSchema).array(),
				])
				.optional(),
			disconnect: z
				.union([
					z.lazy(() => AccountWhereUniqueInputSchema),
					z.lazy(() => AccountWhereUniqueInputSchema).array(),
				])
				.optional(),
			delete: z
				.union([
					z.lazy(() => AccountWhereUniqueInputSchema),
					z.lazy(() => AccountWhereUniqueInputSchema).array(),
				])
				.optional(),
			connect: z
				.union([
					z.lazy(() => AccountWhereUniqueInputSchema),
					z.lazy(() => AccountWhereUniqueInputSchema).array(),
				])
				.optional(),
			update: z
				.union([
					z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema),
					z.lazy(() => AccountUpdateWithWhereUniqueWithoutUserInputSchema).array(),
				])
				.optional(),
			updateMany: z
				.union([
					z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema),
					z.lazy(() => AccountUpdateManyWithWhereWithoutUserInputSchema).array(),
				])
				.optional(),
			deleteMany: z
				.union([
					z.lazy(() => AccountScalarWhereInputSchema),
					z.lazy(() => AccountScalarWhereInputSchema).array(),
				])
				.optional(),
		})
		.strict();

export const DesktopUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.DesktopUncheckedUpdateOneWithoutUserNestedInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => DesktopCreateWithoutUserInputSchema),
					z.lazy(() => DesktopUncheckedCreateWithoutUserInputSchema),
				])
				.optional(),
			connectOrCreate: z.lazy(() => DesktopCreateOrConnectWithoutUserInputSchema).optional(),
			upsert: z.lazy(() => DesktopUpsertWithoutUserInputSchema).optional(),
			disconnect: z.union([z.boolean(), z.lazy(() => DesktopWhereInputSchema)]).optional(),
			delete: z.union([z.boolean(), z.lazy(() => DesktopWhereInputSchema)]).optional(),
			connect: z.lazy(() => DesktopWhereUniqueInputSchema).optional(),
			update: z
				.union([
					z.lazy(() => DesktopUpdateToOneWithWhereWithoutUserInputSchema),
					z.lazy(() => DesktopUpdateWithoutUserInputSchema),
					z.lazy(() => DesktopUncheckedUpdateWithoutUserInputSchema),
				])
				.optional(),
		})
		.strict();

export const UserCreateNestedOneWithoutDesktopInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutDesktopInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => UserCreateWithoutDesktopInputSchema),
					z.lazy(() => UserUncheckedCreateWithoutDesktopInputSchema),
				])
				.optional(),
			connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDesktopInputSchema).optional(),
			connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
		})
		.strict();

export const EnumBackgroundOptionFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumBackgroundOptionFieldUpdateOperationsInput> =
	z
		.object({
			set: z.lazy(() => BackgroundOptionSchema).optional(),
		})
		.strict();

export const UserUpdateOneRequiredWithoutDesktopNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutDesktopNestedInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => UserCreateWithoutDesktopInputSchema),
					z.lazy(() => UserUncheckedCreateWithoutDesktopInputSchema),
				])
				.optional(),
			connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutDesktopInputSchema).optional(),
			upsert: z.lazy(() => UserUpsertWithoutDesktopInputSchema).optional(),
			connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
			update: z
				.union([
					z.lazy(() => UserUpdateToOneWithWhereWithoutDesktopInputSchema),
					z.lazy(() => UserUpdateWithoutDesktopInputSchema),
					z.lazy(() => UserUncheckedUpdateWithoutDesktopInputSchema),
				])
				.optional(),
		})
		.strict();

export const UserCreateNestedOneWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSessionsInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => UserCreateWithoutSessionsInputSchema),
					z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
				])
				.optional(),
			connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
			connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
		})
		.strict();

export const UserUpdateOneRequiredWithoutSessionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSessionsNestedInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => UserCreateWithoutSessionsInputSchema),
					z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
				])
				.optional(),
			connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSessionsInputSchema).optional(),
			upsert: z.lazy(() => UserUpsertWithoutSessionsInputSchema).optional(),
			connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
			update: z
				.union([
					z.lazy(() => UserUpdateToOneWithWhereWithoutSessionsInputSchema),
					z.lazy(() => UserUpdateWithoutSessionsInputSchema),
					z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
				])
				.optional(),
		})
		.strict();

export const UserCreateNestedOneWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAccountsInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => UserCreateWithoutAccountsInputSchema),
					z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
				])
				.optional(),
			connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
			connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
		})
		.strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> =
	z
		.object({
			set: z.coerce.date().optional().nullable(),
		})
		.strict();

export const UserUpdateOneRequiredWithoutAccountsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAccountsNestedInput> =
	z
		.object({
			create: z
				.union([
					z.lazy(() => UserCreateWithoutAccountsInputSchema),
					z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
				])
				.optional(),
			connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAccountsInputSchema).optional(),
			upsert: z.lazy(() => UserUpsertWithoutAccountsInputSchema).optional(),
			connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
			update: z
				.union([
					z.lazy(() => UserUpdateToOneWithWhereWithoutAccountsInputSchema),
					z.lazy(() => UserUpdateWithoutAccountsInputSchema),
					z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
				])
				.optional(),
		})
		.strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z
	.object({
		equals: z.string().optional(),
		in: z.string().array().optional(),
		notIn: z.string().array().optional(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z.union([z.string(), z.lazy(() => NestedStringFilterSchema)]).optional(),
	})
	.strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z
	.object({
		equals: z.boolean().optional(),
		not: z.union([z.boolean(), z.lazy(() => NestedBoolFilterSchema)]).optional(),
	})
	.strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z
	.object({
		equals: z.string().optional().nullable(),
		in: z.string().array().optional().nullable(),
		notIn: z.string().array().optional().nullable(),
		lt: z.string().optional(),
		lte: z.string().optional(),
		gt: z.string().optional(),
		gte: z.string().optional(),
		contains: z.string().optional(),
		startsWith: z.string().optional(),
		endsWith: z.string().optional(),
		not: z
			.union([z.string(), z.lazy(() => NestedStringNullableFilterSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z
	.object({
		equals: z.coerce.date().optional(),
		in: z.coerce.date().array().optional(),
		notIn: z.coerce.date().array().optional(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z.union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)]).optional(),
	})
	.strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
	z
		.object({
			equals: z.string().optional(),
			in: z.string().array().optional(),
			notIn: z.string().array().optional(),
			lt: z.string().optional(),
			lte: z.string().optional(),
			gt: z.string().optional(),
			gte: z.string().optional(),
			contains: z.string().optional(),
			startsWith: z.string().optional(),
			endsWith: z.string().optional(),
			not: z.union([z.string(), z.lazy(() => NestedStringWithAggregatesFilterSchema)]).optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedStringFilterSchema).optional(),
			_max: z.lazy(() => NestedStringFilterSchema).optional(),
		})
		.strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z
	.object({
		equals: z.number().optional(),
		in: z.number().array().optional(),
		notIn: z.number().array().optional(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional(),
		not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
	})
	.strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> =
	z
		.object({
			equals: z.boolean().optional(),
			not: z.union([z.boolean(), z.lazy(() => NestedBoolWithAggregatesFilterSchema)]).optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedBoolFilterSchema).optional(),
			_max: z.lazy(() => NestedBoolFilterSchema).optional(),
		})
		.strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> =
	z
		.object({
			equals: z.string().optional().nullable(),
			in: z.string().array().optional().nullable(),
			notIn: z.string().array().optional().nullable(),
			lt: z.string().optional(),
			lte: z.string().optional(),
			gt: z.string().optional(),
			gte: z.string().optional(),
			contains: z.string().optional(),
			startsWith: z.string().optional(),
			endsWith: z.string().optional(),
			not: z
				.union([z.string(), z.lazy(() => NestedStringNullableWithAggregatesFilterSchema)])
				.optional()
				.nullable(),
			_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
			_min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
			_max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
		})
		.strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z
	.object({
		equals: z.number().optional().nullable(),
		in: z.number().array().optional().nullable(),
		notIn: z.number().array().optional().nullable(),
		lt: z.number().optional(),
		lte: z.number().optional(),
		gt: z.number().optional(),
		gte: z.number().optional(),
		not: z
			.union([z.number(), z.lazy(() => NestedIntNullableFilterSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> =
	z
		.object({
			equals: z.coerce.date().optional(),
			in: z.coerce.date().array().optional(),
			notIn: z.coerce.date().array().optional(),
			lt: z.coerce.date().optional(),
			lte: z.coerce.date().optional(),
			gt: z.coerce.date().optional(),
			gte: z.coerce.date().optional(),
			not: z
				.union([z.coerce.date(), z.lazy(() => NestedDateTimeWithAggregatesFilterSchema)])
				.optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
			_max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
		})
		.strict();

export const NestedEnumBackgroundOptionFilterSchema: z.ZodType<Prisma.NestedEnumBackgroundOptionFilter> =
	z
		.object({
			equals: z.lazy(() => BackgroundOptionSchema).optional(),
			in: z
				.lazy(() => BackgroundOptionSchema)
				.array()
				.optional(),
			notIn: z
				.lazy(() => BackgroundOptionSchema)
				.array()
				.optional(),
			not: z
				.union([
					z.lazy(() => BackgroundOptionSchema),
					z.lazy(() => NestedEnumBackgroundOptionFilterSchema),
				])
				.optional(),
		})
		.strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z
	.object({
		equals: InputJsonValueSchema.optional(),
		path: z.string().array().optional(),
		mode: z.lazy(() => QueryModeSchema).optional(),
		string_contains: z.string().optional(),
		string_starts_with: z.string().optional(),
		string_ends_with: z.string().optional(),
		array_starts_with: InputJsonValueSchema.optional().nullable(),
		array_ends_with: InputJsonValueSchema.optional().nullable(),
		array_contains: InputJsonValueSchema.optional().nullable(),
		lt: InputJsonValueSchema.optional(),
		lte: InputJsonValueSchema.optional(),
		gt: InputJsonValueSchema.optional(),
		gte: InputJsonValueSchema.optional(),
		not: InputJsonValueSchema.optional(),
	})
	.strict();

export const NestedEnumBackgroundOptionWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumBackgroundOptionWithAggregatesFilter> =
	z
		.object({
			equals: z.lazy(() => BackgroundOptionSchema).optional(),
			in: z
				.lazy(() => BackgroundOptionSchema)
				.array()
				.optional(),
			notIn: z
				.lazy(() => BackgroundOptionSchema)
				.array()
				.optional(),
			not: z
				.union([
					z.lazy(() => BackgroundOptionSchema),
					z.lazy(() => NestedEnumBackgroundOptionWithAggregatesFilterSchema),
				])
				.optional(),
			_count: z.lazy(() => NestedIntFilterSchema).optional(),
			_min: z.lazy(() => NestedEnumBackgroundOptionFilterSchema).optional(),
			_max: z.lazy(() => NestedEnumBackgroundOptionFilterSchema).optional(),
		})
		.strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z
	.object({
		equals: z.coerce.date().optional().nullable(),
		in: z.coerce.date().array().optional().nullable(),
		notIn: z.coerce.date().array().optional().nullable(),
		lt: z.coerce.date().optional(),
		lte: z.coerce.date().optional(),
		gt: z.coerce.date().optional(),
		gte: z.coerce.date().optional(),
		not: z
			.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableFilterSchema)])
			.optional()
			.nullable(),
	})
	.strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> =
	z
		.object({
			equals: z.coerce.date().optional().nullable(),
			in: z.coerce.date().array().optional().nullable(),
			notIn: z.coerce.date().array().optional().nullable(),
			lt: z.coerce.date().optional(),
			lte: z.coerce.date().optional(),
			gt: z.coerce.date().optional(),
			gte: z.coerce.date().optional(),
			not: z
				.union([z.coerce.date(), z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema)])
				.optional()
				.nullable(),
			_count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
			_min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
			_max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
		})
		.strict();

export const SessionCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateWithoutUserInput> =
	z
		.object({
			id: z.string(),
			expiresAt: z.coerce.date(),
			token: z.string(),
			createdAt: z.coerce.date(),
			updatedAt: z.coerce.date(),
			ipAddress: z.string().optional().nullable(),
			userAgent: z.string().optional().nullable(),
		})
		.strict();

export const SessionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedCreateWithoutUserInput> =
	z
		.object({
			id: z.string(),
			expiresAt: z.coerce.date(),
			token: z.string(),
			createdAt: z.coerce.date(),
			updatedAt: z.coerce.date(),
			ipAddress: z.string().optional().nullable(),
			userAgent: z.string().optional().nullable(),
		})
		.strict();

export const SessionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.SessionCreateOrConnectWithoutUserInput> =
	z
		.object({
			where: z.lazy(() => SessionWhereUniqueInputSchema),
			create: z.union([
				z.lazy(() => SessionCreateWithoutUserInputSchema),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
			]),
		})
		.strict();

export const SessionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.SessionCreateManyUserInputEnvelope> =
	z
		.object({
			data: z.union([
				z.lazy(() => SessionCreateManyUserInputSchema),
				z.lazy(() => SessionCreateManyUserInputSchema).array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const AccountCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateWithoutUserInput> =
	z
		.object({
			id: z.string(),
			accountId: z.string(),
			providerId: z.string(),
			accessToken: z.string().optional().nullable(),
			refreshToken: z.string().optional().nullable(),
			idToken: z.string().optional().nullable(),
			accessTokenExpiresAt: z.coerce.date().optional().nullable(),
			refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
			scope: z.string().optional().nullable(),
			password: z.string().optional().nullable(),
			createdAt: z.coerce.date(),
			updatedAt: z.coerce.date(),
		})
		.strict();

export const AccountUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedCreateWithoutUserInput> =
	z
		.object({
			id: z.string(),
			accountId: z.string(),
			providerId: z.string(),
			accessToken: z.string().optional().nullable(),
			refreshToken: z.string().optional().nullable(),
			idToken: z.string().optional().nullable(),
			accessTokenExpiresAt: z.coerce.date().optional().nullable(),
			refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
			scope: z.string().optional().nullable(),
			password: z.string().optional().nullable(),
			createdAt: z.coerce.date(),
			updatedAt: z.coerce.date(),
		})
		.strict();

export const AccountCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AccountCreateOrConnectWithoutUserInput> =
	z
		.object({
			where: z.lazy(() => AccountWhereUniqueInputSchema),
			create: z.union([
				z.lazy(() => AccountCreateWithoutUserInputSchema),
				z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
			]),
		})
		.strict();

export const AccountCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.AccountCreateManyUserInputEnvelope> =
	z
		.object({
			data: z.union([
				z.lazy(() => AccountCreateManyUserInputSchema),
				z.lazy(() => AccountCreateManyUserInputSchema).array(),
			]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const DesktopCreateWithoutUserInputSchema: z.ZodType<Prisma.DesktopCreateWithoutUserInput> =
	z
		.object({
			id: z.string().uuid().optional(),
			state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
			isPublic: z.boolean().optional(),
			background: z.lazy(() => BackgroundOptionSchema).optional(),
			createdAt: z.coerce.date().optional(),
			updatedAt: z.coerce.date().optional(),
		})
		.strict();

export const DesktopUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.DesktopUncheckedCreateWithoutUserInput> =
	z
		.object({
			id: z.string().uuid().optional(),
			state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]),
			isPublic: z.boolean().optional(),
			background: z.lazy(() => BackgroundOptionSchema).optional(),
			createdAt: z.coerce.date().optional(),
			updatedAt: z.coerce.date().optional(),
		})
		.strict();

export const DesktopCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.DesktopCreateOrConnectWithoutUserInput> =
	z
		.object({
			where: z.lazy(() => DesktopWhereUniqueInputSchema),
			create: z.union([
				z.lazy(() => DesktopCreateWithoutUserInputSchema),
				z.lazy(() => DesktopUncheckedCreateWithoutUserInputSchema),
			]),
		})
		.strict();

export const SessionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpsertWithWhereUniqueWithoutUserInput> =
	z
		.object({
			where: z.lazy(() => SessionWhereUniqueInputSchema),
			update: z.union([
				z.lazy(() => SessionUpdateWithoutUserInputSchema),
				z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema),
			]),
			create: z.union([
				z.lazy(() => SessionCreateWithoutUserInputSchema),
				z.lazy(() => SessionUncheckedCreateWithoutUserInputSchema),
			]),
		})
		.strict();

export const SessionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithWhereUniqueWithoutUserInput> =
	z
		.object({
			where: z.lazy(() => SessionWhereUniqueInputSchema),
			data: z.union([
				z.lazy(() => SessionUpdateWithoutUserInputSchema),
				z.lazy(() => SessionUncheckedUpdateWithoutUserInputSchema),
			]),
		})
		.strict();

export const SessionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateManyWithWhereWithoutUserInput> =
	z
		.object({
			where: z.lazy(() => SessionScalarWhereInputSchema),
			data: z.union([
				z.lazy(() => SessionUpdateManyMutationInputSchema),
				z.lazy(() => SessionUncheckedUpdateManyWithoutUserInputSchema),
			]),
		})
		.strict();

export const SessionScalarWhereInputSchema: z.ZodType<Prisma.SessionScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => SessionScalarWhereInputSchema),
				z.lazy(() => SessionScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => SessionScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => SessionScalarWhereInputSchema),
				z.lazy(() => SessionScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		expiresAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		token: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		ipAddress: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		userAgent: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
	})
	.strict();

export const AccountUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpsertWithWhereUniqueWithoutUserInput> =
	z
		.object({
			where: z.lazy(() => AccountWhereUniqueInputSchema),
			update: z.union([
				z.lazy(() => AccountUpdateWithoutUserInputSchema),
				z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema),
			]),
			create: z.union([
				z.lazy(() => AccountCreateWithoutUserInputSchema),
				z.lazy(() => AccountUncheckedCreateWithoutUserInputSchema),
			]),
		})
		.strict();

export const AccountUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithWhereUniqueWithoutUserInput> =
	z
		.object({
			where: z.lazy(() => AccountWhereUniqueInputSchema),
			data: z.union([
				z.lazy(() => AccountUpdateWithoutUserInputSchema),
				z.lazy(() => AccountUncheckedUpdateWithoutUserInputSchema),
			]),
		})
		.strict();

export const AccountUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateManyWithWhereWithoutUserInput> =
	z
		.object({
			where: z.lazy(() => AccountScalarWhereInputSchema),
			data: z.union([
				z.lazy(() => AccountUpdateManyMutationInputSchema),
				z.lazy(() => AccountUncheckedUpdateManyWithoutUserInputSchema),
			]),
		})
		.strict();

export const AccountScalarWhereInputSchema: z.ZodType<Prisma.AccountScalarWhereInput> = z
	.object({
		AND: z
			.union([
				z.lazy(() => AccountScalarWhereInputSchema),
				z.lazy(() => AccountScalarWhereInputSchema).array(),
			])
			.optional(),
		OR: z
			.lazy(() => AccountScalarWhereInputSchema)
			.array()
			.optional(),
		NOT: z
			.union([
				z.lazy(() => AccountScalarWhereInputSchema),
				z.lazy(() => AccountScalarWhereInputSchema).array(),
			])
			.optional(),
		id: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		accountId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		providerId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		userId: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
		accessToken: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		refreshToken: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		idToken: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		accessTokenExpiresAt: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		refreshTokenExpiresAt: z
			.union([z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date()])
			.optional()
			.nullable(),
		scope: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		password: z
			.union([z.lazy(() => StringNullableFilterSchema), z.string()])
			.optional()
			.nullable(),
		createdAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
		updatedAt: z.union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()]).optional(),
	})
	.strict();

export const DesktopUpsertWithoutUserInputSchema: z.ZodType<Prisma.DesktopUpsertWithoutUserInput> =
	z
		.object({
			update: z.union([
				z.lazy(() => DesktopUpdateWithoutUserInputSchema),
				z.lazy(() => DesktopUncheckedUpdateWithoutUserInputSchema),
			]),
			create: z.union([
				z.lazy(() => DesktopCreateWithoutUserInputSchema),
				z.lazy(() => DesktopUncheckedCreateWithoutUserInputSchema),
			]),
			where: z.lazy(() => DesktopWhereInputSchema).optional(),
		})
		.strict();

export const DesktopUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.DesktopUpdateToOneWithWhereWithoutUserInput> =
	z
		.object({
			where: z.lazy(() => DesktopWhereInputSchema).optional(),
			data: z.union([
				z.lazy(() => DesktopUpdateWithoutUserInputSchema),
				z.lazy(() => DesktopUncheckedUpdateWithoutUserInputSchema),
			]),
		})
		.strict();

export const DesktopUpdateWithoutUserInputSchema: z.ZodType<Prisma.DesktopUpdateWithoutUserInput> =
	z
		.object({
			id: z
				.union([z.string().uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
			isPublic: z
				.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
				.optional(),
			background: z
				.union([
					z.lazy(() => BackgroundOptionSchema),
					z.lazy(() => EnumBackgroundOptionFieldUpdateOperationsInputSchema),
				])
				.optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
		})
		.strict();

export const DesktopUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.DesktopUncheckedUpdateWithoutUserInput> =
	z
		.object({
			id: z
				.union([z.string().uuid(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			state: z.union([z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema]).optional(),
			isPublic: z
				.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
				.optional(),
			background: z
				.union([
					z.lazy(() => BackgroundOptionSchema),
					z.lazy(() => EnumBackgroundOptionFieldUpdateOperationsInputSchema),
				])
				.optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
		})
		.strict();

export const UserCreateWithoutDesktopInputSchema: z.ZodType<Prisma.UserCreateWithoutDesktopInput> =
	z
		.object({
			id: z.string(),
			name: z.string(),
			email: z.string(),
			emailVerified: z.boolean(),
			image: z.string().optional().nullable(),
			createdAt: z.coerce.date(),
			updatedAt: z.coerce.date(),
			osName: z
				.string()
				.min(2, { message: "OS 名は2文字以上で入力してください。" })
				.max(10, { message: "OS 名は10文字以下で入力してください。" })
				.optional()
				.nullable(),
			sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
			accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
		})
		.strict();

export const UserUncheckedCreateWithoutDesktopInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutDesktopInput> =
	z
		.object({
			id: z.string(),
			name: z.string(),
			email: z.string(),
			emailVerified: z.boolean(),
			image: z.string().optional().nullable(),
			createdAt: z.coerce.date(),
			updatedAt: z.coerce.date(),
			osName: z
				.string()
				.min(2, { message: "OS 名は2文字以上で入力してください。" })
				.max(10, { message: "OS 名は10文字以下で入力してください。" })
				.optional()
				.nullable(),
			sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
			accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
		})
		.strict();

export const UserCreateOrConnectWithoutDesktopInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutDesktopInput> =
	z
		.object({
			where: z.lazy(() => UserWhereUniqueInputSchema),
			create: z.union([
				z.lazy(() => UserCreateWithoutDesktopInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutDesktopInputSchema),
			]),
		})
		.strict();

export const UserUpsertWithoutDesktopInputSchema: z.ZodType<Prisma.UserUpsertWithoutDesktopInput> =
	z
		.object({
			update: z.union([
				z.lazy(() => UserUpdateWithoutDesktopInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutDesktopInputSchema),
			]),
			create: z.union([
				z.lazy(() => UserCreateWithoutDesktopInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutDesktopInputSchema),
			]),
			where: z.lazy(() => UserWhereInputSchema).optional(),
		})
		.strict();

export const UserUpdateToOneWithWhereWithoutDesktopInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutDesktopInput> =
	z
		.object({
			where: z.lazy(() => UserWhereInputSchema).optional(),
			data: z.union([
				z.lazy(() => UserUpdateWithoutDesktopInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutDesktopInputSchema),
			]),
		})
		.strict();

export const UserUpdateWithoutDesktopInputSchema: z.ZodType<Prisma.UserUpdateWithoutDesktopInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			emailVerified: z
				.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
				.optional(),
			image: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			osName: z
				.union([
					z
						.string()
						.min(2, { message: "OS 名は2文字以上で入力してください。" })
						.max(10, { message: "OS 名は10文字以下で入力してください。" }),
					z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
				])
				.optional()
				.nullable(),
			sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
			accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
		})
		.strict();

export const UserUncheckedUpdateWithoutDesktopInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutDesktopInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			emailVerified: z
				.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
				.optional(),
			image: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			osName: z
				.union([
					z
						.string()
						.min(2, { message: "OS 名は2文字以上で入力してください。" })
						.max(10, { message: "OS 名は10文字以下で入力してください。" }),
					z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
				])
				.optional()
				.nullable(),
			sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
			accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
		})
		.strict();

export const UserCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSessionsInput> =
	z
		.object({
			id: z.string(),
			name: z.string(),
			email: z.string(),
			emailVerified: z.boolean(),
			image: z.string().optional().nullable(),
			createdAt: z.coerce.date(),
			updatedAt: z.coerce.date(),
			osName: z
				.string()
				.min(2, { message: "OS 名は2文字以上で入力してください。" })
				.max(10, { message: "OS 名は10文字以下で入力してください。" })
				.optional()
				.nullable(),
			accounts: z.lazy(() => AccountCreateNestedManyWithoutUserInputSchema).optional(),
			desktop: z.lazy(() => DesktopCreateNestedOneWithoutUserInputSchema).optional(),
		})
		.strict();

export const UserUncheckedCreateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSessionsInput> =
	z
		.object({
			id: z.string(),
			name: z.string(),
			email: z.string(),
			emailVerified: z.boolean(),
			image: z.string().optional().nullable(),
			createdAt: z.coerce.date(),
			updatedAt: z.coerce.date(),
			osName: z
				.string()
				.min(2, { message: "OS 名は2文字以上で入力してください。" })
				.max(10, { message: "OS 名は10文字以下で入力してください。" })
				.optional()
				.nullable(),
			accounts: z.lazy(() => AccountUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
			desktop: z.lazy(() => DesktopUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
		})
		.strict();

export const UserCreateOrConnectWithoutSessionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSessionsInput> =
	z
		.object({
			where: z.lazy(() => UserWhereUniqueInputSchema),
			create: z.union([
				z.lazy(() => UserCreateWithoutSessionsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
			]),
		})
		.strict();

export const UserUpsertWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSessionsInput> =
	z
		.object({
			update: z.union([
				z.lazy(() => UserUpdateWithoutSessionsInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
			]),
			create: z.union([
				z.lazy(() => UserCreateWithoutSessionsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutSessionsInputSchema),
			]),
			where: z.lazy(() => UserWhereInputSchema).optional(),
		})
		.strict();

export const UserUpdateToOneWithWhereWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput> =
	z
		.object({
			where: z.lazy(() => UserWhereInputSchema).optional(),
			data: z.union([
				z.lazy(() => UserUpdateWithoutSessionsInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutSessionsInputSchema),
			]),
		})
		.strict();

export const UserUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSessionsInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			emailVerified: z
				.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
				.optional(),
			image: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			osName: z
				.union([
					z
						.string()
						.min(2, { message: "OS 名は2文字以上で入力してください。" })
						.max(10, { message: "OS 名は10文字以下で入力してください。" }),
					z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
				])
				.optional()
				.nullable(),
			accounts: z.lazy(() => AccountUpdateManyWithoutUserNestedInputSchema).optional(),
			desktop: z.lazy(() => DesktopUpdateOneWithoutUserNestedInputSchema).optional(),
		})
		.strict();

export const UserUncheckedUpdateWithoutSessionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSessionsInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			emailVerified: z
				.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
				.optional(),
			image: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			osName: z
				.union([
					z
						.string()
						.min(2, { message: "OS 名は2文字以上で入力してください。" })
						.max(10, { message: "OS 名は10文字以下で入力してください。" }),
					z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
				])
				.optional()
				.nullable(),
			accounts: z.lazy(() => AccountUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
			desktop: z.lazy(() => DesktopUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
		})
		.strict();

export const UserCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateWithoutAccountsInput> =
	z
		.object({
			id: z.string(),
			name: z.string(),
			email: z.string(),
			emailVerified: z.boolean(),
			image: z.string().optional().nullable(),
			createdAt: z.coerce.date(),
			updatedAt: z.coerce.date(),
			osName: z
				.string()
				.min(2, { message: "OS 名は2文字以上で入力してください。" })
				.max(10, { message: "OS 名は10文字以下で入力してください。" })
				.optional()
				.nullable(),
			sessions: z.lazy(() => SessionCreateNestedManyWithoutUserInputSchema).optional(),
			desktop: z.lazy(() => DesktopCreateNestedOneWithoutUserInputSchema).optional(),
		})
		.strict();

export const UserUncheckedCreateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAccountsInput> =
	z
		.object({
			id: z.string(),
			name: z.string(),
			email: z.string(),
			emailVerified: z.boolean(),
			image: z.string().optional().nullable(),
			createdAt: z.coerce.date(),
			updatedAt: z.coerce.date(),
			osName: z
				.string()
				.min(2, { message: "OS 名は2文字以上で入力してください。" })
				.max(10, { message: "OS 名は10文字以下で入力してください。" })
				.optional()
				.nullable(),
			sessions: z.lazy(() => SessionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
			desktop: z.lazy(() => DesktopUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
		})
		.strict();

export const UserCreateOrConnectWithoutAccountsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAccountsInput> =
	z
		.object({
			where: z.lazy(() => UserWhereUniqueInputSchema),
			create: z.union([
				z.lazy(() => UserCreateWithoutAccountsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
			]),
		})
		.strict();

export const UserUpsertWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpsertWithoutAccountsInput> =
	z
		.object({
			update: z.union([
				z.lazy(() => UserUpdateWithoutAccountsInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
			]),
			create: z.union([
				z.lazy(() => UserCreateWithoutAccountsInputSchema),
				z.lazy(() => UserUncheckedCreateWithoutAccountsInputSchema),
			]),
			where: z.lazy(() => UserWhereInputSchema).optional(),
		})
		.strict();

export const UserUpdateToOneWithWhereWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAccountsInput> =
	z
		.object({
			where: z.lazy(() => UserWhereInputSchema).optional(),
			data: z.union([
				z.lazy(() => UserUpdateWithoutAccountsInputSchema),
				z.lazy(() => UserUncheckedUpdateWithoutAccountsInputSchema),
			]),
		})
		.strict();

export const UserUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUpdateWithoutAccountsInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			emailVerified: z
				.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
				.optional(),
			image: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			osName: z
				.union([
					z
						.string()
						.min(2, { message: "OS 名は2文字以上で入力してください。" })
						.max(10, { message: "OS 名は10文字以下で入力してください。" }),
					z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
				])
				.optional()
				.nullable(),
			sessions: z.lazy(() => SessionUpdateManyWithoutUserNestedInputSchema).optional(),
			desktop: z.lazy(() => DesktopUpdateOneWithoutUserNestedInputSchema).optional(),
		})
		.strict();

export const UserUncheckedUpdateWithoutAccountsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAccountsInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			name: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			email: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			emailVerified: z
				.union([z.boolean(), z.lazy(() => BoolFieldUpdateOperationsInputSchema)])
				.optional(),
			image: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			osName: z
				.union([
					z
						.string()
						.min(2, { message: "OS 名は2文字以上で入力してください。" })
						.max(10, { message: "OS 名は10文字以下で入力してください。" }),
					z.lazy(() => NullableStringFieldUpdateOperationsInputSchema),
				])
				.optional()
				.nullable(),
			sessions: z.lazy(() => SessionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
			desktop: z.lazy(() => DesktopUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
		})
		.strict();

export const SessionCreateManyUserInputSchema: z.ZodType<Prisma.SessionCreateManyUserInput> = z
	.object({
		id: z.string(),
		expiresAt: z.coerce.date(),
		token: z.string(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
		ipAddress: z.string().optional().nullable(),
		userAgent: z.string().optional().nullable(),
	})
	.strict();

export const AccountCreateManyUserInputSchema: z.ZodType<Prisma.AccountCreateManyUserInput> = z
	.object({
		id: z.string(),
		accountId: z.string(),
		providerId: z.string(),
		accessToken: z.string().optional().nullable(),
		refreshToken: z.string().optional().nullable(),
		idToken: z.string().optional().nullable(),
		accessTokenExpiresAt: z.coerce.date().optional().nullable(),
		refreshTokenExpiresAt: z.coerce.date().optional().nullable(),
		scope: z.string().optional().nullable(),
		password: z.string().optional().nullable(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date(),
	})
	.strict();

export const SessionUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUpdateWithoutUserInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			expiresAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			ipAddress: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			userAgent: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
		})
		.strict();

export const SessionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateWithoutUserInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			expiresAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			ipAddress: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			userAgent: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
		})
		.strict();

export const SessionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.SessionUncheckedUpdateManyWithoutUserInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			expiresAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			token: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			ipAddress: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			userAgent: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
		})
		.strict();

export const AccountUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUpdateWithoutUserInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			accountId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			providerId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			accessToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			refreshToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			idToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			accessTokenExpiresAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			refreshTokenExpiresAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			scope: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			password: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
		})
		.strict();

export const AccountUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateWithoutUserInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			accountId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			providerId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			accessToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			refreshToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			idToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			accessTokenExpiresAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			refreshTokenExpiresAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			scope: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			password: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
		})
		.strict();

export const AccountUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.AccountUncheckedUpdateManyWithoutUserInput> =
	z
		.object({
			id: z.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)]).optional(),
			accountId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			providerId: z
				.union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
				.optional(),
			accessToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			refreshToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			idToken: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			accessTokenExpiresAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			refreshTokenExpiresAt: z
				.union([z.coerce.date(), z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			scope: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			password: z
				.union([z.string(), z.lazy(() => NullableStringFieldUpdateOperationsInputSchema)])
				.optional()
				.nullable(),
			createdAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
			updatedAt: z
				.union([z.coerce.date(), z.lazy(() => DateTimeFieldUpdateOperationsInputSchema)])
				.optional(),
		})
		.strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
	})
	.strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
	})
	.strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z.union([UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array()]).optional(),
	})
	.strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z
	.object({
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema])
			.optional(),
		cursor: UserWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z
	.object({
		where: UserWhereInputSchema.optional(),
		orderBy: z
			.union([UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema])
			.optional(),
		by: UserScalarFieldEnumSchema.array(),
		having: UserScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict();

export const DesktopFindFirstArgsSchema: z.ZodType<Prisma.DesktopFindFirstArgs> = z
	.object({
		select: DesktopSelectSchema.optional(),
		include: DesktopIncludeSchema.optional(),
		where: DesktopWhereInputSchema.optional(),
		orderBy: z
			.union([DesktopOrderByWithRelationInputSchema.array(), DesktopOrderByWithRelationInputSchema])
			.optional(),
		cursor: DesktopWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([DesktopScalarFieldEnumSchema, DesktopScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const DesktopFindFirstOrThrowArgsSchema: z.ZodType<Prisma.DesktopFindFirstOrThrowArgs> = z
	.object({
		select: DesktopSelectSchema.optional(),
		include: DesktopIncludeSchema.optional(),
		where: DesktopWhereInputSchema.optional(),
		orderBy: z
			.union([DesktopOrderByWithRelationInputSchema.array(), DesktopOrderByWithRelationInputSchema])
			.optional(),
		cursor: DesktopWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([DesktopScalarFieldEnumSchema, DesktopScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const DesktopFindManyArgsSchema: z.ZodType<Prisma.DesktopFindManyArgs> = z
	.object({
		select: DesktopSelectSchema.optional(),
		include: DesktopIncludeSchema.optional(),
		where: DesktopWhereInputSchema.optional(),
		orderBy: z
			.union([DesktopOrderByWithRelationInputSchema.array(), DesktopOrderByWithRelationInputSchema])
			.optional(),
		cursor: DesktopWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([DesktopScalarFieldEnumSchema, DesktopScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const DesktopAggregateArgsSchema: z.ZodType<Prisma.DesktopAggregateArgs> = z
	.object({
		where: DesktopWhereInputSchema.optional(),
		orderBy: z
			.union([DesktopOrderByWithRelationInputSchema.array(), DesktopOrderByWithRelationInputSchema])
			.optional(),
		cursor: DesktopWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const DesktopGroupByArgsSchema: z.ZodType<Prisma.DesktopGroupByArgs> = z
	.object({
		where: DesktopWhereInputSchema.optional(),
		orderBy: z
			.union([
				DesktopOrderByWithAggregationInputSchema.array(),
				DesktopOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: DesktopScalarFieldEnumSchema.array(),
		having: DesktopScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const DesktopFindUniqueArgsSchema: z.ZodType<Prisma.DesktopFindUniqueArgs> = z
	.object({
		select: DesktopSelectSchema.optional(),
		include: DesktopIncludeSchema.optional(),
		where: DesktopWhereUniqueInputSchema,
	})
	.strict();

export const DesktopFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.DesktopFindUniqueOrThrowArgs> = z
	.object({
		select: DesktopSelectSchema.optional(),
		include: DesktopIncludeSchema.optional(),
		where: DesktopWhereUniqueInputSchema,
	})
	.strict();

export const SessionFindFirstArgsSchema: z.ZodType<Prisma.SessionFindFirstArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereInputSchema.optional(),
		orderBy: z
			.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
			.optional(),
		cursor: SessionWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const SessionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SessionFindFirstOrThrowArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereInputSchema.optional(),
		orderBy: z
			.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
			.optional(),
		cursor: SessionWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const SessionFindManyArgsSchema: z.ZodType<Prisma.SessionFindManyArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereInputSchema.optional(),
		orderBy: z
			.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
			.optional(),
		cursor: SessionWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([SessionScalarFieldEnumSchema, SessionScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const SessionAggregateArgsSchema: z.ZodType<Prisma.SessionAggregateArgs> = z
	.object({
		where: SessionWhereInputSchema.optional(),
		orderBy: z
			.union([SessionOrderByWithRelationInputSchema.array(), SessionOrderByWithRelationInputSchema])
			.optional(),
		cursor: SessionWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const SessionGroupByArgsSchema: z.ZodType<Prisma.SessionGroupByArgs> = z
	.object({
		where: SessionWhereInputSchema.optional(),
		orderBy: z
			.union([
				SessionOrderByWithAggregationInputSchema.array(),
				SessionOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: SessionScalarFieldEnumSchema.array(),
		having: SessionScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const SessionFindUniqueArgsSchema: z.ZodType<Prisma.SessionFindUniqueArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereUniqueInputSchema,
	})
	.strict();

export const SessionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SessionFindUniqueOrThrowArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereUniqueInputSchema,
	})
	.strict();

export const AccountFindFirstArgsSchema: z.ZodType<Prisma.AccountFindFirstArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereInputSchema.optional(),
		orderBy: z
			.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
			.optional(),
		cursor: AccountWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const AccountFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AccountFindFirstOrThrowArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereInputSchema.optional(),
		orderBy: z
			.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
			.optional(),
		cursor: AccountWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const AccountFindManyArgsSchema: z.ZodType<Prisma.AccountFindManyArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereInputSchema.optional(),
		orderBy: z
			.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
			.optional(),
		cursor: AccountWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([AccountScalarFieldEnumSchema, AccountScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const AccountAggregateArgsSchema: z.ZodType<Prisma.AccountAggregateArgs> = z
	.object({
		where: AccountWhereInputSchema.optional(),
		orderBy: z
			.union([AccountOrderByWithRelationInputSchema.array(), AccountOrderByWithRelationInputSchema])
			.optional(),
		cursor: AccountWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const AccountGroupByArgsSchema: z.ZodType<Prisma.AccountGroupByArgs> = z
	.object({
		where: AccountWhereInputSchema.optional(),
		orderBy: z
			.union([
				AccountOrderByWithAggregationInputSchema.array(),
				AccountOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: AccountScalarFieldEnumSchema.array(),
		having: AccountScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const AccountFindUniqueArgsSchema: z.ZodType<Prisma.AccountFindUniqueArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereUniqueInputSchema,
	})
	.strict();

export const AccountFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AccountFindUniqueOrThrowArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereUniqueInputSchema,
	})
	.strict();

export const VerificationFindFirstArgsSchema: z.ZodType<Prisma.VerificationFindFirstArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		where: VerificationWhereInputSchema.optional(),
		orderBy: z
			.union([
				VerificationOrderByWithRelationInputSchema.array(),
				VerificationOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: VerificationWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([VerificationScalarFieldEnumSchema, VerificationScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const VerificationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VerificationFindFirstOrThrowArgs> =
	z
		.object({
			select: VerificationSelectSchema.optional(),
			where: VerificationWhereInputSchema.optional(),
			orderBy: z
				.union([
					VerificationOrderByWithRelationInputSchema.array(),
					VerificationOrderByWithRelationInputSchema,
				])
				.optional(),
			cursor: VerificationWhereUniqueInputSchema.optional(),
			take: z.number().optional(),
			skip: z.number().optional(),
			distinct: z
				.union([VerificationScalarFieldEnumSchema, VerificationScalarFieldEnumSchema.array()])
				.optional(),
		})
		.strict();

export const VerificationFindManyArgsSchema: z.ZodType<Prisma.VerificationFindManyArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		where: VerificationWhereInputSchema.optional(),
		orderBy: z
			.union([
				VerificationOrderByWithRelationInputSchema.array(),
				VerificationOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: VerificationWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
		distinct: z
			.union([VerificationScalarFieldEnumSchema, VerificationScalarFieldEnumSchema.array()])
			.optional(),
	})
	.strict();

export const VerificationAggregateArgsSchema: z.ZodType<Prisma.VerificationAggregateArgs> = z
	.object({
		where: VerificationWhereInputSchema.optional(),
		orderBy: z
			.union([
				VerificationOrderByWithRelationInputSchema.array(),
				VerificationOrderByWithRelationInputSchema,
			])
			.optional(),
		cursor: VerificationWhereUniqueInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const VerificationGroupByArgsSchema: z.ZodType<Prisma.VerificationGroupByArgs> = z
	.object({
		where: VerificationWhereInputSchema.optional(),
		orderBy: z
			.union([
				VerificationOrderByWithAggregationInputSchema.array(),
				VerificationOrderByWithAggregationInputSchema,
			])
			.optional(),
		by: VerificationScalarFieldEnumSchema.array(),
		having: VerificationScalarWhereWithAggregatesInputSchema.optional(),
		take: z.number().optional(),
		skip: z.number().optional(),
	})
	.strict();

export const VerificationFindUniqueArgsSchema: z.ZodType<Prisma.VerificationFindUniqueArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		where: VerificationWhereUniqueInputSchema,
	})
	.strict();

export const VerificationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VerificationFindUniqueOrThrowArgs> =
	z
		.object({
			select: VerificationSelectSchema.optional(),
			where: VerificationWhereUniqueInputSchema,
		})
		.strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		data: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
	})
	.strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereUniqueInputSchema,
		create: z.union([UserCreateInputSchema, UserUncheckedCreateInputSchema]),
		update: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
	})
	.strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z
	.object({
		data: z.union([UserCreateManyInputSchema, UserCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z
	.object({
		data: z.union([UserCreateManyInputSchema, UserCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		where: UserWhereUniqueInputSchema,
	})
	.strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z
	.object({
		select: UserSelectSchema.optional(),
		include: UserIncludeSchema.optional(),
		data: z.union([UserUpdateInputSchema, UserUncheckedUpdateInputSchema]),
		where: UserWhereUniqueInputSchema,
	})
	.strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z
	.object({
		data: z.union([UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema]),
		where: UserWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z
	.object({
		data: z.union([UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema]),
		where: UserWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z
	.object({
		where: UserWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const DesktopCreateArgsSchema: z.ZodType<Prisma.DesktopCreateArgs> = z
	.object({
		select: DesktopSelectSchema.optional(),
		include: DesktopIncludeSchema.optional(),
		data: z.union([DesktopCreateInputSchema, DesktopUncheckedCreateInputSchema]),
	})
	.strict();

export const DesktopUpsertArgsSchema: z.ZodType<Prisma.DesktopUpsertArgs> = z
	.object({
		select: DesktopSelectSchema.optional(),
		include: DesktopIncludeSchema.optional(),
		where: DesktopWhereUniqueInputSchema,
		create: z.union([DesktopCreateInputSchema, DesktopUncheckedCreateInputSchema]),
		update: z.union([DesktopUpdateInputSchema, DesktopUncheckedUpdateInputSchema]),
	})
	.strict();

export const DesktopCreateManyArgsSchema: z.ZodType<Prisma.DesktopCreateManyArgs> = z
	.object({
		data: z.union([DesktopCreateManyInputSchema, DesktopCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const DesktopCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DesktopCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([DesktopCreateManyInputSchema, DesktopCreateManyInputSchema.array()]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const DesktopDeleteArgsSchema: z.ZodType<Prisma.DesktopDeleteArgs> = z
	.object({
		select: DesktopSelectSchema.optional(),
		include: DesktopIncludeSchema.optional(),
		where: DesktopWhereUniqueInputSchema,
	})
	.strict();

export const DesktopUpdateArgsSchema: z.ZodType<Prisma.DesktopUpdateArgs> = z
	.object({
		select: DesktopSelectSchema.optional(),
		include: DesktopIncludeSchema.optional(),
		data: z.union([DesktopUpdateInputSchema, DesktopUncheckedUpdateInputSchema]),
		where: DesktopWhereUniqueInputSchema,
	})
	.strict();

export const DesktopUpdateManyArgsSchema: z.ZodType<Prisma.DesktopUpdateManyArgs> = z
	.object({
		data: z.union([DesktopUpdateManyMutationInputSchema, DesktopUncheckedUpdateManyInputSchema]),
		where: DesktopWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const DesktopUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.DesktopUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([DesktopUpdateManyMutationInputSchema, DesktopUncheckedUpdateManyInputSchema]),
			where: DesktopWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const DesktopDeleteManyArgsSchema: z.ZodType<Prisma.DesktopDeleteManyArgs> = z
	.object({
		where: DesktopWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const SessionCreateArgsSchema: z.ZodType<Prisma.SessionCreateArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		data: z.union([SessionCreateInputSchema, SessionUncheckedCreateInputSchema]),
	})
	.strict();

export const SessionUpsertArgsSchema: z.ZodType<Prisma.SessionUpsertArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereUniqueInputSchema,
		create: z.union([SessionCreateInputSchema, SessionUncheckedCreateInputSchema]),
		update: z.union([SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema]),
	})
	.strict();

export const SessionCreateManyArgsSchema: z.ZodType<Prisma.SessionCreateManyArgs> = z
	.object({
		data: z.union([SessionCreateManyInputSchema, SessionCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const SessionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([SessionCreateManyInputSchema, SessionCreateManyInputSchema.array()]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const SessionDeleteArgsSchema: z.ZodType<Prisma.SessionDeleteArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		where: SessionWhereUniqueInputSchema,
	})
	.strict();

export const SessionUpdateArgsSchema: z.ZodType<Prisma.SessionUpdateArgs> = z
	.object({
		select: SessionSelectSchema.optional(),
		include: SessionIncludeSchema.optional(),
		data: z.union([SessionUpdateInputSchema, SessionUncheckedUpdateInputSchema]),
		where: SessionWhereUniqueInputSchema,
	})
	.strict();

export const SessionUpdateManyArgsSchema: z.ZodType<Prisma.SessionUpdateManyArgs> = z
	.object({
		data: z.union([SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema]),
		where: SessionWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const SessionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SessionUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([SessionUpdateManyMutationInputSchema, SessionUncheckedUpdateManyInputSchema]),
			where: SessionWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const SessionDeleteManyArgsSchema: z.ZodType<Prisma.SessionDeleteManyArgs> = z
	.object({
		where: SessionWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const AccountCreateArgsSchema: z.ZodType<Prisma.AccountCreateArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		data: z.union([AccountCreateInputSchema, AccountUncheckedCreateInputSchema]),
	})
	.strict();

export const AccountUpsertArgsSchema: z.ZodType<Prisma.AccountUpsertArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereUniqueInputSchema,
		create: z.union([AccountCreateInputSchema, AccountUncheckedCreateInputSchema]),
		update: z.union([AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema]),
	})
	.strict();

export const AccountCreateManyArgsSchema: z.ZodType<Prisma.AccountCreateManyArgs> = z
	.object({
		data: z.union([AccountCreateManyInputSchema, AccountCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const AccountCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([AccountCreateManyInputSchema, AccountCreateManyInputSchema.array()]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const AccountDeleteArgsSchema: z.ZodType<Prisma.AccountDeleteArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		where: AccountWhereUniqueInputSchema,
	})
	.strict();

export const AccountUpdateArgsSchema: z.ZodType<Prisma.AccountUpdateArgs> = z
	.object({
		select: AccountSelectSchema.optional(),
		include: AccountIncludeSchema.optional(),
		data: z.union([AccountUpdateInputSchema, AccountUncheckedUpdateInputSchema]),
		where: AccountWhereUniqueInputSchema,
	})
	.strict();

export const AccountUpdateManyArgsSchema: z.ZodType<Prisma.AccountUpdateManyArgs> = z
	.object({
		data: z.union([AccountUpdateManyMutationInputSchema, AccountUncheckedUpdateManyInputSchema]),
		where: AccountWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const AccountUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AccountUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([AccountUpdateManyMutationInputSchema, AccountUncheckedUpdateManyInputSchema]),
			where: AccountWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const AccountDeleteManyArgsSchema: z.ZodType<Prisma.AccountDeleteManyArgs> = z
	.object({
		where: AccountWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const VerificationCreateArgsSchema: z.ZodType<Prisma.VerificationCreateArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		data: z.union([VerificationCreateInputSchema, VerificationUncheckedCreateInputSchema]),
	})
	.strict();

export const VerificationUpsertArgsSchema: z.ZodType<Prisma.VerificationUpsertArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		where: VerificationWhereUniqueInputSchema,
		create: z.union([VerificationCreateInputSchema, VerificationUncheckedCreateInputSchema]),
		update: z.union([VerificationUpdateInputSchema, VerificationUncheckedUpdateInputSchema]),
	})
	.strict();

export const VerificationCreateManyArgsSchema: z.ZodType<Prisma.VerificationCreateManyArgs> = z
	.object({
		data: z.union([VerificationCreateManyInputSchema, VerificationCreateManyInputSchema.array()]),
		skipDuplicates: z.boolean().optional(),
	})
	.strict();

export const VerificationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationCreateManyAndReturnArgs> =
	z
		.object({
			data: z.union([VerificationCreateManyInputSchema, VerificationCreateManyInputSchema.array()]),
			skipDuplicates: z.boolean().optional(),
		})
		.strict();

export const VerificationDeleteArgsSchema: z.ZodType<Prisma.VerificationDeleteArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		where: VerificationWhereUniqueInputSchema,
	})
	.strict();

export const VerificationUpdateArgsSchema: z.ZodType<Prisma.VerificationUpdateArgs> = z
	.object({
		select: VerificationSelectSchema.optional(),
		data: z.union([VerificationUpdateInputSchema, VerificationUncheckedUpdateInputSchema]),
		where: VerificationWhereUniqueInputSchema,
	})
	.strict();

export const VerificationUpdateManyArgsSchema: z.ZodType<Prisma.VerificationUpdateManyArgs> = z
	.object({
		data: z.union([
			VerificationUpdateManyMutationInputSchema,
			VerificationUncheckedUpdateManyInputSchema,
		]),
		where: VerificationWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();

export const VerificationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VerificationUpdateManyAndReturnArgs> =
	z
		.object({
			data: z.union([
				VerificationUpdateManyMutationInputSchema,
				VerificationUncheckedUpdateManyInputSchema,
			]),
			where: VerificationWhereInputSchema.optional(),
			limit: z.number().optional(),
		})
		.strict();

export const VerificationDeleteManyArgsSchema: z.ZodType<Prisma.VerificationDeleteManyArgs> = z
	.object({
		where: VerificationWhereInputSchema.optional(),
		limit: z.number().optional(),
	})
	.strict();
