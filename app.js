import Fastify from 'fastify'
import supabase from './supabase.js'

const app = Fastify()

app.get('/', async (req, res) => {
    const { data, error } = await supabase.from('metrics').select('*')
    if (error) {
        res.status(500).send(error)
    } else {
        res.status(200).send(data)
    }
})

app.listen({ port: 3000 }, (err) => {
    if (err) {
        console.error('Error starting server:', err)
        process.exit(1)
    }
    console.log('Server is running on port 3000')
})

