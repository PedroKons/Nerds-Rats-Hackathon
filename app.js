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

app.get('/user-rank-clicks/:id', async (req, res) => {
    const { id } = req.params
    const { data, error } = await supabase.query('SELECT * FROM metrics WHERE id = $1', [id])
    
    if (error) {
        res.status(500).send(error)
    } else {
        res.status(200).send(data)
    }
})

app.get('/rank-clicks', async (req, res) => {
const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .order('quant_clicks', { ascending: false })
    .limit(10)

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

