// pushNotifications.js
// Utilidad para gestionar permisos y suscripción a notificaciones push

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

// Configuración de tu proyecto Firebase (REEMPLAZA estos valores por los de tu proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyACEebbBY3AoruPVZa9J4xZLKt_TYMBfYA",
  authDomain: "inmotech-1b4fd.firebaseapp.com",
  projectId: "inmotech-1b4fd",
  storageBucket: "inmotech-1b4fd.firebasestorage.app",
  messagingSenderId: "212809139213",
  appId: "1:212809139213:web:166b445384a871895b8144",
  measurementId: "G-CF1HKR1523"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  const permission = await Notification.requestPermission();
  return permission; // 'granted', 'denied', 'default'
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registrado:', reg);
      return reg;
    } catch (err) {
      console.error('Error registrando service worker:', err);
      return null;
    }
  }
  return null;
}


// NUEVO: obtener el token FCM real usando Firebase
export async function getFcmToken() {
  try {
    const registration = await registerServiceWorker();
    const token = await getToken(messaging, {
      vapidKey: 'BCVQQ8YhP96EuizZql4yC6ejDKPuZkGa9PcEnBHENSiV9Wum4vyMGdYpKWTDygFhzxSO7uUqij4OPVq9lvfdnUk',
      serviceWorkerRegistration: registration
    });
    console.log('Token FCM obtenido:', token);
    return token;
  } catch (err) {
    console.error('Error obteniendo token FCM:', err);
    return null;
  }
}
