import { EncryptStorage } from 'encrypt-storage';
import { TOKEN_KEY } from '@/actions/variables';

export const Storage = new EncryptStorage(TOKEN_KEY, { prefix: '@' });