import { Metadata } from "next"
import { Mail, Phone, MapPin, Globe, Facebook, Instagram, Twitter } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us - QuiCake Ecommerce",
  description: "Get in touch with QuiCake Ecommerce. We're here to help with your questions, feedback, and assistance needs.",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
      
      <div className="text-center mb-8">
        <p className="text-lg">
          Got a question, feedback, or need assistance? We're here to help!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <MapPin className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p>New Cabalan, Olongapo City</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Mail className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>sample@quicake.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Phone className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p>+63 9683506258</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Globe className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">Website</h3>
              <p>quicake.com</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Facebook className="w-6 h-6 text-primary" />
              <p>QuiCake</p>
            </div>
            <div className="flex items-center space-x-4">
              <Instagram className="w-6 h-6 text-primary" />
              <p>@quicake</p>
            </div>
            <div className="flex items-center space-x-4">
              <Twitter className="w-6 h-6 text-primary" />
              <p>@quicake1</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-lg">
        <p className="font-medium">
          Need help with an order? Contact our customer service team, and we'll ensure your experience is as smooth as your cake's frosting!
        </p>
      </div>
    </div>
  )
} 