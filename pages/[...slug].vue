<script setup lang="ts">
const projects = [{
  title: 'CodeTime',
  description: 'Programmer Time Tracking.',
  link: 'https://codetime.dev',
}, {
  title: 'Anichart.js',
  description: 'Animate historical data.',
  link: 'https://github.com/Jannchie/anichart.js',
}, {
  title: 'Zeroroku',
  description: 'Data Observatory.',
  link: 'https://zeroroku.com',
}, {
  title: 'Roku UI',
  description: 'React UI Library.',
  link: 'https://roku-ui.vercel.app',
}, {
  title: 'Jannchie\'s Blog',
  description: 'My Blog.',
  link: 'https://www.jannchie.com',
}]

// const notes = await queryContent('/notes').sort({
//   createdAt: -1,
// }).limit(4).find()
</script>

<template>
  <main class="flex flex-col">
    <HomeCover />
    <HomeSectionTitle>
      Projects
    </HomeSectionTitle>
    <div class="flex flex-wrap gap-4 p-8 m-auto justify-center">
      <HomeProjectCard
        v-for="project in projects"
        :key="project.title"
        :title="project.title"
        :description="project.description"
        :link="project.link"
      />
    </div>
    <!-- <HomeSectionTitle>
      Notes
    </HomeSectionTitle>
    <div class="flex flex-col items-start gap-8 p-8 w-[80ch] m-auto">
      <HomePostLine v-for="content in notes" :key="content._id" :content="content" />
    </div> -->
    <Footer />
  </main>
</template>
