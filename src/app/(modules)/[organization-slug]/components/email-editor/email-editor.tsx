'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CodeIcon, AppWindowIcon } from 'lucide-react';

export default function EmailTemplateEditor() {
  const [html, setHtml] = useState(` 
<!DOCTYPE html>
<html>
<head>
  <style>
    /* General styles for the email */
    body {
      font-family: Arial, sans-serif;
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
    </div>

    <!-- Footer Section -->
    <div class="footer">
      <p>You’re receiving this email because you signed up on our website.</p>
      <p>Unsubscribe | Contact Us</p>
    </div>
  </div>
</body>
</html>

 
`);

  return (
    <div className='w-full rounded-2xl shadow-xl border bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden'>
      <Tabs defaultValue='code' className='w-full'>
        {/* Tabs header */}
        <TabsList className='grid w-full grid-cols-2 bg-white/70 backdrop-blur-md border-b'>
          <TabsTrigger
            value='code'
            className='flex gap-2 items-center text-sm font-medium data-[state=active]:text-indigo-600'
          >
            <CodeIcon size={16} /> Code Editor
          </TabsTrigger>
          <TabsTrigger
            value='preview'
            className='flex gap-2 items-center text-sm font-medium data-[state=active]:text-indigo-600'
          >
            <AppWindowIcon size={16} /> Live Preview
          </TabsTrigger>
        </TabsList>

        {/* Code editor */}
        <TabsContent value='code' className='p-4'>
          <div className='rounded-xl border bg-black/95 text-white overflow-hidden shadow-inner'>
            <div className='flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-gradient-to-r from-indigo-600/40 to-purple-600/40'>
              <div className='h-3 w-3 rounded-full bg-red-500' />
              <div className='h-3 w-3 rounded-full bg-yellow-400' />
              <div className='h-3 w-3 rounded-full bg-green-500' />
              <span className='ml-3 text-xs text-gray-300'>
                email-template.html
              </span>
            </div>
            <Textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className='min-h-[500px] font-mono text-sm resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3'
            />
          </div>
        </TabsContent>

        {/* Preview */}
        <TabsContent value='preview' className='p-6'>
          <div className='rounded-xl border bg-white shadow-lg overflow-hidden'>
            <iframe
              srcDoc={html}
              title='Email Preview'
              className='h-[500px] w-full rounded-xl border-none'
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
