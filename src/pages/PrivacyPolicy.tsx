import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, FileText } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16 pt-32 lg:pt-36">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Shield className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">
              How we collect, use, and protect your personal information
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: January 2024
            </p>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <h4>Personal Information</h4>
                <ul>
                  <li>Name, email address, and phone number</li>
                  <li>Travel preferences and booking history</li>
                  <li>Payment information (processed securely)</li>
                  <li>Communication preferences</li>
                </ul>
                
                <h4>Automatically Collected Information</h4>
                <ul>
                  <li>Website usage data and analytics</li>
                  <li>Device information and IP address</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <ul>
                  <li>Process and manage your travel bookings</li>
                  <li>Provide customer support and assistance</li>
                  <li>Send important updates about your bookings</li>
                  <li>Improve our services and website experience</li>
                  <li>Send marketing communications (with your consent)</li>
                  <li>Comply with legal requirements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Data Protection & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul>
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure servers and data storage</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information</li>
                  <li>Staff training on data protection</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                  <li>Lodge a complaint with supervisory authorities</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you have questions about this Privacy Policy or want to exercise your rights, contact us:
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

export default PrivacyPolicy;