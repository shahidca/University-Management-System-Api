export interface GoogleUserPayload {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture?: string | undefined;
}
export declare const verifyGoogleIdToken: (idToken: string) => Promise<GoogleUserPayload>;
//# sourceMappingURL=google.service.d.ts.map