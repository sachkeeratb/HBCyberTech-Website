import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

<<<<<<< HEAD
<<<<<<< HEAD
=======
// https://vitejs.dev/config/
>>>>>>> 8fbf333 (First commit)
=======
>>>>>>> 3dde0c9 (Add a server folder)
export default defineConfig({
	plugins: [react()],
	server: {
		watch: {
			usePolling: true
		}
	}
});
