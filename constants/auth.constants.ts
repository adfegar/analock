let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(newAccessToken: string): void {
  accessToken = newAccessToken;
}
