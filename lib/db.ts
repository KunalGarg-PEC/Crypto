import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  walletAddress: text("wallet_address").notNull().unique(),
  nickname: text("nickname"),
  telegram: text("telegram"),
  discord: text("discord"),
  twitter: text("twitter"),
  twitch: text("twitch"),
  kick: text("kick"),
  listed: boolean("listed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export async function addUser(
  walletAddress: string,
  socials?: {
    nickname?: string;
    telegram?: string;
    discord?: string;
    twitter?: string;
    twitch?: string;
    kick?: string;
  }
) {
  try {
    const result = await db
      .insert(users)
      .values({
        walletAddress,
        nickname: socials?.nickname || null,
        telegram: socials?.telegram || null,
        discord: socials?.discord || null,
        twitter: socials?.twitter || null,
        twitch: socials?.twitch || null,
        kick: socials?.kick || null,
      })
      .returning();

    if (result.length === 0) {
      throw new Error("Failed to insert user");
    }
    return result[0];
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("duplicate key value violates unique constraint")
      ) {
        throw new Error("User with this wallet address already exists");
      }
    }
    console.error("Error adding user to database:", error);
    throw error;
  }
}

export async function getUserByWalletAddress(walletAddress: string) {
  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.walletAddress, walletAddress));
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching user from database:", error);
    throw error;
  }
}

export async function updateUser(
  walletAddress: string,
  data: {
    nickname?: string;
    telegram?: string;
    discord?: string;
    twitter?: string;
    twitch?: string;
    kick?: string;
  }
) {
  try {
    const result = await db
      .update(users)
      .set(data)
      .where(eq(users.walletAddress, walletAddress))
      .returning({
        id: users.id,
        walletAddress: users.walletAddress,
        nickname: users.nickname,
        telegram: users.telegram,
        discord: users.discord,
        twitter: users.twitter,
        twitch: users.twitch,
        kick: users.kick,
        createdAt: users.createdAt,
      });

    if (result.length === 0) {
      throw new Error("User not found");
    }
    return result[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}
export async function toggleUserListing(
  walletAddress: string,
  listed: boolean
) {
  try {
    const result = await db
      .update(users)
      .set({ listed })
      .where(eq(users.walletAddress, walletAddress))
      .returning();

    if (result.length === 0) throw new Error("User not found");
    return result[0];
  } catch (error) {
    console.error("Error toggling user listing:", error);
    throw error;
  }
}

export async function getListedUsers() {
  try {
    return await db.select().from(users).where(eq(users.listed, true));
  } catch (error) {
    console.error("Error fetching listed users:", error);
    throw error;
  }
}
