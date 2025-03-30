export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.push(`<script>!function() {var e = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches; t = localStorage.getItem("vueuse-color-scheme") || "auto";("dark" === t || e && "light" !== t) && document.documentElement.setAttribute("data-scheme", "dark")}()</script>`)
  })
})
