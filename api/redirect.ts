export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  let { pathname } = new URL(req.url)
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

  return new Response(
    `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="go-import" content="${importRoot} ${process.env.GIR_VCS} ${process.env.GIR_VCS_ROOT}" />
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
        'cache-control': 'max-age=0, s-maxage=86400',
      },
    }
  )
}
