import UserProfile from "../models/profile.model.js";
import type { CreateUserProfileRequest, UpdateUserProfileRequest, UserProfileResponse } from "../types/user.types.js";

export const createUserProfile = async (data: CreateUserProfileRequest): Promise<UserProfileResponse> => {

    const existingProfile = await UserProfile.findOne({
        userId: data.userId
    })

    if (existingProfile) {
        throw new Error("User profile already exists");
    }

    const profile = await UserProfile.create({
        userId: data.userId,
        phone: data.phone,
        avatar: data.avatar,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
    })

    return {
        success: true,
        message: "User profile generated successfully",
        profile: {
            id: profile._id.toString(),
            userId: profile.userId.toString(),
            ...(profile.phone !== undefined && { phone: profile.phone }),
            ...(profile.avatar !== undefined && { avatar: profile.avatar }),
            ...(profile.dateOfBirth !== undefined && { dateOfBirth: profile.dateOfBirth }),
            ...(profile.gender !== undefined && { gender: profile.gender }),
            addresses: profile.addresses,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt,
        }
    }
}