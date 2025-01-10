import { inject } from '@adonisjs/core'
import transmit from '@adonisjs/transmit/services/main'
import Job from '#models/job'

enum JobEvent {
  JobCreated = 'JOB_CREATED',
  JobResolved = 'JOB_RESOLVED',
}

@inject()
export class JobEventService {
  constructor() {}

  private broadcast(event: JobEvent, payload: Record<string, string | number | null>) {
    transmit.broadcast('jobs', { event, payload })
  }

  onJobCreated(job: Job) {
    const id = job.getId()
    if (!id) {
      return
    }
    this.broadcast(JobEvent.JobCreated, { id })
  }

  onJobResolved(job: Job) {
    const id = job.getId()
    if (!id) {
      return
    }
    this.broadcast(JobEvent.JobResolved, { id, name: job.getName() })
  }
}
