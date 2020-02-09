/* The payload of a JWT token */

export interface JwtPayload {
  iss: string,
  sub: string,
  iat: string,
  exp: string
}