export async function resizeImageDataUrl(dataUrl, maxSize = 1024) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      // คุณสามารถปรับคุณภาพได้ (0.9)
      const out = canvas.toDataURL('image/jpeg', 0.9);
      resolve(out);
    };
    img.src = dataUrl;
  });
}