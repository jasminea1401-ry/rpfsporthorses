import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"
import { getSiteSettings } from "@/lib/sanity/queries"

export async function Footer() {
  const settings = await getSiteSettings()
  const barnName = settings?.barnName || "RPF Sporthorses"
  const address = settings?.address || "Raeford, North Carolina"
  const phone = settings?.phone || "(XXX) XXX-XXXX"
  const email = settings?.email || "info@rpfsporthorses.com"
  const facebook = settings?.facebook
  const instagram = settings?.instagram

  return (
    <footer className="bg-zinc-950 text-zinc-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-zinc-950 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif text-lg font-bold">
                RPF
              </div>
              <div>
                <div className="text-white font-serif text-lg font-bold">{barnName}</div>
                <div className="text-amber-400 text-xs tracking-widest uppercase">Raeford, NC</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 text-zinc-400">
              A premier equestrian training facility in the heart of Raeford, North Carolina.
              Dedicated to developing horse and rider partnerships at every level.
            </p>
            <div className="flex gap-3">
              {facebook && (
                <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors text-white">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              )}
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors text-white">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/gallery", label: "Gallery" },
                { href: "/awards", label: "Awards" },
                { href: "/show-team", label: "Show Team" },
                { href: "/trial", label: "Book Trial Lesson" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <a href={`tel:${phone}`} className="hover:text-amber-400 transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-amber-400 transition-colors">
                  {email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>© {new Date().getFullYear()} RPF Sporthorses. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-stone-300 transition-colors">Client Portal</Link>
            <Link href="/login?trainer=true" className="hover:text-stone-300 transition-colors">Trainer Login</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
