
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MessageSquare } from 'lucide-react';
import React from 'react';

export const SOCIAL_PLATFORMS = [
  { value: 'Facebook', icon: <Facebook className="h-4 w-4 mr-2" /> },
  { value: 'YouTube', icon: <Youtube className="h-4 w-4 mr-2" /> },
  { value: 'Instagram', icon: <Instagram className="h-4 w-4 mr-2" /> },
  { value: 'Twitter', icon: <Twitter className="h-4 w-4 mr-2" /> },
  { value: 'LinkedIn', icon: <Linkedin className="h-4 w-4 mr-2" /> },
  { value: 'Discord', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'WeChat', label: 'WeChat' },
  { value: 'Telegram', label: 'Telegram' },
  { value: 'Snapchat', label: 'Snapchat' },
  { value: 'Douyin', label: 'Douyin (Chinese TikTok)' },
  { value: 'Pinterest', label: 'Pinterest' },
  { value: 'Reddit', label: 'Reddit' },
  { value: 'Quora', label: 'Quora' },
  { value: 'Weibo', label: 'Sina Weibo' },
  { value: 'Threads', label: 'Threads' },
  { value: 'LINE', label: 'LINE' },
  { value: 'Tumblr', label: 'Tumblr' },
  { value: 'Twitch', label: 'Twitch' },
  { value: 'Viber', label: 'Viber' },
  { value: 'Clubhouse', label: 'Clubhouse' },
  { value: 'BeReal', label: 'BeReal' },
  { value: 'QQ', label: 'QQ' },
];
