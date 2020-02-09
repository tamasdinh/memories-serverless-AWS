import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getSignedUrl } from '../../businessLogic/memoriesLogic'
import { createLogger } from '../../logger/logger'
import { ALLOWED_ORIGINS, extractUserID } from '../../auth/utils'

const logger = createLogger('deleteMemory')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const origin = event.headers.origin
  let headers
  
  if (ALLOWED_ORIGINS.includes(origin)) {
    logger.info('Origin is in allowed origins', {origin})
    headers = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true
    }
  } else {
    headers = {
      'Access-Control-Allow-Origin': '*'
    }
  }

  const userID = extractUserID(event)
  logger.info({headers})
  logger.info({userID})

  const { timeStamp } = event.pathParameters

  logger.info({userID})
  logger.info({timeStamp})

  const signedURL = getSignedUrl(userID, timeStamp)

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      uploadURL: signedURL
    })
  }
}