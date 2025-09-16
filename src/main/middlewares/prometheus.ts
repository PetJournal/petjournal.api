import type { RequestHandler } from 'express'
import promBundle from 'express-prom-bundle'

export const prometheus = promBundle({ includeMethod: true, includePath: true }) as unknown as RequestHandler
