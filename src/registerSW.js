export async function registerSW() {
    if (!('serviceWorker' in navigator)) {
        return null;
    }

    let reloading = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (reloading) return;

        reloading = true;
        window.location.reload();
    });

    try {
        const registration = await navigator.serviceWorker.register('./sw.js', {
            updateViaCache: 'none',
        });

        await registration.update();

        return registration;
    } catch (error) {
        console.error('Service Worker registration failed:', error);
        return null;
    }
}