import type { ICreateBotRequest } from "@/types/entities/bots";

export default (payload: ICreateBotRequest) => ({
  _id: `temp-${Date.now()}`,
  name: payload.name || "",
  description: payload.description || "",
  isActive: payload.isActive ?? true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
