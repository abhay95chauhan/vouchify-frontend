import { IEmailTemplate, IEmailTemplatePost } from './interfaces';

export class EmailTemplatesGetModel implements IEmailTemplate {
  id: string;
  name: string;
  subject: string;
  category?: string;
  html: string;
  created_at: string | Date;
  updated_at: string | Date;

  constructor(data?: Partial<IEmailTemplate>) {
    this.id = data?.id ?? '';
    this.name = data?.name ?? '';
    this.subject = data?.subject ?? '';
    this.category = data?.category ?? '';
    this.html = data?.html ?? ''; // default if you want
    this.created_at = data?.created_at ?? '';
    this.updated_at = data?.updated_at ?? '';
  }
}

export class EmailTemplatesPostModel implements IEmailTemplatePost {
  name: string;
  subject: string;
  category?: string;
  html: string;

  constructor(data?: Partial<IEmailTemplatePost>) {
    this.name = data?.name ?? '';
    this.subject = data?.subject ?? '';
    this.category = data?.category ?? '';
    this.html = data?.html ?? '';
  }
}
