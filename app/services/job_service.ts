import JobRepository from '#repositories/job_repository'
import { JobStatus } from '#types/types'
import { inject } from '@adonisjs/core'
import Job from '#models/job'
import { JobEventService } from '#services/job_event_service'
import { UnsplashService } from '#services/unsplash_service'
import logger from '@adonisjs/core/services/logger'

@inject()
export class JobService {
  constructor(
    private jobRepository: JobRepository,
    private jobEventService: JobEventService,
    private unsplashService: UnsplashService
  ) {}

  list() {
    const jobs = this.jobRepository.all()
    const sortedJobs = jobs.sort((a, b) => {
      const aCreatedAt = a.getCreatedAt()
      const bCreatedAt = b.getCreatedAt()
      if (!aCreatedAt || !bCreatedAt) {
        return 0
      }
      return bCreatedAt.getTime() - aCreatedAt.getTime()
    })
    return sortedJobs.map((job) => {
      return job.serialize()
    })
  }

  find(id: number) {
    const job = this.jobRepository.find(id)
    if (!job) {
      return null
    }
    return job.serialize()
  }

  create({ name }: { name: string }) {
    const job = new Job()
    job.setName(name)
    job.setStatus(JobStatus.Pending)
    this.jobRepository.insert(job)
    this.jobEventService.onJobCreated(job)
    return job
  }

  scheduleForResolve(job: Job) {
    const min = 5
    const max = 5 * 60
    const step = 5
    const delay = Math.floor((Math.random() * (max - min)) / step) * step * 1000 + min * 1000
    const expectedResolveAt = new Date(Date.now() + delay)
    logger.info(
      `Scheduling job ${job.getId()} for resolve in ${delay}ms at ${expectedResolveAt.toISOString()}`
    )
    setTimeout(() => {
      ;(async () => {
        try {
          await this.resolve(job)
        } catch (e) {
          console.error(e)
        }
      })()
    }, delay)
  }

  async resolve(job: Job) {
    const photo = await this.unsplashService.getRandomPhoto()
    job.setImage({
      full: photo.urls.full,
      regular: photo.urls.regular,
      small: photo.urls.small,
      thumb: photo.urls.thumb,
    })
    job.setStatus(JobStatus.Resolved)
    job.setResolvedAt(new Date())
    this.jobRepository.update(job)
    this.jobEventService.onJobResolved(job)
  }
}
