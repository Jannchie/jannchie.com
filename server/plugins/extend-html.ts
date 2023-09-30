export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event: _ }) => {
    html.head.push(`<script>!function() {var e = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches; t = localStorage.getItem("vueuse-color-scheme") || "auto";("dark" === t || e && "light" !== t) && document.documentElement.setAttribute("color-scheme", "dark")}()</script>`)
  })
})
