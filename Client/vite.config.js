import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const baseFolder = env.APPDATA !== undefined && env.APPDATA !== ''
  ? `${env.APPDATA}/ASP.NET/https` 
  : `${env.HOME}/.aspnet/https`;

const certificateName = "Client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(baseFolder)) {
  fs.mkdirSync(baseFolder, { recursive: true });
}

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
  if (0 !== child_process.spawnSync('dotnet', [
    'dev-certs',
    'https',
    '--export-path',
    certFilePath,
    '--format',
    'Pem',
    '--no-password',
  ], { stdio: 'inherit', }).status) {
    throw new Error("Could not create certificate.");
  }
}

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` 
  : env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] 
  : 'https://localhost:7128';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [plugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 63446,
    https: false,
    // https: {
    //   key: fs.readFileSync(keyFilePath),
    //   cert: fs.readFileSync(certFilePath),
    // }
    proxy: {
      '^/api/app-setting': { target, secure: false },
      '^/api/signin-ad': { target, secure: false },
      '^/api/refresh': { target, secure: false },
      '^/api/email-template-active': { target, secure: false },
      '^/api/email-template-count': { target, secure: false },
      '^/api/email-templates': { target, secure: false },
      '^/api/email-template': { target, secure: false },
      '^/api/user-info': { target, secure: false },
      '^/api/user-admins': { target, secure: false },
      '^/api/user-admin': { target, secure: false },
      '^/api/user': { target, secure: false },
    },
  }
})
