export interface AccessTokenPayload {
    userId: string;
    role: string;
}
export interface RefreshTokenPayload {
    userId: string;
    tokenId: string;
}
export declare const generateAccessToken: (payload: AccessTokenPayload) => string;
export declare const generateRefreshToken: (payload: RefreshTokenPayload) => string;
export declare const verifyAccessToken: (token: string) => AccessTokenPayload;
//# sourceMappingURL=jwt.d.ts.map