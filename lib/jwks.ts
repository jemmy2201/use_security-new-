// lib/jwks.ts
import fetch from 'node-fetch';

export const getJWKS = async () => {
    const response = await fetch(process.env.SINGPASS_JWKS_URL!);
    if (!response.ok) throw new Error('Failed to fetch JWKS');
    const jwks = await response.json();
    return jwks;
};
