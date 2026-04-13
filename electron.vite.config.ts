import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@shared': resolve('src/shared'),
        '@pkg': resolve('package.json'),
        '@resources': resolve('resources'),
        '@handlers': resolve('src/handlers')
      }
    }
  },
  preload: {
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@shared': resolve('src/shared'),
        '@pkg': resolve('package.json'),
        '@resources': resolve('resources'),
        '@handlers': resolve('src/handlers')
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@handlers': resolve('src/handlers'),
        '@assets': resolve('src/renderer/src/assets'),
        '@components': resolve('src/renderer/src/components'),
        '@context': resolve('src/renderer/src/context'),
        '@hooks': resolve('src/renderer/src/hooks'),
        '@pages': resolve('src/renderer/src/pages'),
        '@stores': resolve('src/renderer/src/stores'),
        '@styles': resolve('src/renderer/src/styles'),
        '@renderer': resolve('src/renderer/src'),
        '@utils': resolve('src/renderer/src/utils')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
