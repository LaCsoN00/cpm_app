'use client'

import { useState, useEffect } from 'react'
import { subscribeUser, unsubscribeUser, sendNotification } from './actions'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      registerServiceWorker()
    }
  }, [])

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      const sub = await registration.pushManager.getSubscription()
      setSubscription(sub)
    } catch (error) {
      console.error('Service Worker Registration Failed:', error)
    }
  }

  async function subscribeToPush() {
    setLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
        ),
      })
      setSubscription(sub)
      await subscribeUser(JSON.parse(JSON.stringify(sub)))
    } catch (error) {
      console.error('Subscription Failed:', error)
    }
    setLoading(false)
  }

  async function unsubscribeFromPush() {
    setLoading(true)
    try {
      await subscription?.unsubscribe()
      setSubscription(null)
      await unsubscribeUser()
    } catch (error) {
      console.error('Unsubscription Failed:', error)
    }
    setLoading(false)
  }

  async function sendTestNotification() {
    if (!message.trim()) return
    try {
      await sendNotification(message)
      setMessage('')
    } catch (error) {
      console.error('Notification Failed:', error)
    }
  }

  if (!isSupported) {
    return <p className="text-center text-red-500">Les notifications push ne sont pas supportées sur ce navigateur.</p>
  }

  return (
    <div className="p-4 bg-white shadow-lg rounded-xl">
      <h3 className="text-lg font-bold text-violet-600">Notifications Push</h3>
      {subscription ? (
        <>
          <p className="text-green-600">Vous êtes abonné aux notifications.</p>
          <button className="btn btn-error mt-2" onClick={unsubscribeFromPush} disabled={loading}>
            {loading ? 'Désabonnement...' : 'Se désabonner'}
          </button>
          <div className="mt-4">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Entrez un message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button className="btn btn-primary mt-2 w-full" onClick={sendTestNotification} disabled={!message.trim()}>
              Envoyer Notification
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-600">Vous n&apos;êtes pas encore abonné.</p>
          <button className="btn btn-success mt-2" onClick={subscribeToPush} disabled={loading}>
            {loading ? 'Abonnement...' : 'S’abonner'}
          </button>
        </>
      )}
    </div>
  )
}

function InstallPrompt() {
  const [isStandalone, setIsStandalone] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true)
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    })
  }, [])

  async function installPWA() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  if (isStandalone) return null

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-lg text-center">
      <h3 className="text-lg font-bold text-violet-600">Installer l&apos;App</h3>
      <button className="btn btn-primary mt-2" onClick={installPWA} disabled={!deferredPrompt}>
        Ajouter à l&apos;écran d&apos;accueil
      </button>
    </div>
  )
}

export default function Page() {
  return (
    <div className="p-6 space-y-6">
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  )
}
