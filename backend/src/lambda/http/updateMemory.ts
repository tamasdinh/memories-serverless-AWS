import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateMemoryRequest } from '../../requests/UpdateMemoryRequest'
import { updateMemory } from '../../businessLogic/memoriesLogic'
import { ALLOWED_ORIGINS, extractUserID } from '../../auth/utils'
import { createLogger } from '../../logger/logger'

const logger = createLogger('updateMemory')

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
  const { timeStamp } = event.pathParameters
  logger.info({headers})
  logger.info({userID})
  logger.info({timeStamp})


  const updatedMemory: UpdateMemoryRequest = JSON.parse(event.body)

  await updateMemory(userID, timeStamp, updatedMemory)

  return {
    statusCode: 201,
    headers,
    body: ""
  }
}