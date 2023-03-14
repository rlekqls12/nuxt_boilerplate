/**
 * node.js 서버에서 컨텍스트 저장
 */
export default function (ctx) {
  if (process.server) {
    if (!global.$nuxt) {
      global.$nuxt = ctx
    }
    if (!global.$nuxt.$store) {
      global.$nuxt.$store = ctx.store
    }
  }
}
