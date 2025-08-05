import axios from "axios";

import type { GenericObject } from "@/types/GenericObject";
import config from "@/config";

export default {
  login(email: string, password: string) {
    return axios.post(config.BACKEND_BASE_URL + "/api/login", {
      email,
      password,
    });
  },
  editUser(id: string, payload: GenericObject) {
    return axios.put(config.BACKEND_BASE_URL + `/api/members/${id}`, payload);
  },
  updatePassword(id: string, newPassword: string) {
    return axios.put(
      config.BACKEND_BASE_URL + `/api/members/${id}/update-password`,
      { newPassword }
    );
  },
  refreshToken() {
    return axios.get(config.BACKEND_BASE_URL + "/api/token");
  },
};
