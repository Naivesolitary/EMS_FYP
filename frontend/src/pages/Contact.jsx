import { ContactForm } from "../components/ContactForm"
// import { SocialLinks } from "@/components/social-links"
import { ContactInfo } from "../components/ContactInfo"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">Get in Touch</h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-500">
              We're here to help make your event extraordinary. Reach out to our team with any questions.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-5 lg:gap-16">
            <div className="md:col-span-3">
              <ContactForm />
            </div>
            <div className="md:col-span-2">
              <ContactInfo />
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-medium text-gray-900">Connect With Us</h3>
                {/* <SocialLinks /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
