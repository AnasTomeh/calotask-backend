import { JobService } from '#services/job_service'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import { createJobValidator } from '#validators/job'

@inject()
export default class JobsController {
  constructor(private jobService: JobService) {}

  list({ response }: HttpContext) {
    const jobs = this.jobService.list()
    return response.json({
      jobs,
    })
  }

  get({ params, response }: HttpContext) {
    const job = this.jobService.find(params.id)
    return response.json({
      job,
    })
  }

  async create({ request, response }: HttpContext) {
    const data = request.all()
    const payload = await createJobValidator.validate(data)
    const job = this.jobService.create({ name: payload.name })
    this.jobService.scheduleForResolve(job)
    return response.json({
      jobId: job.getId(),
    })
  }
}
