let running: boolean
let nextRoute: string | null

export default defineNuxtPlugin({
  name: 'fix-transiton',
  setup(app) {
    app.hook('page:start', () => {
      const nuxtApp = useNuxtApp()
      running = false
      nuxtApp.$router.beforeEach((to, _) => {
        if (running) {
          return true
        }
        else {
          nextRoute = to.fullPath
          return false
        }
      })
    })
    app.hook('page:transition:finish', () => {
      const nuxtApp = useNuxtApp()
      running = true
      if (nextRoute) {
        nuxtApp.$router.push(nextRoute)
        nextRoute = null
      }
    })
    return {
      provide: {
        hooks: {
          'page:transition:finish': function () {
            const nuxtApp = useNuxtApp()
            running = true
            if (nextRoute) {
              nuxtApp.$router.push(nextRoute)
              nextRoute = null
            }
          },
        },
      },
    }
  },
})
