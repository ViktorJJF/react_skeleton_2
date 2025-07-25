export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: "new" | "contacted" | "qualified" | "lost";
  channel: "Chatbot web" | "Chatbot WhatsApp";
  initialQuestion: string;
  createdAt: string;
}
