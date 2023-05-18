export const config = {
  runtime: 'edge',
}

export default async () =>
  new Response('pong', {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'x-content-type-options': 'nosniff',
    },
  })
