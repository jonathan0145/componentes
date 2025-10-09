class NotificationService {
  constructor() {
    this.permission = 'default';
    this.isSupported = 'Notification' in window;
    this.notificationSound = null;
  }

  // Solicitar permiso para notificaciones
  async requestPermission() {
    if (!this.isSupported) {
      console.warn('Este navegador no soporta notificaciones');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error solicitando permisos de notificación:', error);
      return false;
    }
  }

  // Verificar si las notificaciones están permitidas
  areNotificationsEnabled() {
    return this.isSupported && this.permission === 'granted';
  }

  // Mostrar notificación de nuevo mensaje
  showMessageNotification(message, conversation) {
    if (!this.areNotificationsEnabled()) {
      return;
    }

    const title = `Nuevo mensaje de ${message.sender.name}`;
    const options = {
      body: message.type === 'file' 
        ? `📎 ${message.file.name}` 
        : message.text,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `message-${conversation.id}`,
      renotify: true,
      requireInteraction: false,
      data: {
        conversationId: conversation.id,
        messageId: message.id,
        type: 'new_message'
      }
    };

    const notification = new Notification(title, options);

    // Auto cerrar después de 5 segundos
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Manejar click en la notificación
    notification.onclick = () => {
      window.focus();
      // Navegar al chat si es necesario
      if (window.location.pathname !== '/chat') {
        window.location.href = `/chat?conversation=${conversation.id}`;
      }
      notification.close();
    };

    // Reproducir sonido si está habilitado
    this.playNotificationSound();
  }

  // Mostrar notificación de nueva oferta
  showOfferNotification(offer, property) {
    if (!this.areNotificationsEnabled()) {
      return;
    }

    const title = offer.type === 'received' 
      ? `Nueva oferta recibida` 
      : `Respuesta a tu oferta`;
      
    const options = {
      body: `${property.title} - $${this.formatPrice(offer.amount)}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: `offer-${offer.id}`,
      requireInteraction: true,
      data: {
        offerId: offer.id,
        propertyId: property.id,
        type: 'new_offer'
      }
    };

    const notification = new Notification(title, options);

    notification.onclick = () => {
      window.focus();
      // Navegar a ofertas o propiedad
      window.location.href = `/properties/${property.id}`;
      notification.close();
    };

    this.playNotificationSound();
  }

  // Reproducir sonido de notificación
  playNotificationSound() {
    try {
      if (!this.notificationSound) {
        // Crear sonido de notificación usando Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    } catch (error) {
      console.warn('No se pudo reproducir el sonido de notificación:', error);
    }
  }

  // Limpiar notificaciones por tag
  clearNotifications(tag) {
    // Note: No hay API estándar para esto, pero podemos usar service workers
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAR_NOTIFICATIONS',
        tag: tag
      });
    }
  }

  // Formatear precio
  formatPrice(amount) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Configurar Service Worker para notificaciones en segundo plano
  async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado para notificaciones');
        return registration;
      } catch (error) {
        console.error('Error registrando Service Worker:', error);
      }
    }
  }

  // Enviar notificación push cuando la app esté en segundo plano
  sendPushNotification(data) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_NOTIFICATION',
        data: data
      });
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;