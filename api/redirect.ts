export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  let { pathname } = new URL(req.url)
  if (pathname === '/favicon.ico') {
    return new Response('404 page not found', {
      status: 404,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'x-content-type-options': 'nosniff',
      },
    })
  }

  pathname = pathname.replace(/\/$/, '')
  if (pathname === '') {
    return Response.redirect(
      `https://pkg.go.dev/${process.env.GIR_IMPORT_PATH}`,
      302
    )
  }

  let elem = pathname.replace(/^\//, '')
  let suffix = ''
  const i = elem.indexOf('/')
  if (i >= 0) {
    suffix = elem.slice(i)
    elem = elem.slice(0, i)
  }

  const importRoot = `${process.env.GIR_IMPORT_PATH}/${elem}`
  const repoRoot = `${process.env.GIR_VCS_ROOT}/${elem}`

  return new Response(
    `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="go-import" content="${importRoot} ${process.env.GIR_VCS} ${repoRoot}" />
    <meta http-equiv="refresh" content="0; url=https://pkg.go.dev/${importRoot}${suffix}" />
  </head>
  <body>
    Redirecting to docs at <a href="https://pkg.go.dev/${importRoot}${suffix}">pkg.go.dev/${importRoot}${suffix}</a>...
  </body>
</html>
`,
    {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'x-content-type-options': 'nosniff',
        'cache-control': 'max-age=0, s-maxage=86400',
      },
    }
  )
}
