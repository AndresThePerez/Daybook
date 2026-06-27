import axios from 'axios';

const client = axios.create({
  baseURL: '/api/v1',
  headers: { Accept: 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
});

function resource(name) {
  return {
    list: (params) => client.get(`/${name}`, { params }).then((r) => r.data),
    show: (id) => client.get(`/${name}/${id}`).then((r) => r.data.data),
    create: (payload) => client.post(`/${name}`, payload).then((r) => r.data.data),
    update: (id, payload) => client.put(`/${name}/${id}`, payload).then((r) => r.data.data),
    remove: (id) => client.delete(`/${name}/${id}`).then(() => undefined),
  };
}

export const tasks = resource('tasks');
export const categories = resource('categories');

export function validationErrors(error) {
  return error?.response?.status === 422 ? error.response.data.errors : null;
}
