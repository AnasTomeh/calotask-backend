export enum JobStatus {
  Pending = 'pending',
  Resolved = 'resolved',
}

export type IJob = {
  id: number
  status: JobStatus
  name: string
  image: IImage | null
  createdAt: Date
  updatedAt: Date
  resolvedAt: Date | null
}

export type IImage = {
  full: string
  regular: string
  small: string
  thumb: string
}
