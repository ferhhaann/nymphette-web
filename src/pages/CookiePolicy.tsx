import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cookie, Settings, Eye, Shield } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Cookie className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground text-lg">
              How we use cookies to improve your browsing experience
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
                  What Are Cookies?
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
                <p>
                  Cookies help us understand how you use our website and allow us to provide you with a better user experience.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <h4>Essential Cookies</h4>
                <p>These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.</p>
                
                <h4>Performance Cookies</h4>
                <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                
                <h4>Functional Cookies</h4>
                <p>These cookies enable the website to provide enhanced functionality and personalization, such as remembering your preferences.</p>
                
                <h4>Marketing Cookies</h4>
                <p>These cookies are used to track visitors across websites to display relevant and engaging advertisements.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specific Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">Cookie Name</th>
                        <th className="border border-border p-3 text-left">Purpose</th>
                        <th className="border border-border p-3 text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3">_session</td>
                        <td className="border border-border p-3">Essential for website functionality</td>
                        <td className="border border-border p-3">Session</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">_preferences</td>
                        <td className="border border-border p-3">Remember user preferences</td>
                        <td className="border border-border p-3">1 year</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">_analytics</td>
                        <td className="border border-border p-3">Website analytics and performance</td>
                        <td className="border border-border p-3">2 years</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">_marketing</td>
                        <td className="border border-border p-3">Personalized advertising</td>
                        <td className="border border-border p-3">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Managing Your Cookie Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <h4>Browser Settings</h4>
                <p>Most web browsers allow you to control cookies through their settings. You can:</p>
                <ul>
                  <li>Delete existing cookies</li>
                  <li>Block cookies from being set</li>
                  <li>Set warnings before cookies are stored</li>
                  <li>Restrict cookies to first-party only</li>
                </ul>

                <h4>Our Cookie Settings</h4>
                <p>You can also manage your cookie preferences directly on our website using our cookie preference center.</p>
                
                <h4>Important Note</h4>
                <p>Please note that disabling cookies may affect the functionality of our website and limit your user experience.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>We may use third-party services that place cookies on your device, including:</p>
                <ul>
                  <li><strong>Google Analytics:</strong> For website analytics</li>
                  <li><strong>Social Media Platforms:</strong> For social sharing functionality</li>
                  <li><strong>Payment Processors:</strong> For secure payment processing</li>
                  <li><strong>Advertising Networks:</strong> For relevant advertisements</li>
                </ul>
                <p>These third parties have their own privacy and cookie policies.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  If you have questions about our use of cookies, please contact us:
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

export default CookiePolicy;