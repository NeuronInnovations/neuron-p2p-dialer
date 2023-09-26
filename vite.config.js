export default {
  base:'/neuron-p2p-dialer/',
  
  build: {
    target: 'es2020',
    outDir: './docs'
  },
  optimizeDeps: {
    esbuildOptions: { target: 'es2020', supported: { bigint: true } }
  }
}
