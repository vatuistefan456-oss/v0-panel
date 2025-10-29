import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Mail, FileText, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Help & Support</h1>
        <p className="text-muted-foreground">Get help with your CS2 panel questions and issues</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Discord Support</CardTitle>
                <CardDescription>Join our Discord server for live support</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get instant help from our community and support team on Discord. Available 24/7.
            </p>
            <Link
              href="https://discord.gg/your-server"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Join Discord
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Browse our comprehensive guides</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Learn how to use all features of the CS2 panel with our detailed documentation.
            </p>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              View Docs
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Contact us via email</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <a
              href="mailto:support@cs2-panel.ro"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              Send Email
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>FAQ</CardTitle>
                <CardDescription>Frequently asked questions</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Find answers to common questions about the CS2 panel and its features.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              View FAQ
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Common Issues</CardTitle>
          <CardDescription>Quick solutions to common problems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Can't login to the panel?</h3>
              <p className="text-sm text-muted-foreground">
                Make sure you're using your Steam account credentials. If you haven't registered yet, join the server
                first to create your account automatically.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Items not showing in inventory?</h3>
              <p className="text-sm text-muted-foreground">
                Try refreshing the page or reconnecting to the server. If the issue persists, contact support on
                Discord.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">How do I purchase VIP?</h3>
              <p className="text-sm text-muted-foreground">
                Navigate to the Shop section and select your desired VIP package. You can pay using credits or real
                money through our payment gateway.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
