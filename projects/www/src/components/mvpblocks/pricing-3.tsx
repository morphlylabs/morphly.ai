'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@workspace/ui/components/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import BackgroundGradient from '@/components/background-gradient';

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonVariant:
    | 'outline'
    | 'default'
    | 'link'
    | 'destructive'
    | 'secondary'
    | 'ghost';
  span: number;
  highlight: boolean;
};

const plans: Plan[] = [
  {
    name: 'Free',
    price: '$0 / mo',
    description: 'Get started with basic 3D modeling',
    features: [
      '100 Llama Maverick 4 model usages',
      'Basic parametric modeling',
      'Multiple export formats (STL, STEP, code)',
    ],
    buttonVariant: 'outline',
    span: 2,
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19 / mo',
    description: 'For professional designers and engineers',
    features: [
      'Unlimited Llama Maverick 4 usages',
      '1,000 Claude 4 model usages',
      'Advanced parametric modeling',
      'Priority support',
    ],
    buttonVariant: 'default',
    span: 3,
    highlight: true,
  },
];

export default function PricingThree() {
  return (
    <>
      <BackgroundGradient />
      <section className="note-prose relative h-screen w-full py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center text-4xl font-semibold lg:text-5xl"
            >
              Pricing that Scales with You
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Choose the perfect plan for your design needs. From simple
              prototypes to complex assemblies, our AI-powered text-to-CAD
              platform brings your imagination to life with parametric
              precision.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.08 }}
                className={`flex flex-col justify-between space-y-8 rounded-lg border p-6 lg:p-10 ${
                  plan.highlight
                    ? 'dark:bg-muted shadow-lg shadow-gray-950/5 md:col-span-3 dark:[--color-muted:var(--color-zinc-900)]'
                    : 'md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0'
                }`}
              >
                {/* Header */}
                <div className="space-y-4">
                  <div>
                    <h2 className="font-medium">{plan.name}</h2>
                    <span className="my-3 block text-2xl font-semibold">
                      {plan.price}
                    </span>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant={plan.buttonVariant}
                    className="w-full"
                  >
                    <Link prefetch={true} href="https://app.morphly.ai">
                      Get Started
                    </Link>
                  </Button>
                </div>

                {/* Divider */}
                {!plan.highlight && <hr className="border-dashed" />}

                {/* Features */}
                {plan.highlight ? (
                  <div>
                    <div className="text-sm font-medium">
                      Everything in free plus:
                    </div>
                    <ul className="mt-4 list-outside space-y-3 text-sm">
                      {plan.features.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="size-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <ul className="list-outside space-y-3 text-sm">
                    {plan.features.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="size-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
