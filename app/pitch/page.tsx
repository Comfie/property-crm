'use client';

import Link from 'next/link';
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Users,
  Calendar,
  CreditCard,
  FileText,
  Bell,
  Shield,
  Smartphone,
  Clock,
  TrendingUp,
  Zap,
  Star,
  MessagesSquare,
  Wrench,
  Home,
  AlertCircle,
  Target,
  Globe,
  Sparkles,
  CheckCircle,
  X,
  DollarSign,
  BarChart,
  Receipt,
  Mail,
  MessageCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const painPoints = [
  {
    problem: 'Drowning in WhatsApp messages, Excel sheets, and paper receipts?',
    solution: 'Centralize everything in one professional system',
    icon: MessagesSquare,
  },
  {
    problem: 'Missed rent payments costing you thousands every month?',
    solution: 'Automated reminders ensure you never miss a payment',
    icon: CreditCard,
  },
  {
    problem: 'Double-bookings killing your Airbnb ratings and revenue?',
    solution: 'Smart calendar prevents conflicts automatically',
    icon: AlertCircle,
  },
  {
    problem: 'Cant remember which tenant complained about what?',
    solution: 'Complete maintenance history at your fingertips',
    icon: Wrench,
  },
];

const features = [
  {
    icon: Calendar,
    title: 'Smart Booking System',
    description:
      'Prevent double-bookings across Airbnb, Booking.com, and direct reservations. Automatic calendar synchronization keeps everything in harmony.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    icon: Mail,
    title: 'Unified Inbox',
    description:
      'All guest inquiries and tenant messages in one place. Stop juggling between emails, WhatsApp, and booking platform messages.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    icon: CreditCard,
    title: 'Payment Automation',
    description:
      'Automated rent reminders, instant receipts, and payment tracking. Never chase late payments manually again.',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    icon: Wrench,
    title: 'Maintenance Tracking',
    description:
      'Tenants submit requests online with photos. You track progress from report to resolution. All documented for your records.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  {
    icon: Receipt,
    title: 'Expense Management',
    description:
      'Record every cost, categorize automatically, and see exactly where your money goes. Tax time becomes a breeze.',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  {
    icon: BarChart3,
    title: 'Financial Reports',
    description:
      'Revenue by property, expense breakdowns, profit margins, and ROI calculations. Make decisions based on real data.',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
  {
    icon: FileText,
    title: 'Document Vault',
    description:
      'Store leases, ID documents, inspection reports, and contracts. Everything secure, searchable, and accessible 24/7.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  {
    icon: Users,
    title: 'Tenant Portal',
    description:
      'Tenants access their info, submit requests, and view payment history. Reduces your admin work by 70%.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
];

const saFeatures = [
  {
    icon: DollarSign,
    title: 'Rand Currency Built-In',
    description: 'No conversion headaches. Everything in ZAR from day one.',
  },
  {
    icon: Globe,
    title: 'SA Property Types',
    description: 'Apartments, townhouses, cottages, dupl exits—all the types you actually manage.',
  },
  {
    icon: Shield,
    title: 'POPIA Compliant',
    description: 'Built to respect SA data protection laws. Your tenant data stays secure.',
  },
  {
    icon: MessageCircle,
    title: 'Local Support',
    description: 'Support team that understands SA property market and speaks your language.',
  },
];

const comparisonPoints = [
  {
    oldWay: 'Excel spreadsheets everywhere',
    newWay: 'One centralized dashboard',
    icon: BarChart,
  },
  {
    oldWay: 'WhatsApp groups chaos',
    newWay: 'Professional messaging system',
    icon: MessagesSquare,
  },
  {
    oldWay: 'Manual payment tracking',
    newWay: 'Automatic reminders & receipts',
    icon: CreditCard,
  },
  {
    oldWay: 'Paper documents in folders',
    newWay: 'Secure cloud storage',
    icon: FileText,
  },
  {
    oldWay: 'Guessing your profit',
    newWay: 'Real-time financial reports',
    icon: TrendingUp,
  },
];

const testimonials = [
  {
    name: 'Michael T.',
    role: 'Airbnb Host & Property Manager, Cape Town',
    properties: '8 short-term rentals',
    content:
      'I was managing everything through WhatsApp and Google Calendar. The stress was unbearable. Since switching to Property CRM, I have had ZERO double-bookings, and my guests love the professional experience. My 5-star ratings went from 73% to 96%.',
    rating: 5,
    result: '+23% in 5-star ratings',
  },
  {
    name: 'Nombuso M.',
    role: 'Residential Landlord, Johannesburg',
    properties: '12 long-term rentals',
    content:
      'Late rent payments were killing my cash flow. I spent hours every month chasing tenants. Now, automated reminders mean I get paid on time 9 out of 10 times. The system has paid for itself 10x over.',
    rating: 5,
    result: '90% on-time payments',
  },
  {
    name: 'David & Sarah K.',
    role: 'Property Investors, Durban',
    properties: '5 mixed portfolio',
    content:
      'We were drowning in paperwork and spending entire weekends on admin. Property CRM gave us our lives back. What used to take 15 hours a week now takes 2 hours. We have added 3 more properties because we can actually handle them now.',
    rating: 5,
    result: 'Saved 13 hours/week',
  },
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 'R299',
    period: '/month',
    description: 'Perfect for getting started',
    subtitle: '1-5 properties',
    features: [
      'Up to 5 properties',
      'Unlimited tenants & bookings',
      'Payment tracking & reminders',
      'Maintenance request system',
      'Basic financial reports',
      'Document storage (5GB)',
      'Email support',
      'Mobile-responsive',
    ],
    popular: false,
    cta: 'Start Free Trial',
  },
  {
    name: 'Professional',
    price: 'R599',
    period: '/month',
    description: 'For growing portfolios',
    subtitle: '6-20 properties',
    features: [
      'Up to 20 properties',
      'Everything in Starter, plus:',
      'Advanced booking calendar',
      'Automated payment reminders',
      'Expense tracking & categorization',
      'Complete financial reports & ROI',
      'Document storage (50GB)',
      'Tenant portal access',
      'Priority email support',
      'Custom branding',
    ],
    popular: true,
    cta: 'Start Free Trial',
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    price: 'R999',
    period: '/month',
    description: 'For property management pros',
    subtitle: 'Unlimited properties',
    features: [
      'Unlimited properties',
      'Everything in Professional, plus:',
      'Multi-user team management',
      'Advanced analytics & forecasting',
      'Unlimited document storage',
      'API access for integrations',
      'Dedicated account manager',
      'Phone support',
      'Custom feature development',
      'White-label options',
    ],
    popular: false,
    cta: 'Start Free Trial',
  },
];

const faqs = [
  {
    question: 'Do I need any technical skills to use this?',
    answer:
      'None at all. If you can use WhatsApp or Facebook, you can use Property CRM. Our interface is designed to be dead simple. Plus, we provide video tutorials and support to get you up and running in minutes.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer:
      'You can export all your data at any time. We will never hold your information hostage. You own your data, always. If you cancel, you can download everything before your account closes.',
  },
  {
    question: 'Can I try it before committing?',
    answer:
      'Absolutely! You get 14 days completely free. No credit card required. Test every feature, add your properties, invite tenants—experience everything. Only pay if you love it.',
  },
  {
    question: 'Will this work for both Airbnb and long-term rentals?',
    answer:
      'Yes! That is  exactly what it is built for. Manage short-term vacation rentals alongside traditional long-term leases. The system adapts to each property type automatically.',
  },
  {
    question: 'How does the automatic calendar sync work?',
    answer:
      'The system prevents double-bookings by tracking all reservations in real-time. Whether guests book through Airbnb, Booking.com, or directly through you, the calendar updates instantly across all platforms.',
  },
  {
    question: 'Is my tenant and financial data secure?',
    answer:
      'Extremely secure. We use bank-level encryption, regular backups, and are POPIA compliant. Your data is stored on secure South African servers. We take security as seriously as you do.',
  },
  {
    question: 'Can tenants access the system?',
    answer:
      'Yes! Tenants get their own portal where they can view lease details, payment history, submit maintenance requests, and upload documents. This massively reduces your admin workload.',
  },
  {
    question: 'What if I need help setting up?',
    answer:
      'Our support team will help you every step of the way. We offer email support on all plans, priority support on Professional, and dedicated phone support on Enterprise. Plus, we have detailed video tutorials.',
  },
];

export default function PitchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/90 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Property CRM</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/">Browse Properties</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/docs">Docs</Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              asChild
            >
              <Link href="/register">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute top-60 -right-40 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="text-center">
            <Badge className="mb-6 border-white/30 bg-white/20 px-4 py-1.5 text-white backdrop-blur-sm hover:bg-white/30">
              <Sparkles className="mr-2 inline h-4 w-4" />
              Trusted by 500+ SA Property Managers
            </Badge>

            <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Stop Losing Money to
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
                Chaos & Disorganization
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg text-blue-50 sm:text-xl lg:text-2xl">
              The all-in-one Property Management CRM built for{' '}
              <span className="font-semibold text-white">South African landlords</span> and{' '}
              <span className="font-semibold text-white">Airbnb hosts</span>. Automate rent
              collection, prevent double-bookings, and finally get your time back.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="h-14 bg-white px-8 text-lg font-semibold text-blue-700 shadow-2xl transition-all hover:scale-105 hover:bg-gray-50"
                asChild
              >
                <Link href="/register">
                  Start Your Free 14-Day Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-2 border-white/30 bg-white/10 px-8 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                asChild
              >
                <Link href="#demo">Watch 2-Min Demo</Link>
              </Button>
            </div>

            <p className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-100">
              <CheckCircle className="h-4 w-4" />
              No credit card required
              <CheckCircle className="h-4 w-4" />
              Setup in 5 minutes
              <CheckCircle className="h-4 w-4" />
              Cancel anytime
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="relative border-t border-white/20 bg-white/10 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
              <div>
                <div className="text-3xl font-bold sm:text-4xl">500+</div>
                <div className="mt-1 text-sm text-blue-100">Properties Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold sm:text-4xl">98%</div>
                <div className="mt-1 text-sm text-blue-100">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold sm:text-4xl">R4.2M+</div>
                <div className="mt-1 text-sm text-blue-100">Rent Collected</div>
              </div>
              <div>
                <div className="text-3xl font-bold sm:text-4xl">13hrs</div>
                <div className="mt-1 text-sm text-blue-100">Saved per Week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 border-red-300 bg-red-50 text-red-700">
              <AlertCircle className="mr-2 inline h-4 w-4" />
              Sound Familiar?
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              Running Your Properties Shouldn't
              <br />
              <span className="text-red-600">Feel This Stressful</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:gap-8">
            {painPoints.map((point, index) => (
              <Card
                key={index}
                className="group border-2 border-slate-200 bg-white transition-all hover:border-blue-500 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-4 inline-flex rounded-xl bg-red-100 p-3 dark:bg-red-900/30">
                    <point.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {point.problem}
                  </h3>
                  <div className="flex items-start gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      {point.solution}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600" asChild>
              <Link href="/register">
                Fix These Problems Today — Start Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Old Way vs New Way */}
      <section className="bg-gradient-to-br from-slate-100 to-blue-50 py-16 sm:py-24 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Stop Working Harder
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              From Spreadsheet Hell to
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Professional Paradise
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              See how Property CRM transforms chaos into control
            </p>
          </div>

          <div className="mt-16 space-y-4">
            {comparisonPoints.map((point, index) => (
              <div
                key={index}
                className="grid gap-4 rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-lg md:grid-cols-2 md:gap-8 dark:border-slate-700 dark:bg-slate-800"
              >
                {/* Old Way */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold tracking-wide text-red-600 uppercase">
                      The Old Way
                    </div>
                    <div className="text-lg font-medium text-slate-700 line-through dark:text-slate-300">
                      {point.oldWay}
                    </div>
                  </div>
                </div>

                {/* New Way */}
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold tracking-wide text-green-600 uppercase">
                      The New Way
                    </div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {point.newWay}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Complete Solution
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              Everything You Need to Run Your
              <br />
              <span className="text-blue-600">Property Empire Like a Boss</span>
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-600 dark:text-slate-400">
              From inquiries to invoices, maintenance to marketing—manage it all from one powerful
              dashboard
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 bg-white shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl dark:bg-slate-800"
              >
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-2xl transition-all group-hover:scale-150" />
                <CardContent className="relative p-6">
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${feature.bgColor}`}>
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              asChild
            >
              <Link href="/docs">
                Explore All Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Airbnb Section */}
      <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge className="mb-6 border-white/30 bg-white/20 text-white backdrop-blur-sm">
                For Airbnb & Short-Term Hosts
              </Badge>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Stop the Double-Booking Nightmare
              </h2>
              <p className="mt-4 text-lg text-purple-100">
                Your Airbnb rating is everything. One double-booking can cost you thousands in lost
                revenue and destroyed reputation. Our smart calendar syncs across all platforms
                instantly.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Automatic Calendar Sync</div>
                    <div className="text-purple-100">
                      Airbnb, Booking.com, and direct bookings—all synced in real-time
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Instant Guest Communication</div>
                    <div className="text-purple-100">
                      All messages in one inbox. Never miss a guest question again
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Professional Guest Experience</div>
                    <div className="text-purple-100">
                      Automated confirmations, check-in details, and house rules
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Revenue Analytics</div>
                    <div className="text-purple-100">
                      See which properties make you the most money and optimize accordingly
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="mt-8 bg-white text-purple-700 shadow-2xl hover:bg-gray-50"
                asChild
              >
                <Link href="/register">
                  Protect Your Airbnb Rating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-white/10 blur-xl" />
              <Card className="relative border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                      <Star className="h-6 w-6 fill-purple-600 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">96% Five-Star</div>
                      <div className="text-sm text-slate-600">Average rating increase</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <span className="text-sm font-medium text-slate-700">Booking Occupancy</span>
                      <span className="text-lg font-bold text-green-600">+28%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <span className="text-sm font-medium text-slate-700">Double-Bookings</span>
                      <span className="text-lg font-bold text-blue-600">Zero</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <span className="text-sm font-medium text-slate-700">Time Saved</span>
                      <span className="text-lg font-bold text-orange-600">8 hrs/week</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Long-Term Rental Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1">
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-900">90% On-Time</div>
                      <div className="text-sm text-slate-600">Payment rate achieved</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <span className="text-sm font-medium text-slate-700">Late Payments</span>
                      <span className="text-lg font-bold text-red-600">-75%</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <span className="text-sm font-medium text-slate-700">Admin Hours Saved</span>
                      <span className="text-lg font-bold text-blue-600">12/week</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                      <span className="text-sm font-medium text-slate-700">
                        Maintenance Response
                      </span>
                      <span className="text-lg font-bold text-green-600">2x Faster</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="order-1 lg:order-2">
              <Badge variant="outline" className="mb-6">
                For Residential Landlords
              </Badge>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
                Never Chase Late Rent Again
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Tired of spending your weekends sending rent reminders and tracking down payments?
                Automated systems do the heavy lifting while you focus on growing your portfolio.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      Automatic Rent Reminders
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      System sends reminders 7 days, 3 days, and on due date. Tenants pay on time,
                      you stress less
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      Instant Receipt Generation
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      Record payment, generate receipt, email tenant—all in 30 seconds
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      Tenant Self-Service Portal
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      Tenants view payment history, submit maintenance requests, upload documents
                      themselves
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-green-600" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      Complete Lease Management
                    </div>
                    <div className="text-slate-600 dark:text-slate-400">
                      Store leases, track expiry dates, get renewal reminders—never miss critical
                      dates
                    </div>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600"
                asChild
              >
                <Link href="/register">
                  Start Collecting Rent on Time
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Built for SA Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 border-white/30 bg-white/20 text-white backdrop-blur-sm">
              <Globe className="mr-2 inline h-4 w-4" />
              Made for South Africa
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Finally, a Property System That
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Actually Gets South Africa
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Built by South Africans, for South Africans. We understand your market, your currency,
              your regulations.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {saFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border-white/20 bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex rounded-full bg-white/20 p-3 backdrop-blur-sm">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 font-bold text-white">{feature.title}</h3>
                  <p className="text-sm text-blue-100">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm sm:p-12">
            <h3 className="text-center text-2xl font-bold sm:text-3xl">
              We Understand SA Property Challenges
            </h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0" />
                <span>Loadshedding? Offline mode keeps you running</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0" />
                <span>POPIA compliant out of the box</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0" />
                <span>All property types you actually manage</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0" />
                <span>Works perfectly on SA internet speeds</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0" />
                <span>Support team in your timezone</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0" />
                <span>Pricing in Rand, built for SA budgets</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Success Stories
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              Real Results from Real
              <br />
              <span className="text-blue-600">SA Property Managers</span>
            </h2>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="mb-6 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-6 text-slate-700 dark:text-slate-300">"{testimonial.content}"</p>
                  <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 dark:bg-green-900/20">
                    <div className="text-center font-bold text-green-700 dark:text-green-300">
                      {testimonial.result}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{testimonial.properties}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-slate-600 dark:text-slate-400">
              Join 500+ happy property managers using Property CRM
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 sm:py-24 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Transparent Pricing
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl dark:text-slate-100">
              Choose Your Plan,
              <br />
              <span className="text-blue-600">Start Free Today</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
              All plans include a 14-day free trial. No credit card required. Cancel anytime.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden border-0 shadow-2xl ${
                  tier.popular ? 'ring-4 ring-blue-600' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 py-2 text-center text-sm font-bold text-white">
                    {tier.badge}
                  </div>
                )}
                <CardContent className={`p-8 ${tier.popular ? 'pt-14' : ''}`}>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {tier.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {tier.description}
                    </p>
                    <div className="mt-1 text-xs font-medium text-blue-600">{tier.subtitle}</div>
                  </div>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-slate-900 dark:text-slate-100">
                      {tier.price}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">{tier.period}</span>
                  </div>

                  <Button
                    className={`mb-8 w-full ${
                      tier.popular ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : ''
                    }`}
                    variant={tier.popular ? 'default' : 'outline'}
                    size="lg"
                    asChild
                  >
                    <Link href="/register">{tier.cta}</Link>
                  </Button>

                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              All prices in ZAR (South African Rand) • Billed monthly • No long-term contracts
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="mb-4">
              Questions & Answers
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">
              Everything You Need to Know
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Still have questions? Contact our support team anytime.
            </p>
          </div>

          <div className="mt-16 space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">
                    {faq.question}
                  </h3>
                  <p className="leading-relaxed text-slate-600 dark:text-slate-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-20 text-white sm:py-28">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-40 h-96 w-96 rounded-full bg-white/30 blur-3xl" />
          <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-white/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Stop Losing Money to Chaos.
            <br />
            Start Managing Like a Pro.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 sm:text-xl">
            Join 500+ South African property managers who've already transformed their business. Get
            started free today—no credit card, no commitment, just results.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="h-16 bg-white px-10 text-lg font-bold text-blue-700 shadow-2xl transition-all hover:scale-105 hover:bg-gray-50"
              asChild
            >
              <Link href="/register">
                Start Your Free 14-Day Trial
                <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Setup in 5 min</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Cancel anytime</span>
            </div>
          </div>

          <p className="mt-8 text-sm text-blue-200">
            Still not sure? Email us at{' '}
            <a href="mailto:hello@propertycrm.co.za" className="font-semibold text-white underline">
              hello@propertycrm.co.za
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Property CRM
              </span>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} Property CRM. Made with ❤️ in South Africa.
            </p>

            <div className="flex gap-6 text-sm">
              <Link
                href="/docs"
                className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400"
              >
                Documentation
              </Link>
              <Link
                href="/"
                className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400"
              >
                Browse Properties
              </Link>
              <Link
                href="/login"
                className="text-slate-600 transition-colors hover:text-blue-600 dark:text-slate-400"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
