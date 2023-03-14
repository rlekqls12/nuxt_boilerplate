import path from 'path'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import webpack from 'webpack'

export function getNuxtConfig() {
  // 'cross-env NODE_ENV=loc DEVICE=pc nuxt'
  const env = process.env.NODE_ENV.toLowerCase()
  const device = process.env.DEVICE.toLowerCase()
  const port = process.env.PORT
  const envFile = `.env.${device}.${env}`
  const envFilePath = path.join(process.cwd(), envFile)
  dotenv.config({ path: envFilePath })

  const srcDir = process.cwd() + '/src/'

  return {
    // 서버 속성
    server: {
      port: port,
      host: '0.0.0.0',
      timing: false, // 사용시 미들웨어가 추가되어서 헤더에 서버 렌더링 시간 표기
    },

    // 배포 대상 static / server
    target: 'server',

    // 기본 SSR 설정, false면 CSR Only
    ssr: true,

    // 공통 로딩 컴포넌트 사용 여부
    loading: false,

    // import 없이 이름만으로 컴포넌트 로딩 비활성화
    components: false,

    // html head 설정
    head: {
      htmlAttrs: {
        lang: 'ko',
      },
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },

    // CSS 설정
    css: [],

    // Plugin 설정
    plugins: [{ src: `~/plugins/axios` }],

    // 라우터 및 미들웨어
    router: {
      // 미들웨어
      middleware: [],
      extendRoutes(routes, resolve) {
        // 수동 라우터 생성
        routes.push({
          name: 'custom',
          path: '*',
          component: resolve(__dirname, `~/${device}/pages/404.vue`),
        })
      },
    },

    // 폴더 사용자 정의
    dir: {
      layouts: `${device}/layouts`,
      pages: `${device}/pages`,
      store: `${device}/store`,
    },

    // 공개 환경변수: 클라이언트/서버
    publicRuntimeConfig: {
      envType: env,
      device: device,
      port: port,
    },

    // 비공개 환경변수: 서버
    privateRuntimeConfig: {},

    // Nuxt 빌드 모듈
    buildModules: ['@nuxtjs/eslint-module'],

    // 서버 미들웨어
    // bodyParser.urlencoded: POST 데이터 전달 받기
    serverMiddleware: [bodyParser.urlencoded({ extended: true })],

    // Nuxt 모듈
    modules: [],

    // 서버 상태 확인
    healthcheck: {
      path: '/healthcheck',
      contentType: 'text/plain',
      healthy: () => {
        return 'OK'
      },
    },

    // axios 모듈 설정
    axios: {
      credentials: true,
      headers: {
        common: {
          Accept: 'application/json, text/plain, */*',
        },
        delete: {},
        get: {},
        head: {},
        post: {},
        put: {},
        patch: {},
      },
    },

    // dayjs 모듈 설정
    dayjs: {
      locales: ['ko'],
      defaultLocale: 'ko',
      defaultTimeZone: 'Asia/Seoul',
      plugins: [
        // Your Day.js plugin
      ],
    },

    // Nuxt 빌드 설정
    build: {
      analyze: false,
      transpile: [],
      extend(config, { isDev, isClient }) {
        config.resolve.alias.vue = 'vue/dist/vue.common' // 런타임 vue 빌드 옵션
      },
      plugins: [
        new webpack.ProvidePlugin({
          // $: 'jquery',
          // _: 'lodash',
        }),
      ],
      babel: {
        compact: true,
        presets({ envName }) {
          const envTargets = {
            client: { browsers: ['>0.25%'] },
            server: { node: 'current' },
          }
          return [
            [
              '@nuxt/babel-preset-app',
              {
                targets: envTargets[envName],
                corejs: { version: 3 },
              },
            ],
          ]
        },
      },
    },

    // Nuxt 빌드 경로 설정
    buildDir: `${process.cwd()}/.nuxt-${device}`,

    // 최상위 경로 설정
    rootDir: srcDir,

    ...CONFIG[device.toUpperCase()],
  }
}

// 속성별 추가 옵션
const CONFIG = {
  PC: {},
  MO: {},
}
