import type { Request, Response } from 'express'
import { JobModel } from '../models/job'
import type { JobFilters } from '../types'

export class JobController {
  // GET /jobs
  // Query params tipados
  static async getAll(req: Request<{}, {}, {}, JobFilters>, res: Response): Promise<void> {
    const { tech, modality, level } = req.query

    // No está mal lo que has hecho, solo vamos a agregar filtro por `limit` y `offset` para que te quede en el ejercicio
    const rawLimit = Number(req.query.limit)
    const rawOffset = Number(req.query.offset)

    // con esto, verificamos que no sea NaN, Infinity, -Infinity, y que sea entero y mayor a cero
    const limit =
      Number.isInteger(rawLimit) && rawLimit > 0
        ? Math.min(rawLimit, 100)
        : 10 // Aquí podemos usar una variable global para tener definido este valor en un solo sitio. Lo mismo con el valor máximo, y los valores de offset

    const offset =
      Number.isInteger(rawOffset) && rawOffset >= 0
        ? rawOffset
        : 0

    const jobs = await JobModel.getAll({ tech, modality, level }, { limit, offset })
    res.json(jobs)
  }

  // GET /jobs/:id
  // Params tipados
  static async getById(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params
    const job = await JobModel.getById(id)

    if (!job) {
      res.status(404).json({ message: 'Job not found' })
      return
    }

    res.json(job)
  }

  // POST /jobs
  // El body ya viene validado por el middleware
  static async create(req: Request, res: Response): Promise<void> {
    const newJob = await JobModel.create(req.body)
    res.status(201).json(newJob)
  }

  // PATCH /jobs/:id
  static async update(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params
    const updatedJob = await JobModel.update(id, req.body)

    if (!updatedJob) {
      res.status(404).json({ message: 'Job not found' })
      return
    }

    res.json(updatedJob)
  }

  // DELETE /jobs/:id
  static async delete(req: Request<{ id: string }>, res: Response): Promise<void> {
    const { id } = req.params
    const deleted = await JobModel.delete(id)

    if (!deleted) {
      res.status(404).json({ message: 'Job not found' })
      return
    }

    res.status(204).send()
  }
}
