'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Twitter, Linkedin, Users } from 'lucide-react';
import Link from 'next/link';
import BackgroundGradient from '@/components/background-gradient';
import type { Route } from 'next';

const socials = [
  {
    name: 'Email',
    description: 'support@morphly.ai',
    icon: Mail,
    href: 'mailto:support@morphly.ai',
  },
  {
    name: 'Discord',
    description: '3caNJCHGMZ',
    icon: Users,
    href: 'https://discord.gg/3caNJCHGMZ',
  },
  {
    name: 'Twitter',
    description: '@morphly_ai',
    icon: Twitter,
    href: 'https://twitter.com/morphly_ai',
  },
  {
    name: 'LinkedIn',
    description: 'ruslanzabarov',
    icon: Linkedin,
    href: 'https://linkedin.com/in/ruslanzabarov',
  },
];

export default function ContactPage() {
  return (
    <>
      <BackgroundGradient />
      <section className="relative h-screen w-full py-16 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center text-4xl font-semibold lg:text-5xl"
            >
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Connect with us through any of these channels. We&apos;d love to
              hear from you!
            </motion.p>
          </div>

          <div className="mt-8 md:mt-12">
            <motion.div
              className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {socials.map((social, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.08 }}
                  className="rounded-2xl border"
                >
                  <Link
                    prefetch={false}
                    href={social.href as Route}
                    className="hover:bg-muted/50 group relative flex flex-col items-center gap-4 rounded-2xl border p-6 text-center transition-all duration-200"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <social.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{social.name}</span>
                    </div>

                    <span className="text-muted-foreground text-sm">
                      {social.description}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-muted-foreground text-sm">
                We typically respond within one business day
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
