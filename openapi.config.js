import { generateService } from '@umijs/openapi'

generateService({
  requestLibPath: "import request from '@/request'",
  schemaPath: 'http://localhost:8009/SynoVision/v2/api-docs',
  serversPath: './src',
})
