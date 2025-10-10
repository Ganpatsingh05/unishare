"use client";

import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, 
  Car, 
  ShoppingBag, 
  BookOpen, 
  MessageCircle,
  Heart,
  Coffee,
  ExternalLink,
  ArrowUp,
  Mail,
  Phone
} from 'lucide-react';
import { useUI } from "../lib/contexts/UniShareContext";
import logoImage from '../assets/images/logounishare1.png';
import styles from './SmallFooter.module.css';

export default function SmallFooter() {
  const { darkMode } = useUI();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Rides', href: '/share-ride', icon: Car },
    { name: 'Marketplace', href: '/marketplace/buy', icon: ShoppingBag },
    { name: 'Housing', href: '/housing', icon: Home },
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'Contacts', href: '/contacts', icon: MessageCircle }
  ];

  const supportLinks = [
    { name: 'Help', href: '/info/help' },
    { name: 'About', href: '/info/about' },
    { name: 'Privacy', href: '/info/privacy' },
    { name: 'Terms', href: '/info/terms' }
  ];

  return (
    <footer className={`${styles.footer} ${darkMode ? styles.dark : styles.light}`}>
      {/* Responsive Content - Shows all sections on all devices */}
      <div className={styles.container}>
        
        {/* Main Content Grid - Responsive columns */}
        <div className={styles.mainGrid}>
          
          {/* Logo and Brief Description */}
          <div className={styles.logoSection}>
            <Link href="/" className={styles.logoLink}>
              <div className={styles.logoContainer}>
                <div className={styles.logoImage}>
                  <Image
                    src={logoImage}
                    alt="UniShare"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className={styles.brandWordmark}>
                  <span className={styles.brandUni}>Uni</span>
                  <span className={styles.brandShare}>Share</span>
                </span>
              </div>
            </Link>
            
            <p className={`${styles.description} ${darkMode ? styles.dark : styles.light}`}>
              Your university community platform for sharing rides, resources, and connections.
            </p>
          </div>

          {/* Quick Links */}
          <div className={styles.section}>
            <h3 className={`${styles.sectionTitle} ${darkMode ? styles.dark : styles.light}`}>
              Quick Access
            </h3>
            <ul className={styles.linkList}>
              {quickLinks.map((link, index) => (
                <li key={index} className={styles.linkItem}>
                  <Link
                    href={link.href}
                    className={`${styles.quickLink} ${darkMode ? styles.dark : styles.light}`}
                  >
                    <link.icon className={styles.quickIcon} />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className={styles.section}>
            <h3 className={`${styles.sectionTitle} ${darkMode ? styles.dark : styles.light}`}>
              Support
            </h3>
            <ul className={styles.linkList}>
              {supportLinks.map((link, index) => (
                <li key={index} className={styles.linkItem}>
                  <Link
                    href={link.href}
                    className={`${styles.supportLink} ${darkMode ? styles.dark : styles.light}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Scroll Top */}
          <div className={`${styles.section} ${styles.contactSection}`}>
            <h3 className={`${styles.sectionTitle} ${darkMode ? styles.dark : styles.light}`}>
              Contact
            </h3>
            
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Mail className={`${styles.contactIcon} ${styles.email} ${darkMode ? styles.dark : styles.light}`} />
                <span className={`${styles.contactText} ${darkMode ? styles.dark : styles.light}`}>
                  support@unishare.com
                </span>
              </div>
              <div className={styles.contactItem}>
                <Phone className={`${styles.contactIcon} ${styles.phone} ${darkMode ? styles.dark : styles.light}`} />
                <span className={`${styles.contactText} ${darkMode ? styles.dark : styles.light}`}>
                  +1 (555) 123-4567
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Responsive */}
        <div className={`${styles.bottomBar} ${darkMode ? styles.dark : styles.light}`}>
          <div className={styles.bottomContent}>
            
            {/* Copyright */}
            <div className={`${styles.copyright} ${darkMode ? styles.dark : styles.light}`}>
              © {new Date().getFullYear()} UniShare. All rights reserved.
            </div>

            {/* Made with Love */}
            <div className={`${styles.madeWith} ${darkMode ? styles.dark : styles.light}`}>
              <span>Made with</span>
              <Heart className={`${styles.heartIcon} ${darkMode ? styles.dark : styles.light}`} />
              <span>for students</span>
              <Coffee className={`${styles.coffeeIcon} ${darkMode ? styles.dark : styles.light}`} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}