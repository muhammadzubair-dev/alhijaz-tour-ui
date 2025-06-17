const buildAntdFileFromUrl = (url, name) => {
  if (!url) return [];
  return [
    {
      uid: name,
      name: name,
      status: 'done',
      url: url,
    }
  ];
};


export default buildAntdFileFromUrl;
