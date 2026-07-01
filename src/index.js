import './index.css'
import App from './app';
import { registerSW } from './registerSW';

if (USE_SW) {
    registerSW();
}

document.addEventListener("DOMContentLoaded", () => {
    let app = new App();
    app.load();
});