export interface CreateMemoryRequest {
  userId: string,
  timeStamp: string,
  title: string,
  memoryText: string,
  imageURL?: string
}