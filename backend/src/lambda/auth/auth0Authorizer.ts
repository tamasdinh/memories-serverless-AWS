import 'source-map-support/register'
import { CustomAuthorizerEvent, CustomAuthorizerResult, CustomAuthorizerHandler } from 'aws-lambda'
import fetch from 'node-fetch'
import { decode, verify } from 'jsonwebtoken'
import * as jwkToPem from 'jwk-to-pem'
import { JwtPayload } from '../../auth/JwtPayload'
import { Jwt } from '../../auth/Jwt'

const jwksUrl = 'https://td-dev2019.eu.auth0.com/.well-known/jwks.json'

export const handler: CustomAuthorizerHandler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    
    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch(error) {

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, {complete: true}) as Jwt

  if (jwt.header.typ !== 'JWT') throw new Error('Token is not a JSON Web Token')
  if (jwt.header.alg !== 'RS256') throw new Error('Token is not RS256')

  await fetch(jwksUrl)
  .then(res => res.json())
  .then(res => {
    res.keys.find(item => item.alg === jwt.header.alg && item.kid === jwt.header.kid)
  })
  .then(auth0Key => verify(token, jwkToPem(auth0Key), {algorithms: ['RS256']}))

  return jwt.payload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer ')) throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}