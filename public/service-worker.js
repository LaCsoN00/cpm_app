
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { CacheableResponse } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ request }) => request.destination === 'api',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponse({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24, 
      }),
    ],
  })
);

// Mise en cache des fichiers CSS, JS et images avec une stratégie CacheFirst
registerRoute(
  ({ request }) => ['style', 'script', 'image'].includes(request.destination),
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30,
      }),
    ],
  })
);

// Gérer la synchronisation des tâches lorsque la connexion est rétablie
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    event.waitUntil(syncTasks());
  }
});

// Fonction pour synchroniser les tâches
async function syncTasks() {
  const tasks = await getTasksFromIndexedDB();
  if (tasks.length > 0) {
    // Envoyer les tâches stockées dans IndexedDB à votre API
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(tasks),
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        console.log('Tâches synchronisées avec succès.');
        // Optionnel : Effacer les tâches après synchronisation
        await clearTasksFromIndexedDB();
      } else {
        console.error('Erreur de synchronisation des tâches.', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la tentative de synchronisation des tâches.', error);
    }
  }
}

// Fonction pour récupérer les tâches depuis IndexedDB
async function getTasksFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('tasksDB', 1);

    request.onerror = () => reject('Erreur d\'ouverture de la base de données.');

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(['tasks'], 'readonly');
      const store = transaction.objectStore('tasks');
      
      const allTasks = store.getAll();
      allTasks.onsuccess = () => {
        resolve(allTasks.result);
      };
      allTasks.onerror = () => reject('Erreur lors de la récupération des tâches.');
    };
  });
}

// Fonction pour effacer les tâches après synchronisation
async function clearTasksFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('tasksDB', 1);

    request.onerror = () => reject('Erreur d\'ouverture de la base de données.');

    request.onsuccess = () => {
      const db = request.result; // Même logique pour accéder à la base de données
      const transaction = db.transaction(['tasks'], 'readwrite');
      const store = transaction.objectStore('tasks');
      
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();  // Résolution une fois les tâches effacées
      clearRequest.onerror = () => reject('Erreur lors de l\'effacement des tâches.');
    };
  });
}
