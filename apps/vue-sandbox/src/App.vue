<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import ConnectWithPortabl from '@portabl/vue-connect-with-portabl';

const redirectUri = 'https://some-url.com';
const mockAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2FwcC5wb3J0YWJsLmlvL3RlbmFudElkIjoidGVzdFRlbmFudElkIiwiaHR0cHM6Ly9hcHAucG9ydGFibC5pby9jb3JyZWxhdGlvbklkIjoidGVzdENvcnJlbGF0aW9uSWQiLCJpc3MiOiJodHRwczovL3BvcnRhYmwtZGV2LnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJ0ZXN0U3ViIiwiYXVkIjoiaHR0cHM6Ly9kZXYtYXBpLmdldHBvcnRhYmwuY29tIiwiaWF0IjoxNjYzMzIwMjgxLCJleHAiOjE2NjM0MDY2NzUsImF6cCI6InpWaVVVVHdUckNwVFlrT1lnMGJodFJOMjU0TGJEamVPIiwic2NvcGUiOiJyZWFkOnNldHRpbmdzIHVwZGF0ZTpzZXR0aW5ncyBjcmVhdGU6aWRlbnRpZmllcnMgcmVhZDppZGVudGlmaWVycyB1cGRhdGU6aWRlbnRpZmllcnMgZGVsZXRlOmlkZW50aWZpZXJzIGNyZWF0ZTpjcmVkZW50aWFsLW1hbmlmZXN0cyByZWFkOmNyZWRlbnRpYWwtbWFuaWZlc3RzIHVwZGF0ZTpjcmVkZW50aWFsLW1hbmlmZXN0cyBkZWxldGU6Y3JlZGVudGlhbC1tYW5pZmVzdHMgY3JlYXRlOnByZXNlbnRhdGlvbi1kZWZpbml0aW9ucyByZWFkOnByZXNlbnRhdGlvbi1kZWZpbml0aW9ucyB1cGRhdGU6cHJlc2VudGF0aW9uLWRlZmluaXRpb25zIGRlbGV0ZTpwcmVzZW50YXRpb24tZGVmaW5pdGlvbnMgY3JlYXRlOnZlcmlmaWFibGUtZG9jdW1lbnRzIHJlYWQ6dmVyaWZpYWJsZS1kb2N1bWVudHMgdXBkYXRlOnZlcmlmaWFibGUtZG9jdW1lbnRzIGRlbGV0ZTp2ZXJpZmlhYmxlLWRvY3VtZW50cyBjcmVhdGU6ZXZpZGVuY2UtZG9jdW1lbnRzIHJlYWQ6ZXZpZGVuY2UtZG9jdW1lbnRzIHVwZGF0ZTpldmlkZW5jZS1kb2N1bWVudHMgZGVsZXRlOmV2aWRlbmNlLWRvY3VtZW50cyBpbml0OmRpZGNvbW0gY3JlYXRlOmRpZGNvbW0tbWVzc2FnZXMgcmVhZDpkaWRjb21tLXRocmVhZHMgdXBkYXRlOmRpZGNvbW0tdGhyZWFkcyIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsInBlcm1pc3Npb25zIjpbInJlYWQ6c2V0dGluZ3MiLCJ1cGRhdGU6c2V0dGluZ3MiLCJjcmVhdGU6aWRlbnRpZmllcnMiLCJyZWFkOmlkZW50aWZpZXJzIiwidXBkYXRlOmlkZW50aWZpZXJzIiwiZGVsZXRlOmlkZW50aWZpZXJzIiwiY3JlYXRlOmNyZWRlbnRpYWwtbWFuaWZlc3RzIiwicmVhZDpjcmVkZW50aWFsLW1hbmlmZXN0cyIsInVwZGF0ZTpjcmVkZW50aWFsLW1hbmlmZXN0cyIsImRlbGV0ZTpjcmVkZW50aWFsLW1hbmlmZXN0cyIsImNyZWF0ZTpwcmVzZW50YXRpb24tZGVmaW5pdGlvbnMiLCJyZWFkOnByZXNlbnRhdGlvbi1kZWZpbml0aW9ucyIsInVwZGF0ZTpwcmVzZW50YXRpb24tZGVmaW5pdGlvbnMiLCJkZWxldGU6cHJlc2VudGF0aW9uLWRlZmluaXRpb25zIiwiY3JlYXRlOnZlcmlmaWFibGUtZG9jdW1lbnRzIiwicmVhZDp2ZXJpZmlhYmxlLWRvY3VtZW50cyIsInVwZGF0ZTp2ZXJpZmlhYmxlLWRvY3VtZW50cyIsImRlbGV0ZTp2ZXJpZmlhYmxlLWRvY3VtZW50cyIsImNyZWF0ZTpldmlkZW5jZS1kb2N1bWVudHMiLCJyZWFkOmV2aWRlbmNlLWRvY3VtZW50cyIsInVwZGF0ZTpldmlkZW5jZS1kb2N1bWVudHMiLCJkZWxldGU6ZXZpZGVuY2UtZG9jdW1lbnRzIiwiaW5pdDpkaWRjb21tIiwiY3JlYXRlOmRpZGNvbW0tbWVzc2FnZXMiLCJyZWFkOmRpZGNvbW0tdGhyZWFkcyIsInVwZGF0ZTpkaWRjb21tLXRocmVhZHMiXX0.PIbRv4dCfQHiwurv8XtQXqCBOms4H7e1DhND5u2sxgs';

const prepareBackup = async () => ({
  accessToken: mockAccessToken,
});

const loadBackupData = () => {};
</script>

<template>
  <div
    :style="{
      display: 'flex',
      justifyContent: 'center',
      alignSelf: 'center',
      flexDirection: 'column',
      height: '100vh',
      width: '390px',
      margin: '0 auto',
    }"
  >
    <b>Connect with Portabl:</b>
    <ConnectWithPortabl
      external-onboarding-id="onboardingID"
      api-key="apiKey"
      cred-manifest-id="credManifestId"
    />
    <br />
    <br />
    <b>Backup with Portabl:</b>
    <BackupWithPortabl
      :prepare-backup="prepareBackup"
      :load-backup-data="loadBackupData"
      :redirect-uri="redirectUri"
    />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
