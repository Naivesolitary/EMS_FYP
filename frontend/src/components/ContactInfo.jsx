import { Mail, Phone, MapPin, Clock } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 md:p-8">
      <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email Us</p>
            <a href="mailto:hello@evenera.com" className="text-base font-medium text-blue-600 hover:underline">
              hello@evenera.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Call Us</p>
            <a href="tel:+15551234567" className="text-base font-medium text-gray-900 hover:text-blue-600">
              +977 9876563456
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Visit Us</p>
            <p className="text-base text-gray-900">
              Zero KM
              <br />
              Pokhara
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Business Hours</p>
            <p className="text-base text-gray-900">
              Monday - Friday: 9AM - 6PM
              <br />
              Saturday: 10AM - 4PM
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
