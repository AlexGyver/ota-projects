import './index.css'
import App from './app';

if (USE_SW) {
    registerSW();
}

document.addEventListener("DOMContentLoaded", () => {
    let app = new App();
    app.load();
});