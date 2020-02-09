import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getMemories } from '../../businessLogic/memoriesLogic'
import { extractUserID, ALLOWED_ORIGINS } from '../../auth/utils'
import { createLogger } from '../../logger/logger'

const logger = createLogger('getMemories')

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

  const response = await getMemories(userID)

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      items: response
    }) 
  }

}