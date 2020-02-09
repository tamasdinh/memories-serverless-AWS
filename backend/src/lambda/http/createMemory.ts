import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createMemory } from '../../businessLogic/memoriesLogic'
import { ALLOWED_ORIGINS, extractUserID } from '../../auth/utils'
import { createLogger } from '../../logger/logger'
import { CreateMemoryRequest } from '../../requests/createMemoryRequest'

const logger = createLogger('createMemory')

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
  
  const newMemory: CreateMemoryRequest = JSON.parse(event.body)
  logger.info({newMemory})
  const newItem = await createMemory(userID, newMemory)

  logger.info({newItem})

  return {
    statusCode: 201,
    headers,
    body: JSON.stringify({
      item: {
        ...newItem
      }
    })
  }

}