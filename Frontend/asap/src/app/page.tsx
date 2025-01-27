"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { motion, useAnimate } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

export default function LandingPage() {
  const [scope, animate] = useAnimate();

  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";

    const animationSequence = async () => {
      await animate(
        "h1 span:first-child",
        { opacity: 1, y: 0 },
        { duration: 1 }
      );
      await animate(
        "h1 span:last-child",
        { opacity: 1, y: 0 },
        { duration: 0.7 }
      );
      animate(".text-generate", { opacity: 1 }, { duration: 0.4 });
      await animate(".hero-cta", { opacity: 1, y: 0 }, { duration: 0.6 });

      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };

    animationSequence();

    return () => {
      // Cleanup: ensure scrolling is re-enabled if component unmounts
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, [animate]);

  const features = [
    {
      title: "Fine-Tuned AI Scheduling",
      description:
        "Fully customizable preferences and intentionally verbose metadata for accurate and optimized task scheduling.",
      image: "/landing/features/asap-demo.gif",
      darkImage: "/landing/features/asap-demo.gif",
    },
    {
      title: "Collaborative Calendars",
      description:
        "Declaratively plan hangouts, meetings, and events with others automatically integrated into everyone's schedule.",
      image: "/landing/features/calendars.png",
      darkImage: "/landing/features/calendars.png",
    },
    // {
    //   title: "Multi-platform Support",
    //   description:
    //     "Use asap wherever you go with a native web and mobile version.",
    //   image: "/landing/features/integrations.png",
    //   darkImage: "/landing/features/integrationsDark.png",
    // },
    {
      title: "Fully Integrated",
      description:
        "Waste no time switching between apps. All your tasks, events, and reminders, in one place, integrated with your favorite tools.",
      image: "/landing/features/integrationsDark.png",
      darkImage: "/landing/features/integrationsDark.png",
    },
  ];

  const faqs = [
    {
      id: "item-0",
      question: "When will Asap launch?",
      answer:
        "We are aiming for an early-access ASAP. The project is a personal one, so it will take time!",
    },
    {
      id: "item-1",
      question: "How does Asap work?",
      answer:
        "Asap uses user-selected preferences, event data, task data and context, to analyze your tasks, deadlines, and work patterns to create an optimized schedule for maximum productivity.",
    },
    {
      id: "item-2",
      question: "How much will Asap cost?",
      answer:
        "Asap will be free for all of early-access. Future pricing will be determined as the product evolves.",
    },
  ];

  return (
    <div className='flex flex-col min-h-screen'>
      <FloatingNav
        navItems={[
          { name: "home", link: "" },
          { name: "features", link: "#features" },
          { name: "faq", link: "#faq" },
        ]}
      />
      <main className='flex-1'>
        <section className='w-full min-h-screen flex items-center justify-center relative overflow-hidden'>
          <BackgroundBeams />
          <div className='absolute inset-0 z-0'>
            <div className='absolute inset-0 bg-grid-pattern opacity-10' />
            <div className='absolute inset-0 bg-gradient-to-b from-transparent to-background' />
          </div>
          <motion.div
            ref={scope}
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            className='container px-4 md:px-6 text-center z-10'>
            <h1 className='text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none mb-6'>
              <span className='inline-block opacity-0 translate-y-8'>
                welcome,
              </span>{" "}
              <span className='inline-block opacity-0 translate-y-8'>
                to <em className='text-primary'>asap</em>.
              </span>
            </h1>
            <div className='text-generate opacity-0'>
              <TextGenerateEffect
                words='spend less time managing your busy schedule and more time getting things done, asap.'
                className='mx-auto max-w-[60ch] font-light text-gray-500 md:text-xl dark:text-gray-400 mb-12'
                filter={false}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
              className='w-full max-w-3xl mx-auto mb-12'>
              <Card className='overflow-hidden'>
                <CardContent className='p-0'>
                  <Image
                    src='/landing/features/dashboard.png'
                    alt='asap demo'
                    width={500}
                    height={500}
                    className='w-full h-auto'
                  />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className='w-full max-w-sm mx-auto space-y-2 hero-cta'
              initial={{ opacity: 0, y: 20 }}>
              <form
                className='flex space-x-2 items-center'
                action='https://getlaunchlist.com/s/PStD5f'
                method='POST'>
                <Input
                  name='email'
                  className='max-w-lg flex-1'
                  placeholder='Enter your email'
                  type='email'
                />
                <HoverBorderGradient className='flex gap-2'>
                  Join Waitlist
                  <ArrowRight className='ml-2 h-4 w-4' />
                </HoverBorderGradient>
              </form>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                get <strong>free</strong> early-access before we launch.
              </p>
            </motion.div>
          </motion.div>
        </section>

        <section id='features' className='w-full py-12 md:py-24 lg:py-32'>
          <div className='container px-4 md:px-6'>
            <h2 className='text-3xl font-medium sm:text-5xl text-center mb-12'>
              features
            </h2>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-6 md:gap-12 mb-12`}>
                <div className='w-full md:w-1/2'>
                  <Card>
                    <CardContent className='p-0'>
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        width={500}
                        height={500}
                        className='w-full h-auto object-cover rounded-md'
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className='w-full md:w-1/2 space-y-4'>
                  <h3 className='text-2xl font-bold'>{feature.title}</h3>
                  <p className='text-gray-500 dark:text-gray-400'>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id='faq'
          className='w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-zinc-800'>
          <div className='container px-4 md:px-6'>
            <h2 className='text-3xl font-medium sm:text-5xl text-center mb-12'>
              frequently asked questions
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}>
              <Accordion
                type='single'
                collapsible
                className='w-full max-w-2xl mx-auto'>
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </section>

        <section id='waitlist' className='w-full py-12 md:py-24 lg:py-32'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='container px-4 md:px-6 text-center'>
            <h2 className='text-3xl font-medium sm:text-5xl mb-6'>
              ready to simplify your scheduling?
            </h2>
            <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mb-6'>
              join our waitlist and get <strong>free</strong> early access.
            </p>
            <div className='w-full max-w-sm mx-auto space-y-2'>
              <form
                className='flex space-x-2 items-center'
                action='https://getlaunchlist.com/s/PStD5f'
                method='POST'>
                <Input
                  name='email'
                  className='max-w-lg flex-1'
                  placeholder='Enter your email'
                  type='email'
                />
                <HoverBorderGradient className='flex gap-2'>
                  Join Waitlist
                  <ArrowRight className='ml-2 h-4 w-4' />
                </HoverBorderGradient>
              </form>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                we will notify you when asap is ready for early-access!
              </p>
            </div>
          </motion.div>
        </section>
      </main>
      <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          © 2025 Asap Inc. All rights reserved.
        </p>
        <nav className='sm:ml-auto flex gap-4 sm:gap-6'>
          <Link className='text-xs hover:underline underline-offset-4' href='#'>
            Terms of Service
          </Link>
          <Link className='text-xs hover:underline underline-offset-4' href='#'>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
