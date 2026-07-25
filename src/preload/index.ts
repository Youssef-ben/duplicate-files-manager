import { cliPreload, globalPreload, themePreload } from '@handlers/index';
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('appApi', {
  global: globalPreload(),
  cli: cliPreload(),
  theme: themePreload()
});
