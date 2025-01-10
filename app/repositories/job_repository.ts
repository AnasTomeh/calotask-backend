import { FSDB } from 'file-system-db'
import Job from '#models/job'
import { IJob } from '#types/types'

export default class JobRepository {
  private db: FSDB

  constructor() {
    this.db = new FSDB('db/jobs.json', false)
  }

  all() {
    const jobs = (this.db.get('jobs') || []) as IJob[]
    return jobs.map((job) => {
      return Job.fromJson(job)
    })
  }

  find(id: number) {
    const item = this.db.get(`jobs.${id - 1}`)
    if (!item) {
      return null
    }
    return Job.fromJson(item)
  }

  insert(job: Job) {
    const jobs = this.db.get('jobs') || []
    const newId = jobs.length + 1
    job.beforeInsert(newId)
    jobs.push(job.toJson())
    this.db.set('jobs', jobs)
    return job
  }

  update(job: Job) {
    const jobs = (this.db.get('jobs') || []) as IJob[]
    const index = jobs.findIndex((j) => j.id === job.getId())
    if (index === -1) {
      throw new Error('Job not found')
    }
    job.beforeUpdate()
    jobs[index] = job.toJson()
    this.db.set('jobs', jobs)
    return job
  }
}
