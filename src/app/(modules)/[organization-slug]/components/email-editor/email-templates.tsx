'use client';
import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { EmailTemplate } from '../../model-interface/interfaces';
import TemplateCard from './template-card';
import EmailTemplateEditor from './email-editor';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const sampleTemplates: EmailTemplate[] = [
  {
    id: 'welcome',
    name: 'Welcome Onboard',
    subject: 'Welcome to ZenSpace ✨',
    category: 'Onboarding',
    updated_at: new Date(),
    html: `
      <!DOCTYPE html>
<html>
<head>
  <style>
    /* General styles for the email */
    body {
      // font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      background-color: #007bff;
      color: #ffffff;
      text-align: center;
      padding: 20px;
    }
    .content {
      padding: 20px;
      color: #333333;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      margin: 20px 0;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      background-color: #f4f4f4;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header Section -->
    <div class="header">
      <h1>Welcome to Our Newsletter!</h1>
    </div>

    <!-- Content Section -->
    <div class="content">
      <p>Hello [Recipient's Name],</p>
      <p>Thank you for subscribing to our newsletter. We’re excited to share updates, tips, and exclusive offers with you.</p>
      <p>Click the button below to explore more:</p>
      <a href="https://example.com" class="cta-button">Visit Our Website</a>
    </div>  <div class="content">
      <p>Hello [Recipient's Name],</p>
      <p>Thank you for subscribing to our newsletter. We’re excited to share updates, tips, and exclusive offers with you.</p>
      <p>Click the button below to explore more:</p>
      <a href="https://example.com" class="cta-button">Visit Our Website</a>
    </div>  <div class="content">
      <p>Hello [Recipient's Name],</p>
      <p>Thank you for subscribing to our newsletter. We’re excited to share updates, tips, and exclusive offers with you.</p>
      <p>Click the button below to explore more:</p>
      <a href="https://example.com" class="cta-button">Visit Our Website</a>
    </div>  <div class="content">
      <p>Hello [Recipient's Name],</p>
      <p>Thank you for subscribing to our newsletter. We’re excited to share updates, tips, and exclusive offers with you.</p>
      <p>Click the button below to explore more:</p>
      <a href="https://example.com" class="cta-button">Visit Our Website</a>
    </div>  <div class="content">
      <p>Hello [Recipient's Name],</p>
      <p>Thank you for subscribing to our newsletter. We’re excited to share updates, tips, and exclusive offers with you.</p>
      <p>Click the button below to explore more:</p>
      <a href="https://example.com" class="cta-button">Visit Our Website</a>
    </div>

    <!-- Footer Section -->
    <div class="footer">
      <p>You’re receiving this email because you signed up on our website.</p>
      <p>Unsubscribe | Contact Us</p>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: 'reset',
    name: 'Password Reset',
    subject: 'Reset your password',
    category: 'Security',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
    html: `
      <div style="font-family: Inter, Arial, sans-serif; padding: 24px;">
        <h2 style="margin:0 0 8px;font-size:24px;">Reset your password</h2>
        <p style="margin:0 0 16px;color:#374151;">We received a request to reset your password. Use the button below to proceed.</p>
        <a href="#" style="background:#16a34a;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;">Reset Password</a>
        <p style="margin-top:24px;color:#6b7280;font-size:12px;">If you didn’t request this, please ignore.</p>
      </div>`,
  },
  {
    id: 'invoice',
    name: 'Invoice Ready',
    subject: 'Your invoice for August is ready',
    category: 'Billing',
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 30),
    html: `
      <div style="font-family: Inter, Arial, sans-serif; padding: 24px;">
        <h2 style="margin:0 0 8px;font-size:24px;">Invoice #INV-2048</h2>
        <p style="margin:0 0 16px;color:#374151;">Hi, your monthly invoice is ready.</p>
        <table style="border-collapse:collapse;width:100%;">
          <tr>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;">Pro Plan</td>
            <td style="padding:8px;border-bottom:1px solid #e5e7eb;text-align:right;">$29.00</td>
          </tr>
          <tr>
            <td style="padding:8px;text-align:right;font-weight:bold;">Total</td>
            <td style="padding:8px;text-align:right;font-weight:bold;">$29.00</td>
          </tr>
        </table>
        <a href="#" style="margin-top:16px;background:#111827;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;display:inline-block;">View Invoice</a>
      </div>`,
  },
];

export default function EmailTemplateGallery({
  templates = sampleTemplates,
}: {
  templates?: EmailTemplate[];
  onEdit?: (t: EmailTemplate) => void;
  onUse?: (t: EmailTemplate) => void;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<EmailTemplate | null>(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return templates.filter((t) => {
      const inText =
        t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
      return inText;
    });
  }, [templates, query]);

  const handlePreview = (t: EmailTemplate) => {
    setActive(t);
    setOpen(true);
  };

  const onClose = () => {
    setActive(null);
    setOpen(false);
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-2'>
          <Input
            placeholder='Search For Templates…'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='w-72'
          />
        </div>
        <div className='flex items-center gap-3'>
          <div className='text-sm text-muted-foreground'>
            {filtered.length} / {templates.length} shown
          </div>
          <Button>
            <Plus /> New Template
          </Button>
        </div>
      </div>

      <Separator />

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {filtered.map((t) => (
          <TemplateCard key={t.id} t={t} onPreview={handlePreview} />
        ))}
        {filtered.length === 0 && (
          <div className='col-span-full rounded-2xl border p-10 text-center text-muted-foreground'>
            No templates match your search.
          </div>
        )}
      </div>

      {/* <PreviewDialog open={open} onOpenChange={setOpen} template={active} /> */}
      {active && (
        <EmailTemplateEditor
          showModal={open}
          onCloseModal={onClose}
          template={active as EmailTemplate}
        />
      )}
    </div>
  );
}
