// The Workers runtime module used to send contact requests through Cloudflare Email Routing.
declare module 'cloudflare:email' {
  export class EmailMessage { constructor(from: string, to: string, raw: string); }
}
