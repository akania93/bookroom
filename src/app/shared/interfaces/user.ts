export interface AppUser {
    uid: string;
    providerId: string;
    displayName: string;
    image: string;
    email: string;
    emailVerified?: boolean;
    phoneNumber: string;
    // lastLoginAt: string;
    // createdAt: string;
}
