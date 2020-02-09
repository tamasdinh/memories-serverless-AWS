import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { UpdateMemoryRequest } from '../requests/UpdateMemoryRequest'
import { CreateMemoryRequest } from '../requests/createMemoryRequest'

export class memoriesDBAccess {

  constructor(
    private readonly docClient: DocumentClient = new DocumentClient(),
    private readonly memoriesTable = process.env.MEMORIES_TABLE,
    // private readonly userIndex = process.env.MEMORIES_ID_INDEX,
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

  async createMemory (memoryItem: CreateMemoryRequest): Promise<void> {
    await this.docClient.put({
      TableName: this.memoriesTable,
      Item: memoryItem
    }).promise()
  }

  async updateMemory (userId: string, timeStamp: string, updatedMemory: UpdateMemoryRequest): Promise<void> {
    
    const existingItem = await this.docClient.query({
      TableName: this.memoriesTable,
      KeyConditionExpression: '#uId = :userId and #ts = :timeStamp',
      ExpressionAttributeNames: {
        '#uId': 'userId',
        '#ts': 'timeStamp'
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':timeStamp': timeStamp
      }
    }).promise()
    
    
    await this.docClient.update({
      TableName: this.memoriesTable,
      Key: {
        userId,
        timeStamp
      },
      UpdateExpression: 'set title = :title, memoryText = :memoryText, imageURL = :imageURL',
      ExpressionAttributeValues: {
        ':title': updatedMemory.title ? updatedMemory.title : existingItem.Items[0].title,
        ':memoryText': updatedMemory.memoryText ? updatedMemory.memoryText : existingItem.Items[0].memoryText,
        ':imageURL': updatedMemory.imageURL ? updatedMemory.imageURL : (existingItem.Items[0].imageURL || " ")
      }
    }).promise()
  }

  async deleteMemory (userId: string, timeStamp: string): Promise<void> {

    await this.docClient.delete({
      TableName: this.memoriesTable,
      Key: {
        userId,
        timeStamp
      }
    }).promise()

  }

}