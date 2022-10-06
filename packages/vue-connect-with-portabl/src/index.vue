<script setup lang="ts">
import {
  Options,
  REDIRECT_ORIGIN,
  ATTRIBUTES,
  ROOT_ELEMENT_ID,
  styles,
} from '@portabl/connect-common';

const props = defineProps<{
  apiKey: Options['apiKey'];
  credManifestId: Options['credManifestId'];
  externalOnboardingId: Options['externalOnboardingId'];
}>();

const handleButtonClick = () => {
  const qsParams = [
    `apiKey=${props.apiKey}`,
    `credManifestId=${props.credManifestId}`,
    `externalOnboardingId=${props.externalOnboardingId}`,
  ];
  const qs = `?${qsParams.join('&')}`;

  const url = `${REDIRECT_ORIGIN}${qs}`;
  window.open(url, '_blank');
};
</script>

<template>
  <div>
    <div :id="ROOT_ELEMENT_ID" :class="styles['portabl-connect-root']">
      <button type="button" @click="handleButtonClick">
        <div
          :class="ATTRIBUTES.imageWrapperClassName"
          role="img"
          :aria-label="ATTRIBUTES.ariaLabel"
        />
      </button>
    </div>
  </div>
</template>
