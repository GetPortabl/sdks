export default function backupError(message: string, ...optionalParams: any[]) {
  const errorStyles = `
    background: linear-gradient(90deg, rgb(244, 38, 107) 0px, rgb(198, 2, 229) 50%, rgb(134, 0, 250)) !important;
    padding: 2px 8px;
    color: white;
    line-height: 22px;
    box-shadow: 0px 0px 1px 1px rgba(178,176,193,0.3);
`;

  console.error(
    `%cBackup With Portabl`,
    errorStyles,
    message,
    ...optionalParams,
  );
}
