import { useEffect, useRef } from 'react'

const UploadWidget = ({ uwConfig, setImages }) => {
  const uploadWidgetRef = useRef(null)

  useEffect(() => {
    const loadCloudinaryScript = () => {
      return new Promise((resolve, reject) => {
        if (window.cloudinary) {
          resolve()
          return
        }

        const script = document.createElement('script')
        script.src = 'https://widget.cloudinary.com/v2.0/global/all.js'
        script.onload = resolve
        script.onerror = () =>
          reject(new Error('Failed to load Cloudinary script'))
        document.body.appendChild(script)
      })
    }

    const initializeWidget = async () => {
      try {
        await loadCloudinaryScript()
        if (!uploadWidgetRef.current) {
          uploadWidgetRef.current = window.cloudinary.createUploadWidget(
            uwConfig,
            (error, result) => {
              if (
                !error &&
                result.event === 'success' &&
                result.info?.secure_url
              ) {
                setImages(result.info.secure_url)
              }
            }
          )
        }
      } catch (error) {
        console.error('Error initializing Cloudinary widget:', error.message)
      }
    }

    initializeWidget()
  }, [uwConfig, setImages])

  const handleUploadClick = () => {
    if (uploadWidgetRef.current) {
      uploadWidgetRef.current.open()
    }
  }

  return (
    <button
      type="button"
      id="upload_widget"
      className="cloudinary-button"
      onClick={handleUploadClick}
    >
      Upload
    </button>
  )
}

export default UploadWidget
