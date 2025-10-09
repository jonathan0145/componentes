// pushNotifications.js
// Utilidad para gestionar permisos y suscripción a notificaciones push

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  const permission = await Notification.requestPermission();
  return permission; // 'granted', 'denied', 'default'
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js');
      return reg;
    } catch (err) {
      return null;
    }
  }
  return null;
}

export async function subscribeUserToPush(registration, publicVapidKey) {
  if (!registration || !('PushManager' in window)) return null;
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    });
    return subscription;
  } catch (err) {
    return null;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
