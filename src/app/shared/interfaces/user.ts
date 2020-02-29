export interface AppUser {
    id?: number;
    uid: string;
    providerId: string;
    displayName: string;
    image: string;
    email: string;
    emailVerified?: boolean;
    phoneNumber: string;
    city?: string;
    lastLoginAt: string;
    createdAt: string;
}
