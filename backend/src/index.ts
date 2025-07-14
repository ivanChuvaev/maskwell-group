import 'reflect-metadata'
import './env'
import { AppDataSource } from './data-source'
import express from 'express'
import { routes } from './routes'
import cors from 'cors'
import { initializeDb } from './initialize-db'
import path from 'path'

AppDataSource.initialize()
    .then(async () => {
        if (process.env.INITIALIZE_DB === 'true') {
            await initializeDb()
        }

        const app = express()

        app.use(express.json())

        app.use(cors())

        app.use(express.static(path.resolve('..', 'frontend', 'dist')))

        for (const route of routes) {
            app[route.method](route.path, route.action)
        }

        app.listen(Number(process.env.PORT))

        console.log(`Listening on port ${process.env.PORT}`)
    })
    .catch((error) => console.log(error))
