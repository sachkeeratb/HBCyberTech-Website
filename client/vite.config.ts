import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

<<<<<<< HEAD
=======
// https://vitejs.dev/config/
>>>>>>> 8fbf333 (First commit)
export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
			usePolling: true
		}
	}
});
