import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { MemoryItem } from '../models/memoryItem'

export class memoriesDBAccess {

  constructor(
    private readonly docClient: DocumentClient = new DocumentClient(),
    private readonly memoriesTable = process.env.MEMORIES_TABLE,
    private readonly userIndex = process.env.MEMORIES_ID_INDEX,
  ){}

  async getMemories (userId: string): Promise<DocumentClient.AttributeMap[]> {

    const response = await this.docClient.query({
      TableName: this.memoriesTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    return response.Items
  }

}