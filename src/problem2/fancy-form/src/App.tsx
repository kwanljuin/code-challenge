import { CurrencySwapForm } from './components/CurrencySwapForm'
import { Toaster } from './components/ui/sonner'
import './App.css'

function App() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-neutral-950 relative py-12">
      {/* Background elements for extra "wow" */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="relative z-10 w-full px-4 flex flex-col items-center">
        <header className="mb-12 text-center space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white">
            Crypto<span className="text-blue-500">Swap</span>
          </h1>
          <p className="text-neutral-500 font-medium max-w-sm mx-auto">
            Trade assets instantly with institutional-grade precision.
          </p>
        </header>

        <CurrencySwapForm />

        <footer className="mt-16 text-neutral-600 text-xs font-medium space-x-6">
          <a href="#" className="hover:text-white text-blue-700">Terms</a>
          <a href="#" className="hover:text-white text-blue-700">Privacy</a>
          <a href="#" className="hover:text-white text-blue-700">Support</a>
        </footer>
      </div>
      <Toaster position="bottom-right" theme="dark" closeButton richColors />
    </div>
  )
}

export default App
