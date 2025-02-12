'use server'

import { addUser, getUserByWalletAddress, updateUser } from '@/lib/db'
import { db } from "@/lib/db"; // Add db import
import { users } from "@/lib/db"; // Add users import
import { eq } from "drizzle-orm"; // Add eq import
import { toggleUserListing } from '@/lib/db';
import { getListedUsers } from '@/lib/db';

export async function addUserToDatabase(walletAddress: string) {
  try {
    // Try to get existing user first
    const existingUser = await getUserByWalletAddress(walletAddress);
    
    if (!existingUser) {
      const user = await addUser(walletAddress);
      return { success: true, user };
    }
    
    return { success: true, user: existingUser };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to add user' 
    };
  }
}

export async function getUserData(walletAddress: string) {
  try {
    const user = await db.select({
      id: users.id,
      walletAddress: users.walletAddress,
      nickname: users.nickname,
      telegram: users.telegram,
      discord: users.discord,
      twitter: users.twitter,
      twitch: users.twitch,
      kick: users.kick,
      listed: users.listed,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.walletAddress, walletAddress));

    if (user.length === 0) return { success: false, error: 'User not found' };
    return { success: true, user: user[0] };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch user' };
  }
}

export async function updateUserSocials(
  nickname: string,
  walletAddress: string,
  socials: {
    telegram?: string
    discord?: string
    twitter?: string
    twitch?: string
    kick?: string
  }
) {
  try {
    const user = await updateUser(walletAddress, { nickname, ...socials })
    return { success: true, user }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update user' }
  }
}

export async function toggleLeaderboardListing(walletAddress: string, listed: boolean) {
  try {
    await db.update(users)
      .set({ listed })
      .where(eq(users.walletAddress, walletAddress));
    
    console.log("users dataa ",users); 
    return { success: true };
  } catch (error) {
    console.error("Error toggling listing:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to toggle listing' 
    };
  }
}

export async function fetchListedUsers() {
  try {
    const listedUsers = await db.select()
      .from(users)
      .where(eq(users.listed, true))
      .execute();

    return { success: true, users: listedUsers };
  } catch (error) {
    console.error("Error fetching listed users:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to fetch leaderboard' 
    };
  }
}