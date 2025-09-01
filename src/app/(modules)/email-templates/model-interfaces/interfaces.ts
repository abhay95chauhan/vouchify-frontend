export interface IEmailTemplate {
  id: string;
  name: string; // internal name
  subject: string;
  category?: string;
  created_at: string | Date;
  updated_at: string | Date;
  html: string; // full HTML template
}

export interface IEmailTemplatePost {
  name: string; // internal name
  subject: string;
  category?: string;
  html: string; // full HTML template
}
