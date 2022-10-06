<script setup lang="ts">
import { watchEffect, reactive, watch } from 'vue';
import {
  ATTRIBUTES,
  createOnboardingUrl,
  ROOT_ELEMENT_ID,
  styles,
} from '@portabl/backup-common';

const props = defineProps<{
  prepareBackup: () => Promise<{ accessToken: string }>;
  loadBackupData: ({ accessToken }: { accessToken: string }) => void;
  redirectUri: string;
  local?: string;
}>();

const state = reactive({
  accessToken: '',
  url: '',
});

watchEffect(() => {
  if (!state.accessToken) {
    (async () => {
      const data = await props.prepareBackup();
      state.accessToken = data.accessToken;
    })();
  }
});

watch(
  () => state.accessToken,
  accessToken => {
    const createOnboardingUrlData = {
      accessToken,
      redirectUri: props.redirectUri,
      local: props.local,
    };
    state.url = accessToken ? createOnboardingUrl(createOnboardingUrlData) : '';
  },
);

const handleButtonClick = async () => {
  if (state.accessToken) {
    props.loadBackupData({
      accessToken: state.accessToken,
    });
  }
};
</script>

<template>
  <div :class="styles['portabl-backup-root']" :id="ROOT_ELEMENT_ID">
    <a
      v-if="state.url"
      :href="state.url"
      target="_blank"
      rel="noreferrer"
      role="button"
      @click="handleButtonClick"
    >
      <div
        :class="ATTRIBUTES.imageWrapperClassName"
        role="img"
        :aria-label="ATTRIBUTES.ariaLabel"
      />
    </a>
  </div>
</template>
