"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, ChevronDown, User, LogOut, Calendar } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { Profile } from "@/types/database"

const navLinks = [
  { href: "/", label: "Home" },
  {
    href: "/about",
    label: "About",
    children: [
      { href: "/about", label: "About Us" },
      { href: "/show-team", label: "Show Team" },
      { href: "/lesson-horses", label: "Lesson Horses" },
    ],
  },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/awards", label: "Awards" },
  { href: "/testimonials", label: "Testimonials" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<Profile | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [navDropdown, setNavDropdown] = useState<string | null>(null)
  const [mobileNavDropdown, setMobileNavDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        const { data } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()
        setUser(data)
      }
    }
    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getUser()
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/")
  }

  const isHomePage = pathname === "/"

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled || !isHomePage
        ? "bg-zinc-950/97 backdrop-blur-sm shadow-lg"
        : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full bg-zinc-950 border border-amber-500/30 flex items-center justify-center text-amber-400 font-serif text-lg font-bold group-hover:border-amber-400 transition-colors">
              RPF
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-serif text-lg font-bold leading-tight">RPF Sporthorses</div>
              <div className="text-amber-400 text-xs tracking-widest uppercase">Raeford, NC</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setNavDropdown(link.href)}
                  onMouseLeave={() => setNavDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1",
                      pathname === link.href || link.children.some((c) => c.href === pathname)
                        ? "text-amber-400"
                        : "text-stone-200 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {link.label}
                    <ChevronDown className="h-3 w-3" />
                  </Link>
                  {navDropdown === link.href && (
                    <div className="absolute left-0 top-full pt-1 w-48">
                      <div className="rounded-md bg-zinc-950/97 backdrop-blur-sm shadow-lg border border-zinc-800 py-1">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block px-4 py-2 text-sm transition-colors",
                              pathname === child.href
                                ? "text-amber-400"
                                : "text-stone-200 hover:text-white hover:bg-white/10"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-amber-400"
                      : "text-stone-200 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/trial">
              <Button variant="gold" size="sm">Book a Trial Lesson</Button>
            </Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-stone-200 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-sm font-medium">
                    {user.full_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm">{user.full_name?.split(" ")[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg border border-stone-200 py-1">
                    {(user.role === "trainer" || user.role === "owner") && (
                      <Link href="/trainer" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50" onClick={() => setDropdownOpen(false)}>
                        <Calendar className="h-4 w-4" /> Trainer Dashboard
                      </Link>
                    )}
                    {(user.role === "owner" || user.role === "student") && (
                      <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50" onClick={() => setDropdownOpen(false)}>
                        <Calendar className="h-4 w-4" /> Book / My Lessons
                      </Link>
                    )}
                    <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50" onClick={() => setDropdownOpen(false)}>
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <hr className="my-1 border-stone-200" />
                    <button onClick={handleSignOut} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-stone-400 text-stone-200 hover:bg-white/10 hover:text-white">
                  Client Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-zinc-950/98 border-t border-zinc-800">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.href}>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 rounded-md text-sm font-medium transition-colors",
                      pathname === link.href || link.children.some((c) => c.href === pathname)
                        ? "text-amber-400 bg-white/10"
                        : "text-stone-200 hover:text-white hover:bg-white/10"
                    )}
                    onClick={() => setMobileNavDropdown(mobileNavDropdown === link.href ? null : link.href)}
                  >
                    {link.label}
                    <ChevronDown className={cn("h-4 w-4 transition-transform", mobileNavDropdown === link.href && "rotate-180")} />
                  </button>
                  {mobileNavDropdown === link.href && (
                    <div className="pl-4 space-y-1 mt-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === child.href
                              ? "text-amber-400 bg-white/10"
                              : "text-stone-300 hover:text-white hover:bg-white/10"
                          )}
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-4 py-3 rounded-md text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-amber-400 bg-white/10"
                      : "text-stone-200 hover:text-white hover:bg-white/10"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/trial" onClick={() => setOpen(false)}>
                <Button variant="gold" className="w-full">Book a Trial Lesson</Button>
              </Link>
              {user ? (
                <>
                  {(user.role === "trainer" || user.role === "owner") && (
                    <Link href="/trainer" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full border-stone-400 text-stone-200">Trainer Dashboard</Button>
                    </Link>
                  )}
                  {(user.role === "owner" || user.role === "student") && (
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full border-stone-400 text-stone-200">Book / My Lessons</Button>
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="text-red-400 text-sm py-2">Sign Out</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full border-stone-400 text-stone-200">Client Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
