import { IImage, JobStatus } from '#types/types'

export default class Job {
  private id: number | null = null
  private status: JobStatus | null = null
  private name: string | null = null
  private image: IImage | null = null
  private createdAt: Date | null = null
  private updatedAt: Date | null = null
  private resolvedAt: Date | null = null

  constructor() {}

  static fromJson(json: any) {
    const job = new Job()

    job.setId(json.id)
    job.setName(json.name)
    job.setStatus(json.status)
    job.setCreatedAt(new Date(json.createdAt))
    job.setUpdatedAt(new Date(json.updatedAt))

    if (json.resolvedAt) {
      job.setResolvedAt(new Date(json.resolvedAt))
    }

    if (json.image) {
      job.setImage(json.image)
    }
    return job
  }

  toJson() {
    if (!this.id || !this.name || !this.status || !this.createdAt || !this.updatedAt) {
      throw new Error('Id, name, status, createdAt, and updatedAt are required')
    }
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      resolvedAt: this.resolvedAt,
      image: this.image,
      status: this.status,
    }
  }

  beforeInsert(id: number) {
    if (!this.name || !this.status) {
      throw new Error('Name and status are required')
    }
    this.setId(id)
    this.setCreatedAt(new Date())
    this.setUpdatedAt(new Date())
  }

  beforeUpdate() {
    this.setUpdatedAt(new Date())
  }

  getId() {
    return this.id
  }

  protected setId(id: number) {
    this.id = id
  }

  getName() {
    return this.name
  }

  setName(name: string) {
    this.name = name
  }

  getCreatedAt() {
    return this.createdAt
  }

  private setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt
  }

  getUpdatedAt() {
    return this.updatedAt
  }

  setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt
  }

  getResolvedAt() {
    return this.resolvedAt
  }

  setResolvedAt(resolvedAt: Date) {
    this.resolvedAt = resolvedAt
  }

  getImage() {
    return this.image
  }

  setImage(image: IImage) {
    this.image = image
  }

  getStatus() {
    return this.status
  }

  setStatus(status: JobStatus) {
    this.status = status
  }

  serialize() {
    if (this.getStatus() === JobStatus.Pending) {
      return {
        id: this.getId(),
        status: this.getStatus(),
        name: this.getName(),
        createdAt: this.getCreatedAt(),
      }
    }
    return this.toJson()
  }
}
