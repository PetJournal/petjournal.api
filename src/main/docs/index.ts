import paths from './paths'
import components from './components'
import schemas from './schemas'

export default {
  openapi: '3.0.0',
  info: {
    title: 'PetJournal',
    description: '',
    version: '1.0.0',
    license: {
      name: 'MIT',
      url: 'https://spdx.org/licenses/MIT.html'
    }
  },
  servers: [{
    url: '/api',
    description: 'Main Server'
  }],
  tags: [
    {
      name: 'guardian',
      description: 'operations about guardian'
    },
    {
      name: 'recovery-password',
      description: 'operations about recovery password'
    }
  ],
  paths,
  schemas,
  components
}
