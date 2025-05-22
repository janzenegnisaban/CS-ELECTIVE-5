import Link from "next/link"
import { CakeSlice, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-pink-50 pt-16 pb-8 relative">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300"></div>

      <div className="container mx-auto px-4">
        {/* Newsletter section */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h3 className="text-2xl font-bold mb-2">Join Our Sweet Community</h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for exclusive offers and cake inspiration
          </p>

          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <Input type="email" placeholder="Your email address" className="rounded-full border-pink-200" />
            <Button className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600">
              Subscribe
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <CakeSlice className="h-6 w-6 text-primary mr-2" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                QuiCake
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Delicious handcrafted cakes and treats delivered to your door. Made with love and the finest ingredients.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 p-0 border-pink-200 hover:bg-pink-50"
              >
                <Instagram className="h-4 w-4 text-pink-500" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 p-0 border-pink-200 hover:bg-pink-50"
              >
                <Facebook className="h-4 w-4 text-blue-500" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 p-0 border-pink-200 hover:bg-pink-50"
              >
                <Twitter className="h-4 w-4 text-sky-500" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Shop</h3>
            <ul className="space-y-2">
              {["All Products", "Cakes", "Cupcakes", "Cookies"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/products${item === "All Products" ? "" : `?category=${item.toLowerCase()}`}`}
                    className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center"
                  >
                    <span className="h-1 w-1 bg-pink-300 rounded-full mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Company</h3>
            <ul className="space-y-2">
              {["About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-sm text-gray-600 hover:text-primary transition-colors flex items-center"
                  >
                    <span className="h-1 w-1 bg-pink-300 rounded-full mr-2"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-primary">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">New Cabalan, Olongapo City</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">+63 9683506258</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-sm text-gray-600">sample@quicake.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pink-100 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} QuiCake. All rights reserved. Made with
            <span className="text-red-500 mx-1">♥</span>
            and lots of sugar!
          </p>
        </div>
      </div>
    </footer>
  )
}
