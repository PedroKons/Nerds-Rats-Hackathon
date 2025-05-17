import Fastify from 'fastify'
import supabase from './supabase.js'
import dotenv from 'dotenv'
import cors from '@fastify/cors'

dotenv.config()

const app = Fastify()

await app.register(cors, {
    origin: true
})

app.post('/metrics', async (req, res) => {
    const { body } = req

    // Validate if body exists
    if (!body) {
        console.log('Request body is required')
        return res.status(400).send({ error: 'Request body is required' })
    }

    if (!body.user_github || !body.email || !body.quant_clicks || !body.quant_dist || !body.quant_scrow || !body.quant_keys) {
        console.log('Missing required fields', body)
        return res.status(400).send({ error: 'Missing required fields' })
    }

    if (typeof body.user_github !== 'string' || typeof body.email !== 'string' || typeof body.quant_clicks !== 'number' || typeof body.quant_dist !== 'number' || typeof body.quant_scrow !== 'number' || typeof body.quant_keys !== 'number') {
        console.log('Invalid data types')
        return res.status(400).send({ error: 'Invalid data types' })
    }

    if (body.quant_clicks < 0 || body.quant_dist < 0 || body.quant_scrow < 0 || body.quant_keys < 0) {
        console.log('Invalid data types')
        return res.status(400).send({ error: 'quant_clicks, quant_dist, quant_scrow and quant_keys must be positive numbers' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
        console.log('Invalid email format')
        return res.status(400).send({ error: 'Invalid email format' })
    }

    //Validar se se existe um usuario com o mesmo email
    const { data: existingUser, error: searchError } = await supabase
        .from('metrics')
        .select('*')
        .eq('email', body.email)
        .single()

    if (searchError && searchError.code !== 'PGRST116') {
        console.log('Error searching for user')
        return res.status(500).send({ error: searchError.message })
    }

    try {
        let result
        if (existingUser) {
            // Update existing user by adding new values
            const { data, error } = await supabase
                .from('metrics')
                .update({
                    quant_clicks: existingUser.quant_clicks + body.quant_clicks,
                    quant_dist: existingUser.quant_dist + body.quant_dist,
                    quant_scrow: existingUser.quant_scrow + body.quant_scrow,
                    quant_keys: existingUser.quant_keys + body.quant_keys
                })
                .eq('email', body.email)
                .select()

            if (error) {
                console.log('Error updating user')
                return res.status(500).send({ error: error.message })
            }
            console.log('User updated', data)
            result = data
        } else {
            // Insert new user
            const { data, error } = await supabase
                .from('metrics')
                .insert([body])
                .select()

            if (error) {
                console.log('Error inserting user')
                return res.status(500).send({ error: error.message })
            }
            console.log('User inserted', data)
            result = data
        }

        return res.status(200).send(result)
    } catch (error) {
        console.log('Error in the post request', error)
        return res.status(500).send({ error: error.message })
    }
})

// Endpoint para buscar métricas ordenadas
// app.get('/metrics/ranking', async (req, res) => {
//     try {
//         const { data, error } = await supabase
//             .from('metrics')
//             .select(`
//                 email,
//                 sum(quant_keys) as total_keys,
//                 sum(quant_dist) as total_dist,
//                 sum(quant_clicks) as total_clicks,
//                 sum(quant_scrow) as total_scrow,
//                 (sum(quant_keys) * 4 + sum(quant_dist) * 3 + sum(quant_clicks) * 2 + sum(quant_scrow) * 1) as total_score
//             `)
//             .group('email')
//             .order('total_score', { ascending: false })

//         if (error) {
//             return res.status(500).send({ error: error.message })
//         }

//         return res.status(200).send(data)
//     } catch (error) {
//         return res.status(500).send({ error: error.message })
//     }
// })

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

const PORT = process.env.PORT || 3000

app.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
    if (err) {
        console.error('Error starting server:', err)
        process.exit(1)
    }
    console.log(`Server is running on port ${PORT}`)
})

