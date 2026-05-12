import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-inverse-surface w-full py-lg px-gutter">
      <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-start gap-md">
        <div className="flex flex-col gap-sm md:max-w-xs">
          <span className="font-display-lg text-headline-md font-bold text-on-primary">SmartDoc AI</span>
          <p className="font-body-md text-body-md text-inverse-on-surface">
            Empowering patients and doctors through clinical AI innovation. Your health, simplified.
          </p>
          <div className="flex items-center gap-xs px-sm py-xs bg-white/5 rounded-lg w-fit">
            <span className="material-symbols-outlined text-[18px] text-secondary-fixed">verified</span>
            <span className="text-label-sm text-inverse-on-surface">Powered by AI</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-xl">
          <div className="flex flex-col gap-xs">
            <span className="font-bold text-on-primary mb-xs">Company</span>
            <Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors duration-200 text-body-md">About Us</Link>
            <Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors duration-200 text-body-md">Contact</Link>
            <Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors duration-200 text-body-md">Support</Link>
          </div>
          <div className="flex flex-col gap-xs">
            <span className="font-bold text-on-primary mb-xs">Legal</span>
            <Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors duration-200 text-body-md">Privacy Policy</Link>
            <Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors duration-200 text-body-md">Terms of Service</Link>
            <Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed transition-colors duration-200 text-body-md">FAQ</Link>
          </div>
        </div>

        <div className="w-full md:w-auto mt-md md:mt-0 flex flex-col gap-sm border-t border-white/10 md:border-none pt-md md:pt-0">
          <span className="text-label-sm text-inverse-on-surface">© 2024 SmartDoc AI. All rights reserved.</span>
          <div className="flex gap-sm">
            <Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed">
              <span className="material-symbols-outlined">share</span>
            </Link>
            <Link href="#" className="text-inverse-on-surface hover:text-secondary-fixed">
              <span className="material-symbols-outlined">mail</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
