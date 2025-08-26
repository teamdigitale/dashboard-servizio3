import axios from "axios";
axios.defaults.withCredentials = true;

/** getSuggestions */
export async function getSuggestions(inputData: (string | number)[][]) {
  // const token = auth.getAuth();
  // if (!token) return null;
  const url = `/hints/`;
  const data = JSON.stringify(inputData.slice(0, 5));
  const response = await axios.post(url, data);
  console.log("hints", response.status);
  if (response.status === 401) {
    return logout();
  }
  if (response.status === 200) {
    return response.data;
  }
  return null;
}

/** Upsert */
export async function upsertChart(payload: object, id?: string) {
  // const token = auth.getAuth();
  // if (!token) return null;
  const url = id ? `/charts/${id}` : `/charts/`;
  const method = id ? "PUT" : "POST";

  const response = await (method === "PUT"
    ? axios.put(url, payload)
    : axios.post(url, payload));
  console.log("UPSERT-CHART", response.status);

  // if (response.status === 401) {
  //   return logout();
  // }
  if (response.status === 200) {
    return response.data;
  }

  return null;
}

/** Delete */
export async function deleteChart(id: string) {
  const response = await axios.delete(`/charts/${id}`);
  console.log("deleteChart", response.status);
  if (response.status === 401) {
    return logout();
  }
  if (response.status === 200) {
    return response.data;
  }
  return null;
}

/** List */
export async function getCharts() {
  const response = await axios.get(`/charts`);

  if (response.status === 401) {
    // return auth.logout();
    return logout();
  }
  if (response.status === 200) {
    return response.data;
  } else {
    return [];
  }
}

export async function getUser() {
  const response = await axios(`/auth/user`, {
    method: "GET",
  });
  console.log("response status", response.status);
  console.log("response data", response.data);
  return response.data;
}

export function logout() {
  return axios.get(`/auth/logout`);
}

/** Login */
export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  const response = await axios.post(`/auth/login`, {
    email,
    password,
  });
  const data = response.data;
  if (response.status === 200) {
    console.log("LOGGED IN", data);
    return true;
  } else {
    console.log("ERROR", data);
    if (data.message) {
      throw new Error(data.message);
    }
  }
}
/** Register */
export async function register({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(`/auth/register`, {
      email,
      password,
    });
    const data = response.data;
    console.log("RESPONSE DATA", data);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log("REGISTER ERROR", (error as Error).message);
    throw error;
  }
}

export async function showChart(id: string) {
  const response = await axios(`/charts/show/${id}`, {
    method: "GET",
  });
  if (response.status === 200) {
    const data = response.data;
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data;
  }
  return null;
}

export async function verify({ uid, code }: { uid: string; code: string }) {
  try {
    const response = await axios.post(`/auth/verify`, {
      uid,
      code,
    });
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log("verify ERROR", (error as Error)?.message);
    throw error;
  }
  return false;
}

export async function changePasssword({ password }: { password: string }) {
  try {
    const response = await axios.post(`/auth/pwd`, {
      password,
    });
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log("changePasssword ERROR", (error as Error)?.message);
    throw error;
  }
}

export async function activate() {
  try {
    const response = await axios.post(`/auth/init`);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log("changePasssword ERROR", (error as Error)?.message);
    throw error;
  }
}

export async function recoverPasssword(email: string) {
  try {
    const response = await axios.post(`/auth/recover`, { email });
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.log("recoverPasssword ERROR", (error as Error)?.message);
    throw error;
  }
}
