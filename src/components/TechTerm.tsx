import React from 'react';
import { Tooltip } from './Tooltip';

interface TechTermProps {
  term: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

// High school friendly explanations for technical terms
const TECH_EXPLANATIONS: Record<string, string> = {
  'IP': 'Internet Protocol - Like your home address, but for computers on the internet',
  'DNS': 'Domain Name System - Like a phone book that translates website names (google.com) to computer addresses',
  'TCP': 'Transmission Control Protocol - A reliable way computers talk to each other, like certified mail',
  'HTTP': 'HyperText Transfer Protocol - The language web browsers use to request web pages',
  'HTTPS': 'HTTP Secure - Same as HTTP but encrypted for safety, like a locked envelope',
  'Router': 'A smart device that directs internet traffic, like a traffic cop for data',
  'Packet': 'A small chunk of data sent over the internet, like a piece of a puzzle',
  'ISP': 'Internet Service Provider - The company that gives you internet access (like Comcast or Verizon)',
  'Server': 'A powerful computer that stores websites and sends them to your browser when requested',
  'Client': 'Your computer or phone when it\'s requesting information from a server',
  'Protocol': 'A set of rules that computers follow to communicate, like grammar rules for languages',
  'Latency': 'The time it takes for data to travel from one place to another, like mail delivery time',
  'Bandwidth': 'How much data can be sent at once, like the width of a highway',
  'Firewall': 'Security software that blocks dangerous internet traffic, like a security guard',
  'CDN': 'Content Delivery Network - Servers around the world that store copies of websites to make them faster',
  'URL': 'Uniform Resource Locator - The web address you type in your browser (like www.google.com)',
  'SSL': 'Secure Sockets Layer - Encryption that keeps your data safe when browsing websites',
  'Port': 'A numbered door on a computer that different programs use to communicate',
  'MAC Address': 'Media Access Control - A unique ID for your computer\'s network card, like a fingerprint',
  'DHCP': 'Dynamic Host Configuration Protocol - Automatically assigns IP addresses to devices on a network',
  'Subnet': 'A smaller network within a larger network, like different floors in a building',
  'Gateway': 'The entrance/exit point between your local network and the internet',
  'Ping': 'A test to see if another computer is reachable and how long it takes to respond',
  'Traceroute': 'Shows the path data takes to reach its destination, like GPS directions',
  'Cache': 'Temporary storage of frequently used data to make things faster, like keeping snacks handy'
};

export const TechTerm: React.FC<TechTermProps> = ({ term, children, position = 'top' }) => {
  const explanation = TECH_EXPLANATIONS[term];
  
  if (!explanation) {
    return <>{children}</>;
  }

  return (
    <Tooltip content={explanation} position={position}>
      <span className="tech-term">{children}</span>
    </Tooltip>
  );
};
