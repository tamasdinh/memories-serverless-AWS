import { APIGatewayProxyEvent } from 'aws-lambda'
import { decode } from 'jsonwebtoken'
import { JwtPayload } from './JwtPayload'

export function extractUserID(event: APIGatewayProxyEvent): string {
  const jwtToken = event.headers.Authorization.split(' ')[1]
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}

export const ALLOWED_ORIGINS = [
  'http://localhost:3000'
]