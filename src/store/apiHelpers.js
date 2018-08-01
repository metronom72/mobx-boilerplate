// This realisation have problem. It doesn't work with any types except application/json

export const putData = (url, body) => {
  const data = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  return fetch(url, data)
    .then(response => response.json());
};

export const getData = (url) => {
  const data = {
    method: 'GET',
  };

  return fetch(url, data)
    .then(response => response.json());
};


export const postData = (url, body) => {
  const data = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  return fetch(url, data)
    .then(response => response.json());
};

export const deleteData = (url) => {
  const data = {
    method: 'DELETE',
  };

  return fetch(url, data)
    .then(response => response.json());
};
