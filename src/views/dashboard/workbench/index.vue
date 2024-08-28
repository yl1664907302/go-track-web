<template>
  <a-steps
    :current="1"
    size="small"
    :items="[
      {
        title: 'Finished',
      },
      {
        title: 'In Progress',
      },
      {
        title: 'Waiting',
      },
    ]"
  />
</template>
