import Fastify from 'fastify'
import supabase from './supabase.js'

const app = Fastify()

app.post('/metrics', async (req, res) => {
    const { body } = req

    // Validate if body exists
    if (!body) {
        return res.status(400).send({ error: 'Request body is required' })
    }

    if (!body.user_github || !body.email || !body.quant_clicks || !body.quant_dist) {
        return res.status(400).send({ error: 'Missing required fields' })
    }

    if (typeof body.user_github !== 'string' || typeof body.email !== 'string' || typeof body.quant_clicks !== 'number' || typeof body.quant_dist !== 'number') {
        return res.status(400).send({ error: 'Invalid data types' })
    }

    if (body.quant_clicks < 0 || body.quant_dist < 0) {
        return res.status(400).send({ error: 'quant_clicks and quant_dist must be positive numbers' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
        return res.status(400).send({ error: 'Invalid email format' })
    }

    //Validar se se existe um usuario com o mesmo email
    const { data: existingUser, error: searchError } = await supabase
        .from('metrics')
        .select('*')
        .eq('email', body.email)
        .single()

    if (searchError && searchError.code !== 'PGRST116') {
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
                    quant_dist: existingUser.quant_dist + body.quant_dist
                })
                .eq('email', body.email)
                .select()

            if (error) {
                return res.status(500).send({ error: error.message })
            }
            result = data
        } else {
            // Insert new user
            const { data, error } = await supabase
                .from('metrics')
                .insert([body])
                .select()

            if (error) {
                return res.status(500).send({ error: error.message })
            }
            result = data
        }

        return res.status(200).send(result)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
})

app.listen({ port: 3000 }, (err) => {
    if (err) {
        console.error('Error starting server:', err)
        process.exit(1)
    }
    console.log('Server is running on port 3000')
})

