let origin = process.env.NODE_ENV === 'production' ? location.origin : ''

// 图片地址
export function imageUrl(
  url,
  defaultUrl = `${process.env.BASE_URL}images/default.png`
) {
  if (url) {
    return /(http)|(https)|(\/\/)/gi.test(url)
      ? url.replace(/(^http:)|(^https:)/gi, '')
      : `${origin}${url}`
  } else {
    return defaultUrl
  }
}
