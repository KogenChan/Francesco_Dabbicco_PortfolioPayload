export async function convertToWebP(file: File): Promise<File> {
   return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      img.onload = () => {
         canvas.width = img.width
         canvas.height = img.height
         
         if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
         }
         
         ctx.drawImage(img, 0, 0)
         
         canvas.toBlob(
            (blob) => {
               if (!blob) {
                  reject(new Error('Conversion failed'))
                  return
               }
               
               const webpFile = new File(
                  [blob],
                  file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp'),
                  { type: 'image/webp' }
               )
               
               resolve(webpFile)
            },
            'image/webp',
            0.8 // Quality: 0.9 = 90% (adjust as needed)
         )
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
   })
};