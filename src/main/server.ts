import './config/module-alias'
import 'tsconfig-paths/register'
import app from '@/main/config/app'
import env from '@/main/config/env'

app.listen(env.port, () => { console.log(`Server running at http://localhost:${env.port}`) })
