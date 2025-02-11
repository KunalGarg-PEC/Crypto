CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_address" text NOT NULL,
	"nickname" text,
	"telegram" text,
	"discord" text,
	"twitter" text,
	"twitch" text,
	"kick" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address")
);
