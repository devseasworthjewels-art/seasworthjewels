import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "./appConfig";

const { serviceId, publicKey, templates } = EMAILJS_CONFIG;

export const EMAIL_TEMPLATES = templates;

export function sendEmailForm(templateId, formElement) {
  return emailjs.sendForm(serviceId, templateId, formElement, publicKey);
}

export function sendEmail(templateId, payload) {
  return emailjs.send(serviceId, templateId, payload, publicKey);
}

export function sendQuotaAlert(totalMessages) {
  if (!templates.quotaAlert) return Promise.resolve();
  return sendEmail(templates.quotaAlert, { total_messages: totalMessages });
}
