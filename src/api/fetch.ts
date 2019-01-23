import fetch from "cross-fetch";

export function getJSON(url: string, data) {
  let param = "";
  if (data) {
    const datas = [];
    for (const k in data) {
      if (k) {
        datas.push(`${k}=${data[k]}`);
      }
    }
    if (datas.length > 0) {
      param = "?" + datas.join("&");
    }
  }
  return fetch(url + param)
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error(res.statusText);
    })
}

export function postJSON(url: string, data) {
  return fetch(url, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(res.statusText);
  })
}
