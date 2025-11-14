import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/qQUip0dJPqrrPryE/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">
          Connect Founders, Investors, and Mentors
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-700">
          A transparent, data-driven platform to reduce friction in early-stage funding.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="#get-started" className="px-5 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">Get Started</a>
          <a href="/test" className="px-5 py-3 rounded-md bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors">Check System</a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/70" />
    </section>
  )
}
