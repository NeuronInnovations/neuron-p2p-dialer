export default {
  base:'/neuron-p2p-dialer/',
  build: {
    target: 'es2020'
  },
  optimizeDeps: {
    esbuildOptions: { target: 'es2020', supported: { bigint: true } }
  }
}
