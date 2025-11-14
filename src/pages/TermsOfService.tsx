import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CreditCard, AlertTriangle } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16 pt-32 lg:pt-36">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground text-lg">
              Terms and conditions for using our travel services
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: January 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  By accessing and using Nymphette Tours services, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p>
                  If you do not agree to abide by the above, please do not use our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Booking and Payment Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <h4>Booking Process</h4>
                <ul>
                  <li>All bookings are subject to availability</li>
                  <li>Prices are subject to change until booking is confirmed</li>
                  <li>A deposit may be required to secure your booking</li>
                  <li>Full payment is due as per the terms specified in your booking</li>
                </ul>

                <h4>Payment Terms</h4>
                <ul>
                  <li>We accept major credit cards and bank transfers</li>
                  <li>All payments are processed securely</li>
                  <li>Prices are quoted in the currency specified</li>
                  <li>Additional fees may apply for certain payment methods</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cancellation Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <h4>Cancellation by Customer</h4>
                <ul>
                  <li>Cancellations must be made in writing</li>
                  <li>Cancellation fees may apply based on timing</li>
                  <li>Some bookings may be non-refundable</li>
                  <li>Travel insurance is recommended</li>
                </ul>

                <h4>Cancellation by Nymphette Tours</h4>
                <ul>
                  <li>We reserve the right to cancel trips due to insufficient bookings</li>
                  <li>Force majeure events may result in cancellation</li>
                  <li>Full refund will be provided if we cancel your trip</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Liability and Responsibility
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <h4>Our Responsibility</h4>
                <ul>
                  <li>We act as intermediaries between you and service providers</li>
                  <li>We are not liable for services provided by third parties</li>
                  <li>Our liability is limited to the cost of services booked</li>
                  <li>We recommend comprehensive travel insurance</li>
                </ul>

                <h4>Your Responsibility</h4>
                <ul>
                  <li>Ensure you have valid travel documents</li>
                  <li>Comply with all local laws and regulations</li>
                  <li>Inform us of any special requirements or medical conditions</li>
                  <li>Behave appropriately during your travels</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Travel Documents & Health</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <ul>
                  <li>Valid passport required for international travel</li>
                  <li>Visas may be required - check with relevant embassies</li>
                  <li>Vaccination requirements vary by destination</li>
                  <li>Travel insurance strongly recommended</li>
                  <li>Check government travel advisories before departure</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  For questions about these Terms of Service, contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> tours.maa@nymphetteindia.com</p>
                  <p><strong>Phone:</strong> 044-49579403, 9840109014</p>
                  <p><strong>Address:</strong> No 81, Y Block, 6th Street, 1st Floor, Anna Nagar West, Chennai 600040</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;