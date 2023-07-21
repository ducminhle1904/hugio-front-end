import { setRemoteDefinitions } from '@nx/angular/mf';
import { environment } from './environments/environment';

if (environment.production) {
  fetch('/assets/module-federation.manifest.prod.json')
    .then((res) => res.json())
    .then((definitions) => setRemoteDefinitions(definitions))
    .then(() => import('./bootstrap').catch((err) => console.error(err)));
} else {
  fetch('/assets/module-federation.manifest.json')
    .then((res) => res.json())
    .then((definitions) => setRemoteDefinitions(definitions))
    .then(() => import('./bootstrap').catch((err) => console.error(err)));
}
